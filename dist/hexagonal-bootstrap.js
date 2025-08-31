"use strict";
/**
 * Bootstrap para la arquitectura hexagonal
 * Este archivo inicializa y conecta la nueva arquitectura con el sistema existente
 */
// Implementación temporal del HexagonalContainer en JavaScript
class HexagonalContainer {
    constructor() {
        this.dependencies = new Map();
        this.singletons = new Map();
        this.registerDependencies();
    }
    static getInstance() {
        if (!HexagonalContainer.instance) {
            HexagonalContainer.instance = new HexagonalContainer();
        }
        return HexagonalContainer.instance;
    }
    registerDependencies() {
        // Registrar adaptadores básicos para prueba
        this.registerSingleton('OrderRepositoryPort', () => {
            return {
                getCurrentOrder: async () => null,
                createOrder: async () => ({ id: 'test-order', items: [], total: 0 }),
                save: async (order) => order,
                findById: async (id) => null,
                findAll: async () => [],
                delete: async (id) => true,
                completeOrder: async (id) => true,
                cancelOrder: async (id) => true,
                clearCurrentOrder: async () => true
            };
        });
        this.registerSingleton('ProductRepositoryPort', () => {
            return {
                findByName: async (name) => null,
                findByCategory: async (category) => [],
                findAll: async () => [],
                search: async (query) => [],
                exists: async (productId) => false,
                getDrinkOptions: async (product) => []
            };
        });
        this.registerSingleton('DrinkRulesPort', () => {
            return {
                getAvailableOptions: async (product) => ({ available: [], isAvailable: () => false, isValid: () => true }),
                validateSelection: async (product, selection) => ({ success: true, errors: [], warnings: [] }),
                getDrinkLimits: (product) => ({ min: 0, max: 1 }),
                requiresDrinkSelection: (product) => false,
                allowsMultipleDrinks: (product) => false,
                getLiquorRules: (liquorType) => ({ allowedDrinks: [], maxDrinks: 1, specialRules: [] }),
                validateDrinkCompatibility: async (drinks) => ({ success: true, errors: [], warnings: [] })
            };
        });
        // Registrar casos de uso básicos
        this.registerTransient('CreateOrderUseCase', () => {
            return {
                getCurrentOrder: async () => null,
                createOrder: async () => ({ id: 'test-order', items: [], total: 0 }),
                addOrderItem: async (data) => ({ success: true, item: data }),
                removeOrderItem: async (itemId) => true,
                updateOrderItem: async (itemId, data) => ({ success: true, item: data }),
                completeCurrentOrder: async () => true,
                cancelCurrentOrder: async () => true,
                clearCurrentOrder: async () => true,
                getOrderSummary: async () => ({ total: { toNumber: () => 0 }, itemCount: 0, items: [] })
            };
        });
        this.registerTransient('ValidateProductUseCase', () => {
            return {
                validateProduct: async (data) => ({ isValid: true, errors: [], warnings: [] }),
                getProductInfo: async (name) => null,
                getDrinkOptions: async (product) => [],
                checkProductExists: async (name) => false
            };
        });
    }
    registerSingleton(key, factory) {
        this.dependencies.set(key, { factory, isSingleton: true });
    }
    registerTransient(key, factory) {
        this.dependencies.set(key, { factory, isSingleton: false });
    }
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
    isRegistered(key) {
        return this.dependencies.has(key);
    }
    getRegisteredKeys() {
        return Array.from(this.dependencies.keys());
    }
    clearSingletons() {
        this.singletons.clear();
    }
    replace(key, factory, isSingleton = true) {
        this.dependencies.set(key, { factory, isSingleton });
        if (isSingleton && this.singletons.has(key)) {
            this.singletons.delete(key);
        }
    }
    getCreateOrderUseCase() {
        return this.resolve('CreateOrderUseCase');
    }
    getValidateProductUseCase() {
        return this.resolve('ValidateProductUseCase');
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
    static initialize() {
        const container = HexagonalContainer.getInstance();
        // Exponer casos de uso globalmente para compatibilidad con el sistema existente
        if (typeof window !== 'undefined') {
            window.HexagonalContainer = container;
            window.CreateOrderUseCase = container.resolve('CreateOrderUseCase');
            window.ValidateProductUseCase = container.resolve('ValidateProductUseCase');
        }
        return container;
    }
}
/**
 * Clase principal para inicializar la arquitectura hexagonal
 */
class HexagonalBootstrap {
    constructor() {
        this.container = null;
        this.isInitialized = false;
    }
    /**
     * Inicializa la arquitectura hexagonal
     */
    async initialize() {
        try {
            console.log('🏗️ Inicializando arquitectura hexagonal...');
            // Inicializar el contenedor de dependencias
            this.container = HexagonalContainer.initialize();
            // Conectar con el sistema existente
            await this.connectWithExistingSystem();
            // Exponer la API hexagonal
            this.exposeHexagonalAPI();
            this.isInitialized = true;
            console.log('✅ Arquitectura hexagonal inicializada correctamente');
            return this.container;
        }
        catch (error) {
            console.error('❌ Error inicializando arquitectura hexagonal:', error);
            throw error;
        }
    }
    /**
     * Conecta la nueva arquitectura con el sistema existente
     */
    async connectWithExistingSystem() {
        try {
            // Verificar que los servicios existentes estén disponibles
            this.checkExistingServices();
            // Migrar datos existentes si es necesario
            await this.migrateExistingData();
            // Configurar compatibilidad hacia atrás
            this.setupBackwardCompatibility();
            console.log('🔗 Conexión con sistema existente establecida');
        }
        catch (error) {
            console.warn('⚠️ Advertencia al conectar con sistema existente:', error);
            // No fallar la inicialización por problemas de compatibilidad
        }
    }
    /**
     * Verifica que los servicios existentes estén disponibles
     */
    checkExistingServices() {
        const services = {
            'OrderSystemCore': window.OrderSystemCore
        };
        Object.entries(services).forEach(([name, service]) => {
            if (service) {
                console.log(`✅ Servicio existente encontrado: ${name}`);
            }
            else {
                console.warn(`⚠️ Servicio existente no encontrado: ${name}`);
            }
        });
        // Servicios opcionales - solo log si existen
        const optionalServices = {
            'ProductDataAdapter': window.ProductDataAdapter,
            'OrderSystemValidations': window.OrderSystemValidations
        };
        Object.entries(optionalServices).forEach(([name, service]) => {
            if (service) {
                console.log(`✅ Servicio opcional encontrado: ${name}`);
            }
        });
    }
    /**
     * Migra datos existentes del OrderSystemCore si existe
     */
    async migrateExistingData() {
        if (window.OrderSystemCore && typeof window.OrderSystemCore.prototype !== 'undefined') {
            try {
                // OrderSystemCore is a class, not an instance, so we skip migration
                console.log('⚠️ OrderSystemCore es una clase, no una instancia. Saltando migración de datos.');
                return;
            }
            catch (error) {
                console.warn('⚠️ Error durante migración de datos:', error);
            }
        }
        else if (window.orderSystemCore && typeof window.orderSystemCore.getItems === 'function') {
            try {
                const existingItems = window.orderSystemCore.getItems();
                if (existingItems && existingItems.length > 0) {
                    console.log(`🔄 Migrando ${existingItems.length} items existentes...`);
                    const createOrderUseCase = this.container.getCreateOrderUseCase();
                    // Migrar cada item existente
                    for (const item of existingItems) {
                        try {
                            await this.migrateOrderItem(createOrderUseCase, item);
                        }
                        catch (error) {
                            console.warn('⚠️ Error migrando item:', item, error);
                        }
                    }
                    console.log('✅ Migración de datos completada');
                }
            }
            catch (error) {
                console.warn('⚠️ Error durante migración de datos:', error);
            }
        }
    }
    /**
     * Migra un item individual del sistema existente
     */
    async migrateOrderItem(createOrderUseCase, item) {
        // Extraer datos del item existente
        const productName = item.nombre || item.name || 'Producto Desconocido';
        const quantity = item.cantidad || item.quantity || 1;
        const selectedDrinks = item.bebidas || item.drinks || [];
        const cookingTerm = item.terminoCoccion || item.cookingTerm || '';
        const specialRequests = item.solicitudesEspeciales || item.specialRequests || '';
        // Crear el item en el nuevo sistema
        await createOrderUseCase.addOrderItem({
            productName,
            quantity,
            customizations: {
                drinks: selectedDrinks,
                cookingTerm,
                specialRequests
            }
        });
    }
    /**
     * Configura compatibilidad hacia atrás con el sistema existente
     */
    setupBackwardCompatibility() {
        const createOrderUseCase = this.container.getCreateOrderUseCase();
        const validateProductUseCase = this.container.getValidateProductUseCase();
        // Crear un wrapper que mantenga la API existente del OrderSystemCore
        const hexagonalOrderCore = {
            // Métodos compatibles con OrderSystemCore
            addItem: async (productData) => {
                try {
                    const result = await createOrderUseCase.addOrderItem({
                        productName: productData.nombre || productData.name,
                        quantity: productData.cantidad || productData.quantity || 1,
                        customizations: {
                            drinks: productData.bebidas || productData.drinks || [],
                            cookingTerm: productData.terminoCoccion || productData.cookingTerm || '',
                            specialRequests: productData.solicitudesEspeciales || productData.specialRequests || ''
                        }
                    });
                    return result;
                }
                catch (error) {
                    console.error('Error adding item through hexagonal architecture:', error);
                    throw error;
                }
            },
            removeItem: async (itemId) => {
                try {
                    return await createOrderUseCase.removeOrderItem(itemId);
                }
                catch (error) {
                    console.error('Error removing item through hexagonal architecture:', error);
                    throw error;
                }
            },
            getItems: async () => {
                try {
                    const order = await createOrderUseCase.getCurrentOrder();
                    return order ? order.items : [];
                }
                catch (error) {
                    console.error('Error getting items through hexagonal architecture:', error);
                    return [];
                }
            },
            getTotal: async () => {
                try {
                    const summary = await createOrderUseCase.getOrderSummary();
                    return summary.total.toNumber();
                }
                catch (error) {
                    console.error('Error getting total through hexagonal architecture:', error);
                    return 0;
                }
            },
            clear: async () => {
                try {
                    return await createOrderUseCase.clearCurrentOrder();
                }
                catch (error) {
                    console.error('Error clearing order through hexagonal architecture:', error);
                    throw error;
                }
            },
            validateProduct: async (productData) => {
                try {
                    return await validateProductUseCase.validateProduct({
                        name: productData.nombre || productData.name,
                        quantity: productData.cantidad || productData.quantity || 1,
                        selectedDrinks: productData.bebidas || productData.drinks || [],
                        cookingTerm: productData.terminoCoccion || productData.cookingTerm || ''
                    });
                }
                catch (error) {
                    console.error('Error validating product through hexagonal architecture:', error);
                    throw error;
                }
            }
        };
        // Exponer el wrapper para compatibilidad
        window.HexagonalOrderCore = hexagonalOrderCore;
        console.log('🔄 Compatibilidad hacia atrás configurada');
    }
    /**
     * Expone la API hexagonal para uso directo
     */
    exposeHexagonalAPI() {
        // Exponer casos de uso principales
        window.HexagonalAPI = {
            container: this.container,
            useCases: {
                createOrder: this.container.getCreateOrderUseCase(),
                validateProduct: this.container.getValidateProductUseCase()
            },
            repositories: {
                orders: this.container.getOrderRepository(),
                products: this.container.getProductRepository()
            },
            services: {
                drinkRules: this.container.getDrinkRulesService()
            }
        };
        console.log('🌐 API hexagonal expuesta globalmente');
    }
    /**
     * Obtiene el estado de inicialización
     */
    isReady() {
        return this.isInitialized;
    }
    /**
     * Obtiene el contenedor de dependencias
     */
    getContainer() {
        return this.container;
    }
    /**
     * Método de utilidad para debugging
     */
    getDebugInfo() {
        if (!this.isInitialized) {
            return { status: 'not_initialized' };
        }
        return {
            status: 'initialized',
            registeredDependencies: this.container.getRegisteredKeys(),
            availableServices: {
                OrderSystemCore: !!window.OrderSystemCore,
                ProductDataAdapter: !!window.ProductDataAdapter,
                OrderSystemValidations: !!window.OrderSystemValidations,
                HexagonalAPI: !!window.HexagonalAPI,
                HexagonalOrderCore: !!window.HexagonalOrderCore
            }
        };
    }
}
// Crear instancia global del bootstrap
const hexagonalBootstrap = new HexagonalBootstrap();
// Exponer globalmente para debugging
window.HexagonalBootstrap = hexagonalBootstrap;
// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        hexagonalBootstrap.initialize().catch(error => {
            console.error('Error durante auto-inicialización:', error);
        });
    });
}
else {
    // DOM ya está listo
    hexagonalBootstrap.initialize().catch(error => {
        console.error('Error durante inicialización:', error);
    });
}
// Disponible globalmente como window.HexagonalBootstrap
// No se requiere export ya que se usa como script regular
//# sourceMappingURL=hexagonal-bootstrap.js.map