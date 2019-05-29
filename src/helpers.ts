import { ExecutionContextFlow, IContext } from './pipe';

export function isNullOrUndefined(arg: unknown): arg is (null | undefined) {
  return arg === undefined || arg === null;
}

export function throwContextExecutionFlow(functionName: string, context: IContext, flow: ExecutionContextFlow): never | void {
  if (context.executionFlow !== flow) {
    throw new Error(`Cannot use ${functionName} on ${context.executionFlow} context`);
  }
}

export function throwIfNotArray(functionName: string, value: unknown): never | void {
  if (!Array.isArray(value)) {
    throw new TypeError(`${functionName} argument must be a numbers array`);
  }
}

export function throwIfNotObject(functionName: string, value: unknown): never | void {
  if (typeof value !== 'object') {
    throw new TypeError(`${functionName} argument must be a valid object`);
  }
}

export function throwIfNotString(functionName: string, value: unknown): never | void {
  if (typeof value !== 'string') {
    throw new TypeError(`${functionName} arg must be a string`);
  }
}
