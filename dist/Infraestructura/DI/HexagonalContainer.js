import { CreateOrderUseCase } from '../../Aplicacion/UseCases/CreateOrderUseCase.js';
import { ValidateProductUseCase } from '../../Aplicacion/UseCases/ValidateProductUseCase.js';
import { AddProductToOrderUseCase } from '../../Aplicacion/UseCases/AddProductToOrderUseCase.js';
import { ValidateOrderUseCase } from '../../Aplicacion/UseCases/ValidateOrderUseCase.js';
import { InMemoryOrderRepository } from '../adapters/InMemoryOrderRepository.js';
import { SupabaseAdapterTS } from '../adapters/SupabaseAdapterTS.js';
import { DrinkRulesServiceAdapter } from '../adapters/DrinkRulesServiceAdapter.js';
import BaseAdapter from '../adapters/BaseAdapter.js';
import ProductDataAdapter from '../adapters/ProductDataAdapter.js';
import AIInterface from '../integrations/AIInterface.js';
/**
 * Contenedor de inyección de dependencias para la arquitectura hexagonal
 * Gestiona la creación e inyección de todas las dependencias del sistema
 */
export class HexagonalContainer {
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
            return new InMemoryOrderRepository();
        });
        this.registerSingleton('ProductRepositoryPort', () => {
            // Usar el nuevo SupabaseAdapterTS como adaptador principal
            return new SupabaseAdapterTS();
        });
        this.registerSingleton('DrinkRulesPort', () => {
            // Obtener el servicio de validación existente si está disponible
            const validationService = this.getExistingValidationService();
            return new DrinkRulesServiceAdapter(validationService);
        });
        // Registrar EventBus (implementación simple en memoria)
        this.registerSingleton('EventBusPort', () => {
            return this.createInMemoryEventBus();
        });
        // Registrar adaptadores adicionales para completar Fase 3
        this.registerSingleton('BaseAdapter', () => {
            return new BaseAdapter();
        });
        this.registerSingleton('ProductDataAdapter', () => {
            return new ProductDataAdapter();
        });
        this.registerSingleton('AIInterface', () => {
            return new AIInterface();
        });
        // Registrar casos de uso
        this.registerTransient('CreateOrderUseCase', () => {
            return new CreateOrderUseCase(this.resolve('OrderRepositoryPort'), this.resolve('ProductRepositoryPort'), this.resolve('DrinkRulesPort'), this.resolve('EventBusPort'));
        });
        this.registerTransient('ValidateProductUseCase', () => {
            return new ValidateProductUseCase(this.resolve('ProductRepositoryPort'), this.resolve('DrinkRulesPort'));
        });
        this.registerTransient('AddProductToOrderUseCase', () => {
            return new AddProductToOrderUseCase(this.resolve('OrderRepositoryPort'), this.resolve('ProductRepositoryPort'), this.resolve('DrinkRulesPort'), this.resolve('EventBusPort'));
        });
        this.registerTransient('ValidateOrderUseCase', () => {
            return new ValidateOrderUseCase(this.resolve('OrderRepositoryPort'), this.resolve('DrinkRulesPort'), this.resolve('EventBusPort'));
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
// Inicializar el contenedor automáticamente
if (typeof window !== 'undefined') {
    HexagonalContainer.initialize();
}
