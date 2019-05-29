import { divideBy, useCallValue, put, multiplyBy, add, toString, toDate, toNumber } from '../functions';
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
});
