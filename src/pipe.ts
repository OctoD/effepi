export type Callable = <Input, Output>(input: Input, context: IContext<unknown, Input>) => Output;
export type ExplicitCallable<Input, Output> = (input: Input, context: IContext<unknown, Input>) => Output;
export type ResolvedPipe<Input, Output> = (input: Input) => Promise<Output>;
export type ResolvedSyncPipe<Input, Output> = (input: Input) => Output;
export type Pipeline = Array<Callable | ExplicitCallable<unknown, unknown>>;

export interface IContext<CallValue = unknown, PreviousValue = unknown> {
  readonly callValue: CallValue;
  readonly mutationIndex: number;
  readonly previousValue: PreviousValue;
  readonly previousValues: unknown[];
  mutate?(pipeline: Pipeline): IMutatedContext;
}

export interface IPipe<InitialCallable, Output> {
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

  newPipeline.splice(context.mutationIndex, 0, ... mutations.pipeline);
  
  context.mutate = undefined;

  return [
    context,
    newPipeline,
  ];
}

function createContext<CallValue>(callValue: CallValue): IContext<CallValue> {
  return {
    callValue,
    mutationIndex: 0,
    previousValue: undefined,
    previousValues: [],
  };
}

function createFunction<TCallValue, TReturnValue>(pipeline: Pipeline): (arg: TCallValue) => Promise<TReturnValue> {
  const resolver = createResolver<TCallValue, TReturnValue>(pipeline);
  return arg => resolver(arg);
}

function createMethods<TCallValue, TReturnValue>(pipeline: Pipeline): IPipe<TCallValue, TReturnValue> {
  return {
    pipe: <TNextValue>(callable: ExplicitCallable<TReturnValue, TNextValue>): IPipe<TCallValue, TNextValue> => {
      return createMethods<TCallValue, TNextValue>(
        [
          ...pipeline, 
          callable
        ]
      ) as unknown as IPipe<TCallValue, TNextValue>;
    },
    resolve: createResolver<TCallValue, TReturnValue>(pipeline),
    resolveSync: createSyncResolver<TCallValue, TReturnValue>(pipeline),
    toFunction: <TCall, TReturn>() => createFunction<TCall, TReturn>(pipeline),
    toSyncFunction: <TCall, TReturn>() => createSyncFunction<TCall, TReturn>(pipeline),
  }
}

function createSyncFunction<TCallValue, TReturnValue>(pipeline: Pipeline): (arg: TCallValue) => TReturnValue {
  const resolver = createSyncResolver<TCallValue, TReturnValue>(pipeline);
  return arg => resolver(arg);
}

function createResolver<TCallValue, TReturnValue>(pipeline: Pipeline): ResolvedPipe<TCallValue, TReturnValue> {
  return async callValue => {
    return resolve(
      pipeline, 
      0, 
      createContext(callValue)
    ) as Promise<TReturnValue>;
  }
}

function createSyncResolver<TCallValue, TReturnValue>(pipeline: Pipeline): ResolvedSyncPipe<TCallValue, TReturnValue> {
  return callValue => {
    return resolveSync(
      pipeline, 
      0, 
      createContext(callValue)
    ) as TReturnValue;
  }
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

function updateContext<CallValue, PreviousValue = unknown>(context: IContext<CallValue>, previousValue: PreviousValue): IContext<CallValue, PreviousValue> {
  const {
    callValue,
    mutationIndex,
    mutate,
    previousValues,
  } = context;
  
  return {
    callValue,
    mutationIndex: mutationIndex + 1,
    mutate,
    previousValue,
    previousValues: [... previousValues, previousValue],
  };
}

export default function pipe<CallValue, NextValue>(callable: ExplicitCallable<CallValue, NextValue>) {
  const pipeline = [callable] as Pipeline;
  return createMethods<CallValue, NextValue>(pipeline);
}
