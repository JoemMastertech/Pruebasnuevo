/**
 * Get configuration for current environment
 * @param {string} environment - 'production', 'development', or 'testing'
 * @returns {Object} Configuration object
 */
export function getConfigForEnvironment(environment?: string): Object;
/**
 * Validate sync configuration
 * @param {Object} config - Configuration to validate
 * @returns {boolean} True if valid
 */
export function validateSyncConfig(config: Object): boolean;
/**
 * Apply configuration to the system
 * @param {Object} config - Configuration to apply
 */
export function applySyncConfig(config: Object): void;
export namespace SyncSystemConfig {
    let enabled: boolean;
    let sync: {
        BACKGROUND_SYNC_INTERVAL: number;
        AUTO_UPDATE_ENABLED: boolean;
        IMMEDIATE_LOAD: boolean;
        RETRY_FAILED_SYNC: boolean;
        MAX_SYNC_RETRIES: number;
        SYNC_RETRY_DELAY: number;
    };
    let cache: {
        ENABLE_STATISTICS: boolean;
        AUTO_CLEANUP: boolean;
        CLEANUP_INTERVAL: number;
        DEFAULT_TTL: number;
        LONG_TTL: number;
        SHORT_TTL: number;
        USER_PREFS_TTL: number;
        MAX_CACHE_SIZE: number;
    };
    namespace development {
        let ENABLE_MONITOR: boolean;
        let ENABLE_CONSOLE_COMMANDS: boolean;
        let LOG_SYNC_EVENTS: boolean;
        let SHOW_CACHE_STATS: boolean;
    }
    namespace performance {
        let MAX_CONCURRENT_SYNCS: number;
        let SYNC_TIMEOUT: number;
        let CACHE_PRELOAD: boolean;
    }
}
export namespace SyncPresets {
    export namespace production {
        export namespace development_1 {
            let ENABLE_MONITOR_1: boolean;
            export { ENABLE_MONITOR_1 as ENABLE_MONITOR };
            let ENABLE_CONSOLE_COMMANDS_1: boolean;
            export { ENABLE_CONSOLE_COMMANDS_1 as ENABLE_CONSOLE_COMMANDS };
            let LOG_SYNC_EVENTS_1: boolean;
            export { LOG_SYNC_EVENTS_1 as LOG_SYNC_EVENTS };
            let SHOW_CACHE_STATS_1: boolean;
            export { SHOW_CACHE_STATS_1 as SHOW_CACHE_STATS };
        }
        export { development_1 as development };
        let sync_1: {
            BACKGROUND_SYNC_INTERVAL: number;
            MAX_SYNC_RETRIES: number;
            AUTO_UPDATE_ENABLED: boolean;
            IMMEDIATE_LOAD: boolean;
            RETRY_FAILED_SYNC: boolean;
            SYNC_RETRY_DELAY: number;
        };
        export { sync_1 as sync };
    }
    export namespace development_2 {
        export namespace development_3 {
            let ENABLE_MONITOR_2: boolean;
            export { ENABLE_MONITOR_2 as ENABLE_MONITOR };
            let ENABLE_CONSOLE_COMMANDS_2: boolean;
            export { ENABLE_CONSOLE_COMMANDS_2 as ENABLE_CONSOLE_COMMANDS };
            let LOG_SYNC_EVENTS_2: boolean;
            export { LOG_SYNC_EVENTS_2 as LOG_SYNC_EVENTS };
            let SHOW_CACHE_STATS_2: boolean;
            export { SHOW_CACHE_STATS_2 as SHOW_CACHE_STATS };
        }
        export { development_3 as development };
        let sync_2: {
            BACKGROUND_SYNC_INTERVAL: number;
            MAX_SYNC_RETRIES: number;
            AUTO_UPDATE_ENABLED: boolean;
            IMMEDIATE_LOAD: boolean;
            RETRY_FAILED_SYNC: boolean;
            SYNC_RETRY_DELAY: number;
        };
        export { sync_2 as sync };
    }
    export { development_2 as development };
    export namespace testing {
        let enabled_1: boolean;
        export { enabled_1 as enabled };
        let sync_3: {
            AUTO_UPDATE_ENABLED: boolean;
            IMMEDIATE_LOAD: boolean;
            BACKGROUND_SYNC_INTERVAL: number;
            RETRY_FAILED_SYNC: boolean;
            MAX_SYNC_RETRIES: number;
            SYNC_RETRY_DELAY: number;
        };
        export { sync_3 as sync };
        export namespace development_4 {
            let ENABLE_MONITOR_3: boolean;
            export { ENABLE_MONITOR_3 as ENABLE_MONITOR };
            let ENABLE_CONSOLE_COMMANDS_3: boolean;
            export { ENABLE_CONSOLE_COMMANDS_3 as ENABLE_CONSOLE_COMMANDS };
            let LOG_SYNC_EVENTS_3: boolean;
            export { LOG_SYNC_EVENTS_3 as LOG_SYNC_EVENTS };
            let SHOW_CACHE_STATS_3: boolean;
            export { SHOW_CACHE_STATS_3 as SHOW_CACHE_STATS };
        }
        export { development_4 as development };
    }
}
export default SyncSystemConfig;
//# sourceMappingURL=syncConfig.d.ts.map