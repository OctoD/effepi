import * as logical from '../logical';
import { divideBy, pow } from '../math';
import { useCallValue } from '../misc';
import { ExplicitCallable, IContext, pipe } from '../pipe';
import testFunction from './__ignore__/testFunction';

describe(`Logical operators`, () => {
  testFunction(logical.fold, () => {
    expect(logical.fold(100, 200)(true)).toBe(200);
    expect(logical.fold(100, 200)(false)).toBe(100);
  });

  testFunction(logical.createSwitch, () => {
    const switcher = logical.createSwitch<boolean | number | string>(
      logical.createSwitchOption(100, true),
      logical.createSwitchOption(200, true),
      logical.createSwitchOption(300, true),
      logical.createSwitchOption(400, false),
      logical.createSwitchDefault('default')
    );
    const switcher2 = logical.createSwitch<boolean | string>(
      logical.createSwitchOption(100, true),
      logical.createSwitchOption(200, true),
      logical.createSwitchOption(300, true),
      logical.createSwitchOption(400, false)
    );

    expect(switcher(100)).toBe(true);
    expect(switcher(200)).toBe(true);
    expect(switcher(300)).toBe(true);
    expect(switcher(400)).toBe(false);
    expect(switcher('hello world')).toBe('default');
    expect(switcher2('hello world')).toBeUndefined();
  });

  testFunction(logical.ifElse, async () => {
    function call(this: IContext, arg: ExplicitCallable<unknown, unknown>) {
      return arg(this.previousValue, this);
    }
    const check = (value: number) => value > 5;
    const simple = logical.ifElse(check, 'foo', 'bar');
    const simplePipe = pipe(useCallValue()).pipe(simple);
    const leftPipe = pipe(useCallValue()).pipe(pow(2));
    const rightPipe = pipe(useCallValue()).pipe(divideBy(2));
    const complexPipe = pipe(useCallValue()).pipe(logical.ifElse(check, leftPipe, rightPipe));

    expect(simple(4, { call, previousValue: 4 } as any)).toBe('foo');
    expect(simple(10, { call, previousValue: 10 } as any)).toBe('bar');
    expect(simplePipe.resolveSync(4)).toBe('foo');
    expect(simplePipe.resolveSync(10)).toBe('bar');
    expect(complexPipe.resolveSync(4)).toBe(16);
    expect(complexPipe.resolveSync(10)).toBe(5);
    expect(await complexPipe.resolve(4)).toBe(16);
    expect(await complexPipe.resolve(10)).toBe(5);
  });
});
