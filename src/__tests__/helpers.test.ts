import * as helpers from '../helpers';
import testFunction from './__ignore__/testFunction';

describe(`tests helper functions`, () => {
  testFunction(helpers.isNullOrUndefined, () => {
    expect(helpers.isNullOrUndefined(undefined)).toBeTruthy();
    expect(helpers.isNullOrUndefined(null)).toBeTruthy();
    expect(helpers.isNullOrUndefined(123)).toBeFalsy();
  });

  testFunction(helpers.throwContextExecutionFlow, () => {
    expect(() => helpers.throwContextExecutionFlow('', { executionFlow: 'async' } as any, 'sync')).toThrowError();
    expect(() => helpers.throwContextExecutionFlow('', { executionFlow: 'sync' } as any, 'sync')).not.toThrowError();
  });

  testFunction(helpers.throwIfNotArray, () => {
    expect(() => helpers.throwIfNotArray('', {})).toThrowError();
    expect(() => helpers.throwIfNotArray('', [])).not.toThrowError();
  });

  testFunction(helpers.throwIfNotObject, () => {
    expect(() => helpers.throwIfNotObject('', {})).not.toThrowError();
    expect(() => helpers.throwIfNotObject('', 123)).toThrowError();
  });

  testFunction(helpers.throwIfNotString, () => {
    expect(() => helpers.throwIfNotString('', {})).toThrowError();
    expect(() => helpers.throwIfNotString('', `123`)).not.toThrowError();
  });
});
