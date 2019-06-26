import { IPipe, ExplicitCallable } from './pipe';
import { throwContextExecutionFlow, throwIfNotFunction } from './helpers';
import { IContext } from './context';

/**
 * A simple currying function which adapts a function
 * with two arguments in order to be used with the `pipe` method.
 *
 * Can adapt both a sync or an async function.
 *
 * ```ts
 * function myFn(name: string, surname: string): string {
 *    return [name, surname].join(' ');
 * }
 *
 * async function myFnAsync(name: string, surname: string): string {
 *    return [name, surname].join(' ');
 * }
 *
 * const adaptedMyFn = adapt(myFn);
 * const adaptedMyFnAsync = adapt(myFnAsync);
 *
 * pipe(useCallValue())
 *    .pipe(adaptedMyFn('john'))
 *    .resolveSync('snow'); // 'john snow'
 *
 * pipe(useCallValue())
 *    .pipe(adaptedMyFnAsync('john'))
 *    .resolve('snow'); // Promise('john snow')
 * ```
 *
 * @export
 * @template Arg1
 * @template Arg2
 * @template ReturnType
 * @param {(arg1: Arg1, arg2: Arg2) => ReturnType} fn
 * @returns {(arg: Arg1) => ExplicitCallable<Arg2, ReturnType>}
 */
export function adapt<Arg1, Arg2, ReturnType>(
  fn: (arg1: Arg1, arg2: Arg2) => ReturnType
): (arg: Arg1) => ExplicitCallable<Arg2, ReturnType> {
  return arg1 => arg2 => fn(arg1, arg2);
}

/**
 * Applies a pipeline using the async `resolve` method.
 *
 * > Note: invoking a pipeline using this function with a sync method will throw an error.
 *
 * ```
 * const injectedPipeline = pipe(functions.useCallValue())
 *         .pipe(functions.add(10));
 *
 * const testPipeline = pipe(functions.useCallValue())
 *   .pipe(functions.apply(injectedPipeline))
 *   .pipe(functions.multiplyBy(2));
 *
 * testPipeline.resolve(2) // Promise(24)
 * ```
 *
 * @export
 * @template Initial
 * @template Output
 * @param {IPipe<Initial, Output>} pipe
 * @returns {ExplicitCallable<Initial, Output>}
 */
export function apply<Initial, Output>(pipe: IPipe<Initial, Output>): ExplicitCallable<Initial, Output> {
  return (arg, context) => {
    throwContextExecutionFlow('apply', context, 'async');
    return (pipe.resolve(arg) as unknown) as Output;
  };
}

/**
 * Applies a pipeline using the sync `resolveSync` method.
 *
 * > Note: invoking a pipeline using this function with an async method will throw an error.
 *
 * ```
 * const injectedPipeline = pipe(functions.useCallValue())
 *         .pipe(functions.add(10));
 *
 * const testPipeline = pipe(functions.useCallValue())
 *   .pipe(functions.applySync(injectedPipeline))
 *   .pipe(functions.multiplyBy(2));
 *
 * testPipeline.resolve(2) // 24
 * ```
 *
 * @export
 * @template Initial
 * @template Output
 * @param {IPipe<Initial, Output>} pipe
 * @returns {ExplicitCallable<Initial, Output>}
 */
export function applySync<Initial, Output>(pipe: IPipe<Initial, Output>): ExplicitCallable<Initial, Output> {
  return (arg, context) => {
    throwContextExecutionFlow('applySync', context, 'sync');
    return pipe.resolveSync(arg);
  };
}

/**
 * Calls previous value with a specific argument.
 *
 * Works both with async and sync flows, and the argument can be both a value or a pipeline.
 *
 * It will throw a TypeError if the previous value is not a function.
 *
 * ```ts
 * const p1 = pipe(put(2));
 *
 * pipe(useCallValue())
 *    .pipe(callWith(2))
 *    .resolveSync((arg: number) => arg * 2) // 4
 *
 * pipe(useCallValue())
 *    .pipe(callWith(2))
 *    .resolve(async (arg: number) => arg * 2) // Promise(4)
 * ```
 *
 * @export
 * @template Arg
 * @template ReturnType
 * @param {Arg} value
 * @returns {ExplicitCallable<(arg: Arg) => ReturnType, ReturnType>}
 */
export function callWith<Arg, ReturnType>(value: Arg): ExplicitCallable<(arg: Arg) => ReturnType, ReturnType> {
  return fn => {
    throwIfNotFunction(`callWith`, `fn`, fn);

    return fn(value);
  };
}

/**
 * Use this function to put a value at the beginning of the pipeline
 *
 * ```
 * pipe(put(10)).resolveSync(0) // 10
 * ```
 *
 * @export
 * @template TValue
 * @param {TValue} value
 * @returns {() => TValue}
 */
export function put<TValue>(value: TValue): () => TValue {
  return () => value;
}

/**
 * Use this function to perform a safe function call (will not throw) with the previous value as argument
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(safeCall(() => throw new Error('hello world')))
 *   .resolveSync(100) // will not throw, instead it will return 100
 * ```
 *
 * @export
 * @template T
 * @template TValue
 * @template TReturn
 * @param {T} callback
 * @returns {((arg: TValue) => TReturn | void)}
 */
export function safeCall<T extends (arg: TValue) => TReturn, TValue, TReturn>(
  callback: T,
  fallback?: TReturn
): (arg: TValue) => TReturn | undefined {
  return arg => {
    try {
      return callback(arg);
    } catch {
      return fallback;
    }
  };
}

/**
 * Use this function at the beginning of your pipeline to use the passed value to `resolve`/`resolveSync` and to function invokation
 *
 * ```
 * const p = pipe(useCallValue()).add(100);
 *
 * p.resolve(200) // Promise(300)
 * p.resolveSync(10) // 110
 * p.toFunction()(123) // Promise(223)
 * p.toSyncFunction()(1000) // 1100
 * ```
 *
 * @export
 * @template TCallValue
 * @returns {(
 *   value: unknown,
 *   context: IContext<unknown, TCallValue>
 * ) => TCallValue}
 */
export function useCallValue<TCallValue = unknown>(): (
  value: unknown,
  context: IContext<unknown, TCallValue>
) => TCallValue {
  return (_, context) => context.callValue as TCallValue;
}

/**
 * Use this function to return the previous pipeline value
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(add(10))
 *   .pipe(useValue())
 *   .resolveSync(10) // 20
 * ```
 *
 * @export
 * @returns {<TArg>(arg: TArg) => TArg}
 */
export function useValue(): <TArg>(arg: TArg) => TArg {
  return value => value;
}
