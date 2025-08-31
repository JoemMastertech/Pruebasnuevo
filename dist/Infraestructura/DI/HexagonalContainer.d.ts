import { CreateOrderUseCase } from '../../Aplicacion/UseCases/CreateOrderUseCase.js';
import { ValidateProductUseCase } from '../../Aplicacion/UseCases/ValidateProductUseCase.js';
import { AddProductToOrderUseCase } from '../../Aplicacion/UseCases/AddProductToOrderUseCase.js';
import { ValidateOrderUseCase } from '../../Aplicacion/UseCases/ValidateOrderUseCase.js';
import { OrderRepositoryPort } from '../../Domain/Ports/OrderRepositoryPort.js';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort.js';
import { DrinkRulesPort } from '../../Domain/Ports/DrinkRulesPort.js';
import { EventBusPort } from '../../Domain/Ports/EventBusPort.js';
/**
 * Contenedor de inyección de dependencias para la arquitectura hexagonal
 * Gestiona la creación e inyección de todas las dependencias del sistema
 */
export declare class HexagonalContainer {
    private static instance;
    private dependencies;
    private singletons;
    private constructor();
    /**
     * Obtiene la instancia singleton del contenedor
     */
    static getInstance(): HexagonalContainer;
    /**
     * Registra todas las dependencias del sistema
     */
    private registerDependencies;
    /**
     * Registra una dependencia como singleton
     */
    registerSingleton<T>(key: string, factory: () => T): void;
    /**
     * Registra una dependencia como transient (nueva instancia cada vez)
     */
    registerTransient<T>(key: string, factory: () => T): void;
    /**
     * Resuelve una dependencia por su clave
     */
    resolve<T>(key: string): T;
    /**
     * Verifica si una dependencia está registrada
     */
    isRegistered(key: string): boolean;
    /**
     * Obtiene todas las claves de dependencias registradas
     */
    getRegisteredKeys(): string[];
    /**
     * Limpia todas las instancias singleton (útil para testing)
     */
    clearSingletons(): void;
    /**
     * Reemplaza una dependencia existente (útil para testing)
     */
    replace<T>(key: string, factory: () => T, isSingleton?: boolean): void;
    /**
     * Obtiene el servicio de validación existente del sistema
     */
    private getExistingValidationService;
    /**
     * Crea una implementación simple en memoria del EventBusPort
     */
    private createInMemoryEventBus;
    /**
     * Inicializa el contenedor y expone los casos de uso globalmente
     */
    static initialize(): HexagonalContainer;
    /**
     * Método de utilidad para obtener casos de uso específicos
     */
    getCreateOrderUseCase(): CreateOrderUseCase;
    getValidateProductUseCase(): ValidateProductUseCase;
    getAddProductToOrderUseCase(): AddProductToOrderUseCase;
    getValidateOrderUseCase(): ValidateOrderUseCase;
    getOrderRepository(): OrderRepositoryPort;
    getProductRepository(): ProductRepositoryPort;
    getDrinkRulesService(): DrinkRulesPort;
    getEventBus(): EventBusPort;
}
//# sourceMappingURL=HexagonalContainer.d.ts.map