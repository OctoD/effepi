import { ExecutionContextFlow, IContext } from '../../pipe';

export default function createContextMock<CallValue = any, PreviousValue = any>(
  callValue: CallValue | undefined = undefined,
  executionFlow: ExecutionContextFlow = 'sync',
  previousValue: any = undefined
): IContext<CallValue, PreviousValue> {
  return {
    callValue: callValue as any,
    executionFlow,
    mutationIndex: 0,
    previousValue,
    previousValues: [],
    call(this: IContext<CallValue, PreviousValue>, callable) {
      return callable(this.previousValue, this);
    },
  };
}
