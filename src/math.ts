import { ExplicitCallable } from './pipe';
import { throwIfNotArray, throwIfNotNumber } from './helpers';

/**
 * Sums a value to the previous one.
 *
 * ```
 * pipe(useCallValue()).pipe(add(1)).resolveSync(10) // 11
 * ```
 *
 * @export
 * @param {number} value
 * @returns {ExplicitCallable<number, number>}
 */
export function add(value: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('add', arg);
    return arg + value;
  };
}

/**
 * Changes previous value sign, from positive to negative and vice-versa.
 *
 * ```
 * pipe(put(-123)).pipe(changeSign()) // 123
 * ```
 *
 * @export
 * @returns {ExplicitCallable<number, number>}
 */
export function changeSign(): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('changeSign', arg);
    return -arg;
  };
}

/**
 * Decrements the previous value by one.
 *
 * ```
 * pipe(useCallValue()).pipe(decrement()).resolve(44) // 41
 * ```
 *
 * @export
 * @returns {ExplicitCallable<number, number>}
 */
export function decrement(): ExplicitCallable<number, number> {
  return arg => {
    throwIfNotNumber('decrement', arg);
    return --arg;
  };
}

/**
 * Divides the previous value by the passed one.
 *
 * ```
 * pipe(useCallValue()).pipe(divideBy(2)).resolve(44) // 22
 * ```
 *
 * @export
 * @param {number} value
 * @returns {ExplicitCallable<number, number>}
 */
export function divideBy(value: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('divideBy', arg);
    return arg / value;
  };
}

/**
 * Increments the previous value by one.
 *
 * ```
 * pipe(useCallValue()).pipe(increment()).resolve(44) // 45
 * ```
 *
 * @export
 * @returns {ExplicitCallable<number, number>}
 */
export function increment(): ExplicitCallable<number, number> {
  return arg => {
    throwIfNotNumber('increment', arg);
    return ++arg;
  };
}

export function isNegative(): ExplicitCallable<number, boolean> {
  return arg => arg >= 0;
}

export function isPositive(): ExplicitCallable<number, boolean> {
  return arg => arg >= 0;
}

/**
 * Multiplies the previous value by the given one
 *
 * ```
 * pipe(useCallValue()).pipe(multiplyBy(2)).resolve(44) // 88
 * ```
 *
 * @export
 * @param {number} value
 * @returns {ExplicitCallable<number, number>}
 */
export function multiplyBy(value: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('multiplyBy', arg);
    return arg * value;
  };
}

/**
 * Converts previous' value from positive sign to negative unless is already negative.
 *
 * ```
 * pipe(useCallValue()).pipe(negative()).resolve(44) // -44
 * pipe(useCallValue()).pipe(negative()).resolve(-12) // -12
 * ```
 *
 * @export
 * @returns {ExplicitCallable<number, number>}
 */
export function negative(): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('negative', arg);
    return arg > 0 ? -arg : arg;
  };
}

/**
 * Converts previous' value from negative sign to positive unless is already positive.
 *
 * ```
 * pipe(useCallValue()).pipe(positive()).resolve(44) // 44
 * pipe(useCallValue()).pipe(positive()).resolve(-12) // 12
 * ```
 *
 * @export
 * @returns {ExplicitCallable<number, number>}
 */
export function positive(): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('positive', arg);
    return arg > 0 ? arg : -arg;
  };
}

/**
 * Raises to power the previous value by a given exponent
 *
 * ```
 * pipe(useCallValue()).pipe(pow(4)).resolve(2) // 16
 * pipe(useCallValue()).pipe(pow(2)).resolve(-2) // 4
 * ```
 *
 * @export
 * @param {number} exponent
 * @returns {ExplicitCallable<number, number>}
 */
export function pow(exponent: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('pow', arg);
    return arg ** exponent;
  };
}

/**
 * Extracts the root of the previous value by a given exponent
 *
 * ```
 * pipe(useCallValue()).pipe(root(2)).resolve(4) // 2
 * pipe(useCallValue()).pipe(root(2)).resolve(9) // 3
 * ```
 *
 * @export
 * @param {number} exponent
 * @returns {ExplicitCallable<number, number>}
 */
export function root(exponent: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('root', arg);
    return Math.pow(arg, 1 / exponent);
  };
}

/**
 * Subtracts the previous value by the given one
 *
 * ```
 * pipe(useCallValue()).pipe(subtract(2)).resolve(9) // 7
 * ```
 *
 * @export
 * @param {number} value
 * @returns {ExplicitCallable<number, number>}
 */
export function subtract(value: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('subtract', arg);
    return arg - value;
  };
}

/**
 * Takes all numbers in a number array between two values (inclusive)
 *
 * ```
 * pipe(useCallValue()).pipe(takeBetween(5, 7)).resolve([4, 5, 6, 7, 8]) // [5, 6, 7]
 * ```
 *
 * @export
 * @param {number} start
 * @param {number} end
 * @returns {ExplicitCallable<number[], number[]>}
 */
export function takeBetween(start: number, end: number): ExplicitCallable<number[], number[]> {
  return (arg: number[]) => {
    throwIfNotArray(`takeBetween`, arg);

    const newArray: number[] = [];
    const length = arg.length;

    for (let i = 0; i < length; i++) {
      const value = arg[i];

      throwIfNotNumber('takeBetween', value);

      if (value >= start && value <= end) {
        newArray.push(value);
      }
    }

    return newArray;
  };
}

/**
 * Returns the greater number in a number array
 *
 * ```
 * pipe(useCallValue()).pipe(takeGreater()).resolve([4, 5, 44, 6, 7, 8]) // 44
 * ```
 *
 * @export
 * @returns {ExplicitCallable<number[], number>}
 */
export function takeGreater(): ExplicitCallable<number[], number> {
  return (arg: number[]) => {
    throwIfNotArray('takeGreater', arg);
    return Math.max.apply(Math, arg);
  };
}

/**
 * Takes all numbers in a number array greater than a given value.
 *
 * ```
 * pipe(useCallValue()).pipe(takeGreaterThan(8)).resolve([4, 5, 44, 6, 7, 8]) // [44]
 * ```
 *
 * This function accepts a second parameter (boolean) to include also the same value
 *
 * ```
 * pipe(useCallValue()).pipe(takeGreaterThan(8, true)).resolve([4, 5, 44, 6, 7, 8]) // [8, 44]
 * ```
 *
 * @export
 * @param {number} check
 * @param {boolean} [equal=false]
 * @returns {ExplicitCallable<number[], number[]>}
 */
export function takeGreaterThan(check: number, equal: boolean = false): ExplicitCallable<number[], number[]> {
  return (arg: number[]) => {
    throwIfNotArray(`takeGreaterThan`, arg);

    const newArray: number[] = [];
    const length = arg.length;

    for (let i = 0; i < length; i++) {
      const value = arg[i];

      throwIfNotNumber('takeGreaterThan', value);

      if (equal && value >= check) {
        newArray.push(value);
      } else if (value > check) {
        newArray.push(value);
      }
    }

    return newArray;
  };
}

/**
 * Returns the lower number in a number array
 *
 * ```
 * pipe(takeLower()).pipe(takeGreater()).resolve([4, 5, 44, 6, 7, 8]) // 4
 * ```
 *
 * @export
 * @returns {ExplicitCallable<number[], number>}
 */
export function takeLower(): ExplicitCallable<number[], number> {
  return (arg: number[]) => {
    throwIfNotArray('takeLower', arg);
    return Math.min.apply(Math, arg);
  };
}

/**
 * Takes all numbers in a number array lower than a given value.
 *
 * ```
 * pipe(useCallValue()).pipe(takeLowerThan(5)).resolve([4, 5, 44, 6, 7, 8]) // [4]
 * ```
 *
 * This function accepts a second parameter (boolean) to include also the same value
 *
 * ```
 * pipe(useCallValue()).pipe(takeLowerThan(8, true)).resolve([4, 5, 44, 6, 7, 8]) // [4, 5, 6, 7, 8]
 * ```
 *
 * @export
 * @param {number} check
 * @param {boolean} [equal=false]
 * @returns {ExplicitCallable<number[], number[]>}
 */
export function takeLowerThan(check: number, equal: boolean = false): ExplicitCallable<number[], number[]> {
  return (arg: number[]) => {
    throwIfNotArray(`takeLowerThan`, arg);

    const newArray: number[] = [];
    const length = arg.length;

    for (let i = 0; i < length; i++) {
      const value = arg[i];

      throwIfNotNumber('takeLowerThan', value);

      if (equal && value <= check) {
        newArray.push(value);
      } else if (value < check) {
        newArray.push(value);
      }
    }

    return newArray;
  };
}

/**
 * Takes all numbers in a number array lower than the first passed value or greater than the second passed value. Matching elements are discarded.
 *
 * ```
 * pipe(useCallValue()).pipe(takeOuter(5, 10)).resolveSync([3,4,5,10,11]) // [3, 4, 11]
 * ```
 *
 * @export
 * @param {number} start
 * @param {number} end
 * @returns {ExplicitCallable<number[], number[]>}
 */
export function takeOuter(start: number, end: number): ExplicitCallable<number[], number[]> {
  return (arg: number[]) => {
    throwIfNotArray(`takeOuter`, arg);

    const newArray: number[] = [];
    const length = arg.length;

    for (let i = 0; i < length; i++) {
      const value = arg[i];

      throwIfNotNumber('takeOuter', value);

      if (value < start || value > end) {
        newArray.push(value);
      }
    }

    return newArray;
  };
}
