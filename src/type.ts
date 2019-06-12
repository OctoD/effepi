import { Callable } from './pipe';
import { getTypeOf, throwIfNotArray } from './helpers';

export type TypeCheckerFunction = (value: unknown) => boolean;

export type KnownTypes = 'bigint' | 'boolean' | 'function' | 'undefined' | 'number' | 'object' | 'string';

/**
 * Throws if the previous value is not of the same type expected.
 *
 * TypeName is the second portion of a `Object.prototype.toString` call in **lowerCase**:
 *
 * > [object **TypeName**] --> `typename`
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(exactTypeOf('date'))
 *   .resolveSync(123) // throws!
 *
 * pipe(useCallValue())
 *   .pipe(exactTypeOf('date'))
 *   .resolveSync(new Date()) // 2019-03-26T02:17:000Z
 * ```
 *
 * @export
 * @param {string} typeName
 * @returns {Callable}
 */
export function exactTypeOf(typeName: string): Callable {
  return arg => {
    if (getTypeOf(arg) === typeName) {
      return arg as any;
    }

    throw new TypeError(`Invalid type ${getTypeOf(arg)}, expected ${typeName}`);
  };
}

/**
 * Throws if the previous value is not of the same type expected.
 *
 * Internally uses the `typeof` operator.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(exactTypeOf('number'))
 *   .resolveSync(123) // 123
 *
 * pipe(useCallValue())
 *   .pipe(exactTypeOf('number'))
 *   .resolveSync(`hello world!`) // throws!
 * ```
 *
 * @export
 * @template T
 * @param {T} typeName
 * @returns {Callable}
 */
export function ofType<T extends KnownTypes>(typeName: T): Callable {
  return arg => {
    if (typeof arg === typeName) {
      return arg as any;
    }

    throw new TypeError(`Invalid type ${typeof arg}, expected ${typeName}`);
  };
}

/**
 * Converts previous value to an array.
 *
 * ```
 * pipe(useCallValue()).pipe(toArray()).resolveSync(10) // [10]
 * ```
 *
 * @export
 * @returns {<T>(arg: T) => T[]}
 */
export function toArray(): <T>(arg: T) => T[] {
  return arg => [arg];
}

/**
 * Converts previous value to a boolean value.
 *
 * ```
 * pipe(useCallValue()).pipe(toBoolean()).resolveSync(10) // true
 * pipe(useCallValue()).pipe(toBoolean()).resolveSync(0) // false
 * pipe(useCallValue()).pipe(toBoolean()).resolveSync(null) // false
 * pipe(useCallValue()).pipe(toBoolean()).resolveSync(undefined) // false
 * pipe(useCallValue()).pipe(toBoolean()).resolveSync('') // false
 * pipe(useCallValue()).pipe(toBoolean()).resolveSync('123') // true
 * ```
 *
 * @export
 * @returns {<T>(arg: T) => boolean}
 */
export function toBoolean(): <T>(arg: T) => boolean {
  return arg => (!arg === true ? false : true);
}

/**
 * Converts previous value to a Date instance.
 *
 * ```
 * pipe(useCallValue())
 *    .pipe(toDate())
 *    .resolveSync(`2019-01-01T00:00:000Z`) // Date(2019, 0, 1, 0, 0, 0)
 * ```
 *
 * @export
 * @returns {((arg: string | number) => Date)}
 */
export function toDate(): (arg: string | number) => Date {
  return arg => new Date(arg);
}

/**
 * Converts previous value to a number.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(toNumber())
 *   .resolveSync('12000') // 12000
 * ```
 *
 * @export
 * @returns {(arg: unknown) => number}
 */
export function toNumber(): (arg: unknown) => number {
  return arg => Number(arg);
}

/**
 * Converts previous value to a set. Previous value must be an array.
 *
 * @export
 * @returns {<T>(arg: T[]) => Set<T>}
 */
export function toSet(): <T>(arg: T[]) => Set<T> {
  return arg => {
    throwIfNotArray('toSet', arg);

    return new Set(arg);
  };
}

/**
 * Converts previous value to a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(toString())
 *   .resolveSync([1,2,3]) // "1,2,3"
 * ```
 *
 * @export
 * @returns {(arg: unknown) => string}
 */
export function toString(): (arg: unknown) => string {
  return arg => String(arg);
}
