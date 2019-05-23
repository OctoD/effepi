import { ICallable, IPipeContext, IPipePureReturnValue } from './pipe';

//#region Array

export function applyEach<T, R>(pipe: IPipePureReturnValue<T, R>): (arg: T[], context: IPipeContext<T[], R>) => Promise<R>[] {
  return values => values.map(value => pipe.resolve(value));
}

export function applyEachSync<T, R>(pipe: IPipePureReturnValue<T, R>): (arg: T[], context: IPipeContext<T[], R>) => R[] {
  return values => values.map(value => pipe.resolveSync(value));
}

//#endregion

//#region Math

export function add(value: number): ICallable<number, number> {
  return (arg: number) => arg + value;
}

export function changeSign(): ICallable<number, number> {
  return (arg: number) => -arg;
}

export function divideBy(value: number): ICallable<number, number> {
  return (arg: number) => arg / value;
}

export function multiplyBy(value: number): ICallable<number, number> {
  return (arg: number) => arg * value;
}

export function negative(): ICallable<number, number> {
  return (arg: number) => arg > 0 ? -arg : arg;
}

export function positive(): ICallable<number, number> {
  return (arg: number) => arg > 0 ? arg : -arg;
}

export function pow(exponent: number): ICallable<number, number> {
  return (arg: number) => arg ** exponent;
}

export function root(exponent: number): ICallable<number, number> {
  return (arg: number) => Math.pow(arg, 1 / exponent);
}

export function subtract(value: number): ICallable<number, number> {
  return (arg: number) => arg - value;
}

export function takeGreater(): ICallable<number[], number> {
  return (arg: number[]) => Math.max.apply(Math, arg);
}

export function takeLower(): ICallable<number[], number> {
  return (arg: number[]) => Math.min.apply(Math, arg);
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

export function useCallValue<TCallValue = unknown>(): (value: unknown, context: IPipeContext<unknown, TCallValue>) => TCallValue {
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
