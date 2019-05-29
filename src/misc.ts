import { IPipe, ExplicitCallable, IContext } from './pipe';
import { throwContextExecutionFlow } from './helpers';

export function apply<Initial, Output>(pipe: IPipe<Initial, Output>): ExplicitCallable<Initial, Output> {
  return (arg, context) => {
    throwContextExecutionFlow('apply', context, 'async');
    return pipe.resolve(arg) as unknown as Output;
  };
}

export function applySync<Initial, Output>(pipe: IPipe<Initial, Output>): ExplicitCallable<Initial, Output> {
  return (arg, context) => {
    throwContextExecutionFlow('applySync', context, 'sync');
    return pipe.resolveSync(arg);
  }
}

/**
 * Puts a value inside a pipeline
 * @export
 * @template TValue
 * @param {TValue} value
 * @returns {() => TValue}
 */
export function put<TValue>(value: TValue): () => TValue {
  return () => value;
}

/**
 * @export
 * @template T
 * @template TValue
 * @template TReturn
 * @param {T} callback
 * @returns {((arg: TValue) => TReturn | void)}
 */
export function safeCall<T extends (arg: TValue) => TReturn, TValue, TReturn>(callback: T, fallback?: TReturn): (arg: TValue) => TReturn | undefined {
  return arg => {
    try {
      return callback(arg);
    } catch {
      return fallback;
    }
  }
}

export function useCallValue<TCallValue = unknown>(): (value: unknown, context: IContext<unknown, TCallValue>) => TCallValue {
  return (_, context) => context.callValue as TCallValue;
}

export function useValue(): <TArg>(arg: TArg) => TArg {
  return value => value;
}
