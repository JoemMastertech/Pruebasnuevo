/**
 * Gets the ProductRepository from DI Container
 * Consolidates getProductRepository functions from multiple files
 * @returns {Object} Product repository instance
 * @throws {Error} If DIContainer is not initialized
 */
export function getProductRepository(): Object;
/**
 * Generic service resolver from DI Container
 * @param {string} serviceName - Name of the service to resolve
 * @returns {Object} Resolved service instance
 * @throws {Error} If DIContainer is not initialized or service not found
 */
export function resolveService(serviceName: string): Object;
/**
 * Checks if DI Container is available
 * @returns {boolean} True if container is available
 */
export function isDIContainerAvailable(): boolean;
/**
 * Gets the DI Container instance
 * @returns {Object|null} DI Container instance or null if not available
 */
export function getDIContainer(): Object | null;
/**
 * Safely resolves a service with error handling
 * @param {string} serviceName - Name of the service to resolve
 * @param {Object} fallback - Fallback value if service cannot be resolved
 * @returns {Object} Resolved service or fallback
 */
export function safeResolveService(serviceName: string, fallback?: Object): Object;
//# sourceMappingURL=diUtils.d.ts.map