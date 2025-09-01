export class EnvironmentManager {
    constructor(options?: {});
    config: {
        defaultEnvironment: string;
        autoDetect: boolean;
        persistConfig: boolean;
        configKey: string;
        validateConfig: boolean;
    };
    currentEnvironment: any;
    configurations: Map<any, any>;
    validator: ConfigValidator;
    featureFlags: FeatureFlagManager;
    watchers: Set<any>;
    isDebugMode: boolean;
    initializeDefaultSchemas(): void;
    detectEnvironment(): void;
    registerConfig(environment: any, config: any, options?: {}): boolean;
    getConfig(environment?: null, path?: null): any;
    setConfig(path: any, value: any, environment?: null): boolean;
    switchEnvironment(environment: any): boolean;
    registerFeatureFlag(flagName: any, flagConfig: any): boolean;
    isFeatureEnabled(flagName: any, userId?: null): any;
    watch(callback: any): () => void;
    validateConfiguration(config: any): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    getStats(): {
        currentEnvironment: any;
        totalEnvironments: number;
        environments: any[];
        featureFlags: {
            totalFlags: number;
            overrides: number;
            experiments: number;
            flags: {
                name: any;
                defaultValue: any;
                hasExperiment: boolean;
                hasOverride: boolean;
            }[];
        };
        watchers: number;
        config: {
            defaultEnvironment: string;
            autoDetect: boolean;
            persistConfig: boolean;
            configKey: string;
            validateConfig: boolean;
        };
    };
    exportConfig(environments?: null): {
        version: string;
        timestamp: string;
        environments: {};
        featureFlags: {};
    };
    importConfig(configData: any, options?: {}): boolean;
    deepMerge(target: any, source: any): any;
    getNestedValue(obj: any, path: any): any;
    setNestedValue(obj: any, path: any, value: any): any;
    persistConfiguration(environment: any, config: any): void;
    notifyWatchers(event: any, data: any): void;
}
export function getConfig(environment?: null, path?: null): any;
export function setConfig(path: any, value: any, environment?: null): boolean;
export function registerConfig(environment: any, config: any, options?: {}): boolean;
export function switchEnvironment(environment: any): boolean;
export function registerFeatureFlag(flagName: any, flagConfig: any): boolean;
export function isFeatureEnabled(flagName: any, userId?: null): any;
export function watch(callback: any): () => void;
export function getEnvironmentStats(): {
    currentEnvironment: any;
    totalEnvironments: number;
    environments: any[];
    featureFlags: {
        totalFlags: number;
        overrides: number;
        experiments: number;
        flags: {
            name: any;
            defaultValue: any;
            hasExperiment: boolean;
            hasOverride: boolean;
        }[];
    };
    watchers: number;
    config: {
        defaultEnvironment: string;
        autoDetect: boolean;
        persistConfig: boolean;
        configKey: string;
        validateConfig: boolean;
    };
};
export default globalEnvironmentManager;
declare class ConfigValidator {
    schemas: Map<any, any>;
    validationRules: Map<any, any>;
    registerSchema(schemaName: any, schema: any): void;
    validate(config: any, schemaName: any): {
        valid: boolean;
        errors: string[];
        warnings?: never;
    } | {
        valid: boolean;
        errors: string[];
        warnings: any[];
    };
    validateProperty(value: any, propSchema: any, propName: any): {
        errors: string[];
        warnings: any[];
    };
}
declare class FeatureFlagManager {
    flags: Map<any, any>;
    overrides: Map<any, any>;
    experiments: Map<any, any>;
    registerFlag(flagName: any, flagConfig: any): void;
    isEnabled(flagName: any, environment?: null, userId?: null): any;
    setOverride(flagName: any, value: any): void;
    removeOverride(flagName: any): void;
    getExperimentValue(flagName: any, userId: any, experiment: any): any;
    hashString(str: any): number;
    getAllFlags(environment?: null, userId?: null): {};
    getStats(): {
        totalFlags: number;
        overrides: number;
        experiments: number;
        flags: {
            name: any;
            defaultValue: any;
            hasExperiment: boolean;
            hasOverride: boolean;
        }[];
    };
}
declare const globalEnvironmentManager: EnvironmentManager;
//# sourceMappingURL=EnvironmentManager.d.ts.map