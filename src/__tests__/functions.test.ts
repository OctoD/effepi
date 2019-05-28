import * as functions from '../functions';
import {pipe} from '../pipe';

describe(`Tests functions`, () => {
  describe(`Array functions`, () => {
    test(functions.applyEach.name, async () => {
      const p = pipe(functions.useCallValue()).pipe(functions.add(1));
      const result = functions.applyEach(p)([100, 200, 300], {
        callValue: 0 as any,
        mutationIndex: 0,
        previousValue: 0,
        previousValues: [],
      });
      const exresult = await Promise.all(result);

      expect(exresult[0]).toBe(101);
      expect(exresult[1]).toBe(201);
      expect(exresult[2]).toBe(301);
    });

    test(functions.applyEachSync.name, async () => {
      const p = pipe(functions.useCallValue()).pipe(functions.add(1));
      const result = functions.applyEachSync(p)([100, 200, 300], {
        callValue: 0 as any,
        mutationIndex: 0,
        previousValue: 0,
        previousValues: [],
      });

      expect(result[0]).toBe(101);
      expect(result[1]).toBe(201);
      expect(result[2]).toBe(301);
    });
  });
  
  describe(`Math functions`, () => {
    test(functions.add.name, () => {
      expect(functions.add(20)(2, {} as any)).toBe(22);
    });

    test(functions.changeSign.name, () => {
      expect(functions.changeSign()(2, {} as any)).toBe(-2);
      expect(functions.changeSign()(-2, {} as any)).toBe(2);
    });

    test(functions.divideBy.name, () => {
      expect(functions.divideBy(20)(2, {} as any)).toBe(.1);
    });
    
    test(functions.multiplyBy.name, () => {
      expect(functions.multiplyBy(20)(2, {} as any)).toBe(40);
    });

    test(functions.negative.name, () => {
      expect(functions.negative()(-5, {} as any)).toBe(-5);
      expect(functions.negative()(5, {} as any)).toBe(-5);
    });

    test(functions.positive.name, () => {
      expect(functions.positive()(-5, {} as any)).toBe(5);
      expect(functions.positive()(5, {} as any)).toBe(5);
    });

    test(functions.pow.name, () => {
      expect(functions.pow(2)(5, {} as any)).toBe(25);
    });

    test(functions.root.name, () => {
      expect(functions.root(3)(8, {} as any)).toBe(2);
    });

    test(functions.subtract.name, () => {
      expect(functions.subtract(20)(2, {} as any)).toBe(-18);
    });

    test(functions.takeBetween.name, () => {
      const list = [11, 25, 4, 5, 6, 12, 10];
      const result = functions.takeBetween(5, 10)(list, {} as any);

      expect(() => functions.takeBetween(0, 0)({} as any, {} as any)).toThrowError();
      
      expect(result.includes(5)).toBeTruthy();
      expect(result.includes(6)).toBeTruthy();
      expect(result.includes(10)).toBeTruthy();
      
      expect(result.includes(4)).toBeFalsy();
      expect(result.includes(11)).toBeFalsy();
      expect(result.includes(12)).toBeFalsy();
      expect(result.includes(25)).toBeFalsy();
    });

    test(functions.takeGreater.name, () => {
      expect(functions.takeGreater()([10, 200, 2001, 1, 55], {} as any)).toBe(2001);
    });

    test(functions.takeGreaterThan.name, () => {
      const list = [1, 2, 3, 4, 5, 6, 7, 8];
      const result = functions.takeGreaterThan(6)(list, { } as any);
      const resultEqual = functions.takeGreaterThan(6, true)(list, { } as any);

      expect(() => functions.takeGreaterThan(0)({} as any, {} as any)).toThrowError();
      expect(() => functions.takeGreaterThan(0, true)({} as any, {} as any)).toThrowError();

      expect(result.includes(1)).toBeFalsy();
      expect(result.includes(2)).toBeFalsy();
      expect(result.includes(3)).toBeFalsy();
      expect(result.includes(4)).toBeFalsy();
      expect(result.includes(5)).toBeFalsy();
      expect(result.includes(6)).toBeFalsy();
      expect(result.includes(7)).toBeTruthy();
      expect(result.includes(8)).toBeTruthy();

      expect(resultEqual.includes(1)).toBeFalsy();
      expect(resultEqual.includes(2)).toBeFalsy();
      expect(resultEqual.includes(3)).toBeFalsy();
      expect(resultEqual.includes(4)).toBeFalsy();
      expect(resultEqual.includes(5)).toBeFalsy();
      expect(resultEqual.includes(6)).toBeTruthy();
      expect(resultEqual.includes(7)).toBeTruthy();
      expect(resultEqual.includes(8)).toBeTruthy();
    });

    test(functions.takeLower.name, () => {
      expect(functions.takeLower()([10, 200, 2001, 1, 55, -123], {} as any)).toBe(-123);
    });

    test(functions.takeLowerThan.name, () => {
      const list = [1, 2, 3, 4, 5, 6, 7, 8];
      const result = functions.takeLowerThan(6)(list, {} as any);
      const resultEqual = functions.takeLowerThan(6, true)(list, {} as any);

      expect(() => functions.takeLowerThan(0)({} as any, {} as any)).toThrowError();
      expect(() => functions.takeLowerThan(0, true)({} as any, {} as any)).toThrowError();

      expect(result.includes(1)).toBeTruthy();
      expect(result.includes(2)).toBeTruthy();
      expect(result.includes(3)).toBeTruthy();
      expect(result.includes(4)).toBeTruthy();
      expect(result.includes(5)).toBeTruthy();
      expect(result.includes(6)).toBeFalsy();
      expect(result.includes(7)).toBeFalsy();
      expect(result.includes(8)).toBeFalsy();

      expect(resultEqual.includes(1)).toBeTruthy();
      expect(resultEqual.includes(2)).toBeTruthy();
      expect(resultEqual.includes(3)).toBeTruthy();
      expect(resultEqual.includes(4)).toBeTruthy();
      expect(resultEqual.includes(5)).toBeTruthy();
      expect(resultEqual.includes(6)).toBeTruthy();
      expect(resultEqual.includes(7)).toBeFalsy();
      expect(resultEqual.includes(8)).toBeFalsy();
    });

    test(functions.takeOuter.name, () => {
      const list = [11, 25, 4, 5, 6, 12, 10];
      const result = functions.takeOuter(5, 10)(list, {} as any);

      expect(() => functions.takeOuter(0, 0)({} as any, {} as any)).toThrowError();

      expect(result.includes(5)).toBeFalsy();
      expect(result.includes(6)).toBeFalsy();
      expect(result.includes(10)).toBeFalsy();

      expect(result.includes(4)).toBeTruthy();
      expect(result.includes(11)).toBeTruthy();
      expect(result.includes(12)).toBeTruthy();
      expect(result.includes(25)).toBeTruthy();
    });
  });

  describe(`Logical operators`, () => {
    test(functions.fold.name, () => {
      expect(functions.fold(100, 200)(true)).toBe(200);
      expect(functions.fold(100, 200)(false)).toBe(100);
    });

    test(functions.createSwitch.name, () => {
      const switcher = functions.createSwitch<boolean | number | string>(
        functions.createSwitchOption(100, true),
        functions.createSwitchOption(200, true),
        functions.createSwitchOption(300, true),
        functions.createSwitchOption(400, false),
        functions.createSwitchDefault('default'),
      );
      const switcher2 = functions.createSwitch<boolean | string>(
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

  describe(`Object functions`, () => {
    test(functions.exclude.name, () => {
      class Test {
        public foo = 1;
        public bar = 2;
        public baz = new Date();
      }

      const result = functions.exclude<Test>('foo', 'bar', 'helloworld' as any)({ foo: 1, bar: 2, baz: new Date() }, {} as any);

      expect(() => functions.exclude()('' as any, {} as any)).toThrowError();

      expect(result).not.toHaveProperty(`foo`);
      expect(result).not.toHaveProperty(`bar`);
      expect(result).toHaveProperty(`baz`);
    });

    test(functions.hasProperty.name, () => {
      expect(
        functions.hasProperty('foo')({}, {} as any)
      ).toBeFalsy();

      expect(
        functions.hasProperty('foo')({ foo: 100 }, {} as any)
      ).toBeTruthy();

      expect(
        functions.hasProperty('foo')(null, {} as any)
      ).toBeFalsy();
    });

    test(functions.merge.name, () => {
      expect(() => functions.merge({})(123, {} as any)).toThrowError();
      expect(
        functions.merge({ foo: 123 })({ bar: 123 }, { } as any)
      ).toStrictEqual({
        foo: 123,
        bar: 123,
      });
    });

    test(functions.pick.name, () => {
      class Test {
        public foo = 1;
        public bar = 2;
        public baz = new Date();
      }

      const result = functions.pick<Test>('foo', 'bar', 'helloworld' as any)({ foo: 1, bar: 2, baz: new Date() }, {} as any);

      expect(() => functions.pick()('' as any, {} as any)).toThrowError();

      expect(result).toHaveProperty(`foo`);
      expect(result).toHaveProperty(`bar`);
      expect(result).not.toHaveProperty(`baz`);
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

    test(functions.useValue.name, () => {
      const p = functions.useValue();

      expect(p(1)).toBe(1);
      expect(p(123123)).toBe(123123);
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
