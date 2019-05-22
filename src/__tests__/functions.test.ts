import * as functions from '../functions';

describe(`Tests functions`, () => {
  describe(`Math functions`, () => {
    test(functions.add.name, () => {
      expect(functions.add(20)(2)).toBe(22);
    });

    test(functions.divideBy.name, () => {
      expect(functions.divideBy(20)(2)).toBe(.1);
    });

    test(functions.multiplyBy.name, () => {
      expect(functions.multiplyBy(20)(2)).toBe(40);
    });

    test(functions.subtract.name, () => {
      expect(functions.subtract(20)(2)).toBe(-18);
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
