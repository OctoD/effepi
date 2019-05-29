import * as string from '../string';
import testFunction from './__ignore__/testFunction';

describe(`String functions`, () => {
  testFunction(string.camelCase, () => {
    const str = 'hello world foo bar baz';
    const result = string.camelCase()(str, {} as any);

    expect(typeof result === 'string').toBeTruthy();
    expect(result).toBe(`helloWorldFooBarBaz`);
    expect(() => string.camelCase()(123 as any, {} as any)).toThrowError();
  });

  testFunction(string.chars, () => {
    const str = 'hello world';
    const chars = string.chars()(str, {} as any);

    expect(Array.isArray(chars)).toBeTruthy();
    expect(chars.length).toBe(str.length);
    expect(() => string.chars()(123 as any, {} as any)).toThrowError();
  });

  testFunction(string.concat, () => {
    const str = 'hello';
    const concat = string.concat('world')(str, {} as any);

    expect(concat).toBe('helloworld');
    expect(() => string.concat('')(123 as any, {} as any)).toThrowError();
  });

  testFunction(string.length, () => {
    const str = 'hello world';
    const length = string.length()(str, {} as any);

    expect(Number.isInteger(length)).toBeTruthy();
    expect(length).toBe(str.length);
    expect(() => string.length()(123 as any, {} as any)).toThrowError();
  });

  testFunction(string.lowercase, () => {
    const str = 'HELLO WORLD';
    const lowercase = string.lowercase()(str, {} as any);

    expect(lowercase).toBe('hello world');
    expect(() => string.lowercase()(123 as any, {} as any)).toThrowError();
  });

  testFunction(string.pascalCase, () => {
    const str = 'hello world foo bar baz';
    const result = string.pascalCase()(str, {} as any);

    expect(typeof result === 'string').toBeTruthy();
    expect(result).toBe(`HelloWorldFooBarBaz`);
    expect(() => string.pascalCase()(123 as any, {} as any)).toThrowError();
  });

  testFunction(string.replaceAll, () => {
    const str = 'hello';
    const out = string.replaceAll('l', '1')(str, {} as any);

    expect(typeof out === 'string').toBeTruthy();
    expect(out).toBe('he11o');
    expect(() => string.replaceAll('', '')(123 as any, {} as any)).toThrowError();
  });

  testFunction(string.uppercase, () => {
    const str = 'hello world';
    const uppercase = string.uppercase()(str, {} as any);

    expect(uppercase).toBe('HELLO WORLD');
    expect(() => string.uppercase()(123 as any, {} as any)).toThrowError();
  });
});
