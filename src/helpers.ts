import { ExecutionContextFlow, IContext, IPipe } from './pipe';

export function getTypeOf(arg: unknown): string {
  const type = Object.prototype.toString.call(arg) as string;

  return type
    .replace('[object ', '')
    .slice(0, -1)
    .toLowerCase();
}

export function isContextFlowAsync(arg: IContext): boolean {
  return arg.executionFlow === 'async';
}

export function isContextFlowSync(arg: IContext): boolean {
  return arg.executionFlow === 'sync';
}

export function isNullOrUndefined(arg: unknown): arg is null | undefined {
  return arg === undefined || arg === null;
}

export function isPipe(arg: unknown): arg is IPipe<unknown, unknown> {
  if (typeof arg !== 'object') {
    return false;
  }

  if (arg === null) {
    return false;
  }

  if ('pipe' in arg) {
    return (arg as any).type === 'pipe';
  }

  return false;
}

export function throwContextExecutionFlow(
  functionName: string,
  context: IContext,
  flow: ExecutionContextFlow
): never | void {
  if (context.executionFlow !== flow) {
    throw new Error(`Cannot use ${functionName} on ${context.executionFlow} context`);
  }
}

export function throwIfNotArray(functionName: string, value: unknown): never | void {
  if (!Array.isArray(value)) {
    throw new TypeError(`${functionName} argument must be a numbers array`);
  }
}
export function throwIfNotBoolean(functionName: string, value: unknown): never | void {
  if (typeof value !== 'boolean') {
    throw new TypeError(`${functionName} argument must be a numbers array`);
  }
}

export function throwIfNotFunction(functionName: string, paramName: string, value: unknown): never | void {
  if (typeof value !== 'function') {
    throw new TypeError(`${functionName}'s ${paramName} argument must be a function`);
  }
}

export function throwIfNotObject(functionName: string, value: unknown): never | void {
  if (typeof value !== 'object') {
    throw new TypeError(`${functionName} argument must be a valid object`);
  }
}

export function throwIfNotNumber(functionName: string, value: unknown): never | void {
  if (typeof value !== 'number') {
    throw new TypeError(`${functionName} argument must be a number`);
  }
}

export function throwIfNotString(functionName: string, value: unknown): never | void {
  if (typeof value !== 'string') {
    throw new TypeError(`${functionName} arg must be a string`);
  }
}
