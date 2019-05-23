import * as functions from '../functions';
import { createContext } from '../pipe';

describe(`Tests functions`, () => {
  describe(`Math functions`, () => {
    test(functions.add.name, () => {
      expect(functions.add(20)(2)).toBe(22);
    });

    test(functions.changeSign.name, () => {
      expect(functions.changeSign()(2)).toBe(-2);
      expect(functions.changeSign()(-2)).toBe(2);
    });

    test(functions.divideBy.name, () => {
      expect(functions.divideBy(20)(2)).toBe(.1);
    });
    
    test(functions.multiplyBy.name, () => {
      expect(functions.multiplyBy(20)(2)).toBe(40);
    });

    test(functions.negative.name, () => {
      expect(functions.negative()(-5)).toBe(-5);
      expect(functions.negative()(5)).toBe(-5);
    });

    test(functions.positive.name, () => {
      expect(functions.positive()(-5)).toBe(5);
      expect(functions.positive()(5)).toBe(5);
    });

    test(functions.pow.name, () => {
      expect(functions.pow(2)(5)).toBe(25);
    });

    test(functions.root.name, () => {
      expect(functions.root(3)(8)).toBe(2);
    });

    test(functions.subtract.name, () => {
      expect(functions.subtract(20)(2)).toBe(-18);
    });
  });

  describe(`Logical operators`, () => {
    test(functions.fold.name, () => {
      expect(functions.fold(100, 200)(true)).toBe(200);
      expect(functions.fold(100, 200)(false)).toBe(100);
    });

    test(functions.createSwitch.name, () => {
      const switcher = functions.createSwitch(
        functions.createSwitchOption(100, true),
        functions.createSwitchOption(200, true),
        functions.createSwitchOption(300, true),
        functions.createSwitchOption(400, false),
        functions.createSwitchDefault('default'),
      );
      const switcher2 = functions.createSwitch(
        functions.createSwitchOption(100, true),
        functions.createSwitchOption(200, true),
        functions.createSwitchOption(300, true),
        functions.createSwitchOption(400, false),
      );
      
      expect(switcher(100)).toBe(true);
      expect(switcher(200)).toBe(true);
      expect(switcher(300)).toBe(true);
      expect(switcher(400)).toBe(false);
      expect(switcher('hello world')).toBe('default');
      expect(switcher2('hello world')).toBeUndefined();
    });
  });

  describe(`Miscellaneous functions`, () => {
    test(functions.put.name, () => {
      expect(functions.put(10)()).toBe(10);
    });

    test(functions.safeCall.name, () => {
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
      
      expect(() => functions.safeCall(fn)('')).not.toThrow();
      expect(() => functions.safeCall(fn)(1)).not.toThrow();
      expect(() => functions.safeCall(fn)({})).not.toThrow();
      expect(() => functions.safeCall(fn)([])).not.toThrow();
      expect(() => functions.safeCall(fn)(undefined)).not.toThrow();
      
      expect(functions.safeCall(fn)('')).toBeUndefined();
      expect(functions.safeCall(fn)(1)).toBeUndefined();
      expect(functions.safeCall(fn)({})).toBeUndefined();
      expect(functions.safeCall(fn)([])).toBeUndefined();
      expect(functions.safeCall(fn)(undefined)).toBe('hello');
      expect(functions.safeCall(fn, '100')([])).toBe('100');
    });
  });

  describe(`Type conversion functions`, () => {
    test(functions.toArray.name, () => {
      expect(
        Array.isArray(
          functions.toArray()(123)
        )
      ).toBeTruthy();
    });

    test(functions.toDate.name, () => {
      const date = new Date();

      expect(functions.toDate()(date.toJSON()) instanceof Date).toBeTruthy();
      expect(functions.toDate()(date.toJSON()).getDate()).toBeTruthy();

      expect(functions.toDate()(date.getTime()) instanceof Date).toBeTruthy();
      expect(functions.toDate()(date.getTime()).getDate()).toBeTruthy();
    });

    test(functions.toNumber.name, () => {
      expect(functions.toNumber()('100')).toBe(100);
    });

    test(functions.toString.name, () => {
      expect(functions.toString()(100)).toBe('100');
    });
  });
});
