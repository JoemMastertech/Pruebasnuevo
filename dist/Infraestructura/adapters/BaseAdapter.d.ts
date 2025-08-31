export default BaseAdapter;
/**
 * Base Adapter - Common functionality for all infrastructure adapters
 * Implements common patterns: error handling, logging, validation
 * Follows YAGNI principle - only includes actually needed functionality
 * Part of Hexagonal Architecture - Infrastructure layer base class
 */
declare class BaseAdapter {
    adapterName: string;
    /**
     * Safe method execution with error handling and logging
     * @param {Function} operation - The operation to execute
     * @param {string} methodName - Name of the method for logging
     * @param {*} fallbackValue - Value to return on error (default: [])
     * @returns {*} Operation result or fallback value
     */
    safeExecute(operation: Function, methodName: string, fallbackValue?: any): any;
    /**
     * Safe async method execution with error handling and logging
     * @param {Function} asyncOperation - The async operation to execute
     * @param {string} methodName - Name of the method for logging
     * @param {*} fallbackValue - Value to return on error (default: [])
     * @returns {Promise<*>} Operation result or fallback value
     */
    safeExecuteAsync(asyncOperation: Function, methodName: string, fallbackValue?: any): Promise<any>;
    /**
     * Validate text input parameter
     * @param {string} text - Text to validate
     * @param {string} paramName - Parameter name for logging
     * @returns {boolean} True if valid, false otherwise
     */
    validateTextParam(text: string, paramName: string): boolean;
    /**
     * Get standard categories list
     * @returns {Array} Array of category names
     */
    getStandardCategories(): any[];
}
//# sourceMappingURL=BaseAdapter.d.ts.map