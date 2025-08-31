export default SimpleCache;
declare class SimpleCache {
    static cache: Map<any, any>;
    static prefix: string;
    static stats: {
        hits: number;
        misses: number;
        sets: number;
        removes: number;
    };
    static set(key: any, data: any, ttl?: number): void;
    static get(key: any): any;
    static remove(key: any): void;
    static clear(): void;
    static getStats(): {
        hitRate: string;
        cacheSize: number;
        memoryKeys: any[];
        hits: number;
        misses: number;
        sets: number;
        removes: number;
    };
    static getCacheInfo(key: any): {
        key: any;
        created: string;
        accessed: string;
        expires: string;
        accessCount: any;
        timeToExpire: number;
        isExpired: boolean;
    } | null;
    static cleanExpired(): number;
}
//# sourceMappingURL=simpleCache.d.ts.map