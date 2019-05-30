import { ExplicitCallable } from './pipe';
import { throwIfNotBoolean } from './helpers';

export function inverse(): ExplicitCallable<boolean, boolean> {
  return arg => {
    throwIfNotBoolean('inverse', arg);
    return !arg;
  };
}
