/**
 * OrderPresenter - Presenter para órdenes siguiendo arquitectura hexagonal
 * Fase 4: UI + CSS Final
 *
 * Responsabilidades:
 * - Formatear datos para la vista
 * - Manejar actualizaciones del DOM
 * - Aplicar estilos BEM
 */
export class OrderPresenter {
    constructor() {
        this.orderContainer = null;
        this.statusContainer = null;
        this.errorContainer = null;
        this.currentOrder = null;
        this.initializeContainers();
    }
    /**
     * Inicializar contenedores del DOM
     */
    initializeContainers() {
        this.orderContainer = document.querySelector('.order-system');
        this.statusContainer = document.querySelector('.order-status');
        this.errorContainer = document.querySelector('.error-messages');
        // Crear contenedores si no existen
        if (!this.orderContainer) {
            this.orderContainer = this.createOrderContainer();
        }
        if (!this.statusContainer) {
            this.statusContainer = this.createStatusContainer();
        }
        if (!this.errorContainer) {
            this.errorContainer = this.createErrorContainer();
        }
    }
    /**
     * Crear contenedor principal de órdenes
     */
    createOrderContainer() {
        const container = document.createElement('div');
        container.className = 'order-system';
        container.innerHTML = `
      <div class="order-system__header">
        <h2 class="order-system__title">Sistema de Órdenes</h2>
        <button class="order-system__new-btn btn btn--primary" data-action="create-order">
          Nueva Orden
        </button>
      </div>
      <div class="order-system__content">
        <div class="order-system__items"></div>
        <div class="order-system__summary"></div>
      </div>
    `;
        const mainContent = document.querySelector('main') || document.body;
        mainContent.appendChild(container);
        return container;
    }
    /**
     * Crear contenedor de estado
     */
    createStatusContainer() {
        const container = document.createElement('div');
        container.className = 'order-status';
        const mainContent = document.querySelector('main') || document.body;
        mainContent.appendChild(container);
        return container;
    }
    /**
     * Crear contenedor de errores
     */
    createErrorContainer() {
        const container = document.createElement('div');
        container.className = 'error-messages';
        const mainContent = document.querySelector('main') || document.body;
        mainContent.appendChild(container);
        return container;
    }
    /**
     * Obtener orden actual
     */
    getCurrentOrder() {
        return this.currentOrder;
    }
    /**
     * Presentar orden creada
     */
    presentOrderCreated(orderId) {
        console.log('[OrderPresenter] Presentando orden creada:', orderId.getValue());
        // Guardar referencia a la orden actual
        this.currentOrder = { id: orderId.getValue(), status: 'active' };
        this.clearErrors();
        // Actualizar estado
        if (this.statusContainer) {
            this.statusContainer.innerHTML = `
        <div class="order-status__success">
          <div class="order-status__icon">✅</div>
          <div class="order-status__message">
            Orden creada exitosamente
            <span class="order-status__id">#${orderId.getValue()}</span>
          </div>
        </div>
      `;
        }
        // Actualizar contenedor principal
        if (this.orderContainer) {
            const itemsContainer = this.orderContainer.querySelector('.order-system__items');
            if (itemsContainer) {
                itemsContainer.innerHTML = `
          <div class="order-items">
            <div class="order-items__header">
              <h3 class="order-items__title">Orden #${orderId.getValue()}</h3>
              <span class="order-items__status order-items__status--active">Activa</span>
            </div>
            <div class="order-items__list">
              <div class="order-items__empty">
                <p>No hay productos en la orden</p>
                <p class="order-items__help">Selecciona productos del menú para agregar</p>
              </div>
            </div>
          </div>
        `;
            }
        }
        // Auto-ocultar mensaje de éxito
        setTimeout(() => {
            if (this.statusContainer) {
                this.statusContainer.innerHTML = '';
            }
        }, 3000);
    }
    /**
     * Presentar producto agregado
     */
    presentProductAdded(orderItem) {
        console.log('[OrderPresenter] Presentando producto agregado:', orderItem.getId().getValue());
        this.clearErrors();
        // Mostrar notificación
        if (this.statusContainer) {
            this.statusContainer.innerHTML = `
        <div class="order-status__success">
          <div class="order-status__icon">➕</div>
          <div class="order-status__message">
            Producto agregado a la orden
          </div>
        </div>
      `;
        }
        // Actualizar lista de items
        this.updateOrderItemsList(orderItem);
        // Auto-ocultar notificación
        setTimeout(() => {
            if (this.statusContainer) {
                this.statusContainer.innerHTML = '';
            }
        }, 2000);
    }
    /**
     * Actualizar lista de items en el DOM
     */
    updateOrderItemsList(orderItem) {
        if (!this.orderContainer)
            return;
        const itemsList = this.orderContainer.querySelector('.order-items__list');
        if (!itemsList)
            return;
        // Remover mensaje vacío si existe
        const emptyMessage = itemsList.querySelector('.order-items__empty');
        if (emptyMessage) {
            emptyMessage.remove();
        }
        // Crear elemento del item
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.setAttribute('data-item-id', orderItem.getId().getValue());
        itemElement.innerHTML = `
      <div class="order-item__info">
        <h4 class="order-item__name">${orderItem.product.getName()}</h4>
        <div class="order-item__details">
          <span class="order-item__quantity">Cantidad: ${orderItem.getQuantity()}</span>
          ${orderItem.getDrinkOptions().length > 0 ?
            `<span class="order-item__options">Opciones: ${orderItem.getDrinkOptions().join(', ')}</span>` :
            ''}
        </div>
      </div>
      <div class="order-item__actions">
        <button class="order-item__remove btn btn--secondary" data-action="remove-item" data-item-id="${orderItem.getId().getValue()}">
          Remover
        </button>
      </div>
    `;
        itemsList.appendChild(itemElement);
    }
    /**
     * Presentar orden válida
     */
    presentOrderValid(validationResult) {
        console.log('[OrderPresenter] Presentando orden válida');
        this.clearErrors();
        if (this.statusContainer) {
            this.statusContainer.innerHTML = `
        <div class="order-status__success">
          <div class="order-status__icon">✅</div>
          <div class="order-status__message">
            Orden válida - Lista para completar
          </div>
        </div>
      `;
        }
        // Habilitar botón de completar
        this.enableCompleteButton();
    }
    /**
     * Presentar orden inválida
     */
    presentOrderInvalid(validationResult) {
        console.log('[OrderPresenter] Presentando orden inválida:', validationResult.errors);
        if (this.errorContainer) {
            this.errorContainer.innerHTML = `
        <div class="error-message error-message--validation">
          <div class="error-message__icon">⚠️</div>
          <div class="error-message__content">
            <h4 class="error-message__title">Orden no válida</h4>
            <ul class="error-message__list">
              ${validationResult.errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
        }
        // Deshabilitar botón de completar
        this.disableCompleteButton();
    }
    /**
     * Presentar orden completada
     */
    presentOrderCompleted() {
        console.log('[OrderPresenter] Presentando orden completada');
        this.clearErrors();
        if (this.statusContainer) {
            this.statusContainer.innerHTML = `
        <div class="order-status__success order-status__success--completed">
          <div class="order-status__icon">🎉</div>
          <div class="order-status__message">
            ¡Orden completada exitosamente!
          </div>
        </div>
      `;
        }
        // Limpiar orden actual después de un delay
        setTimeout(() => {
            this.clearCurrentOrder();
        }, 3000);
    }
    /**
     * Presentar estado de orden
     */
    presentOrderStatus(orderStatus) {
        console.log('[OrderPresenter] Presentando estado de orden:', orderStatus);
        if (this.orderContainer) {
            const summaryContainer = this.orderContainer.querySelector('.order-system__summary');
            if (summaryContainer) {
                summaryContainer.innerHTML = `
          <div class="order-summary">
            <h3 class="order-summary__title">Resumen</h3>
            <div class="order-summary__details">
              <div class="order-summary__row">
                <span class="order-summary__label">Items:</span>
                <span class="order-summary__value">${orderStatus.items.length}</span>
              </div>
              <div class="order-summary__row order-summary__row--total">
                <span class="order-summary__label">Total:</span>
                <span class="order-summary__value">$${orderStatus.total.toFixed(2)}</span>
              </div>
            </div>
            <div class="order-summary__actions">
              <button class="btn btn--primary" data-action="validate-order">
                Validar Orden
              </button>
              <button class="btn btn--success" data-action="complete-order" disabled>
                Completar Orden
              </button>
            </div>
          </div>
        `;
            }
        }
    }
    /**
     * Presentar error
     */
    presentError(error) {
        console.error('[OrderPresenter] Presentando error:', error);
        if (this.errorContainer) {
            this.errorContainer.innerHTML = `
        <div class="error-message error-message--general">
          <div class="error-message__icon">❌</div>
          <div class="error-message__content">
            <h4 class="error-message__title">Error</h4>
            <p class="error-message__text">${error}</p>
          </div>
          <button class="error-message__close" data-action="close-error">×</button>
        </div>
      `;
        }
    }
    /**
     * Limpiar errores
     */
    clearErrors() {
        if (this.errorContainer) {
            this.errorContainer.innerHTML = '';
        }
    }
    /**
     * Habilitar botón de completar
     */
    enableCompleteButton() {
        const completeBtn = document.querySelector('[data-action="complete-order"]');
        if (completeBtn) {
            completeBtn.disabled = false;
            completeBtn.classList.remove('btn--disabled');
        }
    }
    /**
     * Deshabilitar botón de completar
     */
    disableCompleteButton() {
        const completeBtn = document.querySelector('[data-action="complete-order"]');
        if (completeBtn) {
            completeBtn.disabled = true;
            completeBtn.classList.add('btn--disabled');
        }
    }
    /**
     * Limpiar orden actual
     */
    clearCurrentOrder() {
        if (this.orderContainer) {
            const itemsList = this.orderContainer.querySelector('.order-items__list');
            if (itemsList) {
                itemsList.innerHTML = `
          <div class="order-items__empty">
            <p>No hay productos en la orden</p>
            <p class="order-items__help">Selecciona productos del menú para agregar</p>
          </div>
        `;
            }
            const summaryContainer = this.orderContainer.querySelector('.order-system__summary');
            if (summaryContainer) {
                summaryContainer.innerHTML = '';
            }
        }
        if (this.statusContainer) {
            this.statusContainer.innerHTML = '';
        }
    }
}
//# sourceMappingURL=OrderPresenter.js.map