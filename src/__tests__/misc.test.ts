import { divideBy, useCallValue, put, multiplyBy, add, toString, toDate, toNumber, apply, applySync, pow, chars } from '../functions';
import {pipe, IContext} from '../pipe';

describe(`miscellaneous tests, jff`, () => {
  test(`A vat calculator`, () => {
    const p = (vat: number) => pipe(useCallValue<number>()).pipe(divideBy(100)).pipe(multiplyBy(vat)).toSyncFunction();
    const vatCalculator = p(22);

    expect(vatCalculator(100)).toBe(22);
    expect(vatCalculator(1285)).toBe(282.7);
  });

  test(`Mutation example`, () => {
    const mock = jest.fn((arg: number) => arg % 2 === 0);
    const aFunctionUsingContext = (previousValue: number, context: IContext) => {
      context.mutate = () => {
        const pipeline = [mock];

        return { pipeline };
      };

      return previousValue;
    };

    const isEven = pipe(useCallValue())
      .pipe(aFunctionUsingContext)
      .toSyncFunction();

    expect(isEven(10)).toBeTruthy();
    expect(mock).toHaveBeenCalled();
    expect(isEven(9)).toBeFalsy();
  });

  test(`Pipeline composition`, () => {
    const p1 = pipe(useCallValue()).pipe(multiplyBy(5));
    const p2 = pipe(useCallValue()).pipe(divideBy(2)).pipe(pow(3));
    const p3 = pipe<number, number>(useCallValue()).pipe(applySync(p1)).pipe(applySync(p2));
    const p4 = pipe<number, number>(useCallValue()).pipe(applySync(p3)).pipe(toString()).pipe(chars());

    expect(p3.resolveSync(4)).toBe(1000);
    const p4result = p4.resolveSync(4);
    expect(expect.arrayContaining(p4result)).toEqual(['1', '0', '0', '0']);
  });
});
