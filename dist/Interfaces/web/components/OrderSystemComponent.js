/**
 * OrderSystemComponent - Componente principal del sistema de órdenes
 * Fase 4: UI + CSS Final
 *
 * Responsabilidades:
 * - Inicializar y coordinar el sistema de órdenes
 * - Integrar controladores, presenters y event handlers
 * - Manejar el ciclo de vida del componente
 */
import { OrderPresenter } from '../presenters/OrderPresenter';
import { EventHandler } from '../events/EventHandler';
import { ProductPresenter } from '../presenters/ProductPresenter';
export class OrderSystemComponent {
    constructor(orderController, orderPresenter, productController, productPresenter, config = {}) {
        this.isInitialized = false;
        this.container = null;
        this.orderController = orderController;
        this.orderPresenter = orderPresenter;
        this.productController = productController;
        this.productPresenter = productPresenter;
        this.config = {
            autoStart: true,
            enableLogging: true,
            containerSelector: 'main',
            ...config
        };
        // Crear event handler con dependencias
        this.eventHandler = new EventHandler({
            orderController: this.orderController,
            productController: this.productController,
            productPresenter: this.productPresenter
        });
        this.log('OrderSystemComponent creado');
    }
    /**
     * Inicializar el componente
     */
    async initialize() {
        if (this.isInitialized) {
            this.log('Componente ya está inicializado');
            return;
        }
        this.log('Inicializando OrderSystemComponent');
        try {
            // Encontrar o crear contenedor
            await this.setupContainer();
            // Inicializar event handlers
            this.eventHandler.initialize();
            // Cargar datos iniciales
            await this.loadInitialData();
            // Auto-start si está configurado
            if (this.config.autoStart) {
                await this.start();
            }
            this.isInitialized = true;
            this.log('OrderSystemComponent inicializado exitosamente');
        }
        catch (error) {
            console.error('[OrderSystemComponent] Error durante inicialización:', error);
            throw error;
        }
    }
    /**
     * Configurar contenedor principal
     */
    async setupContainer() {
        this.container = document.querySelector(this.config.containerSelector);
        if (!this.container) {
            throw new Error(`No se encontró contenedor: ${this.config.containerSelector}`);
        }
        // Agregar clases CSS para el sistema
        this.container.classList.add('order-system-container');
        // Crear estructura básica si no existe
        if (!this.container.querySelector('.order-system')) {
            await this.createBasicStructure();
        }
    }
    /**
     * Crear estructura básica del DOM
     */
    async createBasicStructure() {
        if (!this.container)
            return;
        const structure = document.createElement('div');
        structure.className = 'order-system-layout';
        structure.innerHTML = `
      <div class="order-system-layout__header">
        <h1 class="order-system-layout__title">Sistema de Órdenes</h1>
        <div class="order-system-layout__status"></div>
      </div>
      
      <div class="order-system-layout__content">
        <aside class="order-system-layout__sidebar">
          <!-- Filtros de productos se insertan aquí -->
        </aside>
        
        <main class="order-system-layout__main">
          <!-- Grid de productos se inserta aquí -->
        </main>
        
        <aside class="order-system-layout__order">
          <!-- Sistema de órdenes se inserta aquí -->
        </aside>
      </div>
      
      <div class="order-system-layout__footer">
        <!-- Mensajes de error se insertan aquí -->
      </div>
    `;
        this.container.appendChild(structure);
        this.log('Estructura básica creada');
    }
    /**
     * Cargar datos iniciales
     */
    async loadInitialData() {
        this.log('Cargando datos iniciales');
        try {
            // Cargar productos y categorías
            await Promise.all([
                this.productController.getAllProducts(),
                this.productController.getAvailableCategories()
            ]);
            // Obtener estado actual de orden
            await this.orderController.getCurrentOrderStatus();
            this.log('Datos iniciales cargados');
        }
        catch (error) {
            console.error('[OrderSystemComponent] Error cargando datos iniciales:', error);
            // No lanzar error para permitir que el componente funcione sin datos
        }
    }
    /**
     * Iniciar el sistema
     */
    async start() {
        this.log('Iniciando sistema de órdenes');
        try {
            // Crear orden inicial si no existe
            await this.ensureActiveOrder();
            // Mostrar interfaz
            this.showInterface();
            this.log('Sistema de órdenes iniciado');
        }
        catch (error) {
            console.error('[OrderSystemComponent] Error iniciando sistema:', error);
            throw error;
        }
    }
    /**
     * Asegurar que existe una orden activa
     */
    async ensureActiveOrder() {
        try {
            const statusResult = await this.orderController.getCurrentOrderStatus();
            if (!statusResult.success || !statusResult.data?.orderId) {
                this.log('No hay orden activa, creando nueva orden');
                await this.orderController.createOrder();
            }
            else {
                this.log('Orden activa encontrada:', statusResult.data.orderId);
            }
        }
        catch (error) {
            this.log('Error verificando orden activa, creando nueva:', error);
            await this.orderController.createOrder();
        }
    }
    /**
     * Mostrar interfaz
     */
    showInterface() {
        if (!this.container)
            return;
        const layout = this.container.querySelector('.order-system-layout');
        if (layout) {
            layout.classList.add('order-system-layout--active');
        }
        // Agregar indicador de estado
        this.updateSystemStatus('Sistema activo');
    }
    /**
     * Actualizar estado del sistema
     */
    updateSystemStatus(status) {
        const statusElement = this.container?.querySelector('.order-system-layout__status');
        if (statusElement) {
            statusElement.innerHTML = `
        <div class="system-status system-status--active">
          <div class="system-status__indicator"></div>
          <span class="system-status__text">${status}</span>
        </div>
      `;
        }
    }
    /**
     * Pausar el sistema
     */
    pause() {
        this.log('Pausando sistema');
        this.updateSystemStatus('Sistema pausado');
        const layout = this.container?.querySelector('.order-system-layout');
        if (layout) {
            layout.classList.add('order-system-layout--paused');
        }
    }
    /**
     * Reanudar el sistema
     */
    resume() {
        this.log('Reanudando sistema');
        this.updateSystemStatus('Sistema activo');
        const layout = this.container?.querySelector('.order-system-layout');
        if (layout) {
            layout.classList.remove('order-system-layout--paused');
        }
    }
    /**
     * Detener el sistema
     */
    stop() {
        this.log('Deteniendo sistema');
        this.updateSystemStatus('Sistema detenido');
        const layout = this.container?.querySelector('.order-system-layout');
        if (layout) {
            layout.classList.remove('order-system-layout--active');
            layout.classList.add('order-system-layout--stopped');
        }
    }
    /**
     * Reiniciar el sistema
     */
    async restart() {
        this.log('Reiniciando sistema');
        this.stop();
        // Esperar un momento antes de reiniciar
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.start();
    }
    /**
     * Destruir el componente
     */
    destroy() {
        this.log('Destruyendo OrderSystemComponent');
        // Destruir event handlers
        this.eventHandler.destroy();
        // Limpiar DOM
        const layout = this.container?.querySelector('.order-system-layout');
        if (layout) {
            layout.remove();
        }
        // Remover clases del contenedor
        if (this.container) {
            this.container.classList.remove('order-system-container');
        }
        this.isInitialized = false;
        this.log('OrderSystemComponent destruido');
    }
    /**
     * Obtener estado del componente
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            hasActiveOrder: this.container?.querySelector('.order-system') !== null,
            container: this.container
        };
    }
    /**
     * Configurar opciones
     */
    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('Configuración actualizada:', this.config);
    }
    /**
     * Obtener referencia a controladores
     */
    getControllers() {
        return {
            order: this.orderController,
            product: this.productController
        };
    }
    /**
     * Obtener referencia a presenters
     */
    getPresenters() {
        return {
            order: this.orderPresenter,
            product: this.productPresenter
        };
    }
    /**
     * Obtener referencia al event handler
     */
    getEventHandler() {
        return this.eventHandler;
    }
    /**
     * Logging condicional
     */
    log(message, ...args) {
        if (this.config.enableLogging) {
            console.log(`[OrderSystemComponent] ${message}`, ...args);
        }
    }
    /**
     * Manejar errores del sistema
     */
    handleSystemError(error, context) {
        console.error(`[OrderSystemComponent] Error en ${context}:`, error);
        this.updateSystemStatus(`Error: ${error.message}`);
        // Mostrar error en UI
        const errorContainer = this.container?.querySelector('.order-system-layout__footer');
        if (errorContainer) {
            errorContainer.innerHTML = `
        <div class="system-error">
          <div class="system-error__icon">⚠️</div>
          <div class="system-error__message">
            <strong>Error del Sistema:</strong> ${error.message}
          </div>
          <button class="system-error__retry btn btn--primary" data-action="retry-system">
            Reintentar
          </button>
        </div>
      `;
        }
    }
    /**
     * Método estático para crear instancia con dependencias inyectadas
     */
    static async createWithDependencies(container, // HexagonalContainer
    config = {}) {
        try {
            // Resolver dependencias del contenedor
            const orderController = container.resolve('OrderController');
            const orderPresenter = new OrderPresenter();
            const productController = container.resolve('ProductController');
            const productPresenter = new ProductPresenter();
            const component = new OrderSystemComponent(orderController, orderPresenter, productController, productPresenter, config);
            await component.initialize();
            return component;
        }
        catch (error) {
            console.error('[OrderSystemComponent] Error creando componente:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=OrderSystemComponent.js.map