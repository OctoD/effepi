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

export function createSwitch<TArgs extends Array<ReturnType<typeof createSwitchOption>>>(... args: TArgs): (arg: unknown) => unknown {
  return arg => {
    while (args.length > 0) {
      const result = args.pop()!(arg);

      if (result.success) {
        return result.value;
      }
    }
  };
}

export function createSwitchOption<Match, Value>(match: Match, value: Value): (arg: unknown) => { success: boolean, value: Value } {
  return arg => {
    if (arg === match) {
      return { success: true, value };
    }

    return { success: false, value: undefined };
  };
}

export function fold<Left, Right>(left: Left, right: Right): <T extends boolean>(arg: T) => T extends true ? Right : Left {
  return (arg: boolean) => arg ? right : left as any;
}

//#endregion

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
