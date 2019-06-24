import { ExplicitCallable, Callable } from './pipe';
import { throwIfNotObject, isPipe } from './helpers';
import { isNullOrUndefined } from 'util';
import { IContext } from './context';

/**
 * Returns previous value except for the given keys. This applies only to objects.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(exclude('foo'))
 *   .resolveSync({ foo: 123, bar: 'baz' }); // { bar: 'baz' }
 * ```
 *
 * @export
 * @template KObject
 * @template Keys
 * @param {...Keys[]} keys
 * @returns {ExplicitCallable<KObject, Pick<KObject, Keys>>}
 */
export function exclude<KObject, Keys extends keyof KObject = keyof KObject>(
  ...keys: Keys[]
): ExplicitCallable<KObject, Pick<KObject, Keys>> {
  return (arg: any) => {
    throwIfNotObject(`pick`, arg);

    const newObject = <Pick<KObject, Keys>>{ ...arg };
    const keysArray = keys.slice();

    while (keysArray.length > 0) {
      delete newObject[keysArray.pop()!];
    }

    return newObject;
  };
}

/**
 * Returns if an object has a owned property
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(hasProperty('foo'))
 *   .resolveSync({ foo: new Date() }) // true
 * ```
 *
 * @export
 * @param {string} propertyKey
 * @returns {ExplicitCallable<unknown, boolean>}
 */
export function hasProperty(propertyKey: string): ExplicitCallable<unknown, boolean> {
  return arg => {
    if (isNullOrUndefined(arg)) {
      return false;
    }

    return Object.prototype.hasOwnProperty.call(arg, propertyKey);
  };
}

/**
 * Returns previous's value keys. Works only for objects
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(keys())
 *   .resolveSync({ bar: 123, foo: new Date() }) // ['bar', 'foo']
 * ```
 *
 * @export
 * @returns {Callable}
 */
export function keys(): Callable {
  return arg => {
    throwIfNotObject(`keys`, arg);

    return Object.keys((arg as unknown) as object) as any;
  };
}

/**
 * Returns a property key value by a given path. This applies only to objects.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(maybe('foo.bar'))
 *   .resolveSync({ foo: { bar: 100 } }) // 100
 * ```
 *
 * You can provide a fallback value or a fallback pipeline if the path does not match the object schema.
 *
 * If you start you pipeline with the `useCallValue` function, the monad will be invoked with an `undefined` value.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(maybe('foo.bar.baz', 123))
 *   .resolveSync({ foo: { bar: 100 } }) // 123
 *
 * // or
 *
 * const fallback = pipe(useCallValue());
 *
 * pipe(useCallValue())
 *   .pipe(maybe('foo.bar.baz', fallback))
 *   .resolveSync({ foo: { bar: 100 } }) // undefined
 *
 * // or
 *
 * const fallback = pipe(put(10));
 *
 * pipe(useCallValue())
 *   .pipe(maybe('foo.bar.baz', fallback))
 *   .resolveSync({ foo: { bar: 100 } }) // 10
 * ```
 *
 * @export
 * @template TObject
 * @template TReturn
 * @param {string} path
 * @param {TReturn} [fallbackValue]
 * @returns {(ExplicitCallable<TObject, TReturn | undefined>)}
 */
export function maybe<TObject = unknown, TReturn = unknown>(
  path: string,
  fallbackValue?: TReturn
): ExplicitCallable<TObject, TReturn | undefined> {
  const shouldUseFallback = (current: TObject) => {
    return isNullOrUndefined(current) && !isNullOrUndefined(fallbackValue);
  };

  const returnFallbackValue = (context: IContext) => {
    if (!isPipe(fallbackValue)) {
      return fallbackValue;
    }

    const isAsync = context.executionFlow === 'async';

    if (isAsync) {
      return (fallbackValue.resolve(undefined) as unknown) as TReturn;
    }

    return fallbackValue.resolveSync(undefined) as TReturn;
  };

  return (arg, context) => {
    throwIfNotObject('maybe', arg);

    let pathChunks = path.split('.').reverse();
    let current = arg;

    while (pathChunks.length) {
      const key = pathChunks.pop()!;

      if (!current) {
        break;
      }

      current = (current as any)[key];
    }

    if (shouldUseFallback(current)) {
      return returnFallbackValue(context);
    }

    return (current as unknown) as TReturn;
  };
}

/**
 * Merges the previous object with the given one
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(merge({ foo: 'bar' }))
 *   .resolveSync({ bar: 'baz' }) // { foo: 'bar', bar: 'baz' }
 * ```
 *
 * @export
 * @template T
 * @template K
 * @param {T} target
 * @returns {(ExplicitCallable<K, K & T>)}
 */
export function merge<T extends object, K>(target: T): ExplicitCallable<K, K & T> {
  return arg => {
    throwIfNotObject('merge', arg);

    return {
      ...arg,
      ...target,
    };
  };
}

/**
 * Returns a new object (previous value) with the given keys. This applies only to objects.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(pick('foo'))
 *   .resolveSync({ foo: 123, bar: 'baz' }); // { foo: 123 }
 * ```
 *
 * @export
 * @template KObject
 * @template Keys
 * @param {...Keys[]} keys
 * @returns {ExplicitCallable<KObject, Pick<KObject, Keys>>}
 */
export function pick<KObject, Keys extends keyof KObject = keyof KObject>(
  ...keys: Keys[]
): ExplicitCallable<KObject, Pick<KObject, Keys>> {
  return (arg: any) => {
    throwIfNotObject(`pick`, arg);

    const newObject = <Pick<KObject, Keys>>{};
    const keysArray = keys.slice();

    while (keysArray.length > 0) {
      const key = keysArray.pop();

      if (arg[key]) {
        (newObject as any)[key] = arg[key];
      }
    }

    return newObject;
  };
}
