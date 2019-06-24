import { pipe } from '../pipe';
import * as misc from '../misc';
import * as math from '../math';
import * as string from '../string';
import * as type from '../type';
import { IContext } from '../context';

describe(`miscellaneous tests, jff`, () => {
  test(`A vat calculator`, () => {
    const p = (vat: number) =>
      pipe(misc.useCallValue<number>())
        .pipe(math.divideBy(100))
        .pipe(math.multiplyBy(vat))
        .toSyncFunction();
    const vatCalculator = p(22);

    expect(vatCalculator(100)).toBe(22);
    expect(vatCalculator(1285)).toBe(282.7);
  });

  test(`Mutation example`, () => {
    const mock = jest.fn((arg: number) => arg % 2 === 0);
    const aFunctionUsingContext = (previousValue: number, context: IContext) => {
      context.mutate = () => {
        const pipeline = [mock];

        return { pipeline } as any;
      };

      return previousValue;
    };

    const isEven = pipe<number, number>(misc.useCallValue())
      .pipe(aFunctionUsingContext)
      .toSyncFunction();

    expect(isEven(10)).toBeTruthy();
    expect(mock).toHaveBeenCalled();
    expect(isEven(9)).toBeFalsy();
  });

  test(`Pipeline composition`, () => {
    const p1 = pipe<number, number>(misc.useCallValue()).pipe(math.multiplyBy(5));
    const p2 = pipe<number, number>(misc.useCallValue())
      .pipe(math.divideBy(2))
      .pipe(math.pow(3));
    const p3 = pipe<number, number>(misc.useCallValue())
      .pipe(misc.applySync(p1))
      .pipe(misc.applySync(p2));
    const p4 = pipe<number, number>(misc.useCallValue())
      .pipe(misc.applySync(p3))
      .pipe(type.toString())
      .pipe(string.chars());

    expect(p3.resolveSync(4)).toBe(1000);
    const p4result = p4.resolveSync(4);
    expect(expect.arrayContaining(p4result)).toEqual(['1', '0', '0', '0']);
  });
});
