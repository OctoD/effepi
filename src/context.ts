import { ExecutionContextFlow, ExplicitCallable, Pipeline } from './pipe';

export interface IContext<CallValue = unknown, PreviousValue = unknown> {
  /**
   * The value used to call the pipeline
   * @type {CallValue}
   * @memberof IContext
   */
  readonly callValue: CallValue;
  /**
   * The context execution flow can be `sync` or `async`, based on
   * the invokation of sync methods like `resolveSync` and `toSyncFunction`
   * @type {ExecutionContextFlow}
   * @memberof IContext
   */
  readonly executionFlow: ExecutionContextFlow;
  /**
   * Current mutation index.
   * @type {number}
   * @memberof IContext
   */
  readonly mutationIndex: number;
  /**
   * Previous mutated value.
   * @type {PreviousValue}
   * @memberof IContext
   */
  readonly previousValue: PreviousValue;
  /**
   * An array including previous values
   * @type {unknown[]}
   * @memberof IContext
   */
  readonly previousValues: unknown[];
  /**
   * Calls a function with the `previousValue` and `context` as arguments
   * @template ReturnType
   * @param {ExplicitCallable<PreviousValue, ReturnType>} callable
   * @returns {ReturnType}
   * @memberof IContext
   */
  call<ReturnType>(callable: ExplicitCallable<PreviousValue, ReturnType>): ReturnType;
  /**
   * Applies a mutation.
   * @param {Pipeline} pipeline
   * @returns {IMutatedContext}
   * @memberof IContext
   */
  mutate?(pipeline: Pipeline): IMutatedContext;
}

export interface IMutatedContext {
  /**
   * A list of new mutations to append after the current one has been applied.
   * @type {Pipeline}
   * @memberof IMutatedContext
   */
  pipeline: Pipeline;
}

export function applyMutation(context: IContext, pipeline: Pipeline): [IContext, Pipeline] {
  if (typeof context.mutate !== 'function') {
    return [context, pipeline];
  }

  const mutations = context.mutate(pipeline);
  const newPipeline = pipeline.slice();

  newPipeline.splice(context.mutationIndex, 0, ...mutations.pipeline);

  context.mutate = undefined;

  return [context, newPipeline];
}

/**
 * @export
 * @template CallValue
 * @param {CallValue} callValue
 * @param {ExecutionContextFlow} executionFlow
 * @returns {IContext<CallValue>}
 */
export function create<CallValue>(callValue: CallValue, executionFlow: ExecutionContextFlow): IContext<CallValue> {
  return {
    callValue,
    executionFlow,
    mutationIndex: 0,
    previousValue: undefined,
    previousValues: [],
    call(this: IContext<CallValue>, callable) {
      return callable(this.previousValue, this);
    },
  };
}

/**
 *
 * @export
 * @template CallValue
 * @template PreviousValue
 * @param {IContext<CallValue>} context
 * @returns {IContext<CallValue, PreviousValue>}
 */
export function downgrade<CallValue, PreviousValue = unknown>(
  context: IContext<CallValue>
): IContext<CallValue, PreviousValue> {
  const { call, callValue, executionFlow, mutationIndex, mutate, previousValues } = context;
  const previousMutationIndex = mutationIndex - 1;
  const prevPreviousValues = previousValues.slice(0, previousMutationIndex);

  return {
    call: call as any,
    callValue,
    executionFlow,
    mutationIndex: previousMutationIndex,
    mutate,
    previousValue: prevPreviousValues[prevPreviousValues.length - 1] as PreviousValue,
    previousValues: prevPreviousValues,
  };
}

/**
 * @export
 * @template CallValue
 * @template PreviousValue
 * @param {IContext<CallValue>} context
 * @param {PreviousValue} previousValue
 * @returns {IContext<CallValue, PreviousValue>}
 */
export function update<CallValue, PreviousValue = unknown>(
  context: IContext<CallValue>,
  previousValue: PreviousValue
): IContext<CallValue, PreviousValue> {
  const { call, callValue, executionFlow, mutationIndex, mutate, previousValues } = context;

  return {
    call: call as any,
    callValue,
    executionFlow,
    mutationIndex: mutationIndex + 1,
    mutate,
    previousValue,
    previousValues: [...previousValues, previousValue],
  };
}
