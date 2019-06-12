import * as type from '../type';
import testFunction from './__ignore__/testFunction';

describe(`Type conversion functions`, () => {
  testFunction(type.exactTypeOf, () => {
    expect(() => type.exactTypeOf('object')({}, {} as any)).not.toThrowError();
    expect(() => type.exactTypeOf('object')([], {} as any)).toThrowError();
    expect(() => type.exactTypeOf('array')([], {} as any)).not.toThrowError();
    expect(() => type.exactTypeOf('date')(new Date(), {} as any)).not.toThrowError();
  });

  testFunction(type.ofType, () => {
    expect(() => type.ofType('boolean')(123, {} as any)).toThrowError();
    expect(() => type.ofType('number')(123, {} as any)).not.toThrowError();
  });

  testFunction(type.toArray, () => {
    expect(Array.isArray(type.toArray()(123))).toBeTruthy();
  });

  testFunction(type.toBoolean, () => {
    expect(type.toBoolean()(10)).toBeTruthy();
    expect(type.toBoolean()(0)).toBeFalsy();
    expect(type.toBoolean()(null)).toBeFalsy();
    expect(type.toBoolean()(undefined)).toBeFalsy();
    expect(type.toBoolean()('')).toBeFalsy();
    expect(type.toBoolean()('123')).toBeTruthy();
  });

  testFunction(type.toDate, () => {
    const date = new Date();

    expect(type.toDate()(date.toJSON()) instanceof Date).toBeTruthy();
    expect(
      type
        .toDate()(date.toJSON())
        .getDate()
    ).toBeTruthy();

    expect(type.toDate()(date.getTime()) instanceof Date).toBeTruthy();
    expect(
      type
        .toDate()(date.getTime())
        .getDate()
    ).toBeTruthy();
  });

  testFunction(type.toNumber, () => {
    expect(type.toNumber()('100')).toBe(100);
  });

  testFunction(type.toSet, () => {
    expect(type.toSet()([1, 2, 3, 3, 3]) instanceof Set).toBeTruthy();
    expect(type.toSet()([1, 2, 3, 3, 3]).size).toBe(3);
  });

  testFunction(type.toString, () => {
    expect(type.toString()(100)).toBe('100');
  });
});
