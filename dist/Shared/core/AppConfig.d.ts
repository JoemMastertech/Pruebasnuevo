export default appConfigInstance;
export { AppConfig as AppConfigClass };
declare const appConfigInstance: AppConfig;
/**
 * Application Configuration Manager
 * Centralizes environment variables, feature flags, and UI configuration
 * Replaces window.appConfig with structured, environment-aware configuration
 */
declare class AppConfig {
    config: Object;
    /**
     * Load configuration from environment and defaults
     * @returns {Object} Complete configuration object
     */
    loadConfiguration(): Object;
    /**
     * Detect current environment (simplified)
     * @returns {string} Environment name
     */
    detectEnvironment(): string;
    /**
     * Get environment variable with fallback (simplified)
     * @param {string} key - Environment variable key
     * @param {*} defaultValue - Default value if not found
     * @returns {string|*} Environment variable value or default
     */
    getEnvVar(key: string, defaultValue?: any): string | any;
    /**
     * Get boolean environment variable (simplified)
     * @param {string} key - Environment variable key
     * @param {boolean} defaultValue - Default boolean value
     * @returns {boolean}
     */
    getBooleanEnv(key: string, defaultValue?: boolean): boolean;
    /**
     * Get numeric environment variable (simplified)
     * @param {string} key - Environment variable key
     * @param {number} defaultValue - Default numeric value
     * @returns {number}
     */
    getNumberEnv(key: string, defaultValue?: number): number;
    /**
     * Validate configuration integrity
     * @throws {Error} If configuration is invalid
     */
    validateConfiguration(): void;
    /**
     * Get configuration value by path
     * @param {string} path - Dot-separated path (e.g., 'database.supabaseUrl')
     * @param {*} defaultValue - Default value if path not found
     * @returns {*} Configuration value
     */
    get(path: string, defaultValue?: any): any;
    /**
     * Check if a feature is enabled
     * @param {string} featureName - Feature flag name
     * @returns {boolean}
     */
    isFeatureEnabled(featureName: string): boolean;
    /**
     * Get validation rule
     * @param {string} ruleName - Validation rule name
     * @returns {*} Validation rule value
     */
    getValidationRule(ruleName: string): any;
    /**
     * Get UI configuration
     * @param {string} uiPath - UI configuration path
     * @returns {*} UI configuration value
     */
    getUI(uiPath: string): any;
    /**
     * Get all configuration (read-only)
     * @returns {Object} Complete configuration object
     */
    getAll(): Object;
    /**
     * Reload configuration (useful for testing)
     */
    reload(): void;
}
//# sourceMappingURL=AppConfig.d.ts.map