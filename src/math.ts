import { ExplicitCallable } from './pipe';
import { throwIfNotArray, throwIfNotNumber } from './helpers';

export function add(value: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('add', arg);
    return arg + value;
  };
}

export function changeSign(): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('changeSign', arg);
    return -arg;
  };
}

export function decrement(): ExplicitCallable<number, number> {
  return arg => {
    throwIfNotNumber('decrement', arg);
    return --arg;
  };
}

export function divideBy(value: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('divideBy', arg);
    return arg / value;
  };
}

export function increment(): ExplicitCallable<number, number> {
  return arg => {
    throwIfNotNumber('increment', arg);
    return ++arg;
  };
}

export function multiplyBy(value: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('multiplyBy', arg);
    return arg * value;
  };
}

export function negative(): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('negative', arg);
    return arg > 0 ? -arg : arg;
  };
}

export function positive(): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('positive', arg);
    return arg > 0 ? arg : -arg;
  };
}

export function pow(exponent: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('pow', arg);
    return arg ** exponent;
  };
}

export function root(exponent: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('root', arg);
    return Math.pow(arg, 1 / exponent);
  };
}

export function subtract(value: number): ExplicitCallable<number, number> {
  return (arg: number) => {
    throwIfNotNumber('subtract', arg);
    return arg - value;
  };
}

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

export function takeGreater(): ExplicitCallable<number[], number> {
  return (arg: number[]) => {
    throwIfNotArray('takeGreater', arg);
    return Math.max.apply(Math, arg);
  };
}

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

export function takeLower(): ExplicitCallable<number[], number> {
  return (arg: number[]) => {
    throwIfNotArray('takeLower', arg);
    return Math.min.apply(Math, arg);
  };
}

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
