export type Callable = <Input, Output>(input: Input, context: IContext<unknown, Input>) => Output;
export type ExecutionContextFlow = 'async' | 'sync';
export type ExplicitCallable<Input, Output> = (input: Input, context: IContext<unknown, Input>) => Output;
export type ResolvedPipe<Input, Output> = (input: Input) => Promise<Output>;
export type ResolvedSyncPipe<Input, Output> = (input: Input) => Output;
export type Pipeline = Array<Callable | ExplicitCallable<unknown, unknown>>;

export interface IContext<CallValue = unknown, PreviousValue = unknown> {
  readonly callValue: CallValue;
  readonly executionFlow: ExecutionContextFlow;
  readonly mutationIndex: number;
  readonly previousValue: PreviousValue;
  readonly previousValues: unknown[];
  apply<ReturnType>(callable: ExplicitCallable<PreviousValue, ReturnType>): ReturnType;
  mutate?(pipeline: Pipeline): IMutatedContext;
}

export interface IPipe<InitialCallable, Output> {
  readonly memoized: boolean;
  readonly type: 'pipe';
  pipe<NextValue>(callable: ExplicitCallable<Output, NextValue>): IPipe<InitialCallable, NextValue>;
  resolve: ResolvedPipe<InitialCallable, Output>;
  resolveSync: ResolvedSyncPipe<InitialCallable, Output>;
  toFunction(): (input: InitialCallable) => Promise<Output>;
  toSyncFunction(): (input: InitialCallable) => Output;
}

export interface IMutatedContext {
  pipeline: Pipeline;
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

function createContext<CallValue>(callValue: CallValue, executionFlow: ExecutionContextFlow): IContext<CallValue> {
  return {
    callValue,
    executionFlow,
    mutationIndex: 0,
    previousValue: undefined,
    previousValues: [],
    apply(this: IContext<CallValue>, callable) {
      return callable(this.previousValue, this);
    },
  };
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
      return (createMethods<TCallValue, TNextValue>([...pipeline, callable], memoized) as unknown) as IPipe<
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
  let previousCallValue: TCallValue = undefined;
  let previousReturnValue: TReturnValue = undefined;

  return async callValue => {
    if (memoized && callValue === previousCallValue) {
      return previousReturnValue;
    }

    previousCallValue = callValue;
    previousReturnValue = (await resolve(pipeline, 0, createContext(callValue, 'async'))) as TReturnValue;

    return previousReturnValue;
  };
}

function createSyncResolver<TCallValue, TReturnValue>(
  pipeline: Pipeline,
  memoized: boolean
): ResolvedSyncPipe<TCallValue, TReturnValue> {
  let previousCallValue: TCallValue = undefined;
  let previousReturnValue: TReturnValue = undefined;

  return callValue => {
    if (memoized && callValue === previousCallValue) {
      return previousReturnValue;
    }

    previousCallValue = callValue;
    previousReturnValue = resolveSync(pipeline, 0, createContext(callValue, 'sync')) as TReturnValue;

    return previousReturnValue;
  };
}

async function resolve(pipeline: Pipeline, index: number, context: IContext): Promise<unknown> {
  if (index >= pipeline.length) {
    return context.previousValue;
  }

  const previousValue = await Promise.resolve(pipeline[index](context.previousValue, context));
  const updatedContext = updateContext<unknown, unknown>(context, previousValue);
  const [mutatedContext, mutatedPipeline] = applyMutation(updatedContext, pipeline);

  return resolve(mutatedPipeline, index + 1, mutatedContext);
}

function resolveSync(pipeline: Pipeline, index: number, context: IContext): unknown {
  if (index >= pipeline.length) {
    return context.previousValue;
  }

  const previousValue = pipeline[index](context.previousValue, context);
  const updatedContext = updateContext<unknown, unknown>(context, previousValue);
  const [mutatedContext, mutatedPipeline] = applyMutation(updatedContext, pipeline);

  return resolveSync(mutatedPipeline, index + 1, mutatedContext);
}

function updateContext<CallValue, PreviousValue = unknown>(
  context: IContext<CallValue>,
  previousValue: PreviousValue
): IContext<CallValue, PreviousValue> {
  const { apply, callValue, executionFlow, mutationIndex, mutate, previousValues } = context;

  return {
    apply: apply as any,
    callValue,
    executionFlow,
    mutationIndex: mutationIndex + 1,
    mutate,
    previousValue,
    previousValues: [...previousValues, previousValue],
  };
}

export function pipe<CallValue, NextValue>(
  callable: ExplicitCallable<CallValue, NextValue>,
  memoized: boolean = false
) {
  const pipeline = [callable] as Pipeline;
  return createMethods<CallValue, NextValue>(pipeline, memoized);
}
