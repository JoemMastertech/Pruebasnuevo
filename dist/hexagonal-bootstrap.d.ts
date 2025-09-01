/**
 * Bootstrap para la arquitectura hexagonal
 * Este archivo inicializa y conecta la nueva arquitectura con el sistema existente
 */
declare class HexagonalContainer {
    static getInstance(): any;
    static initialize(): any;
    dependencies: Map<any, any>;
    singletons: Map<any, any>;
    registerDependencies(): void;
    registerSingleton(key: any, factory: any): void;
    registerTransient(key: any, factory: any): void;
    resolve(key: any): any;
    isRegistered(key: any): boolean;
    getRegisteredKeys(): any[];
    clearSingletons(): void;
    replace(key: any, factory: any, isSingleton?: boolean): void;
    getCreateOrderUseCase(): any;
    getValidateProductUseCase(): any;
    getAddProductToOrderUseCase(): any;
    getValidateOrderUseCase(): any;
    getOrderRepository(): any;
    getProductRepository(): any;
    getDrinkRulesService(): any;
}
/**
 * Clase principal para inicializar la arquitectura hexagonal
 */
declare class HexagonalBootstrap {
    container: any;
    isInitialized: boolean;
    /**
     * Inicializa la arquitectura hexagonal
     */
    initialize(): Promise<any>;
    /**
     * Carga automáticamente _bem-base.css
     */
    loadBemBaseCss(): Promise<any>;
    /**
     * Expone adaptadores globalmente según contrato
     */
    exposeAdaptersGlobally(): void;
    /**
     * Conecta la nueva arquitectura con el sistema existente
     */
    connectWithExistingSystem(): Promise<void>;
    /**
     * Verifica que los servicios existentes estén disponibles
     */
    checkExistingServices(): void;
    /**
     * Migra datos existentes del OrderSystemCore si existe
     */
    migrateExistingData(): Promise<void>;
    /**
     * Migra un item individual del sistema existente
     */
    migrateOrderItem(createOrderUseCase: any, item: any): Promise<void>;
    /**
     * Configura compatibilidad hacia atrás con el sistema existente
     */
    setupBackwardCompatibility(): void;
    /**
     * Expone la API hexagonal para uso directo
     */
    exposeHexagonalAPI(): void;
    /**
     * Obtiene el estado de inicialización
     */
    isReady(): boolean;
    /**
     * Obtiene el contenedor de dependencias
     */
    getContainer(): any;
    /**
     * Método de utilidad para debugging
     */
    getDebugInfo(): {
        status: string;
        registeredDependencies?: never;
        availableServices?: never;
    } | {
        status: string;
        registeredDependencies: any;
        availableServices: {
            OrderSystemCore: boolean;
            ProductDataAdapter: boolean;
            OrderSystemValidations: boolean;
            HexagonalAPI: boolean;
            HexagonalOrderCore: boolean;
        };
    };
}
declare const hexagonalBootstrap: HexagonalBootstrap;
//# sourceMappingURL=hexagonal-bootstrap.d.ts.map