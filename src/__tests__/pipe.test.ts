import { pipe } from '../pipe';
import * as misc from '../misc';
import * as math from '../math';

describe(`pipe`, () => {
  test(`creates a pipe`, async () => {
    const p = pipe(() => 10);

    expect(p).toHaveProperty('pipe');
    expect(p).toHaveProperty('resolve');
    expect(p).toHaveProperty('resolveSync');
    expect(p).toHaveProperty('toFunction');
    expect(p).toHaveProperty('toSyncFunction');
    expect(typeof p.resolve).toBe('function');
    expect(typeof p.resolveSync).toBe('function');
    expect(typeof p.toFunction).toBe('function');
    expect(typeof p.toSyncFunction).toBe('function');
  });

  test(`Each pipeline function will be invoked on resolve`, async () => {
    const rt1 = jest.fn();
    const rt2 = jest.fn();
    const rt3 = jest.fn();

    const fn1 = jest.fn().mockReturnValue(rt1);
    const fn2 = jest.fn().mockReturnValue(rt2);
    const fn3 = jest.fn().mockReturnValue(rt3);

    const p = pipe(fn1())
      .pipe(fn2())
      .pipe(fn3());

    await p.resolve(jest.fn());

    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
    expect(fn3).toHaveBeenCalled();

    expect(rt1).toHaveBeenCalled();
    expect(rt2).toHaveBeenCalled();
    expect(rt3).toHaveBeenCalled();
  });

  test(`the first value passed to the first function is the same one passed to the resolve function`, () => {
    const p = pipe(misc.useCallValue());

    expect(p.resolveSync(10)).toBe(10);
  });

  test(`resolve returns the pipeline result`, async () => {
    const p = pipe(misc.put(10))
      .pipe(math.add(20))
      .pipe(math.multiplyBy(2));

    expect(await p.resolve(0)).toBe(60);
  });

  test(`resolve sync returns the pipeline result`, () => {
    const p = pipe(misc.put(10))
      .pipe(math.add(20))
      .pipe(math.multiplyBy(2));

    expect(p.resolveSync(0)).toBe(60);
  });

  test(`can create an async function which can be called later`, async () => {
    const p = pipe(misc.put(10))
      .pipe(math.add(20))
      .pipe(math.multiplyBy(2));
    const fn = p.toFunction();

    expect(await fn(0)).toBe(60);
  });

  test(`can create a sync function which which can be called later`, () => {
    const p = pipe(misc.put(10))
      .pipe(math.add(20))
      .pipe(math.multiplyBy(2));
    const fn = p.toSyncFunction();

    expect(fn(0)).toBe(60);
  });

  test(`context can apply arbitrary mutations to pipeline`, () => {
    const mock = jest.fn((arg: number) => arg ** 2);
    const p = pipe<number, number>(misc.useCallValue())
      .pipe((arg, context) => {
        context.mutate = () => {
          const pipeline = [mock];
          return {
            pipeline,
          };
        };

        return arg + 1;
      })
      .pipe(math.add(1));

    const result = p.resolveSync(10);

    expect(mock).toHaveBeenCalled();
    expect(result).toBe(122);
  });

  test(`context has an apply method, which can be used to call a function with the previous value as argument`, () => {
    const p = pipe<number, number>(misc.useCallValue()).pipe((value, context) => {
      return context.call(math.add(value));
    });

    expect(p.resolveSync(2)).toBe(4);
    expect(p.resolveSync(10)).toBe(20);
  });

  test(`pipe can be memoized, for speed stuff and for caching result`, async () => {
    const increment = (arg: number) => arg + 1;
    const mock = jest.fn(increment);
    const mockSync = jest.fn(increment);
    const fn = pipe<number, number>(
      misc.useCallValue(),
      true
    )
      .pipe(mock)
      .toFunction();
    const fnSync = pipe<number, number>(
      misc.useCallValue(),
      true
    )
      .pipe(mockSync)
      .toSyncFunction();

    await fn(10);
    fnSync(10);

    expect(mock).toBeCalledTimes(1);
    expect(mockSync).toBeCalledTimes(1);

    await fn(10);
    fnSync(10);

    expect(mock).toBeCalledTimes(1);
    expect(mockSync).toBeCalledTimes(1);

    await fn(11);
    fnSync(11);

    expect(mock).toBeCalledTimes(2);
    expect(mockSync).toBeCalledTimes(2);

    await fn(10);
    fnSync(10);

    expect(mock).toBeCalledTimes(3);
    expect(mockSync).toBeCalledTimes(3);
  });
});
