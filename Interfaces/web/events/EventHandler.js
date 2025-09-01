"use strict";
/**
 * EventHandler - Sistema de manejo de eventos desacoplado
 * Fase 4: UI + CSS Final
 *
 * Responsabilidades:
 * - Event delegation usando data attributes
 * - Desacoplar eventos de controladores
 * - Manejar eventos del DOM de forma centralizada
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
class EventHandler {
    constructor(dependencies) {
        this.isInitialized = false;
        /**
         * Debounce para búsqueda
         */
        this.searchTimeout = null;
        this.orderController = dependencies.orderController;
        this.productController = dependencies.productController;
        this.productPresenter = dependencies.productPresenter;
    }
    /**
     * Inicializar event listeners
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('[EventHandler] Ya está inicializado');
            return;
        }
        console.log('[EventHandler] Inicializando event handlers');
        this.setupEventDelegation();
        this.setupKeyboardEvents();
        this.setupFormEvents();
        this.isInitialized = true;
        console.log('[EventHandler] Event handlers inicializados');
    }
    /**
     * Configurar event delegation principal
     */
    setupEventDelegation() {
        // Event delegation en el documento para capturar todos los clicks
        document.addEventListener('click', this.handleClick.bind(this));
        // Event delegation para inputs y cambios
        document.addEventListener('change', this.handleChange.bind(this));
        // Event delegation para inputs de texto
        document.addEventListener('input', this.handleInput.bind(this));
    }
    /**
     * Manejar eventos de click usando data attributes
     */
    async handleClick(event) {
        const target = event.target;
        if (!target)
            return;
        // Buscar el elemento con data-action más cercano
        const actionElement = target.closest('[data-action]');
        if (!actionElement)
            return;
        const action = actionElement.getAttribute('data-action');
        if (!action)
            return;
        console.log('[EventHandler] Manejando acción:', action);
        // Prevenir comportamiento por defecto para botones
        if (actionElement.tagName === 'BUTTON') {
            event.preventDefault();
        }
        try {
            await this.executeAction(action, actionElement, event);
        }
        catch (error) {
            console.error('[EventHandler] Error ejecutando acción:', action, error);
            this.handleActionError(action, error);
        }
    }
    /**
     * Ejecutar acción basada en data-action
     */
    async executeAction(action, element, event) {
        switch (action) {
            // Acciones de orden
            case 'create-order':
                await this.handleCreateOrder(element);
                break;
            case 'add-product':
                await this.handleAddProduct(element);
                break;
            case 'add-product-with-options':
                await this.handleAddProductWithOptions(element);
                break;
            case 'remove-item':
                await this.handleRemoveItem(element);
                break;
            case 'validate-order':
                await this.handleValidateOrder(element);
                break;
            case 'complete-order':
                await this.handleCompleteOrder(element);
                break;
            // Acciones de productos
            case 'view-product':
                await this.handleViewProduct(element);
                break;
            case 'toggle-view':
                this.handleToggleView(element);
                break;
            case 'clear-filters':
                await this.handleClearFilters(element);
                break;
            // Acciones de UI
            case 'close-modal':
                this.handleCloseModal(element);
                break;
            case 'close-error':
                this.handleCloseError(element);
                break;
            case 'increase-quantity':
                this.handleIncreaseQuantity(element);
                break;
            case 'decrease-quantity':
                this.handleDecreaseQuantity(element);
                break;
            default:
                console.warn('[EventHandler] Acción no reconocida:', action);
        }
    }
    /**
     * Manejar cambios en inputs (radio, checkbox, select)
     */
    async handleChange(event) {
        const target = event.target;
        if (!target)
            return;
        const filter = target.getAttribute('data-filter');
        if (!filter)
            return;
        console.log('[EventHandler] Manejando filtro:', filter, target.value);
        try {
            await this.handleFilterChange(filter, target.value, target);
        }
        catch (error) {
            console.error('[EventHandler] Error aplicando filtro:', filter, error);
        }
    }
    /**
     * Manejar input de texto (búsqueda)
     */
    async handleInput(event) {
        const target = event.target;
        if (!target)
            return;
        const filter = target.getAttribute('data-filter');
        if (filter === 'search') {
            // Debounce para búsqueda
            this.debounceSearch(target.value);
        }
    }
    debounceSearch(searchTerm) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = window.setTimeout(async () => {
            console.log('[EventHandler] Ejecutando búsqueda:', searchTerm);
            try {
                if (searchTerm.trim()) {
                    await this.productController.searchProducts(searchTerm.trim());
                }
                else {
                    await this.productController.getAllProducts();
                }
            }
            catch (error) {
                console.error('[EventHandler] Error en búsqueda:', error);
            }
        }, 300);
    }
    // === HANDLERS DE ORDEN ===
    async handleCreateOrder(element) {
        console.log('[EventHandler] Creando nueva orden');
        // Deshabilitar botón temporalmente
        this.setButtonLoading(element, true);
        try {
            await this.orderController.createOrder();
        }
        finally {
            this.setButtonLoading(element, false);
        }
    }
    async handleAddProduct(element) {
        const productId = element.getAttribute('data-product-id');
        if (!productId) {
            console.error('[EventHandler] No se encontró product-id');
            return;
        }
        console.log('[EventHandler] Agregando producto:', productId);
        this.setButtonLoading(element, true);
        try {
            await this.orderController.addProduct({ productId });
        }
        finally {
            this.setButtonLoading(element, false);
        }
    }
    async handleAddProductWithOptions(element) {
        const productId = element.getAttribute('data-product-id');
        if (!productId)
            return;
        // Obtener opciones seleccionadas del modal
        const modal = element.closest('.product-modal');
        if (!modal)
            return;
        const selectedOptions = [];
        const optionInputs = modal.querySelectorAll('.product-detail__option-input:checked');
        optionInputs.forEach(input => selectedOptions.push(input.value));
        const quantityInput = modal.querySelector('.product-detail__quantity-input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        console.log('[EventHandler] Agregando producto con opciones:', { productId, selectedOptions, quantity });
        this.setButtonLoading(element, true);
        try {
            await this.orderController.addProduct({
                productId,
                drinkOptions: selectedOptions,
                quantity
            });
            // Cerrar modal después de agregar
            this.productPresenter.closeProductModal();
        }
        finally {
            this.setButtonLoading(element, false);
        }
    }
    async handleRemoveItem(element) {
        const itemId = element.getAttribute('data-item-id');
        if (!itemId)
            return;
        console.log('[EventHandler] Removiendo item:', itemId);
        // TODO: Implementar RemoveItemUseCase
        const itemElement = element.closest('.order-item');
        if (itemElement) {
            itemElement.remove();
        }
    }
    async handleValidateOrder(element) {
        console.log('[EventHandler] Validando orden');
        this.setButtonLoading(element, true);
        try {
            await this.orderController.validateOrder();
        }
        finally {
            this.setButtonLoading(element, false);
        }
    }
    async handleCompleteOrder(element) {
        console.log('[EventHandler] Completando orden');
        this.setButtonLoading(element, true);
        try {
            await this.orderController.completeOrder();
        }
        finally {
            this.setButtonLoading(element, false);
        }
    }
    // === HANDLERS DE PRODUCTOS ===
    async handleViewProduct(element) {
        const productId = element.getAttribute('data-product-id');
        if (!productId)
            return;
        console.log('[EventHandler] Viendo producto:', productId);
        try {
            await this.productController.getProductById(productId);
        }
        catch (error) {
            console.error('[EventHandler] Error viendo producto:', error);
        }
    }
    handleToggleView(element) {
        const productGrid = document.querySelector('.product-grid__items');
        if (!productGrid)
            return;
        productGrid.classList.toggle('product-grid__items--list');
        const isListView = productGrid.classList.contains('product-grid__items--list');
        element.textContent = isListView ? 'Vista Grid' : 'Vista Lista';
    }
    async handleClearFilters(element) {
        console.log('[EventHandler] Limpiando filtros');
        // Limpiar inputs de filtro
        const filterInputs = document.querySelectorAll('[data-filter]');
        filterInputs.forEach(input => {
            if (input.type === 'text' || input.type === 'number') {
                input.value = '';
            }
            else if (input.type === 'radio') {
                input.checked = input.value === '';
            }
            else if (input.type === 'checkbox') {
                input.checked = false;
            }
        });
        // Mostrar todos los productos
        try {
            await this.productController.getAllProducts();
        }
        catch (error) {
            console.error('[EventHandler] Error limpiando filtros:', error);
        }
    }
    // === HANDLERS DE FILTROS ===
    async handleFilterChange(filter, value, element) {
        switch (filter) {
            case 'category':
                if (value) {
                    await this.productController.getProductsByCategory(value);
                }
                else {
                    await this.productController.getAllProducts();
                }
                break;
            case 'price-min':
            case 'price-max':
                await this.handlePriceRangeChange();
                break;
        }
    }
    async handlePriceRangeChange() {
        const minInput = document.querySelector('[data-filter="price-min"]');
        const maxInput = document.querySelector('[data-filter="price-max"]');
        const min = minInput?.value ? parseFloat(minInput.value) : 0;
        const max = maxInput?.value ? parseFloat(maxInput.value) : Infinity;
        if (min > 0 || max < Infinity) {
            await this.productController.filterProducts({
                priceRange: { min, max }
            });
        }
        else {
            await this.productController.getAllProducts();
        }
    }
    // === HANDLERS DE UI ===
    handleCloseModal(element) {
        this.productPresenter.closeProductModal();
    }
    handleCloseError(element) {
        const errorMessage = element.closest('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    handleIncreaseQuantity(element) {
        const quantityInput = element.parentElement?.querySelector('.product-detail__quantity-input');
        if (quantityInput) {
            const currentValue = parseInt(quantityInput.value) || 1;
            const maxValue = parseInt(quantityInput.getAttribute('max') || '10');
            if (currentValue < maxValue) {
                quantityInput.value = (currentValue + 1).toString();
            }
        }
    }
    handleDecreaseQuantity(element) {
        const quantityInput = element.parentElement?.querySelector('.product-detail__quantity-input');
        if (quantityInput) {
            const currentValue = parseInt(quantityInput.value) || 1;
            const minValue = parseInt(quantityInput.getAttribute('min') || '1');
            if (currentValue > minValue) {
                quantityInput.value = (currentValue - 1).toString();
            }
        }
    }
    // === UTILIDADES ===
    setButtonLoading(button, loading) {
        const btn = button;
        if (loading) {
            btn.disabled = true;
            btn.classList.add('btn--loading');
            btn.setAttribute('data-original-text', btn.textContent || '');
            btn.textContent = 'Cargando...';
        }
        else {
            btn.disabled = false;
            btn.classList.remove('btn--loading');
            const originalText = btn.getAttribute('data-original-text');
            if (originalText) {
                btn.textContent = originalText;
                btn.removeAttribute('data-original-text');
            }
        }
    }
    handleActionError(action, error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error(`[EventHandler] Error en acción ${action}:`, errorMessage);
        // Mostrar error en UI
        const errorContainer = document.querySelector('.error-messages');
        if (errorContainer) {
            errorContainer.innerHTML = `
        <div class="error-message error-message--action">
          <div class="error-message__icon">❌</div>
          <div class="error-message__content">
            <h4 class="error-message__title">Error en ${action}</h4>
            <p class="error-message__text">${errorMessage}</p>
          </div>
          <button class="error-message__close" data-action="close-error">×</button>
        </div>
      `;
        }
    }
    /**
     * Configurar eventos de teclado
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            // Escape para cerrar modales
            if (event.key === 'Escape') {
                this.productPresenter.closeProductModal();
            }
            // Enter en inputs de búsqueda
            if (event.key === 'Enter') {
                const target = event.target;
                if (target?.getAttribute('data-filter') === 'search') {
                    event.preventDefault();
                    if (this.searchTimeout) {
                        clearTimeout(this.searchTimeout);
                    }
                    this.debounceSearch(target.value);
                }
            }
        });
    }
    /**
     * Configurar eventos de formularios
     */
    setupFormEvents() {
        document.addEventListener('submit', (event) => {
            // Prevenir envío de formularios por defecto
            event.preventDefault();
            console.log('[EventHandler] Formulario interceptado');
        });
    }
    /**
     * Destruir event handlers
     */
    destroy() {
        if (!this.isInitialized)
            return;
        console.log('[EventHandler] Destruyendo event handlers');
        // Remover event listeners
        document.removeEventListener('click', this.handleClick.bind(this));
        document.removeEventListener('change', this.handleChange.bind(this));
        document.removeEventListener('input', this.handleInput.bind(this));
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.isInitialized = false;
    }
}
exports.EventHandler = EventHandler;
