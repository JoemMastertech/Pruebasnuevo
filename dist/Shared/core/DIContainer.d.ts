export default DIContainer;
/**
 * Dependency Injection Container for Hexagonal Architecture
 * Manages service registration, resolution, and lifecycle
 * Provides singleton support and circular dependency detection
 */
declare class DIContainer {
    services: Map<any, any>;
    singletons: Map<any, any>;
    resolving: Set<any>;
    /**
     * Register a service with factory function
     * @param {string} name - Service identifier
     * @param {Function} factory - Factory function that creates the service
     * @param {Object} options - Registration options
     */
    register(name: string, factory: Function, options?: Object): this;
    /**
     * Register a singleton service
     * @param {string} name - Service identifier
     * @param {Function} factory - Factory function
     * @param {Array} dependencies - Service dependencies
     */
    singleton(name: string, factory: Function, dependencies?: any[]): this;
    /**
     * Resolve a service by name
     * @param {string} name - Service identifier
     * @returns {*} The resolved service instance
     */
    resolve(name: string): any;
    /**
     * Check if a service is registered
     * @param {string} name - Service identifier
     * @returns {boolean}
     */
    has(name: string): boolean;
    /**
     * Clear all services and singletons
     */
    clear(): void;
    /**
     * Get list of registered service names
     * @returns {Array<string>}
     */
    getRegisteredServices(): Array<string>;
    /**
     * Validate all registered services can be resolved
     * @returns {Object} Validation result with success flag and errors
     */
    validate(): Object;
}
//# sourceMappingURL=DIContainer.d.ts.map