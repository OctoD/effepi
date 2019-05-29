import { IPipe, IContext, ExplicitCallable } from './pipe';
import { throwContextExecutionFlow, throwIfNotArray } from './helpers';

export function applyEach<T, R>(pipe: IPipe<T, R>): (arg: T[], context: IContext<T[], R>) => Promise<R>[] {
  return (values, context) => {
    throwContextExecutionFlow('applyEach', context, 'async');

    return values.map(value => pipe.resolve(value));
  };
}

export function applyEachSync<T, R>(pipe: IPipe<T, R>): (arg: T[], context: IContext<T[], R>) => R[] {
  return (values, context) => {
    throwContextExecutionFlow('applyEachSync', context, 'sync');

    return values.map(value => pipe.resolveSync(value));
  };
}

export function join(char: string): ExplicitCallable<unknown[], string> {
  return arr => arr.join(char);
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
  }
}