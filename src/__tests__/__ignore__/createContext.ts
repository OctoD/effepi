import { ExecutionContextFlow } from '../../pipe';
import { IContext, create } from '../../context';

export default function createContextMock<CallValue = any, PreviousValue = any>(
  callValue: CallValue | undefined = undefined,
  executionFlow: ExecutionContextFlow = 'sync',
  previousValue: any = undefined
): IContext<CallValue, PreviousValue> {
  const context = create(callValue, executionFlow);

  (context as any).previousValue = previousValue as any;

  return context as IContext<CallValue, PreviousValue>;
}
