import * as misc from '../misc';
import { pipe } from '../pipe';
import * as math from '../math';
import testFunction from './__ignore__/testFunction';
import createContextMock from './__ignore__/createContext';

describe(`Miscellaneous functions`, () => {
  testFunction(misc.adapt, async () => {
    const fn = (arg: number, arg2: number) => arg ** arg2;
    const fnAsync = async (arg: number, arg2: number) => arg ** arg2;
    const adapted = misc.adapt(fn);
    const adaptedAsync = misc.adapt(fnAsync);

    expect(adapted(2)(2, createContextMock())).toBe(4);
    expect(await adaptedAsync(2)(2, createContextMock())).toBe(4);
  });

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

  testFunction(misc.callWith, async () => {
    const fn1 = (arg: number) => arg ** 2;
    const fn2 = async (arg: number) => arg ** 2;

    expect(misc.callWith(2)(fn1, createContextMock())).toBe(4);
    expect(
      await misc.callWith(2)(fn2, {
        ...createContextMock(),
        executionFlow: 'async',
      })
    ).toBe(4);
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
