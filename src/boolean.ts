import { ExplicitCallable } from './pipe';
import { throwIfNotBoolean } from './helpers';

export function inverse(): ExplicitCallable<boolean, boolean> {
  return arg => {
    throwIfNotBoolean('inverse', arg);
    return !arg;
  };
}

export function F(): ExplicitCallable<unknown, false> {
  return () => false;
}

export function T(): ExplicitCallable<unknown, true> {
  return () => true;
}
