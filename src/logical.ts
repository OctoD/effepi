import { isContextFlowAsync, isPipe, throwIfNotFunction } from './helpers';
import { IContext, IPipe } from './pipe';

export type Condition<Type> = (arg: Type) => boolean;
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
  };
}

export function createSwitchOption<Match, Value>(match: Match, value: Value): SwitchOption<Value> {
  return arg => {
    if (arg === match) {
      return { default: false, success: true, value };
    }

    return { default: false, success: false, value: undefined };
  };
}

export function fold<Left, Right>(
  left: Left,
  right: Right
): <T extends boolean>(arg: T) => T extends true ? Right : Left {
  return (arg: boolean) => (arg ? right : (left as any));
}

export function ifElse<TCondition extends Condition<K>, Left, Right, K>(
  condition: TCondition,
  left: Left,
  right: Right
): <T extends K>(arg: T, context: IContext) => ReturnType<TCondition> extends true ? Right : Left {
  const resolveIfIsPipe = (context: IContext, currentPipe: IPipe<unknown, unknown>, value: unknown) => {
    return isContextFlowAsync(context) ? currentPipe.resolve(value) : currentPipe.resolveSync(value);
  };

  return (value, context) => {
    throwIfNotFunction(`ifElse`, 'condition', condition);

    const result = context.call(condition);

    if (isPipe(left) && !result) {
      return resolveIfIsPipe(context, left, value);
    } else if (isPipe(right) && result) {
      return resolveIfIsPipe(context, right, value);
    } else if (result) {
      return right as any;
    } else {
      return left as any;
    }
  };
}
