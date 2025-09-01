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

export class EventHandler {
  private orderController: OrderController;
  private productController: ProductController;
  private productPresenter: ProductPresenter;
  private isInitialized = false;

  constructor(dependencies: EventHandlerDependencies) {
    this.orderController = dependencies.orderController;
    this.productController = dependencies.productController;
    this.productPresenter = dependencies.productPresenter;
  }

  /**
   * Inicializar event listeners
   */
  initialize(): void {
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
  private setupEventDelegation(): void {
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
  private async handleClick(event: Event): Promise<void> {
    const target = event.target as HTMLElement;
    if (!target) return;

    // Buscar el elemento con data-action más cercano
    const actionElement = target.closest('[data-action]') as HTMLElement;
    if (!actionElement) return;

    const action = actionElement.getAttribute('data-action');
    if (!action) return;

    console.log('[EventHandler] Manejando acción:', action);

    // Prevenir comportamiento por defecto para botones
    if (actionElement.tagName === 'BUTTON') {
      event.preventDefault();
    }

    try {
      await this.executeAction(action, actionElement, event);
    } catch (error) {
      console.error('[EventHandler] Error ejecutando acción:', action, error);
      this.handleActionError(action, error);
    }
  }

  /**
   * Ejecutar acción basada en data-action
   */
  private async executeAction(action: string, element: HTMLElement, event: Event): Promise<void> {
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
  private async handleChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    const filter = target.getAttribute('data-filter');
    if (!filter) return;

    console.log('[EventHandler] Manejando filtro:', filter, target.value);

    try {
      await this.handleFilterChange(filter, target.value, target);
    } catch (error) {
      console.error('[EventHandler] Error aplicando filtro:', filter, error);
    }
  }

  /**
   * Manejar input de texto (búsqueda)
   */
  private async handleInput(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    const filter = target.getAttribute('data-filter');
    if (filter === 'search') {
      // Debounce para búsqueda
      this.debounceSearch(target.value);
    }
  }

  /**
   * Debounce para búsqueda
   */
  private searchTimeout: number | null = null;
  private debounceSearch(searchTerm: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(async () => {
      console.log('[EventHandler] Ejecutando búsqueda:', searchTerm);
      try {
        if (searchTerm.trim()) {
          await this.productController.searchProducts(searchTerm.trim());
        } else {
          await this.productController.getAllProducts();
        }
      } catch (error) {
        console.error('[EventHandler] Error en búsqueda:', error);
      }
    }, 300);
  }

  // === HANDLERS DE ORDEN ===

  private async handleCreateOrder(element: HTMLElement): Promise<void> {
    console.log('[EventHandler] Creando nueva orden');
    
    // Deshabilitar botón temporalmente
    this.setButtonLoading(element, true);
    
    try {
      await this.orderController.createOrder();
    } finally {
      this.setButtonLoading(element, false);
    }
  }

  private async handleAddProduct(element: HTMLElement): Promise<void> {
    const productId = element.getAttribute('data-product-id');
    if (!productId) {
      console.error('[EventHandler] No se encontró product-id');
      return;
    }

    console.log('[EventHandler] Agregando producto:', productId);
    
    this.setButtonLoading(element, true);
    
    try {
      await this.orderController.addProduct({ productId });
    } finally {
      this.setButtonLoading(element, false);
    }
  }

  private async handleAddProductWithOptions(element: HTMLElement): Promise<void> {
    const productId = element.getAttribute('data-product-id');
    if (!productId) return;

    // Obtener opciones seleccionadas del modal
    const modal = element.closest('.product-modal');
    if (!modal) return;

    const selectedOptions: string[] = [];
    const optionInputs = modal.querySelectorAll('.product-detail__option-input:checked') as NodeListOf<HTMLInputElement>;
    optionInputs.forEach(input => selectedOptions.push(input.value));

    const quantityInput = modal.querySelector('.product-detail__quantity-input') as HTMLInputElement;
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
    } finally {
      this.setButtonLoading(element, false);
    }
  }

  private async handleRemoveItem(element: HTMLElement): Promise<void> {
    const itemId = element.getAttribute('data-item-id');
    if (!itemId) return;

    console.log('[EventHandler] Removiendo item:', itemId);
    
    // TODO: Implementar RemoveItemUseCase
    const itemElement = element.closest('.order-item');
    if (itemElement) {
      itemElement.remove();
    }
  }

  private async handleValidateOrder(element: HTMLElement): Promise<void> {
    console.log('[EventHandler] Validando orden');
    
    this.setButtonLoading(element, true);
    
    try {
      await this.orderController.validateOrder();
    } finally {
      this.setButtonLoading(element, false);
    }
  }

  private async handleCompleteOrder(element: HTMLElement): Promise<void> {
    console.log('[EventHandler] Completando orden');
    
    this.setButtonLoading(element, true);
    
    try {
      await this.orderController.completeOrder();
    } finally {
      this.setButtonLoading(element, false);
    }
  }

  // === HANDLERS DE PRODUCTOS ===

  private async handleViewProduct(element: HTMLElement): Promise<void> {
    const productId = element.getAttribute('data-product-id');
    if (!productId) return;

    console.log('[EventHandler] Viendo producto:', productId);
    
    try {
      await this.productController.getProductById(productId);
    } catch (error) {
      console.error('[EventHandler] Error viendo producto:', error);
    }
  }

  private handleToggleView(element: HTMLElement): void {
    const productGrid = document.querySelector('.product-grid__items');
    if (!productGrid) return;

    productGrid.classList.toggle('product-grid__items--list');
    
    const isListView = productGrid.classList.contains('product-grid__items--list');
    element.textContent = isListView ? 'Vista Grid' : 'Vista Lista';
  }

  private async handleClearFilters(element: HTMLElement): Promise<void> {
    console.log('[EventHandler] Limpiando filtros');
    
    // Limpiar inputs de filtro
    const filterInputs = document.querySelectorAll('[data-filter]') as NodeListOf<HTMLInputElement>;
    filterInputs.forEach(input => {
      if (input.type === 'text' || input.type === 'number') {
        input.value = '';
      } else if (input.type === 'radio') {
        input.checked = input.value === '';
      } else if (input.type === 'checkbox') {
        input.checked = false;
      }
    });
    
    // Mostrar todos los productos
    try {
      await this.productController.getAllProducts();
    } catch (error) {
      console.error('[EventHandler] Error limpiando filtros:', error);
    }
  }

  // === HANDLERS DE FILTROS ===

  private async handleFilterChange(filter: string, value: string, element: HTMLInputElement): Promise<void> {
    switch (filter) {
      case 'category':
        if (value) {
          await this.productController.getProductsByCategory(value);
        } else {
          await this.productController.getAllProducts();
        }
        break;
      
      case 'price-min':
      case 'price-max':
        await this.handlePriceRangeChange();
        break;
    }
  }

  private async handlePriceRangeChange(): Promise<void> {
    const minInput = document.querySelector('[data-filter="price-min"]') as HTMLInputElement;
    const maxInput = document.querySelector('[data-filter="price-max"]') as HTMLInputElement;
    
    const min = minInput?.value ? parseFloat(minInput.value) : 0;
    const max = maxInput?.value ? parseFloat(maxInput.value) : Infinity;
    
    if (min > 0 || max < Infinity) {
      await this.productController.filterProducts({
        priceRange: { min, max }
      });
    } else {
      await this.productController.getAllProducts();
    }
  }

  // === HANDLERS DE UI ===

  private handleCloseModal(element: HTMLElement): void {
    this.productPresenter.closeProductModal();
  }

  private handleCloseError(element: HTMLElement): void {
    const errorMessage = element.closest('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  private handleIncreaseQuantity(element: HTMLElement): void {
    const quantityInput = element.parentElement?.querySelector('.product-detail__quantity-input') as HTMLInputElement;
    if (quantityInput) {
      const currentValue = parseInt(quantityInput.value) || 1;
      const maxValue = parseInt(quantityInput.getAttribute('max') || '10');
      if (currentValue < maxValue) {
        quantityInput.value = (currentValue + 1).toString();
      }
    }
  }

  private handleDecreaseQuantity(element: HTMLElement): void {
    const quantityInput = element.parentElement?.querySelector('.product-detail__quantity-input') as HTMLInputElement;
    if (quantityInput) {
      const currentValue = parseInt(quantityInput.value) || 1;
      const minValue = parseInt(quantityInput.getAttribute('min') || '1');
      if (currentValue > minValue) {
        quantityInput.value = (currentValue - 1).toString();
      }
    }
  }

  // === UTILIDADES ===

  private setButtonLoading(button: HTMLElement, loading: boolean): void {
    const btn = button as HTMLButtonElement;
    if (loading) {
      btn.disabled = true;
      btn.classList.add('btn--loading');
      btn.setAttribute('data-original-text', btn.textContent || '');
      btn.textContent = 'Cargando...';
    } else {
      btn.disabled = false;
      btn.classList.remove('btn--loading');
      const originalText = btn.getAttribute('data-original-text');
      if (originalText) {
        btn.textContent = originalText;
        btn.removeAttribute('data-original-text');
      }
    }
  }

  private handleActionError(action: string, error: any): void {
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
  private setupKeyboardEvents(): void {
    document.addEventListener('keydown', (event) => {
      // Escape para cerrar modales
      if (event.key === 'Escape') {
        this.productPresenter.closeProductModal();
      }
      
      // Enter en inputs de búsqueda
      if (event.key === 'Enter') {
        const target = event.target as HTMLInputElement;
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
  private setupFormEvents(): void {
    document.addEventListener('submit', (event) => {
      // Prevenir envío de formularios por defecto
      event.preventDefault();
      console.log('[EventHandler] Formulario interceptado');
    });
  }

  /**
   * Destruir event handlers
   */
  destroy(): void {
    if (!this.isInitialized) return;

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