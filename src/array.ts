import { IPipe, IContext, ExplicitCallable, Callable } from './pipe';
import { throwContextExecutionFlow, throwIfNotArray } from './helpers';

export function applyEach<T, R>(pipe: IPipe<T, R>): (arg: T[], context: IContext<T[], R>) => Promise<R>[] {
  return (values, context) => {
    throwContextExecutionFlow('applyEach', context, 'async');
    throwIfNotArray('applyEach', values);

    return values.map(value => pipe.resolve(value));
  };
}

export function applyEachSync<T, R>(pipe: IPipe<T, R>): (arg: T[], context: IContext<T[], R>) => R[] {
  return (values, context) => {
    throwContextExecutionFlow('applyEachSync', context, 'sync');
    throwIfNotArray('applyEach', values);

    return values.map(value => pipe.resolveSync(value));
  };
}

export function concat<T = unknown>(newArr: T[]): ExplicitCallable<T[], T[]> {
  return arr => {
    throwIfNotArray('concat', arr);

    return arr.concat(newArr);
  };
}

export function filter<T = unknown>(filterCallback: (arg: T) => boolean): ExplicitCallable<T[], T[]>;
export function filter<T = unknown>(filterCallback: (arg: T, index: number) => boolean): ExplicitCallable<T[], T[]>;
export function filter<T = unknown>(
  filterCallback: (arg: T, index: number, arr: T[]) => boolean
): ExplicitCallable<T[], unknown[]> {
  return arr => {
    throwIfNotArray('filter', arr);

    return arr.filter(filterCallback);
  };
}

export function filterWith<T>(value: T): ExplicitCallable<T[], T[]> {
  return arr => {
    throwIfNotArray('filterWith', arr);

    return arr.filter(x => x === value);
  };
}

export function find<T>(callback: (arg: T) => boolean): ExplicitCallable<T[], T | undefined>;
export function find<T>(callback: (arg: T, index: number) => boolean): ExplicitCallable<T[], T | undefined>;
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

export function join(char: string): ExplicitCallable<unknown[], string> {
  return arr => {
    throwIfNotArray('applyEach', arr);

    return arr.join(char);
  };
}

export function length(): ExplicitCallable<unknown[], number> {
  return arr => {
    throwIfNotArray('length', arr);

    return arr.length;
  };
}

export function nth(index: number): Callable {
  return arg => {
    throwIfNotArray('nth', arg);

    return (<any>arg)[index];
  };
}

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
