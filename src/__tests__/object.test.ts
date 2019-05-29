import * as object from '../object';
import testFunction from './__ignore__/testFunction';

describe(`Object functions`, () => {
  testFunction(object.exclude, () => {
    class Test {
      public foo = 1;
      public bar = 2;
      public baz = new Date();
    }

    const result = object.exclude<Test>('foo', 'bar', 'helloworld' as any)({ foo: 1, bar: 2, baz: new Date() }, {} as any);

    expect(() => object.exclude()('' as any, {} as any)).toThrowError();

    expect(result).not.toHaveProperty(`foo`);
    expect(result).not.toHaveProperty(`bar`);
    expect(result).toHaveProperty(`baz`);
  });

  testFunction(object.hasProperty, () => {
    expect(
      object.hasProperty('foo')({}, {} as any)
    ).toBeFalsy();

    expect(
      object.hasProperty('foo')({ foo: 100 }, {} as any)
    ).toBeTruthy();

    expect(
      object.hasProperty('foo')(null, {} as any)
    ).toBeFalsy();
  });

  testFunction(object.merge, () => {
    expect(() => object.merge({})(123, {} as any)).toThrowError();
    expect(
      object.merge({ foo: 123 })({ bar: 123 }, {} as any)
    ).toStrictEqual({
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
