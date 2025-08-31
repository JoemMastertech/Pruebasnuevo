export default DataSyncService;
/**
 * Data Synchronization Service
 * Manages automatic background synchronization of data from Supabase
 * Ensures fresh data without blocking user interface
 */
declare class DataSyncService {
    constructor(adapter: any);
    adapter: any;
    syncInterval: NodeJS.Timeout | null;
    isRunning: boolean;
    lastSyncTime: number | null;
    syncRetries: Map<any, any>;
    /**
     * Start automatic background synchronization
     */
    startAutoSync(): void;
    /**
     * Stop automatic background synchronization
     */
    stopAutoSync(): void;
    /**
     * Synchronize all product categories
     */
    syncAllCategories(): Promise<void>;
    /**
     * Synchronize a specific category with retry logic
     * @param {string} category - Category name to sync
     */
    syncCategory(category: string): Promise<void>;
    /**
     * Schedule retry for failed sync
     * @param {string} category - Category that failed to sync
     */
    scheduleRetry(category: string): void;
    /**
     * Force immediate sync of all categories
     */
    forceSyncNow(): Promise<void>;
    /**
     * Get sync status information
     * @returns {Object} Sync status details
     */
    getSyncStatus(): Object;
    /**
     * Clean up resources
     */
    destroy(): void;
}
//# sourceMappingURL=DataSyncService.d.ts.map