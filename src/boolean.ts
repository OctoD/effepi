import { ExplicitCallable } from './pipe';
import { throwIfNotBoolean } from './helpers';

/**
 * Inverts previous value.
 *
 * Previous value must be boolean.
 *
 * ```
 * pipe(useCallValue()).pipe(inverse()).resolveSync(true) // false
 * pipe(useCallValue()).pipe(inverse()).resolveSync(false) // true
 * ```
 * @export
 * @returns {ExplicitCallable<boolean, boolean>}
 */
export function inverse(): ExplicitCallable<boolean, boolean> {
  return arg => {
    throwIfNotBoolean('inverse', arg);
    return !arg;
  };
}

/**
 * Puts a `false` value.
 *
 * ```
 * pipe(F()).resolveSync(undefined) // false
 * ```
 * @export
 * @returns {ExplicitCallable<unknown, false>}
 */
export function F(): ExplicitCallable<unknown, false> {
  return () => false;
}

/**
 * Puts a `true` value.
 *
 * ```
 * pipe(T()).resolveSync(undefined) // true
 * ```
 * @export
 * @returns {ExplicitCallable<unknown, true>}
 */
export function T(): ExplicitCallable<unknown, true> {
  return () => true;
}
