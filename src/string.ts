import { ExplicitCallable, Callable } from './pipe';
import { throwIfNotString } from './helpers';

const regexps = {} as { [index: string]: RegExp };

export function camelCase(): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString(`camelCase`, arg);
    return arg
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
      )
      .replace(/\s+/g, '');
  };
}

export function chars(): ExplicitCallable<string, string[]> {
  return arg => {
    throwIfNotString(`chars`, arg);
    return arg.split('');
  };
}

export function concat(str: string): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString(`concat`, arg);
    return arg + str;
  };
}

export function length(): ExplicitCallable<string, number> {
  return arg => {
    throwIfNotString(`length`, arg);
    return arg.length;
  };
}

export function lowercase(): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString(`lowercase`, arg);
    return arg.toLowerCase();
  };
}

export function pascalCase(): ExplicitCallable<string, string> {
  return (arg, context) => {
    let camelized = camelCase()(arg, context);

    return camelized.charAt(0).toUpperCase() + camelized.slice(1);
  };
}

export function replaceAll(
  needle: string,
  replaceWith: string
): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString(`replaceAll`, arg);
    regexps[needle] = regexps[needle] || new RegExp(needle, 'gi');
    return arg.replace(regexps[needle], replaceWith);
  };
}

export function toBinaryArray(): ExplicitCallable<string, string[]> {
  const binarizeCharset = (index: number, charset: string[]) => {
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

    return binarizeCharset(0, context.apply(chars()));
  };
}

export function uppercase(): ExplicitCallable<string, string> {
  return arg => {
    throwIfNotString(`uppercase`, arg);
    return arg.toUpperCase();
  };
}
