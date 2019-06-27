import { IPipe, ExplicitCallable, Callable } from './pipe';
import { throwContextExecutionFlow, throwIfNotArray } from './helpers';
import { IContext } from './context';

/**
 * Applies a pipeline to an array of values.
 * It works only with async pipelines
 *
 * ```
 * const pipe1 = pipe(useCallValue()).pipe(multiplyBy(2)).pipe(add(11));
 * const pipe2 = pipe(useCallValue()).pipe(applyEach(pipe1));
 *
 * pipe2.resolve([10, 20, 30]) // Promise([31, 51, 71])
 * ```
 * @export
 * @template T
 * @template R
 * @param {IPipe<T, R>} pipe
 * @returns {(arg: T[], context: IContext<T[], R>) => Promise<R>[]}
 */
export function applyEach<T, R>(pipe: IPipe<T, R>): (arg: T[], context: IContext<T[], R>) => Promise<R>[] {
  return (values, context) => {
    throwContextExecutionFlow('applyEach', context, 'async');
    throwIfNotArray('applyEach', values);

    return values.map(value => pipe.resolve(value));
  };
}

/**
 * Applies a pipeline to an array of values.
 * It works only with sync pipelines
 *
 * ```
 * const pipe1 = pipe(useCallValue()).pipe(multiplyBy(2)).pipe(add(11));
 * const pipe2 = pipe(useCallValue()).pipe(applyEach(pipe1));
 *
 * pipe2.resolveSync([10, 20, 30]) // [31, 51, 71]
 * ```
 * @export
 * @template T
 * @template R
 * @param {IPipe<T, R>} pipe
 * @returns {(arg: T[], context: IContext<T[], R>) => R[]}
 */
export function applyEachSync<T, R>(pipe: IPipe<T, R>): (arg: T[], context: IContext<T[], R>) => R[] {
  return (values, context) => {
    throwContextExecutionFlow('applyEachSync', context, 'sync');
    throwIfNotArray('applyEach', values);

    return values.map(value => pipe.resolveSync(value));
  };
}

/**
 * Concatenates previous value with another array.
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(concat([4,5,6]))
 *   .resolveSync([1,2,3]) // [1,2,3,4,5,6]
 * ```
 *
 * @export
 * @template T
 * @param {T[]} newArr
 * @returns {ExplicitCallable<T[], T[]>}
 */
export function concat<T = unknown>(newArr: T[]): ExplicitCallable<T[], T[]> {
  return arr => {
    throwIfNotArray('concat', arr);

    return arr.concat(newArr);
  };
}

/**
 * Filters the previous value with a given callback. The callback must return a boolean value.
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(filter(a => a > 2))
 *   .resolveSync([1,2,3]) // [3]
 * ```
 * @export
 * @template T
 * @param {(arg: T) => boolean} filterCallback
 * @returns {ExplicitCallable<T[], T[]>}
 */
export function filter<T = unknown>(filterCallback: (arg: T) => boolean): ExplicitCallable<T[], T[]>;
/**
 * Filters the previous value with a given callback. The callback must return a boolean value.
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(filter((a, index) => index === 1))
 *   .resolveSync([1,2,3]) // [2]
 * ```
 * @export
 * @template T
 * @param {(arg: T, index: number) => boolean} filterCallback
 * @returns {ExplicitCallable<T[], T[]>}
 */
export function filter<T = unknown>(filterCallback: (arg: T, index: number) => boolean): ExplicitCallable<T[], T[]>;
/**
 * Filters the previous value with a given callback. The callback must return a boolean value.
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(filter((a, index, array) => array.length > 2 && index === 1 && a > 1))
 *   .resolveSync([1,2,3]) // [2]
 * ```
 * @export
 * @template T
 * @param {(arg: T, index: number, arr: T[]) => boolean} filterCallback
 * @returns {ExplicitCallable<T[], unknown[]>}
 */
export function filter<T = unknown>(
  filterCallback: (arg: T, index: number, arr: T[]) => boolean
): ExplicitCallable<T[], unknown[]> {
  return arr => {
    throwIfNotArray('filter', arr);

    return arr.filter(filterCallback);
  };
}

/**
 * Filters the previous value with a given value.
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(filterWith(2))
 *   .resolveSync([1,2,3,2,3,2]) // [2,2,2]
 * ```
 * @export
 * @template T
 * @param {T} value
 * @returns {ExplicitCallable<T[], T[]>}
 */
export function filterWith<T>(value: T): ExplicitCallable<T[], T[]> {
  return arr => {
    throwIfNotArray('filterWith', arr);

    return arr.filter(x => x === value);
  };
}

/**
 * Finds a value as specified by a find callback. The callback must return `true`.
 *
 * If the value is not found, the pipe will return an `undefined`
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(find((arg: number) => arg === 1))
 *   .resolveSync([1,2,3,2,3,2]) // 1
 * ```
 * @export
 * @template T
 * @param {(arg: T) => boolean} callback
 * @returns {(ExplicitCallable<T[], T | undefined>)}
 */
export function find<T>(callback: (arg: T) => boolean): ExplicitCallable<T[], T | undefined>;
/**
 * Finds a value as specified by a find callback. The callback must return `true`.
 *
 * If the value is not found, the pipe will return an `undefined`
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(find((arg: number, index) => index === 5))
 *   .resolveSync([1,2,3,2,3,2000]) // 2000
 * ```
 * @export
 * @template T
 * @param {(arg: T, index: number) => boolean} callback
 * @returns {(ExplicitCallable<T[], T | undefined>)}
 */
export function find<T>(callback: (arg: T, index: number) => boolean): ExplicitCallable<T[], T | undefined>;
/**
 * Finds a value as specified by a find callback. The callback must return `true`.
 *
 * If the value is not found, the pipe will return an `undefined`
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(find((arg: number, index, array) => index > 2 && index < array.length - 1 && arg > 2))
 *   .resolveSync([1,2,3,2,3,2]) // 3
 * ```
 * @export
 * @template T
 * @param {(arg: T, index: number, arr: T[]) => boolean} callback
 * @returns {(ExplicitCallable<T[], T | undefined>)}
 */
export function find<T>(callback: (arg: T, index: number, arr: T[]) => boolean): ExplicitCallable<T[], T | undefined> {
  return arr => {
    throwIfNotArray('findExact', arr);

    for (let i = 0; i < arr.length; i++) {
      if (callback(arr[i], i, arr)) {
        return arr[i];
      }
    }
  };
}

/**
 * Finds an exacts value.
 *
 * If the value is not found, the pipe will return an `undefined`
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(find(1))
 *   .resolveSync([1,2,3,2,3,2]) // 1
 * ```
 * @export
 * @template T
 * @param {T} value
 * @returns {(ExplicitCallable<T[], T | undefined>)}
 */
export function findExact<T>(value: T): ExplicitCallable<T[], T | undefined> {
  return arr => {
    throwIfNotArray('findExact', arr);

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        return arr[i];
      }
    }
  };
}

/**
 * Joins the previous value with a given char.
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(join('*'))
 *   .resolveSync([1,2,3]) // '1*2*3'
 * ```
 * @export
 * @param {string} char
 * @returns {ExplicitCallable<unknown[], string>}
 */
export function join(char: string): ExplicitCallable<unknown[], string> {
  return arr => {
    throwIfNotArray('applyEach', arr);

    return arr.join(char);
  };
}

/**
 * Returns the length of the previous value.
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *  .pipe(length())
 *  .resolveSync([1,2,3]) // 3
 * ```
 * @export
 * @returns {ExplicitCallable<unknown[], number>}
 */
export function length(): ExplicitCallable<unknown[], number> {
  return arr => {
    throwIfNotArray('length', arr);

    return arr.length;
  };
}

/**
 * Returns the nth element in the previous value.
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(nth(3))
 *   .resolveSync([0, 2, 5, 12, 24]) // 12
 * ```
 *
 * @export
 * @param {number} index
 * @returns {Callable}
 */
export function nth(index: number): Callable {
  return arg => {
    throwIfNotArray('nth', arg);

    return (<any>arg)[index];
  };
}

/**
 * Reverses the previous value.
 *
 * If the previous value is not an array an error will be thrown
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(reverse())
 *   .resolveSync([1,2,3]) // [3,2,1]
 * ```
 *
 * @export
 * @returns {ExplicitCallable<unknown[], unknown[]>}
 */
export function reverse(): ExplicitCallable<unknown[], unknown[]> {
  return arr => {
    throwIfNotArray('reverse', arr);

    const newArr = arr.slice();
    const length = newArr.length;

    for (let i = length / 2; i > 0; i--) {
      const startIndex = length - i;
      const left = newArr[startIndex];
      const right = newArr[i];

      newArr[startIndex] = right;
      newArr[i] = left;
    }

    return arr;
  };
}
