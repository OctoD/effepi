import { Callable } from './pipe';
import { getTypeOf } from './helpers';

export type TypeCheckerFunction = (value: unknown) => boolean;

export type KnownTypes =
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'undefined'
  | 'number'
  | 'object'
  | 'string';

export function ofType<T extends KnownTypes>(typeName: T): Callable {
  return arg => {
    if (typeof arg === typeName) {
      return arg as any;
    }

    throw new TypeError(`Invalid type ${typeof arg}, expected ${typeName}`);
  };
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
