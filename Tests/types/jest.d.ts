// Declaraciones de tipos para Jest
// Esto permite usar describe, test, expect sin errores de TypeScript

declare global {
  function describe(name: string, fn: () => void): void;
  function test(name: string, fn: () => void | Promise<void>): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  function beforeEach(fn: () => void | Promise<void>): void;
  function afterEach(fn: () => void | Promise<void>): void;
  function beforeAll(fn: () => void | Promise<void>): void;
  function afterAll(fn: () => void | Promise<void>): void;

  namespace jest {
    interface Matchers<R> {
      toBe(expected: any): R;
      toEqual(expected: any): R;
      toBeDefined(): R;
      toBeUndefined(): R;
      toBeNull(): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toContain(expected: any): R;
      toHaveLength(expected: number): R;
      toBeGreaterThan(expected: number): R;
      toBeLessThan(expected: number): R;
      toBeCloseTo(expected: number, precision?: number): R;
      toThrow(expected?: any): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenCalledTimes(expected: number): R;
    }
  }

  function expect<T = any>(actual: T): jest.Matchers<void>;

  // Window extensions for testing
  interface Window {
    performanceMetrics?: any;
    gc?: () => void;
  }
}

export {};