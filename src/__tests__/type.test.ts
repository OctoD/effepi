import * as type from '../type';
import testFunction from './__ignore__/testFunction';

describe(`Type conversion functions`, () => {
  testFunction(type.toArray, () => {
    expect(
      Array.isArray(
        type.toArray()(123)
      )
    ).toBeTruthy();
  });

  testFunction(type.toDate, () => {
    const date = new Date();

    expect(type.toDate()(date.toJSON()) instanceof Date).toBeTruthy();
    expect(type.toDate()(date.toJSON()).getDate()).toBeTruthy();

    expect(type.toDate()(date.getTime()) instanceof Date).toBeTruthy();
    expect(type.toDate()(date.getTime()).getDate()).toBeTruthy();
  });

  testFunction(type.toNumber, () => {
    expect(type.toNumber()('100')).toBe(100);
  });

  testFunction(type.toString, () => {
    expect(type.toString()(100)).toBe('100');
  });
});