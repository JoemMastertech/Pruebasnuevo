"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexagonalContainer = void 0;
const CreateOrderUseCase_js_1 = require("../../Aplicacion/UseCases/CreateOrderUseCase.js");
const ValidateProductUseCase_js_1 = require("../../Aplicacion/UseCases/ValidateProductUseCase.js");
const AddProductToOrderUseCase_js_1 = require("../../Aplicacion/UseCases/AddProductToOrderUseCase.js");
const ValidateOrderUseCase_js_1 = require("../../Aplicacion/UseCases/ValidateOrderUseCase.js");
const InMemoryOrderRepository_js_1 = require("../adapters/InMemoryOrderRepository.js");
const ProductDataRepositoryAdapter_js_1 = require("../adapters/ProductDataRepositoryAdapter.js");
const DrinkRulesServiceAdapter_js_1 = require("../adapters/DrinkRulesServiceAdapter.js");
/**
 * Contenedor de inyección de dependencias para la arquitectura hexagonal
 * Gestiona la creación e inyección de todas las dependencias del sistema
 */
class HexagonalContainer {
    constructor() {
        this.dependencies = new Map();
        this.singletons = new Map();
        this.registerDependencies();
    }
    /**
     * Obtiene la instancia singleton del contenedor
     */
    static getInstance() {
        if (!HexagonalContainer.instance) {
            HexagonalContainer.instance = new HexagonalContainer();
        }
        return HexagonalContainer.instance;
    }
    /**
     * Registra todas las dependencias del sistema
     */
    registerDependencies() {
        // Registrar adaptadores de infraestructura
        this.registerSingleton('OrderRepositoryPort', () => {
            return new InMemoryOrderRepository_js_1.InMemoryOrderRepository();
        });
        this.registerSingleton('ProductRepositoryPort', () => {
            // Obtener el ProductDataAdapter existente del sistema
            const productDataAdapter = this.getExistingProductDataAdapter();
            return new ProductDataRepositoryAdapter_js_1.ProductDataRepositoryAdapter(productDataAdapter);
        });
        this.registerSingleton('DrinkRulesPort', () => {
            // Obtener el servicio de validación existente si está disponible
            const validationService = this.getExistingValidationService();
            return new DrinkRulesServiceAdapter_js_1.DrinkRulesServiceAdapter(validationService);
        });
        // Registrar EventBus (implementación simple en memoria)
        this.registerSingleton('EventBusPort', () => {
            return this.createInMemoryEventBus();
        });
        // Registrar casos de uso
        this.registerTransient('CreateOrderUseCase', () => {
            return new CreateOrderUseCase_js_1.CreateOrderUseCase(this.resolve('OrderRepositoryPort'), this.resolve('ProductRepositoryPort'), this.resolve('DrinkRulesPort'), this.resolve('EventBusPort'));
        });
        this.registerTransient('ValidateProductUseCase', () => {
            return new ValidateProductUseCase_js_1.ValidateProductUseCase(this.resolve('ProductRepositoryPort'), this.resolve('DrinkRulesPort'));
        });
        this.registerTransient('AddProductToOrderUseCase', () => {
            return new AddProductToOrderUseCase_js_1.AddProductToOrderUseCase(this.resolve('OrderRepositoryPort'), this.resolve('ProductRepositoryPort'), this.resolve('DrinkRulesPort'), this.resolve('EventBusPort'));
        });
        this.registerTransient('ValidateOrderUseCase', () => {
            return new ValidateOrderUseCase_js_1.ValidateOrderUseCase(this.resolve('OrderRepositoryPort'), this.resolve('DrinkRulesPort'), this.resolve('EventBusPort'));
        });
    }
    /**
     * Registra una dependencia como singleton
     */
    registerSingleton(key, factory) {
        this.dependencies.set(key, { factory, isSingleton: true });
    }
    /**
     * Registra una dependencia como transient (nueva instancia cada vez)
     */
    registerTransient(key, factory) {
        this.dependencies.set(key, { factory, isSingleton: false });
    }
    /**
     * Resuelve una dependencia por su clave
     */
    resolve(key) {
        const dependency = this.dependencies.get(key);
        if (!dependency) {
            throw new Error(`Dependency '${key}' not found in container`);
        }
        if (dependency.isSingleton) {
            if (!this.singletons.has(key)) {
                this.singletons.set(key, dependency.factory());
            }
            return this.singletons.get(key);
        }
        return dependency.factory();
    }
    /**
     * Verifica si una dependencia está registrada
     */
    isRegistered(key) {
        return this.dependencies.has(key);
    }
    /**
     * Obtiene todas las claves de dependencias registradas
     */
    getRegisteredKeys() {
        return Array.from(this.dependencies.keys());
    }
    /**
     * Limpia todas las instancias singleton (útil para testing)
     */
    clearSingletons() {
        this.singletons.clear();
    }
    /**
     * Reemplaza una dependencia existente (útil para testing)
     */
    replace(key, factory, isSingleton = true) {
        this.dependencies.set(key, { factory, isSingleton });
        if (isSingleton && this.singletons.has(key)) {
            this.singletons.delete(key);
        }
    }
    /**
     * Obtiene el ProductDataAdapter existente del sistema
     */
    getExistingProductDataAdapter() {
        try {
            // Intentar obtener el ProductDataAdapter del sistema existente
            if (typeof window !== 'undefined' && window.ProductDataAdapter) {
                return window.ProductDataAdapter;
            }
            // Fallback: crear un adaptador mock si no existe
            console.warn('ProductDataAdapter not found, creating mock adapter');
            return this.createMockProductDataAdapter();
        }
        catch (error) {
            console.error('Error getting ProductDataAdapter:', error);
            return this.createMockProductDataAdapter();
        }
    }
    /**
     * Obtiene el servicio de validación existente del sistema
     */
    getExistingValidationService() {
        try {
            // Intentar obtener el servicio de validación del sistema existente
            if (typeof window !== 'undefined' && window.OrderSystemValidations) {
                return window.OrderSystemValidations;
            }
            return null; // El DrinkRulesServiceAdapter puede funcionar sin este servicio
        }
        catch (error) {
            console.error('Error getting validation service:', error);
            return null;
        }
    }
    /**
     * Crea una implementación simple en memoria del EventBusPort
     */
    createInMemoryEventBus() {
        const subscribers = new Map();
        const eventHistory = [];
        let subscriptionCounter = 0;
        const eventBus = {
            publish: async (event) => {
                console.log(`[EventBus] Publishing event: ${event.eventType}`, event);
                eventHistory.push(event);
                const handlers = subscribers.get(event.eventType) || [];
                for (const { handler } of handlers) {
                    try {
                        await handler.handle(event);
                    }
                    catch (error) {
                        console.error(`[EventBus] Error handling event ${event.eventType}:`, error);
                        return {
                            success: false,
                            eventId: event.eventId,
                            errorMessage: error instanceof Error ? error.message : 'Unknown error'
                        };
                    }
                }
                return {
                    success: true,
                    eventId: event.eventId
                };
            },
            subscribe: async (eventType, handler) => {
                console.log(`[EventBus] Subscribing to event: ${eventType}`);
                const subscriptionId = `sub_${++subscriptionCounter}`;
                if (!subscribers.has(eventType)) {
                    subscribers.set(eventType, []);
                }
                subscribers.get(eventType).push({ id: subscriptionId, handler });
                return {
                    success: true,
                    subscriptionId
                };
            },
            publishMany: async (events) => {
                const results = [];
                for (const event of events) {
                    results.push(await eventBus.publish(event));
                }
                return results;
            },
            unsubscribe: async (eventType, subscriptionId) => {
                const handlers = subscribers.get(eventType);
                if (handlers) {
                    const index = handlers.findIndex(h => h.id === subscriptionId);
                    if (index >= 0) {
                        handlers.splice(index, 1);
                        return true;
                    }
                }
                return false;
            },
            getEventHistory: async (eventType) => {
                return eventType
                    ? eventHistory.filter(e => e.eventType === eventType)
                    : eventHistory;
            },
            clearEventHistory: async (eventType) => {
                if (eventType) {
                    const index = eventHistory.findIndex(e => e.eventType === eventType);
                    if (index >= 0)
                        eventHistory.splice(index, 1);
                }
                else {
                    eventHistory.length = 0;
                }
            },
            hasSubscribers: (eventType) => {
                return subscribers.has(eventType) && subscribers.get(eventType).length > 0;
            },
            getSubscriberCount: (eventType) => {
                return subscribers.get(eventType)?.length || 0;
            },
            getStats: async () => ({
                totalEventsPublished: eventHistory.length,
                totalSubscriptions: Array.from(subscribers.values()).reduce((sum, handlers) => sum + handlers.length, 0),
                eventTypeStats: {},
                uptime: Date.now()
            })
        };
        return eventBus;
    }
    /**
     * Crea un adaptador mock para desarrollo/testing
     */
    createMockProductDataAdapter() {
        return {
            getProductByName: async (name) => {
                // Mock data para desarrollo
                const mockProducts = [
                    { nombre: 'Cerveza', categoria: 'bebidas', precio: 25, ingredientes: 'Malta, lúpulo' },
                    { nombre: 'Hamburguesa', categoria: 'comida', precio: 85, ingredientes: 'Carne, pan, lechuga' },
                    { nombre: 'Tequila', categoria: 'licores', precio: 45, ingredientes: 'Agave' }
                ];
                return mockProducts.find(p => p.nombre.toLowerCase() === name.toLowerCase()) || null;
            },
            getProductsByCategory: async (category) => {
                const mockProducts = [
                    { nombre: 'Cerveza', categoria: 'bebidas', precio: 25, ingredientes: 'Malta, lúpulo' },
                    { nombre: 'Hamburguesa', categoria: 'comida', precio: 85, ingredientes: 'Carne, pan, lechuga' },
                    { nombre: 'Tequila', categoria: 'licores', precio: 45, ingredientes: 'Agave' }
                ];
                return mockProducts.filter(p => p.categoria === category);
            },
            getAllProducts: async () => {
                return [
                    { nombre: 'Cerveza', categoria: 'bebidas', precio: 25, ingredientes: 'Malta, lúpulo' },
                    { nombre: 'Hamburguesa', categoria: 'comida', precio: 85, ingredientes: 'Carne, pan, lechuga' },
                    { nombre: 'Tequila', categoria: 'licores', precio: 45, ingredientes: 'Agave' }
                ];
            },
            searchProducts: async (query) => {
                const mockProducts = [
                    { nombre: 'Cerveza', categoria: 'bebidas', precio: 25, ingredientes: 'Malta, lúpulo' },
                    { nombre: 'Hamburguesa', categoria: 'comida', precio: 85, ingredientes: 'Carne, pan, lechuga' },
                    { nombre: 'Tequila', categoria: 'licores', precio: 45, ingredientes: 'Agave' }
                ];
                return mockProducts.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()) ||
                    p.ingredientes.toLowerCase().includes(query.toLowerCase()));
            }
        };
    }
    /**
     * Inicializa el contenedor y expone los casos de uso globalmente
     */
    static initialize() {
        const container = HexagonalContainer.getInstance();
        // Exponer casos de uso globalmente para compatibilidad con el sistema existente
        if (typeof window !== 'undefined') {
            window.HexagonalContainer = container;
            window.CreateOrderUseCase = container.resolve('CreateOrderUseCase');
            window.ValidateProductUseCase = container.resolve('ValidateProductUseCase');
            window.AddProductToOrderUseCase = container.resolve('AddProductToOrderUseCase');
            window.ValidateOrderUseCase = container.resolve('ValidateOrderUseCase');
        }
        return container;
    }
    /**
     * Método de utilidad para obtener casos de uso específicos
     */
    getCreateOrderUseCase() {
        return this.resolve('CreateOrderUseCase');
    }
    getValidateProductUseCase() {
        return this.resolve('ValidateProductUseCase');
    }
    getAddProductToOrderUseCase() {
        return this.resolve('AddProductToOrderUseCase');
    }
    getValidateOrderUseCase() {
        return this.resolve('ValidateOrderUseCase');
    }
    getOrderRepository() {
        return this.resolve('OrderRepositoryPort');
    }
    getProductRepository() {
        return this.resolve('ProductRepositoryPort');
    }
    getDrinkRulesService() {
        return this.resolve('DrinkRulesPort');
    }
    getEventBus() {
        return this.resolve('EventBusPort');
    }
}
exports.HexagonalContainer = HexagonalContainer;
// Inicializar el contenedor automáticamente
if (typeof window !== 'undefined') {
    HexagonalContainer.initialize();
}
