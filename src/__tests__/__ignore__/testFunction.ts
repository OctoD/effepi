export default function testFunction<T extends Function>(fn: T, callback: jest.ProvidesCallback, timeout?: number): void {
  test(fn.name, callback, timeout);
}
