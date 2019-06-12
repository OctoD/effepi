import { isContextFlowAsync, isPipe, throwIfNotFunction } from './helpers';
import { IContext, IPipe } from './pipe';

export type Condition<Type> = (arg: Type) => boolean;
export type SwitchOption<TValue> = (arg: unknown) => ISwitchResult<TValue>;

export interface ISwitchResult<TValue> {
  default: boolean;
  success: boolean;
  value: TValue;
}

/**
 * Is the same of the `switch` construct.
 *
 * ```
 * // silly example: checking if a string is inside an array of strings
 * const cities = pipe(useCallValue())
 *   .pipe(
 *     createSwitch(
 *       createSwitchDefault('City not found'),
 *       createSwitchOption('Munich', 'Beerfest!'),
 *       createSwitchOption('Rome', 'We love carbonara'),
 *       createSwitchOption('London', 'God save the queen'),
 *     )
 *   )
 *   .toSyncFunction();
 *
 * cities('Munich') // 'Beerfest!'
 * cities('Rome') // 'We love carbonara'
 * cities('London') // 'God save the queen'
 * cities('Casalpusterlengo') // 'City not found'
 * ```
 *
 * To create the default, you can use the `createSwitchDefault` method, whilst using `createSwitchOption` you can add a switch case.
 * @export
 * @template TValue
 * @param {...SwitchOption<TValue>[]} args
 * @returns {(arg: TValue) => unknown}
 */
export function createSwitch<TValue>(...args: SwitchOption<TValue>[]): (arg: TValue) => unknown {
  return arg => {
    let defaultCase: ISwitchResult<unknown>;
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

    if (defaultCase! !== undefined) {
      return defaultCase.value;
    }
  };
}

/**
 * Creates a `default` case for the `createSwitch` function
 *
 * @export
 * @template Value
 * @param {Value} value
 * @returns {SwitchOption<Value>}
 */
export function createSwitchDefault<Value>(value: Value): SwitchOption<Value> {
  return arg => {
    return {
      default: true,
      success: false,
      value,
    };
  };
}

/**
 * Creates a `switch case` for the `createSwitch` function
 *
 * @export
 * @template Match
 * @template Value
 * @param {Match} match
 * @param {Value} value
 * @returns {SwitchOption<Value>}
 */
export function createSwitchOption<Match, Value>(match: Match, value: Value): SwitchOption<Value> {
  return arg => {
    if (arg === match) {
      return { default: false, success: true, value } as any;
    }

    return { default: false, success: false, value: undefined };
  };
}

/**
 * This function is the same of the `if/else` statement.
 *
 * It takes two arguments, the `left` and the `right` part. The left part is intended as the `false` comparison result, while the `right` is the `true`.
 *
 * ```
 * const smsLengthCheck = pipe(useCallValue())
 *   .pipe(isGreaterThan(144))
 *   .pipe(fold('', 'Maximum character'))
 *   .toSyncFunction();
 *
 * smsLengthCheck('lorem') // ''
 * smsLengthCheck('lorem'.repeat(2000)) // 'Maximum character'
 * ```
 * @export
 * @template Left
 * @template Right
 * @param {Left} left
 * @param {Right} right
 * @returns {<T extends boolean>(arg: T) => T extends true ? Right : Left}
 */
export function fold<Left, Right>(
  left: Left,
  right: Right
): <T extends boolean>(arg: T) => T extends true ? Right : Left {
  return (arg: boolean) => (arg ? right : (left as any));
}

/**
 * This function works like the `if/else` statement.
 *
 * It requires three arguments:
 *
 * * a Condition (a `function` which returns a `boolean`)
 * * a Left, which can be a value or another `pipe`. If is a pipe, it will be resolved using the context's async/sync flow
 * * a Right, which can be a value or another `pipe`. If is a pipe, it will be resolved using the context's async/sync flow
 *
 * ```
 * const simple = pipe(useCallValue())
 *   .pipe(
 *     logical.ifElse(
 *       (arg: number) => arg > 5,
 *       'lower than 5',
 *       'greater than 5'
 *     )
 *   )
 *   .toSyncFunction();
 *
 * const complex = pipe(useCallValue())
 *   .pipe(
 *     logical.ifElse(
 *       (arg: number) => arg > 5,
 *       pipe(useCallValue()).pipe(math.pow(2)),
 *       pipe(useCallValue()).pipe(math.divideBy(2)),
 *     )
 *   ).toSyncFunction();
 *
 * simple(4) // lower than 5
 * simple(10) // greater than 5
 * complex(4) // 14
 * complex(10) // 5
 * ```
 *
 * @export
 * @template TCondition
 * @template Left
 * @template Right
 * @template K
 * @param {TCondition} condition
 * @param {Left} left
 * @param {Right} right
 * @returns {<T extends K>(arg: T, context: IContext) => ReturnType<TCondition> extends true ? Right : Left}
 */
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

    const result = context.call(<any>condition);

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
