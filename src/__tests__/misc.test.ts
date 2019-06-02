import * as misc from '../misc';
import { pipe } from '../pipe';
import * as math from '../math';
import testFunction from './__ignore__/testFunction';

describe(`Miscellaneous functions`, () => {
  testFunction(misc.apply, async () => {
    const p = pipe<number, number>(misc.useCallValue()).pipe(math.add(10));
    const testP = pipe<number, number>(misc.useCallValue())
      .pipe(misc.apply(p))
      .pipe(math.multiplyBy(2));

    expect(await testP.resolve(2)).toBe(24);
  });

  testFunction(misc.applySync, () => {
    const p = pipe<number, number>(misc.useCallValue()).pipe(math.add(10));
    const testP = pipe<number, number>(misc.useCallValue())
      .pipe(misc.applySync(p))
      .pipe(math.multiplyBy(2));

    expect(testP.resolveSync(2)).toBe(24);
  });

  testFunction(misc.put, () => {
    expect(misc.put(10)()).toBe(10);
  });

  testFunction(misc.safeCall, () => {
    const fn = (value: unknown) => {
      switch (typeof value) {
        case 'number':
        case 'object':
        case 'string':
          throw new Error();
        default:
          return 'hello';
      }
    };

    expect(() => misc.safeCall(fn)('')).not.toThrow();
    expect(() => misc.safeCall(fn)(1)).not.toThrow();
    expect(() => misc.safeCall(fn)({})).not.toThrow();
    expect(() => misc.safeCall(fn)([])).not.toThrow();
    expect(() => misc.safeCall(fn)(undefined as any)).not.toThrow();

    expect(misc.safeCall(fn)('')).toBeUndefined();
    expect(misc.safeCall(fn)(1)).toBeUndefined();
    expect(misc.safeCall(fn)({})).toBeUndefined();
    expect(misc.safeCall(fn)([])).toBeUndefined();
    expect(misc.safeCall(fn)(undefined as any)).toBe('hello');
    expect(misc.safeCall(fn, '100')([])).toBe('100');
  });

  testFunction(misc.useValue, () => {
    const p = misc.useValue();

    expect(p(1)).toBe(1);
    expect(p(123123)).toBe(123123);
  });
});
