import * as object from '../object';
import testFunction from './__ignore__/testFunction';
import { pipe } from '../pipe';
import { useCallValue, put } from '../misc';

describe(`Object functions`, () => {
  testFunction(object.exclude, () => {
    class Test {
      public foo = 1;
      public bar = 2;
      public baz = new Date();
    }

    const result = object.exclude<Test>('foo', 'bar', 'helloworld' as any)(
      { foo: 1, bar: 2, baz: new Date() },
      {} as any
    );

    expect(() => object.exclude()('' as any, {} as any)).toThrowError();

    expect(result).not.toHaveProperty(`foo`);
    expect(result).not.toHaveProperty(`bar`);
    expect(result).toHaveProperty(`baz`);
  });

  testFunction(object.hasProperty, () => {
    expect(object.hasProperty('foo')({}, {} as any)).toBeFalsy();

    expect(object.hasProperty('foo')({ foo: 100 }, {} as any)).toBeTruthy();

    expect(object.hasProperty('foo')(null, {} as any)).toBeFalsy();
  });

  testFunction(object.keys, () => {
    expect(expect.arrayContaining(object.keys()({ foo: 100, bar: 200 }, {} as any))).toEqual(['bar', 'foo']);

    expect(() => expect.arrayContaining(object.keys()(123, {} as any))).toThrowError();
  });

  testFunction(object.maybe, async () => {
    const testObject = { foo: { bar: 100 } };

    expect(() => object.maybe('')(123 as any, {} as any)).toThrowError();
    expect(object.maybe('foo.bar')(testObject, {} as any)).toBe(100);
    expect(object.maybe('foo.bar.baz')(testObject, {} as any)).toBe(undefined);
    expect(object.maybe('foo.bar.baz.hello.world')(testObject, {} as any)).toBe(undefined);
    expect(object.maybe('foo.baz.bar.hello.world')(testObject, {} as any)).toBe(undefined);
    expect(object.maybe('foo.baz.bar.hello.world', 123)(testObject, {} as any)).toBe(123);
    expect(object.maybe('foo.baz.bar.hello.world', pipe(useCallValue()))(testObject, {} as any)).toBeUndefined();
    expect(object.maybe('foo.baz.bar.hello.world', pipe(put(10)))(testObject, {} as any)).toBe(10);
    expect(
      await pipe(useCallValue())
        .pipe(object.maybe('foo.baz.bar.hello.world', pipe(put(10))))
        .resolve(testObject)
    ).toBe(10);
  });

  testFunction(object.merge, () => {
    expect(() => object.merge({})(123, {} as any)).toThrowError();
    expect(object.merge({ foo: 123 })({ bar: 123 }, {} as any)).toStrictEqual({
      foo: 123,
      bar: 123,
    });
  });

  testFunction(object.pick, () => {
    class Test {
      public foo = 1;
      public bar = 2;
      public baz = new Date();
    }

    const result = object.pick<Test>('foo', 'bar', 'helloworld' as any)({ foo: 1, bar: 2, baz: new Date() }, {} as any);

    expect(() => object.pick()('' as any, {} as any)).toThrowError();

    expect(result).toHaveProperty(`foo`);
    expect(result).toHaveProperty(`bar`);
    expect(result).not.toHaveProperty(`baz`);
  });
});
