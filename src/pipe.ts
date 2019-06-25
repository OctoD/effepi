import { IContext, create, update, applyMutation } from './context';

export type Callable = <Input, Output>(input: Input, context: IContext<unknown, Input>) => Output;
export type ExecutionContextFlow = 'async' | 'sync';
export type ExplicitCallable<Input, Output> = (input: Input, context: IContext<unknown, Input>) => Output;
export type ResolvedPipe<Input, Output> = (input: Input) => Promise<Output>;
export type ResolvedSyncPipe<Input, Output> = (input: Input) => Output;
export type PassThroughCallable = <Input>(input: Input, context: IContext<unknown, Input>) => Input;
export type Pipeline = (Callable | ExplicitCallable<unknown, unknown>)[];

export interface IPipe<InitialCallable, Output> {
  /**
   * Determines if the function is memoized or not
   * @type {boolean}
   * @memberof IPipe
   */
  readonly memoized: boolean;
  /**
   * @type {'pipe'}
   * @memberof IPipe
   */
  readonly type: 'pipe';
  /**
   * Runs until next breakpoint
   * @returns {IIterablePipe<InitialCallable, Output>}
   * @memberof IPipe
   */
  iter(callValue: InitialCallable): IIterablePipe<InitialCallable, Output>;
  /**
   * Method for chaining a function
   * @template NextValue
   * @param {ExplicitCallable<Output, NextValue>} callable
   * @returns {IPipe<InitialCallable, NextValue>}
   * @memberof IPipe
   */
  pipe<NextValue>(callable: ExplicitCallable<Output, NextValue>): IPipe<InitialCallable, NextValue>;
  /**
   * Resolves the pipeline asynchronously.
   * @type {ResolvedPipe<InitialCallable, Output>}
   * @memberof IPipe
   */
  resolve: ResolvedPipe<InitialCallable, Output>;
  /**
   * Resolves the pipeline synchronously.
   * @type {ResolvedSyncPipe<InitialCallable, Output>}
   * @memberof IPipe
   */
  resolveSync: ResolvedSyncPipe<InitialCallable, Output>;
  /**
   * Creates an `async` function from the pipeline
   * @returns {(input: InitialCallable) => Promise<Output>}
   * @memberof IPipe
   */
  toFunction(): (input: InitialCallable) => Promise<Output>;
  /**
   * Creates a function from the pipeline
   * @returns {(input: InitialCallable) => Output}
   * @memberof IPipe
   */
  toSyncFunction(): (input: InitialCallable) => Output;
}

export interface IIterablePipe<InitialCallable, Output> {
  hasnext(): boolean;
  hasprev(): boolean;
  next(): IIterablePipe<InitialCallable, Output>;
  prev(): IIterablePipe<InitialCallable, Output>;
  value<Value = unknown>(): Value;
}

function createFunction<TCallValue, TReturnValue>(
  pipeline: Pipeline,
  memoized: boolean
): (arg: TCallValue) => Promise<TReturnValue> {
  const resolver = createResolver<TCallValue, TReturnValue>(pipeline, memoized);
  return arg => resolver(arg);
}

function createIter<CallValue, NextValue>(
  pipeline: Pipeline
): (callValue: CallValue) => IIterablePipe<CallValue, NextValue> {
  return callValue => {
    const context = create(callValue, 'sync');
    return createIterableMethods(callValue, pipeline, context);
  };
}

function createIterableMethods<CallValue, ReturnValue>(
  callValue: CallValue,
  pipeline: Pipeline,
  context: IContext
): IIterablePipe<CallValue, ReturnValue> {
  const breakpoint = context.mutationIndex;
  const methods = <IIterablePipe<CallValue, ReturnValue>>{};

  function getPreviousBreakpoint(mutationIndex: number, breakpoints: number[]): number {
    const copy = breakpoints.slice();

    while (copy.length > 0) {
      const breakpoint = breakpoints.pop()!;

      if (breakpoint < mutationIndex) {
        return breakpoint;
      }
    }

    return 0;
  }

  methods.hasnext = () => hasNextIterable(context, pipeline.length);
  methods.hasprev = () => hasPrevIterable(context);
  methods.next = () => {
    const [nextContext, value] = resolveSync(pipeline, breakpoint, context, true);

    return createIterableMethods(value, pipeline, nextContext);
  };
  methods.prev = () => {
    const previousBreakpoint = getPreviousBreakpoint(breakpoint, context.breakpoints);
    const previousBreakpointIndex = context.breakpoints.indexOf(previousBreakpoint);
    const breakpoints = context.breakpoints.slice(0, previousBreakpointIndex);
    const previousValues = context.previousValues.slice(0, previousBreakpoint);
    const previousValueIndex = previousValues.length - 1;
    const previousValue = previousValues[previousValueIndex > 0 ? previousValueIndex : 0];
    const prevContext = update(
      {
        ...context,
        breakpoints,
        mutationIndex: previousBreakpoint,
        previousValue,
        previousValues,
      },
      previousValue
    );

    return createIterableMethods(previousValue, pipeline, prevContext);
  };
  methods.value = <Value = unknown>() => (callValue as unknown) as Value;

  return methods;
}

function createMethods<TCallValue, TReturnValue>(
  pipeline: Pipeline,
  memoized: boolean
): IPipe<TCallValue, TReturnValue> {
  return {
    memoized,
    type: 'pipe',
    iter: createIter(pipeline),
    pipe: <TNextValue>(callable: ExplicitCallable<TReturnValue, TNextValue>): IPipe<TCallValue, TNextValue> => {
      return (createMethods<TCallValue, TNextValue>([...pipeline, callable] as any, memoized) as unknown) as IPipe<
        TCallValue,
        TNextValue
      >;
    },
    resolve: createResolver<TCallValue, TReturnValue>(pipeline, memoized),
    resolveSync: createSyncResolver<TCallValue, TReturnValue>(pipeline, memoized),
    toFunction: <TCall, TReturn>() => createFunction<TCall, TReturn>(pipeline, memoized),
    toSyncFunction: <TCall, TReturn>() => createSyncFunction<TCall, TReturn>(pipeline, memoized),
  };
}

function createSyncFunction<TCallValue, TReturnValue>(
  pipeline: Pipeline,
  memoized: boolean
): (arg: TCallValue) => TReturnValue {
  const resolver = createSyncResolver<TCallValue, TReturnValue>(pipeline, memoized);
  return arg => resolver(arg);
}

function createResolver<TCallValue, TReturnValue>(
  pipeline: Pipeline,
  memoized: boolean
): ResolvedPipe<TCallValue, TReturnValue> {
  let previousCallValue: TCallValue;
  let previousReturnValue: TReturnValue;

  return async callValue => {
    if (memoized && callValue === previousCallValue) {
      return previousReturnValue;
    }

    previousCallValue = callValue;
    const [_, value] = await resolve(pipeline, 0, create(callValue, 'async'));
    previousReturnValue = value as TReturnValue;

    return previousReturnValue;
  };
}

function createSyncResolver<TCallValue, TReturnValue>(
  pipeline: Pipeline,
  memoized: boolean
): ResolvedSyncPipe<TCallValue, TReturnValue> {
  let previousCallValue: TCallValue;
  let previousReturnValue: TReturnValue;

  return callValue => {
    if (memoized && callValue === previousCallValue) {
      return previousReturnValue;
    }

    previousCallValue = callValue;
    const [_, value] = resolveSync(pipeline, 0, create(callValue, 'sync'));
    previousReturnValue = value as TReturnValue;

    return previousReturnValue;
  };
}

function hasNextIterable(context: IContext, pipelineSize: number): boolean {
  return context.mutationIndex < pipelineSize;
}

function hasPrevIterable(context: IContext): boolean {
  return context.mutationIndex > 0;
}

async function resolve(
  pipeline: Pipeline,
  index: number,
  context: IContext,
  stopOnBreakpoint = false
): Promise<[IContext, unknown]> {
  if (index >= pipeline.length) {
    return [context, context.previousValue];
  }

  const previousValue = await Promise.resolve(pipeline[index](context.previousValue, context));
  const updatedContext = update<unknown, unknown>(context, previousValue);
  const [mutatedContext, mutatedPipeline] = applyMutation(updatedContext, pipeline);

  return resolve(mutatedPipeline, index + 1, mutatedContext, stopOnBreakpoint);
}

function resolveSync(
  pipeline: Pipeline,
  index: number,
  context: IContext,
  stopOnBreakpoint = false
): [IContext, unknown] {
  if (index >= pipeline.length) {
    return [context, context.previousValue];
  }

  const previousValue = pipeline[index](context.previousValue, context);
  const updatedContext = update<unknown, unknown>(context, previousValue);
  const [mutatedContext, mutatedPipeline] = applyMutation(updatedContext, pipeline);

  if (shouldStopAndBreakOn(stopOnBreakpoint, index, mutatedContext.breakpoints)) {
    return [mutatedContext, previousValue];
  }

  return resolveSync(mutatedPipeline, index + 1, mutatedContext, stopOnBreakpoint);
}

function shouldStopAndBreakOn(stopOnBreakpoint: boolean, breakpoint: number, breakpoints: number[]): boolean {
  return stopOnBreakpoint && breakpoints.indexOf(breakpoint) >= 0;
}

/**
 * Creates a new pipeline
 * @export
 * @template CallValue
 * @template NextValue
 * @param {ExplicitCallable<CallValue, NextValue>} callable
 * @param {boolean} [memoized=false]
 * @returns
 */
export function pipe<CallValue, NextValue>(
  callable: ExplicitCallable<CallValue, NextValue>,
  memoized: boolean = false
): IPipe<CallValue, NextValue> {
  const pipeline = [callable] as Pipeline;
  return createMethods<CallValue, NextValue>(pipeline, memoized) as IPipe<CallValue, NextValue>;
}
