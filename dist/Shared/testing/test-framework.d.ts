/**
 * Creates an expectation for testing
 * @param {*} actual - The actual value to test
 * @returns {Expect} Expectation object with assertion methods
 */
export function expect(actual: any): Expect;
/**
 * Defines a test suite
 * @param {string} description - Suite description
 * @param {Function} fn - Suite function containing tests
 */
export function describe(description: string, fn: Function): void;
/**
 * Defines a test case
 * @param {string} description - Test description
 * @param {Function} fn - Test function
 */
export function it(description: string, fn: Function): void;
/**
 * Skips a test case
 * @param {string} description - Test description
 * @param {Function} fn - Test function (not executed)
 */
export function xit(description: string, fn: Function): void;
/**
 * Setup function to run before each test
 * @param {Function} fn - Setup function
 */
export function beforeEach(fn: Function): void;
/**
 * Cleanup function to run after each test
 * @param {Function} fn - Cleanup function
 */
export function afterEach(fn: Function): void;
/**
 * Setup function to run before all tests in suite
 * @param {Function} fn - Setup function
 */
export function beforeAll(fn: Function): void;
/**
 * Cleanup function to run after all tests in suite
 * @param {Function} fn - Cleanup function
 */
export function afterAll(fn: Function): void;
/**
 * Runs all defined tests
 * @returns {Promise<Object>} Test results
 */
export function runTests(): Promise<Object>;
/**
 * Creates a mock function
 * @param {Function} implementation - Optional mock implementation
 * @returns {Function} Mock function
 */
export function createMock(implementation?: Function): Function;
/**
 * Spies on an object method
 * @param {Object} object - Target object
 * @param {string} methodName - Method name to spy on
 * @returns {Function} Spy function
 */
export function spyOn(object: Object, methodName: string): Function;
/**
 * Restores all spies
 */
export function restoreAllSpies(): void;
export default testFramework;
/**
 * Assertion utilities with Jest-like syntax
 */
declare class Expect {
    constructor(actual: any);
    actual: any;
    isNot: boolean;
    get not(): this;
    toBe(expected: any): void;
    toEqual(expected: any): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toContain(expected: any): void;
    toThrow(expectedError: any): void;
    deepEqual(a: any, b: any): boolean;
}
declare const testFramework: TestFramework;
/**
 * Test Framework State
 * Manages test execution state and results
 */
declare class TestFramework {
    tests: any[];
    currentSuite: any;
    results: {
        passed: number;
        failed: number;
        skipped: number;
        total: number;
    };
    mocks: Map<any, any>;
    spies: Map<any, any>;
    /**
     * Defines a test suite
     * @param {string} description - Suite description
     * @param {Function} fn - Suite function containing tests
     */
    describe(description: string, fn: Function): void;
    /**
     * Defines a test case
     * @param {string} description - Test description
     * @param {Function} fn - Test function
     */
    it(description: string, fn: Function): void;
    /**
     * Skips a test case
     * @param {string} description - Test description
     * @param {Function} fn - Test function (not executed)
     */
    xit(description: string, fn: Function): void;
    /**
     * Setup function to run before each test
     * @param {Function} fn - Setup function
     */
    beforeEach(fn: Function): void;
    /**
     * Cleanup function to run after each test
     * @param {Function} fn - Cleanup function
     */
    afterEach(fn: Function): void;
    /**
     * Setup function to run before all tests in suite
     * @param {Function} fn - Setup function
     */
    beforeAll(fn: Function): void;
    /**
     * Cleanup function to run after all tests in suite
     * @param {Function} fn - Cleanup function
     */
    afterAll(fn: Function): void;
    /**
     * Runs all defined tests
     * @returns {Promise<Object>} Test results
     */
    runTests(): Promise<Object>;
    /**
     * Prints test execution results
     */
    printResults(): void;
    /**
     * Creates a mock function
     * @param {Function} implementation - Optional mock implementation
     * @returns {Function} Mock function
     */
    createMock(implementation?: Function): Function;
    /**
     * Spies on an object method
     * @param {Object} object - Target object
     * @param {string} methodName - Method name to spy on
     * @returns {Function} Spy function
     */
    spyOn(object: Object, methodName: string): Function;
    /**
     * Restores all spies
     */
    restoreAllSpies(): void;
}
//# sourceMappingURL=test-framework.d.ts.map