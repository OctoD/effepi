import {pipe} from '../pipe';
import { put, add, multiplyBy, useCallValue, useValue } from '../functions';

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

    const p = pipe(fn1()).pipe(fn2()).pipe(fn3());

    await p.resolve(jest.fn());

    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
    expect(fn3).toHaveBeenCalled();

    expect(rt1).toHaveBeenCalled();
    expect(rt2).toHaveBeenCalled();
    expect(rt3).toHaveBeenCalled();
  });

  test(`the first value passed to the first function is the same one passed to the resolve function`, () => {
    const p = pipe(useCallValue());

    expect(p.resolveSync(10)).toBe(10);
  });

  test(`resolve returns the pipeline result`, async () => {
    const p = pipe(put(10)).pipe(add(20)).pipe(multiplyBy(2));

    expect(await p.resolve(0)).toBe(60);
  });

  test(`resolve sync returns the pipeline result`, () => {
    const p = pipe(put(10)).pipe(add(20)).pipe(multiplyBy(2));

    expect(p.resolveSync(0)).toBe(60);
  });

  test(`can create an async function which can be called later`, async () => {
    const p = pipe(put(10)).pipe(add(20)).pipe(multiplyBy(2));
    const fn = p.toFunction();

    expect(await fn(0)).toBe(60);
  });

  test(`can create a sync function which which can be called later`, () => {
    const p = pipe(put(10)).pipe(add(20)).pipe(multiplyBy(2));
    const fn = p.toSyncFunction();

    expect(fn(0)).toBe(60);
  });

  test(`context can apply arbitrary mutations to pipeline`, () => {
    const mock = jest.fn((arg: number) => arg ** 2);
    const p = pipe<number, number>(useCallValue()).pipe((arg, context) => {
      context.mutate = () => {
        const pipeline = [mock];
        return { 
          pipeline,
        };
      };

      return arg + 1;
    }).pipe(add(1));

    const result = p.resolveSync(10);
    
    expect(mock).toHaveBeenCalled();
    expect(result).toBe(122);
  });
});
