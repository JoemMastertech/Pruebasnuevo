/**
 * Page Object Model Base Class
 * Provides structure for page object implementations
 */
export class PageObject {
    constructor(url?: null);
    url: any;
    elementSelector: ElementSelector;
    userInteraction: UserInteraction;
    selectors: {};
    /**
     * Navigates to the page
     *
     * @param {Object} [options={}] - Navigation options
     * @returns {Promise<void>}
     */
    navigate(options?: Object): Promise<void>;
    /**
     * Waits for page to load completely
     *
     * @param {number} [timeout=10000] - Timeout in milliseconds
     * @returns {Promise<void>}
     */
    waitForPageLoad(timeout?: number): Promise<void>;
    /**
     * Gets the current page URL
     *
     * @returns {string} Current URL
     */
    getCurrentUrl(): string;
    /**
     * Gets the page title
     *
     * @returns {string} Page title
     */
    getTitle(): string;
    /**
     * Takes a screenshot (if supported)
     *
     * @param {string} [name] - Screenshot name
     * @returns {Promise<string|null>} Screenshot data URL or null
     */
    takeScreenshot(name?: string): Promise<string | null>;
    /**
     * Waits for a specific condition
     *
     * @param {Function} condition - Condition function
     * @param {Object} [options={}] - Wait options
     * @returns {Promise<*>} Condition result
     */
    waitFor(condition: Function, options?: Object): Promise<any>;
}
/**
 * E2E Test Runner
 * Manages test execution and reporting
 */
export class E2ETestRunner {
    constructor(options?: {});
    config: {
        timeout: number;
        retries: number;
        screenshotOnFailure: boolean;
        parallel: boolean;
    };
    tests: any[];
    results: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        duration: number;
        details: never[];
    };
    isDebugMode: boolean;
    /**
     * Registers a test case
     *
     * @param {string} name - Test name
     * @param {Function} testFn - Test function
     * @param {Object} [options={}] - Test options
     */
    test(name: string, testFn: Function, options?: Object): void;
    /**
     * Runs all registered tests
     *
     * @param {Object} [options={}] - Run options
     * @returns {Promise<Object>} Test results
     */
    run(options?: Object): Promise<Object>;
    /**
     * Runs a single test with retries
     *
     * @param {Object} test - Test object
     * @returns {Promise<Object>} Test result
     */
    runSingleTest(test: Object): Promise<Object>;
    /**
     * Executes a test with timeout
     *
     * @param {Object} test - Test object
     * @returns {Promise<void>}
     */
    executeTestWithTimeout(test: Object): Promise<void>;
    /**
     * Takes a screenshot on test failure
     *
     * @param {string} testName - Test name
     * @param {number} attempt - Attempt number
     * @returns {Promise<void>}
     */
    takeFailureScreenshot(testName: string, attempt: number): Promise<void>;
    /**
     * Prints test results to console
     */
    printResults(): void;
    /**
     * Waits for a specified amount of time
     *
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise<void>}
     */
    wait(ms: number): Promise<void>;
    /**
     * Clears all registered tests
     */
    clear(): void;
}
/**
 * Waits for an element to be present and visible
 *
 * @param {string} selector - CSS selector
 * @param {Object} [options={}] - Wait options
 * @param {number} [options.timeout=5000] - Timeout in milliseconds
 * @param {boolean} [options.visible=true] - Wait for visibility
 * @param {boolean} [options.enabled=false] - Wait for enabled state
 * @returns {Promise<HTMLElement>} Found element
 */
export function waitForElement(selector: string, options?: {
    timeout?: number | undefined;
    visible?: boolean | undefined;
    enabled?: boolean | undefined;
}): Promise<HTMLElement>;
/**
 * Waits for multiple elements
 *
 * @param {string[]} selectors - Array of CSS selectors
 * @param {Object} [options={}] - Wait options
 * @returns {Promise<HTMLElement[]>} Found elements
 */
export function waitForElements(selectors: string[], options?: Object): Promise<HTMLElement[]>;
/**
 * Clicks an element
 *
 * @param {string} selector - CSS selector
 * @param {Object} [options={}] - Click options
 * @param {boolean} [options.force=false] - Force click even if not visible
 * @param {number} [options.delay=0] - Delay before click
 * @returns {Promise<void>}
 */
export function click(selector: string, options?: {
    force?: boolean | undefined;
    delay?: number | undefined;
}): Promise<void>;
/**
 * Types text into an input element
 *
 * @param {string} selector - CSS selector
 * @param {string} text - Text to type
 * @param {Object} [options={}] - Type options
 * @param {boolean} [options.clear=true] - Clear existing text
 * @param {number} [options.delay=50] - Delay between keystrokes
 * @returns {Promise<void>}
 */
export function type(selector: string, text: string, options?: {
    clear?: boolean | undefined;
    delay?: number | undefined;
}): Promise<void>;
/**
 * Selects an option from a dropdown
 *
 * @param {string} selector - CSS selector for select element
 * @param {string|number} value - Option value or index
 * @param {Object} [options={}] - Select options
 * @returns {Promise<void>}
 */
export function select(selector: string, value: string | number, options?: Object): Promise<void>;
/**
 * Hovers over an element
 *
 * @param {string} selector - CSS selector
 * @param {Object} [options={}] - Hover options
 * @returns {Promise<void>}
 */
export function hover(selector: string, options?: Object): Promise<void>;
/**
 * Scrolls to an element
 *
 * @param {string} selector - CSS selector
 * @param {Object} [options={}] - Scroll options
 * @returns {Promise<void>}
 */
export function scrollTo(selector: string, options?: Object): Promise<void>;
/**
 * Registers a test case
 *
 * @param {string} name - Test name
 * @param {Function} testFn - Test function
 * @param {Object} [options={}] - Test options
 */
export function test(name: string, testFn: Function, options?: Object): void;
/**
 * Runs all registered tests
 *
 * @param {Object} [options={}] - Run options
 * @returns {Promise<Object>} Test results
 */
export function runTests(options?: Object): Promise<Object>;
export default globalTestRunner;
/**
 * Element Selector Utilities
 * Provides robust element selection and interaction
 */
export class ElementSelector {
    defaultTimeout: number;
    retryInterval: number;
    /**
     * Waits for an element to be present and visible
     *
     * @param {string} selector - CSS selector
     * @param {Object} [options={}] - Wait options
     * @param {number} [options.timeout=5000] - Timeout in milliseconds
     * @param {boolean} [options.visible=true] - Wait for visibility
     * @param {boolean} [options.enabled=false] - Wait for enabled state
     * @returns {Promise<HTMLElement>} Found element
     */
    waitForElement(selector: string, options?: {
        timeout?: number | undefined;
        visible?: boolean | undefined;
        enabled?: boolean | undefined;
    }): Promise<HTMLElement>;
    /**
     * Waits for multiple elements
     *
     * @param {string[]} selectors - Array of CSS selectors
     * @param {Object} [options={}] - Wait options
     * @returns {Promise<HTMLElement[]>} Found elements
     */
    waitForElements(selectors: string[], options?: Object): Promise<HTMLElement[]>;
    /**
     * Waits for an element to disappear
     *
     * @param {string} selector - CSS selector
     * @param {number} [timeout=5000] - Timeout in milliseconds
     * @returns {Promise<void>}
     */
    waitForElementToDisappear(selector: string, timeout?: number): Promise<void>;
    /**
     * Checks if an element is visible
     *
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Visibility status
     */
    isVisible(element: HTMLElement): boolean;
    /**
     * Gets element text content with retry
     *
     * @param {string} selector - CSS selector
     * @param {Object} [options={}] - Options
     * @returns {Promise<string>} Element text
     */
    getText(selector: string, options?: Object): Promise<string>;
    /**
     * Gets element attribute value
     *
     * @param {string} selector - CSS selector
     * @param {string} attribute - Attribute name
     * @param {Object} [options={}] - Options
     * @returns {Promise<string>} Attribute value
     */
    getAttribute(selector: string, attribute: string, options?: Object): Promise<string>;
}
/**
 * User Interaction Utilities
 * Provides user interaction simulation
 */
export class UserInteraction {
    constructor(elementSelector: any);
    elementSelector: any;
    actionDelay: number;
    /**
     * Clicks an element
     *
     * @param {string} selector - CSS selector
     * @param {Object} [options={}] - Click options
     * @param {boolean} [options.force=false] - Force click even if not visible
     * @param {number} [options.delay=0] - Delay before click
     * @returns {Promise<void>}
     */
    click(selector: string, options?: {
        force?: boolean | undefined;
        delay?: number | undefined;
    }): Promise<void>;
    /**
     * Double clicks an element
     *
     * @param {string} selector - CSS selector
     * @param {Object} [options={}] - Click options
     * @returns {Promise<void>}
     */
    doubleClick(selector: string, options?: Object): Promise<void>;
    /**
     * Types text into an input element
     *
     * @param {string} selector - CSS selector
     * @param {string} text - Text to type
     * @param {Object} [options={}] - Type options
     * @param {boolean} [options.clear=true] - Clear existing text
     * @param {number} [options.delay=50] - Delay between keystrokes
     * @returns {Promise<void>}
     */
    type(selector: string, text: string, options?: {
        clear?: boolean | undefined;
        delay?: number | undefined;
    }): Promise<void>;
    /**
     * Selects an option from a dropdown
     *
     * @param {string} selector - CSS selector for select element
     * @param {string|number} value - Option value or index
     * @param {Object} [options={}] - Select options
     * @returns {Promise<void>}
     */
    select(selector: string, value: string | number, options?: Object): Promise<void>;
    /**
     * Hovers over an element
     *
     * @param {string} selector - CSS selector
     * @param {Object} [options={}] - Hover options
     * @returns {Promise<void>}
     */
    hover(selector: string, options?: Object): Promise<void>;
    /**
     * Scrolls to an element
     *
     * @param {string} selector - CSS selector
     * @param {Object} [options={}] - Scroll options
     * @returns {Promise<void>}
     */
    scrollTo(selector: string, options?: Object): Promise<void>;
    /**
     * Waits for a specified amount of time
     *
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise<void>}
     */
    wait(ms: number): Promise<void>;
    /**
     * Presses a key
     *
     * @param {string} key - Key to press
     * @param {Object} [options={}] - Key options
     * @returns {Promise<void>}
     */
    pressKey(key: string, options?: Object): Promise<void>;
}
declare const globalTestRunner: E2ETestRunner;
//# sourceMappingURL=e2e-framework.d.ts.map