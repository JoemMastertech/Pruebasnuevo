export default syncMonitor;
declare const syncMonitor: SyncMonitor;
/**
 * Sync Monitor - Development tool for monitoring data synchronization
 * Provides console commands and status information for debugging
 */
declare class SyncMonitor {
    adapter: Object | null;
    isEnabled: boolean;
    /**
     * Initialize monitor with adapter reference
     * @param {Object} adapter - ProductDataAdapter instance
     */
    init(adapter: Object): void;
    /**
     * Get comprehensive status information
     * @returns {Object} Complete status information
     */
    getFullStatus(): Object;
    /**
     * Get detailed cache status
     * @returns {Object} Cache information
     */
    getCacheStatus(): Object;
    /**
     * Force immediate synchronization
     */
    forceSync(): Promise<void>;
    /**
     * Start automatic synchronization
     */
    startSync(): void;
    /**
     * Stop automatic synchronization
     */
    stopSync(): void;
    /**
     * Clear all cache data
     */
    clearCache(): void;
    /**
     * Show available commands
     */
    showHelp(): void;
    /**
     * Log sync event for monitoring
     * @param {string} event - Event type
     * @param {Object} data - Event data
     */
    logSyncEvent(event: string, data?: Object): void;
    /**
     * Disable monitor and clean up
     */
    destroy(): void;
}
//# sourceMappingURL=syncMonitor.d.ts.map