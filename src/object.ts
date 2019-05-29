import { ExplicitCallable } from './pipe';
import { throwIfNotObject } from './helpers';
import { isNullOrUndefined } from 'util';

export function exclude<KObject, Keys extends keyof KObject = keyof KObject>(...keys: Keys[]): ExplicitCallable<KObject, Pick<KObject, Keys>> {
  return (arg: any) => {
    throwIfNotObject(`pick`, arg);

    const newObject = <Pick<KObject, Keys>>{ ...arg };
    const keysArray = keys.slice();

    while (keysArray.length > 0) {
      delete newObject[keysArray.pop()];
    }

    return newObject;
  };
}

export function hasProperty(propertyKey: string): ExplicitCallable<unknown, boolean> {
  return arg => {
    if (isNullOrUndefined(arg)) {
      return false;
    }

    return Object.prototype.hasOwnProperty.call(arg, propertyKey);
  }
}

export function merge<T extends object, K>(target: T): ExplicitCallable<K, K & T> {
  return arg => {
    throwIfNotObject('merge', arg);

    return {
      ...arg,
      ...target,
    }
  }
}

export function pick<KObject, Keys extends keyof KObject = keyof KObject>(...keys: Keys[]): ExplicitCallable<KObject, Pick<KObject, Keys>> {
  return (arg: any) => {
    throwIfNotObject(`pick`, arg);

    const newObject = <Pick<KObject, Keys>>{};
    const keysArray = keys.slice();

    while (keysArray.length > 0) {
      const key = keysArray.pop();

      if (arg[key]) {
        newObject[key] = arg[key];
      }
    }

    return newObject;
  };
}
