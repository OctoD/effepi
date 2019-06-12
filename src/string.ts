import { ExplicitCallable } from './pipe';
import { throwIfNotString } from './helpers';

const regexps = {} as { [index: string]: RegExp };

/**
 * Returns previous value in camel-case. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *    .pipe(camelCase())
 *    .resolveSync('hello world') // 'helloWorld'
 * ```
 *
 * @export
 * @returns {ExplicitCallable<string, string>}
 */
export function camelCase(): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString(`camelCase`, arg);
    return arg
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => (index === 0 ? letter.toLowerCase() : letter.toUpperCase()))
      .replace(/\s+/g, '');
  };
}

/**
 * Returns previous value as an array of chars. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(chars())
 *   .resolveSync('hello') // returns ['h', 'e', 'l', 'l', 'o']
 * ```
 *
 * @export
 * @returns {ExplicitCallable<string, string[]>}
 */
export function chars(): ExplicitCallable<string, string[]> {
  return arg => {
    throwIfNotString(`chars`, arg);
    return arg.split('');
  };
}

/**
 * Concatenate previous value with another string. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(concat('world'))
 *   .resolveSync('hello') // 'helloworld'
 * ```
 *
 * @export
 * @param {string} str
 * @returns {ExplicitCallable<string, string>}
 */
export function concat(str: string): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString(`concat`, arg);
    return arg + str;
  };
}

/**
 * Returns if the previous value contains a portion of text. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(includes('llo'))
 *   .resolveSync('hello') // true
 * ```
 *
 * @export
 * @param {string} str
 * @returns {ExplicitCallable<string, boolean>}
 */
export function includes(str: string): ExplicitCallable<string, boolean> {
  return arg => {
    throwIfNotString('find', arg);

    return arg.indexOf(str) >= 0;
  };
}

/**
 * Returns previous value length. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(length())
 *   .resolveSync('hello') // 5
 * ```
 *
 * @export
 * @returns {ExplicitCallable<string, number>}
 */
export function length(): ExplicitCallable<string, number> {
  return arg => {
    throwIfNotString(`length`, arg);
    return arg.length;
  };
}

/**
 * Returns previous value in lower case. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(lowercase())
 *   .resolveSync('HELLO') // 'hello'
 * ```
 *
 * @export
 * @returns {ExplicitCallable<string, string>}
 */
export function lowercase(): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString(`lowercase`, arg);
    return arg.toLowerCase();
  };
}

/**
 * Returns previous value in pascal-case. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(pascalCase())
 *   .resolveSync('hello world') // 'HelloWorld'
 * ```
 *
 * @export
 * @returns {ExplicitCallable<string, string>}
 */
export function pascalCase(): ExplicitCallable<string, string> {
  return (arg, context) => {
    let camelized = camelCase()(arg, context);

    return camelized.charAt(0).toUpperCase() + camelized.slice(1);
  };
}

/**
 * Repeats previous value a number of times. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(repeat())
 *   .resolveSync('hello') // hellohello
 *
 * pipe(useCallValue())
 *   .pipe(repeat(2))
 *   .resolveSync('hello') // hellohellohello
 * ```
 *
 * @export
 * @param {number} [count=1]
 * @returns {ExplicitCallable<string, string>}
 */
export function repeat(count: number = 1): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString('repeat', arg);

    let i = 0;
    let newArg = arg;

    while (i < count) {
      newArg += arg;

      i++;
    }

    return newArg;
  };
}

/**
 * Replaces all occurencies from the previous value. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(replaceAll('l', '1'))
 *   .resolveSync('hello') // he110
 * ```
 *
 * @export
 * @param {string} needle
 * @param {string} replaceWith
 * @returns {ExplicitCallable<string, string>}
 */
export function replaceAll(needle: string, replaceWith: string): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString(`replaceAll`, arg);
    regexps[needle] = regexps[needle] || new RegExp(needle, 'gi');
    return arg.replace(regexps[needle], replaceWith);
  };
}

/**
 * Returns previous value in a binary representation. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(toBinary())
 *   .resolveSync('hello world') // [ '1101000', '1100101', '1101100', '1101100', '1101111', '100000', '1110111', '1101111', '1110010', '1101100', '1100100' ]
 * ```
 *
 * @export
 * @returns {ExplicitCallable<string, string[]>}
 */
export function toBinaryArray(): ExplicitCallable<string, string[]> {
  const binarizeCharset = (index: number, charset: string[]): string[] => {
    if (index >= charset.length) {
      return charset;
    }

    const binary = charset[index].charCodeAt(0).toString(2);
    const newCharset = charset.slice();

    newCharset.splice(index, 1, binary);

    return binarizeCharset(index + 1, newCharset);
  };

  return (arg, context) => {
    throwIfNotString(`toBinary`, arg);

    return binarizeCharset(0, context.call(chars()));
  };
}

/**
 * Returns previous value in upper case. Previous value must be a string.
 *
 * ```
 * pipe(useCallValue())
 *   .pipe(uppercase())
 *   .resolveSync('hello') // 'HELLO'
 * ```
 *
 * @export
 * @returns {ExplicitCallable<string, string>}
 */
export function uppercase(): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString(`uppercase`, arg);
    return arg.toUpperCase();
  };
}
