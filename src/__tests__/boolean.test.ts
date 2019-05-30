import testFunction from './__ignore__/testFunction';
import * as boolean from '../boolean';
import createContextMock from './__ignore__/createContext';

describe(`boolean functions`, () => {
  testFunction(boolean.inverse, () => {
    expect(boolean.inverse()(true, createContextMock())).toBeFalsy();
    expect(boolean.inverse()(false, createContextMock())).toBeTruthy();
  });
});
