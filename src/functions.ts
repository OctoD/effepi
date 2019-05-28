import { ExplicitCallable, IContext, IPipe } from './pipe';

function throwIfNotArray(functionName: string, value: unknown): never | void {
  if (!Array.isArray(value)) {
    throw new TypeError(`${functionName} argument must be a numbers array`);
  }
}

function throwIfNotObject<T = object>(functionName: string, value: unknown): never | void {
  if (typeof value !== 'object') {
    throw new TypeError(`${functionName} argument must be a valid object`);
  }
}

//#region Array

export function applyEach<T, R>(pipe: IPipe<T, R>): (arg: T[], context: IContext<T[], R>) => Promise<R>[] {
  return values => values.map(value => pipe.resolve(value));
}

export function applyEachSync<T, R>(pipe: IPipe<T, R>): (arg: T[], context: IContext<T[], R>) => R[] {
  return values => values.map(value => pipe.resolveSync(value));
}

//#endregion

//#region Math

export function add(value: number): ExplicitCallable<number, number> {
  return (arg: number) => arg + value;
}

export function changeSign(): ExplicitCallable<number, number> {
  return (arg: number) => -arg;
}

export function divideBy(value: number): ExplicitCallable<number, number> {
  return (arg: number) => arg / value;
}

export function multiplyBy(value: number): ExplicitCallable<number, number> {
  return (arg: number) => arg * value;
}

export function negative(): ExplicitCallable<number, number> {
  return (arg: number) => arg > 0 ? -arg : arg;
}

export function positive(): ExplicitCallable<number, number> {
  return (arg: number) => arg > 0 ? arg : -arg;
}

export function pow(exponent: number): ExplicitCallable<number, number> {
  return (arg: number) => arg ** exponent;
}

export function root(exponent: number): ExplicitCallable<number, number> {
  return (arg: number) => Math.pow(arg, 1 / exponent);
}

export function subtract(value: number): ExplicitCallable<number, number> {
  return (arg: number) => arg - value;
}

export function takeBetween(start: number, end: number): ExplicitCallable<number[], number[]> {
  return (arg: number[]) => {
    throwIfNotArray(`takeBetween`, arg);
    
    const newArray: number[] = [];
    const length = arg.length;
    
    for (let i = 0; i < length; i++) {
      const value = arg[i];

      if (value >= start && value <= end) {
        newArray.push(value);
      }
    }

    return newArray;
  };
}

export function takeGreater(): ExplicitCallable<number[], number> {
  return (arg: number[]) => Math.max.apply(Math, arg);
}

export function takeGreaterThan(check: number, equal: boolean = false): ExplicitCallable<number[], number[]> {
  return (arg: number[]) => {
    throwIfNotArray(`takeGreaterThan`, arg);

    const newArray: number[] = [];
    const length = arg.length;

    for (let i = 0; i < length; i++) {
      const value = arg[i];

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
  return (arg: number[]) => Math.min.apply(Math, arg);
}

export function takeLowerThan(check: number, equal: boolean = false): ExplicitCallable<number[], number[]> {
  return (arg: number[]) => {
    throwIfNotArray(`takeLowerThan`, arg);

    const newArray: number[] = [];
    const length = arg.length;

    for (let i = 0; i < length; i++) {
      const value = arg[i];

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

      if (value < start || value > end) {
        newArray.push(value);
      }
    }

    return newArray;
  };
}

//#endregion

//#region logical operators

export type SwitchOption<TValue> = (arg: unknown) => ISwitchResult<TValue>;

export interface ISwitchResult<TValue> {
  default: boolean;
  success: boolean;
  value: TValue;
}

export function createSwitch<TValue>(...args: SwitchOption<TValue>[]): (arg: TValue) => unknown {
  return arg => {
    let defaultCase: ISwitchResult<unknown> = undefined;
    let tests = args.slice();
    
    while (tests.length > 0) {
      const result = tests.pop()!(arg);

      if (result.default) {
        defaultCase = result;
        continue;
      }
      
      if (result.success) {
        return result.value;
      }
    }

    if (defaultCase !== undefined) {
      return defaultCase.value;
    }
  };
}

export function createSwitchDefault<Value>(value: Value): SwitchOption<Value> {
  return arg => {
    return {
      default: true,
      success: false,
      value,
    };
  }
}

export function createSwitchOption<Match, Value>(match: Match, value: Value): SwitchOption<Value> {
  return arg => {
    if (arg === match) {
      return { default: false, success: true, value };
    }

    return { default: false, success: false, value: undefined };
  };
}

export function fold<Left, Right>(left: Left, right: Right): <T extends boolean>(arg: T) => T extends true ? Right : Left {
  return (arg: boolean) => arg ? right : left as any;
}

//#endregion

//#region object functions

export function pick<KObject, Keys extends keyof KObject = keyof KObject>(...keys: Keys[]): ExplicitCallable<KObject, Pick<KObject, Keys>> {
  return (arg: any) => {
    throwIfNotObject<KObject>(`pick`, arg);

    const newObject = <Pick<KObject, Keys>> { };
    const keysArray = keys.slice();

    while(keysArray.length > 0) {
      const key = keysArray.pop();

      if (arg[key]) {
        newObject[key] = arg[key];
      }
    }

    return newObject;
  };
}

//#endregion

//#region misc

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

//#endregion

//#region type casting

export function toArray(): <T>(arg: T) => T[] {
  return arg => [arg];
}

export function toDate(): (arg: string | number) => Date {
  return arg => new Date(arg);
}

export function toNumber(): (arg: unknown) => number {
  return arg => Number(arg);
}

export function toString(): (arg: unknown) => string {
  return arg => String(arg);
}

//#endregion
