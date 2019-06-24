import { IContext, create, update } from './context';

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

function applyMutation(context: IContext, pipeline: Pipeline): [IContext, Pipeline] {
  if (typeof context.mutate !== 'function') {
    return [context, pipeline];
  }

  const mutations = context.mutate(pipeline);
  const newPipeline = pipeline.slice();

  newPipeline.splice(context.mutationIndex, 0, ...mutations.pipeline);

  context.mutate = undefined;

  return [context, newPipeline];
}

function createFunction<TCallValue, TReturnValue>(
  pipeline: Pipeline,
  memoized: boolean
): (arg: TCallValue) => Promise<TReturnValue> {
  const resolver = createResolver<TCallValue, TReturnValue>(pipeline, memoized);
  return arg => resolver(arg);
}

function createMethods<TCallValue, TReturnValue>(
  pipeline: Pipeline,
  memoized: boolean
): IPipe<TCallValue, TReturnValue> {
  return {
    memoized,
    type: 'pipe',
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
    previousReturnValue = (await resolve(pipeline, 0, create(callValue, 'async'))) as TReturnValue;

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
    previousReturnValue = resolveSync(pipeline, 0, create(callValue, 'sync')) as TReturnValue;

    return previousReturnValue;
  };
}

async function resolve(pipeline: Pipeline, index: number, context: IContext): Promise<unknown> {
  if (index >= pipeline.length) {
    return context.previousValue;
  }

  const previousValue = await Promise.resolve(pipeline[index](context.previousValue, context));
  const updatedContext = update<unknown, unknown>(context, previousValue);
  const [mutatedContext, mutatedPipeline] = applyMutation(updatedContext, pipeline);

  return resolve(mutatedPipeline, index + 1, mutatedContext);
}

function resolveSync(pipeline: Pipeline, index: number, context: IContext): unknown {
  if (index >= pipeline.length) {
    return context.previousValue;
  }

  const previousValue = pipeline[index](context.previousValue, context);
  const updatedContext = update<unknown, unknown>(context, previousValue);
  const [mutatedContext, mutatedPipeline] = applyMutation(updatedContext, pipeline);

  return resolveSync(mutatedPipeline, index + 1, mutatedContext);
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
) {
  const pipeline = [callable] as Pipeline;
  return createMethods<CallValue, NextValue>(pipeline, memoized);
}
