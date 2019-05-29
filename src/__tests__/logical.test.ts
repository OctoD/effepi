import * as logical from '../logical';
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
      logical.createSwitchDefault('default'),
    );
    const switcher2 = logical.createSwitch<boolean | string>(
      logical.createSwitchOption(100, true),
      logical.createSwitchOption(200, true),
      logical.createSwitchOption(300, true),
      logical.createSwitchOption(400, false),
    );

    expect(switcher(100)).toBe(true);
    expect(switcher(200)).toBe(true);
    expect(switcher(300)).toBe(true);
    expect(switcher(400)).toBe(false);
    expect(switcher('hello world')).toBe('default');
    expect(switcher2('hello world')).toBeUndefined();
  });
});