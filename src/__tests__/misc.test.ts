import { divideBy, useCallValue, put, multiplyBy, add } from '../functions';
import pipe from '../pipe';

describe(`miscellaneous tests, jff`, () => {
  test(`A vat calculator`, () => {
    const p = (vat: number) => pipe(useCallValue()).pipe(divideBy(100)).pipe(multiplyBy(vat)).toSyncFunction();
    const vatCalculator = p(22);

    expect(vatCalculator(100)).toBe(22);
    expect(vatCalculator(1285)).toBe(282.7);
  });
});
