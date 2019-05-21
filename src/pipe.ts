export type Callable<T, R> = (arg: T) => R;
export type ToFunction<T, R> = () => (arg: T) => Promise<R>;

/**
 * Represents a pipe
 */
export type Pipe<T = unknown> = <R>(callable: Callable<T, R>) => {
  pipe: Pipe<R>;
  readonly pipeline: any[] & [Callable<T, R>];
  resolve(arg: T, context: IPipeContext<T, R>): Promise<R>;
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
    let length = pipeline.length;

    let previousResult: any = arg;

    while (length > 0) {
      const callback = newArray.pop();
      const result = await callback(previousResult, 
        createContext(pipeline.slice(0, pipeline.length - length) as any)
      );

      previousResult = result;
      length--;
    }

    return previousResult;
  };
}

function createToFunction<T, R>(pipeline: any[]): ToFunction<T, R> {
  return () => createResolver<T, R>(pipeline);
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
      toFunction: createToFunction<X, R>(pipeline),
    };
  };

  return {
    pipe: createPipe,
    get pipeline() {
      return pipeline.slice();
    },
    resolve: createResolver<X, T>(pipeline),
    toFunction: createToFunction<X, T>(pipeline),
  };
}

export default pipe;
