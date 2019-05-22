import * as functions from '../functions';

describe(`Tests functions`, () => {
  describe(`Math functions`, () => {
    test(functions.add.name, () => {
      expect(functions.add(20)(2)).toBe(22);
    });

    test(functions.divideBy.name, () => {
      expect(functions.divideBy(20)(2)).toBe(10);
    });

    test(functions.multiplyBy.name, () => {
      expect(functions.multiplyBy(20)(2)).toBe(40);
    });

    test(functions.subtract.name, () => {
      expect(functions.subtract(20)(2)).toBe(-18);
    });
  });
});
