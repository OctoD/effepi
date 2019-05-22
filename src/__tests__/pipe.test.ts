import pipe from '../pipe';
import { put, add, multiplyBy } from '../functions';

describe(`pipe`, () => {
  test(`creates a pipe`, async () => {
    const p = pipe(() => 10);

    expect(p).toHaveProperty('pipe');
    expect(p).toHaveProperty('pipeline');
    expect(p).toHaveProperty('resolve');
    expect(p).toHaveProperty('toFunction');
    expect(typeof p.resolve).toBe('function');
    expect(typeof p.toFunction).toBe('function');
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
  })

  test(`resolve returns the pipeline result`, () => {
    const p = pipe(put(10)).pipe(add(20)).pipe(multiplyBy(2));

    expect(p.pipeline.length).toBe(3);
    expect(p.resolveSync(0)).toBe(60);
  });
});
