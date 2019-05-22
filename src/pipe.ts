export type Callable<T, R> = (arg: T, context: IPipeContext<T, R>) => R;
export type ToFunction<T, R> = () => (arg: T) => Promise<R>;
export type ToSyncFunction<T, R> = () => (arg: T) => R;

/**
 * Represents a pipe
 */
export type Pipe<T = unknown> = <R>(callable: Callable<T, R>) => {
  pipe: Pipe<R>;
  readonly pipeline: any[] & [Callable<T, R>];
  resolve(arg: T): Promise<R>;
  resolveSync(arg: T): R;
  toFunction: ToFunction<T, R>;
  toSyncFunction: ToSyncFunction<T, R>;
};

export type PipeLine<T, R> = any[] & [Callable<T, R>];

export interface IPipeContext<T = unknown, R = unknown> {
  callValue: T;
  index: number;
  memory: Map<string, unknown>;
  pipeline: PipeLine<T, R>;
  // next(): Pipe<R>;
  // prev(): Pipe<T>;
}

/**
 * @template T
 * @template R
 * @param {any[]} pipeline
 * @returns {(arg: T) => Promise<R>}
 */
export function createResolver<T, R>(pipeline: any[], context: IPipeContext): (arg: T) => Promise<R> {
  return async (arg: T) => {
    const newArray = pipeline.slice();
    const length = pipeline.length;

    let previousResult: any = arg;

    context.callValue = arg;

    for (let i = 0; i < length; i++) {
      const callback = newArray[i];
      const result = await callback(previousResult, context);

      previousResult = result;
    }

    return previousResult;
  };
}

/**
 * @template T
 * @template R
 * @param {any[]} pipeline
 * @returns {(arg: T) => R}
 */
export function createSyncResolver<T, R>(pipeline: any[], context: IPipeContext): (arg: T) => R {
  return (arg: T) => {
    const newArray = pipeline.slice();
    const length = pipeline.length;

    let previousResult: any = arg;

    context.callValue = arg;

    for (let i = 0; i < length; i++) {
      context.index = i;

      const callback = newArray[i];
      const result = callback(previousResult, context);

      previousResult = result;
    }

    return previousResult;
  };
}

export function createToFunction<T, R>(pipeline: any[], context: IPipeContext): ToFunction<T, R> {
  return () => createResolver<T, R>(pipeline, context);
} 

export function createToSyncFunction<T, R>(pipeline: any[], context: IPipeContext): ToSyncFunction<T, R> {
  return () => createSyncResolver<T, R>(pipeline, context);
} 

export function createContext<T = unknown, R = unknown>(pipeline: PipeLine<T, R>): IPipeContext<T, R> {
  return {
    callValue: undefined,
    index: 0,
    memory: new Map(),
    pipeline,
  }
}

/**
 * @returns
 */
export function pipe<X, T>(initialCallable: <X>(arg: X, context: IPipeContext<X, T>) => T, preExistingPipeline: any[] = []) {
  const pipeline: any[] = preExistingPipeline.concat(initialCallable);
  const context = createContext(pipeline as any);

  const createPipe = <R>(callable: (arg: T, context: IPipeContext<T, R>) => R) => {
    pipeline.push(callable);

    return {
      pipe: createPipe as unknown as Pipe<R>,
      get pipeline() {
        return pipeline.slice();
      },
      resolve: createResolver<X, R>(pipeline, context),
      resolveSync: createSyncResolver<X, T>(pipeline, context),
      toFunction: createToFunction<X, R>(pipeline, context),
      toSyncFunction: createToSyncFunction<X, R>(pipeline, context),
    };
  };

  return {
    pipe: createPipe,
    get pipeline() {
      return pipeline.slice();
    },
    resolve: createResolver<X, T>(pipeline, context),
    resolveSync: createSyncResolver<X, T>(pipeline, context),
    toFunction: createToFunction<X, T>(pipeline, context),
    toSyncFunction: createToSyncFunction<X, T>(pipeline, context),
  };
}

export default pipe;
