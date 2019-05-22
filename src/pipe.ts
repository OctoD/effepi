export type Callable<T, R> = (arg: T) => R;
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
};

export type PipeLine<T, R> = any[] & [Callable<T, R>];

export interface IPipeContext<T, R> {
  index: number;
  pipeline: PipeLine<T, R>;
}

/**
 * @template T
 * @template R
 * @param {any[]} pipeline
 * @returns {(arg: T) => Promise<R>}
 */
function createResolver<T, R>(pipeline: any[]): (arg: T) => Promise<R> {
  return async (arg: T) => {
    const newArray = pipeline.slice();
    const length = pipeline.length;

    let previousResult: any = arg;

    for (let i = 0; i < length; i++) {
      const callback = newArray[i];
      const result = await callback(previousResult,
        createContext(pipeline.slice(0, pipeline.length - length) as any)
      );

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
function createSyncResolver<T, R>(pipeline: any[]): (arg: T) => R {
  return (arg: T) => {
    const newArray = pipeline.slice();
    const length = pipeline.length;

    let previousResult: any = arg;

    for (let i = 0; i < length; i++) {
      const callback = newArray[i];
      const result = callback(previousResult,
        createContext(pipeline.slice(0, pipeline.length - length) as any)
      );

      previousResult = result;
    }

    return previousResult;
  };
}

function createToFunction<T, R>(pipeline: any[]): ToFunction<T, R> {
  return () => createResolver<T, R>(pipeline);
} 

function createToSyncFunction<T, R>(pipeline: any[]): ToSyncFunction<T, R> {
  return () => createSyncResolver<T, R>(pipeline);
} 

function createContext<T, R>(pipeline: PipeLine<T, R>): IPipeContext<T, R> {
  return {
    index: pipeline.length,
    pipeline,
  }
}

/**
 * @returns
 */
export function pipe<X, T>(initialCallable: (arg: X) => T, preExistingPipeline: any[] = []) {
  const pipeline: any[] = preExistingPipeline.concat(initialCallable);

  const createPipe = <R>(callable: (arg: T, context: IPipeContext<T, R>) => R) => {
    pipeline.push(callable);

    return {
      pipe: createPipe as unknown as Pipe<R>,
      get pipeline() {
        return pipeline.slice();
      },
      resolve: createResolver<X, R>(pipeline),
      resolveSync: createSyncResolver<X, T>(pipeline),
      toFunction: createToFunction<X, R>(pipeline),
      toSyncFunction: createToSyncFunction<X, R>(pipeline),
    };
  };

  return {
    pipe: createPipe,
    get pipeline() {
      return pipeline.slice();
    },
    resolve: createResolver<X, T>(pipeline),
    resolveSync: createSyncResolver<X, T>(pipeline),
    toFunction: createToFunction<X, T>(pipeline),
    toSyncFunction: createToSyncFunction<X, T>(pipeline),
  };
}

export default pipe;
