/**
 * Simplified memoization manager
 */
export class MemoizationManager {
    constructor(defaultTTL?: number);
    defaultTTL: number;
    caches: Map<any, any>;
    /**
     * Memoize a function with automatic caching
     * @param {string} key - Cache namespace
     * @param {Function} fn - Function to memoize
     * @param {number} ttl - Time to live (optional)
     * @returns {Function} Memoized function
     */
    memoize(key: string, fn: Function, ttl?: number): Function;
    /**
     * Store value in cache
     * @param {string} namespace - Cache namespace
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} ttl - Time to live
     */
    set(namespace: string, key: string, value: any, ttl?: number): void;
    /**
     * Get value from cache
     * @param {string} namespace - Cache namespace
     * @param {string} key - Cache key
     * @returns {*} Cached value or null
     */
    get(namespace: string, key: string): any;
    /**
     * Clear specific cache namespace
     * @param {string} namespace - Cache namespace to clear
     */
    clear(namespace: string): void;
    /**
     * Clear all caches
     */
    clearAll(): void;
}
export function memoize(key: any, fn: any, ttl: any): Function;
export function cache(namespace: any, key: any, value: any, ttl: any): void;
export function get(namespace: any, key: any): any;
export function clearCache(namespace: any): void;
export function clearAllCaches(): void;
export default globalManager;
declare const globalManager: MemoizationManager;
//# sourceMappingURL=MemoizationManager.d.ts.map