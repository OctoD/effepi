//#region Math

export function add(value: number): (arg: number) => number {
  return arg => arg + value;
}

export function divideBy(value: number): (arg: number) => number {
  return arg => arg / value;
}

export function multiplyBy(value: number): (arg: number) => number {
  return arg => arg * value;
}

export function subtract(value: number): (arg: number) => number {
  return arg => arg - value;
}

//#endregion

//#region logical operators

export interface ISwitchResult<TValue> {
  default: boolean;
  success: boolean;
  value: TValue;
}

export function createSwitch<TArgs extends Array<ReturnType<typeof createSwitchOption>>>(... args: TArgs): (arg: unknown) => unknown {
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

export function createSwitchDefault<Value>(value: Value): (arg: unknown) => ISwitchResult<Value> {
  return arg => {
    return {
      default: true,
      success: false,
      value,
    };
  }
}

export function createSwitchOption<Match, Value>(match: Match, value: Value): (arg: unknown) => ISwitchResult<Value> {
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
