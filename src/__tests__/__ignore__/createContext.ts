import { ExecutionContextFlow, IContext } from '../../pipe';

export default function createContextMock<CallValue = any, PreviousValue = any>(
  callValue: CallValue = undefined,
  executionFlow: ExecutionContextFlow = 'sync',
  previousValue: any = undefined
): IContext<CallValue, PreviousValue> {
  return {
    callValue,
    executionFlow,
    mutationIndex: 0,
    previousValue,
    previousValues: [],
    apply(this: IContext<CallValue, PreviousValue>, callable) {
      return callable(this.previousValue, this);
    },
  };
}
