export type Callable = <Input, Output>(input: Input) => Output;
export type ExplicitCallable<Input, Output> = (input: Input) => Output;
export type ResolvedPipe<Input, Output> = (input: Input) => Promise<Output>;
export type ResolvedSyncPipe<Input, Output> = (input: Input) => Output;

export interface IContext<CallValue = unknown, PreviousValue = unknown> {
  readonly callValue: CallValue;
  readonly mutationIndex: number;
  readonly previousValue: PreviousValue;
  readonly previousValues: unknown[];
}

export interface IPipe<InitialCallable, Output> {
  pipe<NextValue>(callable: ExplicitCallable<Output, NextValue>): IPipe<InitialCallable, NextValue>;
  resolve(): ResolvedPipe<InitialCallable, Output>;
  resolveSync(): ResolvedSyncPipe<InitialCallable, Output>;
  toFunction(): (input: InitialCallable) => Output;
  toFunction(): (input: InitialCallable) => Output;
}

function createContext<CallValue>(callValue: CallValue): IContext<CallValue> {
  return {
    callValue,
    mutationIndex: 0,
    previousValue: undefined,
    previousValues: [],
  };
}

function updateContext<CallValue, PreviousValue = unknown>(context: IContext<CallValue>, previousValue: PreviousValue): IContext<CallValue, PreviousValue> {
  return {
    ... context,
    mutationIndex: context.mutationIndex + 1,
    previousValue,
  };
}

function pipe<CallValue, NextValue>(callable: ExplicitCallable<CallValue, NextValue>) {
  
}