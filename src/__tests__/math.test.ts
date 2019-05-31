import * as math from '../math';
import testFunction from './__ignore__/testFunction';

describe(`Math functions`, () => {
  testFunction(math.add, () => {
    expect(math.add(20)(2, {} as any)).toBe(22);
  });

  testFunction(math.changeSign, () => {
    expect(math.changeSign()(2, {} as any)).toBe(-2);
    expect(math.changeSign()(-2, {} as any)).toBe(2);
  });

  testFunction(math.decrement, () => {
    expect(math.decrement()(1, {} as any)).toBe(0);
  });

  testFunction(math.divideBy, () => {
    expect(math.divideBy(20)(2, {} as any)).toBe(0.1);
  });

  testFunction(math.increment, () => {
    expect(math.increment()(1, {} as any)).toBe(2);
  });

  testFunction(math.multiplyBy, () => {
    expect(math.multiplyBy(20)(2, {} as any)).toBe(40);
  });

  testFunction(math.negative, () => {
    expect(math.negative()(-5, {} as any)).toBe(-5);
    expect(math.negative()(5, {} as any)).toBe(-5);
  });

  testFunction(math.positive, () => {
    expect(math.positive()(-5, {} as any)).toBe(5);
    expect(math.positive()(5, {} as any)).toBe(5);
  });

  testFunction(math.pow, () => {
    expect(math.pow(2)(5, {} as any)).toBe(25);
  });

  testFunction(math.root, () => {
    expect(math.root(3)(8, {} as any)).toBe(2);
  });

  testFunction(math.subtract, () => {
    expect(math.subtract(20)(2, {} as any)).toBe(-18);
  });

  testFunction(math.takeBetween, () => {
    const list = [11, 25, 4, 5, 6, 12, 10];
    const result = math.takeBetween(5, 10)(list, {} as any);

    expect(() => math.takeBetween(0, 0)({} as any, {} as any)).toThrowError();

    expect(result.includes(5)).toBeTruthy();
    expect(result.includes(6)).toBeTruthy();
    expect(result.includes(10)).toBeTruthy();

    expect(result.includes(4)).toBeFalsy();
    expect(result.includes(11)).toBeFalsy();
    expect(result.includes(12)).toBeFalsy();
    expect(result.includes(25)).toBeFalsy();
  });

  testFunction(math.takeGreater, () => {
    expect(math.takeGreater()([10, 200, 2001, 1, 55], {} as any)).toBe(2001);
  });

  testFunction(math.takeGreaterThan, () => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = math.takeGreaterThan(6)(list, {} as any);
    const resultEqual = math.takeGreaterThan(6, true)(list, {} as any);

    expect(() => math.takeGreaterThan(0)({} as any, {} as any)).toThrowError();
    expect(() => math.takeGreaterThan(0, true)({} as any, {} as any)).toThrowError();

    expect(result.includes(1)).toBeFalsy();
    expect(result.includes(2)).toBeFalsy();
    expect(result.includes(3)).toBeFalsy();
    expect(result.includes(4)).toBeFalsy();
    expect(result.includes(5)).toBeFalsy();
    expect(result.includes(6)).toBeFalsy();
    expect(result.includes(7)).toBeTruthy();
    expect(result.includes(8)).toBeTruthy();

    expect(resultEqual.includes(1)).toBeFalsy();
    expect(resultEqual.includes(2)).toBeFalsy();
    expect(resultEqual.includes(3)).toBeFalsy();
    expect(resultEqual.includes(4)).toBeFalsy();
    expect(resultEqual.includes(5)).toBeFalsy();
    expect(resultEqual.includes(6)).toBeTruthy();
    expect(resultEqual.includes(7)).toBeTruthy();
    expect(resultEqual.includes(8)).toBeTruthy();
  });

  testFunction(math.takeLower, () => {
    expect(math.takeLower()([10, 200, 2001, 1, 55, -123], {} as any)).toBe(-123);
  });

  testFunction(math.takeLowerThan, () => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = math.takeLowerThan(6)(list, {} as any);
    const resultEqual = math.takeLowerThan(6, true)(list, {} as any);

    expect(() => math.takeLowerThan(0)({} as any, {} as any)).toThrowError();
    expect(() => math.takeLowerThan(0, true)({} as any, {} as any)).toThrowError();

    expect(result.includes(1)).toBeTruthy();
    expect(result.includes(2)).toBeTruthy();
    expect(result.includes(3)).toBeTruthy();
    expect(result.includes(4)).toBeTruthy();
    expect(result.includes(5)).toBeTruthy();
    expect(result.includes(6)).toBeFalsy();
    expect(result.includes(7)).toBeFalsy();
    expect(result.includes(8)).toBeFalsy();

    expect(resultEqual.includes(1)).toBeTruthy();
    expect(resultEqual.includes(2)).toBeTruthy();
    expect(resultEqual.includes(3)).toBeTruthy();
    expect(resultEqual.includes(4)).toBeTruthy();
    expect(resultEqual.includes(5)).toBeTruthy();
    expect(resultEqual.includes(6)).toBeTruthy();
    expect(resultEqual.includes(7)).toBeFalsy();
    expect(resultEqual.includes(8)).toBeFalsy();
  });

  testFunction(math.takeOuter, () => {
    const list = [11, 25, 4, 5, 6, 12, 10];
    const result = math.takeOuter(5, 10)(list, {} as any);

    expect(() => math.takeOuter(0, 0)({} as any, {} as any)).toThrowError();

    expect(result.includes(5)).toBeFalsy();
    expect(result.includes(6)).toBeFalsy();
    expect(result.includes(10)).toBeFalsy();

    expect(result.includes(4)).toBeTruthy();
    expect(result.includes(11)).toBeTruthy();
    expect(result.includes(12)).toBeTruthy();
    expect(result.includes(25)).toBeTruthy();
  });
});
