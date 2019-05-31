import * as string from '../string';
import testFunction from './__ignore__/testFunction';
import createContextMock from './__ignore__/createContext';

describe(`String functions`, () => {
  testFunction(string.camelCase, () => {
    const str = 'hello world foo bar baz';
    const result = string.camelCase()(str, createContextMock());

    expect(typeof result === 'string').toBeTruthy();
    expect(result).toBe(`helloWorldFooBarBaz`);
    expect(() => string.camelCase()(123 as any, createContextMock())).toThrowError();
  });

  testFunction(string.chars, () => {
    const str = 'hello world';
    const chars = string.chars()(str, createContextMock());

    expect(Array.isArray(chars)).toBeTruthy();
    expect(chars.length).toBe(str.length);
    expect(() => string.chars()(123 as any, createContextMock())).toThrowError();
  });

  testFunction(string.concat, () => {
    const str = 'hello';
    const concat = string.concat('world')(str, createContextMock());

    expect(concat).toBe('helloworld');
    expect(() => string.concat('')(123 as any, createContextMock())).toThrowError();
  });

  testFunction(string.includes, () => {
    expect(string.includes('foo')('foobar', createContextMock())).toBeTruthy();
    expect(string.includes('baz')('foobar', createContextMock())).toBeFalsy();
    expect(() => string.includes('bar')(123 as any, createContextMock())).toThrowError();
  });

  testFunction(string.length, () => {
    const str = 'hello world';
    const length = string.length()(str, createContextMock());

    expect(Number.isInteger(length)).toBeTruthy();
    expect(length).toBe(str.length);
    expect(() => string.length()(123 as any, createContextMock())).toThrowError();
  });

  testFunction(string.lowercase, () => {
    const str = 'HELLO WORLD';
    const lowercase = string.lowercase()(str, createContextMock());

    expect(lowercase).toBe('hello world');
    expect(() => string.lowercase()(123 as any, createContextMock())).toThrowError();
  });

  testFunction(string.pascalCase, () => {
    const str = 'hello world foo bar baz';
    const result = string.pascalCase()(str, createContextMock());

    expect(typeof result === 'string').toBeTruthy();
    expect(result).toBe(`HelloWorldFooBarBaz`);
    expect(() => string.pascalCase()(123 as any, createContextMock())).toThrowError();
  });

  testFunction(string.repeat, () => {
    expect(string.repeat()('foo', createContextMock())).toBe('foofoo');
    expect(string.repeat(0)('foo', createContextMock())).toBe('foo');
    expect(string.repeat(-1)('foo', createContextMock())).toBe('foo');
    expect(string.repeat(2)('foo', createContextMock())).toBe('foofoofoo');
    expect(() => string.repeat(2)(123 as any, createContextMock())).toThrowError();
  });

  testFunction(string.replaceAll, () => {
    const str = 'hello';
    const out = string.replaceAll('l', '1')(str, createContextMock());

    expect(typeof out === 'string').toBeTruthy();
    expect(out).toBe('he11o');
    expect(() => string.replaceAll('', '')(123 as any, createContextMock())).toThrowError();
  });

  testFunction(string.toBinaryArray, () => {
    const str = 'hello world';
    const context = createContextMock(str, 'sync', str);
    const binaryArray = string.toBinaryArray()(str, context);
    const expected = [
      '1101000',
      '1100101',
      '1101100',
      '1101100',
      '1101111',
      '100000',
      '1110111',
      '1101111',
      '1110010',
      '1101100',
      '1100100',
    ];

    expect(expect.arrayContaining(binaryArray)).toEqual(expected);
    expect(() => string.toBinaryArray()(123 as any, createContextMock())).toThrowError();
  });

  testFunction(string.uppercase, () => {
    const str = 'hello world';
    const uppercase = string.uppercase()(str, createContextMock());

    expect(uppercase).toBe('HELLO WORLD');
    expect(() => string.uppercase()(123 as any, createContextMock())).toThrowError();
  });
});
