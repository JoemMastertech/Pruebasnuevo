/**
 * OrderSystemComponent - Componente principal del sistema de órdenes
 * Fase 4: UI + CSS Final
 *
 * Responsabilidades:
 * - Inicializar y coordinar el sistema de órdenes
 * - Integrar controladores, presenters y event handlers
 * - Manejar el ciclo de vida del componente
 */
import { OrderController } from '../controllers/OrderController';
import { OrderPresenter } from '../presenters/OrderPresenter';
import { EventHandler } from '../events/EventHandler';
import { ProductController } from '../controllers/ProductController';
import { ProductPresenter } from '../presenters/ProductPresenter';
export interface OrderSystemConfig {
    autoStart?: boolean;
    enableLogging?: boolean;
    containerSelector?: string;
}
export declare class OrderSystemComponent {
    private orderController;
    private orderPresenter;
    private productController;
    private productPresenter;
    private eventHandler;
    private config;
    private isInitialized;
    private container;
    constructor(orderController: OrderController, orderPresenter: OrderPresenter, productController: ProductController, productPresenter: ProductPresenter, config?: OrderSystemConfig);
    /**
     * Inicializar el componente
     */
    initialize(): Promise<void>;
    /**
     * Configurar contenedor principal
     */
    private setupContainer;
    /**
     * Crear estructura básica del DOM
     */
    private createBasicStructure;
    /**
     * Cargar datos iniciales
     */
    private loadInitialData;
    /**
     * Iniciar el sistema
     */
    start(): Promise<void>;
    /**
     * Asegurar que existe una orden activa
     */
    private ensureActiveOrder;
    /**
     * Mostrar interfaz
     */
    private showInterface;
    /**
     * Actualizar estado del sistema
     */
    private updateSystemStatus;
    /**
     * Pausar el sistema
     */
    pause(): void;
    /**
     * Reanudar el sistema
     */
    resume(): void;
    /**
     * Detener el sistema
     */
    stop(): void;
    /**
     * Reiniciar el sistema
     */
    restart(): Promise<void>;
    /**
     * Destruir el componente
     */
    destroy(): void;
    /**
     * Obtener estado del componente
     */
    getStatus(): {
        isInitialized: boolean;
        hasActiveOrder: boolean;
        container: HTMLElement | null;
    };
    /**
     * Configurar opciones
     */
    configure(newConfig: Partial<OrderSystemConfig>): void;
    /**
     * Obtener referencia a controladores
     */
    getControllers(): {
        order: OrderController;
        product: ProductController;
    };
    /**
     * Obtener referencia a presenters
     */
    getPresenters(): {
        order: OrderPresenter;
        product: ProductPresenter;
    };
    /**
     * Obtener referencia al event handler
     */
    getEventHandler(): EventHandler;
    /**
     * Logging condicional
     */
    private log;
    /**
     * Manejar errores del sistema
     */
    private handleSystemError;
    /**
     * Método estático para crear instancia con dependencias inyectadas
     */
    static createWithDependencies(container: any, // HexagonalContainer
    config?: OrderSystemConfig): Promise<OrderSystemComponent>;
}
//# sourceMappingURL=OrderSystemComponent.d.ts.map