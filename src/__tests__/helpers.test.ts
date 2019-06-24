import * as helpers from '../helpers';
import testFunction from './__ignore__/testFunction';
import { pipe } from '../pipe';
import { IContext } from '../context';

describe(`tests helper functions`, () => {
  testFunction(helpers.getTypeOf, () => {
    expect(helpers.getTypeOf([])).toBe(`array`);
    expect(helpers.getTypeOf({})).toBe(`object`);
    expect(helpers.getTypeOf(1)).toBe(`number`);
  });

  testFunction(helpers.isContextFlowAsync, () => {
    const mock = <IContext>{ executionFlow: 'async' };

    expect(helpers.isContextFlowAsync(mock)).toBeTruthy();
    expect(helpers.isContextFlowSync(mock)).toBeFalsy();
  });

  testFunction(helpers.isContextFlowAsync, () => {
    const mock = <IContext>{ executionFlow: 'sync' };

    expect(helpers.isContextFlowAsync(mock)).toBeFalsy();
    expect(helpers.isContextFlowSync(mock)).toBeTruthy();
  });

  testFunction(helpers.isNullOrUndefined, () => {
    expect(helpers.isNullOrUndefined(undefined)).toBeTruthy();
    expect(helpers.isNullOrUndefined(null)).toBeTruthy();
    expect(helpers.isNullOrUndefined(123)).toBeFalsy();
  });

  testFunction(helpers.isPipe, () => {
    expect(helpers.isPipe(undefined)).toBeFalsy();
    expect(helpers.isPipe(null)).toBeFalsy();
    expect(helpers.isPipe(123)).toBeFalsy();
    expect(helpers.isPipe('123')).toBeFalsy();
    expect(helpers.isPipe(new Date())).toBeFalsy();
    expect(helpers.isPipe(pipe(() => {}))).toBeTruthy();
  });

  testFunction(helpers.throwContextExecutionFlow, () => {
    expect(() => helpers.throwContextExecutionFlow('', { executionFlow: 'async' } as any, 'sync')).toThrowError();
    expect(() => helpers.throwContextExecutionFlow('', { executionFlow: 'sync' } as any, 'sync')).not.toThrowError();
  });

  testFunction(helpers.throwIfNotArray, () => {
    expect(() => helpers.throwIfNotArray('', {})).toThrowError();
    expect(() => helpers.throwIfNotArray('', [])).not.toThrowError();
  });

  testFunction(helpers.throwIfNotBoolean, () => {
    expect(() => helpers.throwIfNotBoolean('', {})).toThrowError();
    expect(() => helpers.throwIfNotBoolean('', [])).toThrowError();
    expect(() => helpers.throwIfNotBoolean('', false)).not.toThrowError();
    expect(() => helpers.throwIfNotBoolean('', true)).not.toThrowError();
  });

  testFunction(helpers.throwIfNotFunction, () => {
    expect(() => helpers.throwIfNotFunction('', '', [])).toThrowError();
    expect(() => helpers.throwIfNotFunction('', '', {})).toThrowError();
    expect(() => helpers.throwIfNotFunction('', '', '')).toThrowError();
    expect(() => helpers.throwIfNotFunction('', '', 1)).toThrowError();
    expect(() => helpers.throwIfNotFunction('', '', () => {})).not.toThrowError();
  });

  testFunction(helpers.throwIfNotObject, () => {
    expect(() => helpers.throwIfNotObject('', {})).not.toThrowError();
    expect(() => helpers.throwIfNotObject('', 123)).toThrowError();
  });

  testFunction(helpers.throwIfNotNumber, () => {
    expect(() => helpers.throwIfNotNumber('', {})).toThrowError();
    expect(() => helpers.throwIfNotNumber('', [])).toThrowError();
    expect(() => helpers.throwIfNotNumber('', Function)).toThrowError();
    expect(() => helpers.throwIfNotNumber('', new Date())).toThrowError();
    expect(() => helpers.throwIfNotNumber('', '')).toThrowError();
    expect(() => helpers.throwIfNotNumber('', 123)).not.toThrowError();
  });

  testFunction(helpers.throwIfNotString, () => {
    expect(() => helpers.throwIfNotString('', {})).toThrowError();
    expect(() => helpers.throwIfNotString('', `123`)).not.toThrowError();
  });
});
