import testFunction from './__ignore__/testFunction';
import { pipe } from '../pipe';
import * as array from '../array';
import * as misc from '../misc';
import * as math from '../math';

describe(`Array functions`, () => {
  testFunction(array.applyEach, async () => {
    const p = pipe(misc.useCallValue()).pipe(math.add(1));
    const result = array.applyEach(p)([100, 200, 300], {
      callValue: 0 as any,
      executionFlow: 'async',
      mutationIndex: 0,
      previousValue: 0,
      previousValues: [],
      apply: jest.fn(),
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
        apply: jest.fn(),
      })
    ).toThrowError();
  });

  testFunction(array.applyEachSync, async () => {
    const p = pipe(misc.useCallValue()).pipe(math.add(1));
    const result = array.applyEachSync(p)([100, 200, 300], {
      callValue: 0 as any,
      executionFlow: 'sync',
      mutationIndex: 0,
      previousValue: 0,
      previousValues: [],
      apply: jest.fn(),
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
        apply: jest.fn(),
      })
    ).toThrowError();
  });

  testFunction(array.reverse, () => {
    expect(
      array.join('_')([1, 2, 3], {} as any)
    ).toBe('1_2_3');
  });

  testFunction(array.reverse, () => {
    expect(
      expect.arrayContaining(
        array.reverse()([1, 2, 3], {} as any)
      )
    ).toEqual([3, 2, 1]);
  });
});