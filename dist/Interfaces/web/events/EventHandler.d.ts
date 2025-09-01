/**
 * EventHandler - Sistema de manejo de eventos desacoplado
 * Fase 4: UI + CSS Final
 *
 * Responsabilidades:
 * - Event delegation usando data attributes
 * - Desacoplar eventos de controladores
 * - Manejar eventos del DOM de forma centralizada
 */
import { OrderController } from '../controllers/OrderController';
import { ProductController } from '../controllers/ProductController';
import { ProductPresenter } from '../presenters/ProductPresenter';
export interface EventHandlerDependencies {
    orderController: OrderController;
    productController: ProductController;
    productPresenter: ProductPresenter;
}
export declare class EventHandler {
    private orderController;
    private productController;
    private productPresenter;
    private isInitialized;
    constructor(dependencies: EventHandlerDependencies);
    /**
     * Inicializar event listeners
     */
    initialize(): void;
    /**
     * Configurar event delegation principal
     */
    private setupEventDelegation;
    /**
     * Manejar eventos de click usando data attributes
     */
    private handleClick;
    /**
     * Ejecutar acción basada en data-action
     */
    private executeAction;
    /**
     * Manejar cambios en inputs (radio, checkbox, select)
     */
    private handleChange;
    /**
     * Manejar input de texto (búsqueda)
     */
    private handleInput;
    /**
     * Debounce para búsqueda
     */
    private searchTimeout;
    private debounceSearch;
    private handleCreateOrder;
    private handleAddProduct;
    private handleAddProductWithOptions;
    private handleRemoveItem;
    private handleValidateOrder;
    private handleCompleteOrder;
    private handleViewProduct;
    private handleToggleView;
    private handleClearFilters;
    private handleFilterChange;
    private handlePriceRangeChange;
    private handleCloseModal;
    private handleCloseError;
    private handleIncreaseQuantity;
    private handleDecreaseQuantity;
    private setButtonLoading;
    private handleActionError;
    /**
     * Configurar eventos de teclado
     */
    private setupKeyboardEvents;
    /**
     * Configurar eventos de formularios
     */
    private setupFormEvents;
    /**
     * Destruir event handlers
     */
    destroy(): void;
}
//# sourceMappingURL=EventHandler.d.ts.map