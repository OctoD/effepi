import testFunction from './__ignore__/testFunction';
import { pipe } from '../pipe';
import * as array from '../array';
import * as misc from '../misc';
import * as math from '../math';
import createContextMock from './__ignore__/createContext';

describe(`Array functions`, () => {
  testFunction(array.applyEach, async () => {
    const p = pipe<number, number>(misc.useCallValue()).pipe(math.add(1));
    const result = array.applyEach(p)([100, 200, 300], {
      callValue: 0 as any,
      executionFlow: 'async',
      mutationIndex: 0,
      previousValue: 0,
      previousValues: [],
      call: jest.fn(),
    });
    const exresult = await Promise.all(result);

    expect(exresult[0]).toBe(101);
    expect(exresult[1]).toBe(201);
    expect(exresult[2]).toBe(301);

    expect(() =>
      array.applyEach(p)([100, 200, 300], {
        callValue: 0 as any,
        executionFlow: 'sync',
        mutationIndex: 0,
        previousValue: 0,
        previousValues: [],
        call: jest.fn(),
      })
    ).toThrowError();
  });

  testFunction(array.applyEachSync, async () => {
    const p = pipe<number, number>(misc.useCallValue()).pipe(math.add(1));
    const result = array.applyEachSync(p)([100, 200, 300], {
      callValue: 0 as any,
      executionFlow: 'sync',
      mutationIndex: 0,
      previousValue: 0,
      previousValues: [],
      call: jest.fn(),
    });

    expect(result[0]).toBe(101);
    expect(result[1]).toBe(201);
    expect(result[2]).toBe(301);

    expect(() =>
      array.applyEachSync(p)([100, 200, 300], {
        callValue: 0 as any,
        executionFlow: 'async',
        mutationIndex: 0,
        previousValue: 0,
        previousValues: [],
        call: jest.fn(),
      })
    ).toThrowError();
  });

  testFunction(array.concat, () => {
    expect(expect.arrayContaining(array.concat([4, 5, 6])([1, 2, 3], createContextMock()))).toEqual([1, 2, 3, 4, 5, 6]);
    expect(() => array.concat([4, 5, 6])(123 as any, createContextMock())).toThrowError();
  });

  testFunction(array.filter, () => {
    expect(expect.arrayContaining(array.filter((a: number) => a > 2)([1, 2, 3], createContextMock()))).toEqual([3]);
    expect(() => array.filter((a: number) => a > 2)(`123` as any, createContextMock())).toThrowError();
  });

  testFunction(array.filterWith, () => {
    expect(expect.arrayContaining(array.filterWith(2)([1, 2, 3], createContextMock()))).toEqual([2]);
    expect(() => array.filterWith(`123`)(`123` as any, createContextMock())).toThrowError();
  });

  testFunction(array.find, () => {
    expect(array.find((arg: number) => arg === 1)([1, 2, 3], createContextMock())).toBe(1);
    expect(array.find((arg: number) => arg === 5)([1, 2, 3], createContextMock())).toBeUndefined();
    expect(() => array.find((arg: number) => arg === 5)('kaboom' as any, createContextMock())).toThrowError();
  });

  testFunction(array.findExact, () => {
    expect(array.findExact(1)([1, 2, 3], createContextMock())).toBe(1);
    expect(array.findExact(5)([1, 2, 3], createContextMock())).toBeUndefined();
    expect(() => array.findExact(5)('kaboom' as any, createContextMock())).toThrowError();
  });

  testFunction(array.length, () => {
    expect(array.length()([1, 2, 3, 4, 5], createContextMock())).toBe(5);
    expect(() => array.length()({} as any, createContextMock())).toThrowError();
    expect(() => array.length()('unicorn!' as any, createContextMock())).toThrowError();
  });

  testFunction(array.nth, () => {
    expect(array.nth(3)([0, 2, 5, 12, 24], {} as any)).toBe(12);
    expect(() => array.nth(3)(123, {} as any)).toThrowError();
  });

  testFunction(array.reverse, () => {
    expect(array.join('_')([1, 2, 3], {} as any)).toBe('1_2_3');
  });

  testFunction(array.reverse, () => {
    expect(expect.arrayContaining(array.reverse()([1, 2, 3], {} as any))).toEqual([3, 2, 1]);
  });
});
