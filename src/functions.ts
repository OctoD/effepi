export function add(value: number): (arg: number) => number {
  return arg => arg + value;
}

export function divideBy(value: number): (arg: number) => number {
  return arg => arg / value;
}

export function fold<Left, Right>(left: Left, right: Right): <T extends boolean>(arg: T) => T extends true ? Right : Left {
  return (arg: boolean) => arg ? right : left as any;
}

export function multiplyBy(value: number): (arg: number) => number {
  return arg => arg * value;
}

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

export function subtract(value: number): (arg: number) => number {
  return arg => arg - value;
}

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
