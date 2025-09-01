/**
 * ProductPresenter - Presenter para productos siguiendo arquitectura hexagonal
 * Fase 4: UI + CSS Final
 * 
 * Responsabilidades:
 * - Formatear datos de productos para la vista
 * - Manejar actualizaciones del grid de productos
 * - Aplicar estilos BEM y filtros
 */

import { Product } from '../../../Domain/Entities/Product';
import { ProductFilterCommand } from '../controllers/ProductController';

export class ProductPresenter {
  private productContainer: HTMLElement | null = null;
  private filterContainer: HTMLElement | null = null;
  private errorContainer: HTMLElement | null = null;

  constructor() {
    this.initializeContainers();
  }

  /**
   * Inicializar contenedores del DOM
   */
  private initializeContainers(): void {
    this.productContainer = document.querySelector('.product-grid');
    this.filterContainer = document.querySelector('.product-filters');
    this.errorContainer = document.querySelector('.error-messages');

    // Crear contenedores si no existen
    if (!this.productContainer) {
      this.productContainer = this.createProductContainer();
    }

    if (!this.filterContainer) {
      this.filterContainer = this.createFilterContainer();
    }

    if (!this.errorContainer) {
      this.errorContainer = this.createErrorContainer();
    }
  }

  /**
   * Crear contenedor principal de productos
   */
  private createProductContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'product-grid';
    container.innerHTML = `
      <div class="product-grid__header">
        <h2 class="product-grid__title">Menú de Productos</h2>
        <div class="product-grid__controls">
          <button class="product-grid__view-toggle btn btn--secondary" data-action="toggle-view">
            Vista Grid
          </button>
        </div>
      </div>
      <div class="product-grid__content">
        <div class="product-grid__items"></div>
      </div>
    `;

    const mainContent = document.querySelector('main') || document.body;
    mainContent.appendChild(container);
    
    return container;
  }

  /**
   * Crear contenedor de filtros
   */
  private createFilterContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'product-filters';
    container.innerHTML = `
      <div class="product-filters__header">
        <h3 class="product-filters__title">Filtros</h3>
        <button class="product-filters__clear btn btn--text" data-action="clear-filters">
          Limpiar
        </button>
      </div>
      <div class="product-filters__content">
        <div class="product-filters__search">
          <input type="text" class="product-filters__search-input" placeholder="Buscar productos..." data-filter="search">
        </div>
        <div class="product-filters__categories">
          <h4 class="product-filters__subtitle">Categorías</h4>
          <div class="product-filters__category-list"></div>
        </div>
        <div class="product-filters__price">
          <h4 class="product-filters__subtitle">Rango de Precio</h4>
          <div class="product-filters__price-inputs">
            <input type="number" class="product-filters__price-min" placeholder="Min" data-filter="price-min">
            <input type="number" class="product-filters__price-max" placeholder="Max" data-filter="price-max">
          </div>
        </div>
      </div>
    `;

    const mainContent = document.querySelector('main') || document.body;
    mainContent.insertBefore(container, this.productContainer);
    
    return container;
  }

  /**
   * Crear contenedor de errores
   */
  private createErrorContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'error-messages';
    
    const mainContent = document.querySelector('main') || document.body;
    mainContent.appendChild(container);
    
    return container;
  }

  /**
   * Presentar lista de productos
   */
  presentProductList(products: Product[], context?: Partial<ProductFilterCommand & { searchTerm?: string }>): void {
    console.log(`[ProductPresenter] Presentando ${products.length} productos`);

    this.clearErrors();

    if (!this.productContainer) return;

    const itemsContainer = this.productContainer.querySelector('.product-grid__items');
    if (!itemsContainer) return;

    // Actualizar título con contexto
    this.updateGridTitle(products.length, context);

    // Generar HTML de productos
    if (products.length === 0) {
      itemsContainer.innerHTML = `
        <div class="product-grid__empty">
          <div class="product-grid__empty-icon">🍽️</div>
          <h3 class="product-grid__empty-title">No se encontraron productos</h3>
          <p class="product-grid__empty-text">
            ${context?.searchTerm ? 
              `No hay productos que coincidan con "${context.searchTerm}"` :
              context?.category ?
                `No hay productos en la categoría "${context.category}"` :
                'No hay productos disponibles'
            }
          </p>
          <button class="btn btn--primary" data-action="clear-filters">
            Ver todos los productos
          </button>
        </div>
      `;
    } else {
      const productsHTML = products.map(product => this.createProductCard(product)).join('');
      itemsContainer.innerHTML = `
        <div class="product-grid__list">
          ${productsHTML}
        </div>
      `;
    }
  }

  /**
   * Crear tarjeta de producto
   */
  private createProductCard(product: Product): string {
    const productData = {
      id: product.getId().getValue(),
      name: product.getName(),
      category: product.getCategory().value,
      price: product.getPrice(),
      description: product.getDescription(),
      drinkOptions: product.getDrinkOptions()
    };

    return `
      <div class="product-card" data-product-id="${productData.id}">
        <div class="product-card__header">
          <h3 class="product-card__name">${productData.name}</h3>
          <span class="product-card__category">${productData.category}</span>
        </div>
        <div class="product-card__content">
          <p class="product-card__description">${productData.description}</p>
          ${productData.drinkOptions.length > 0 ? `
            <div class="product-card__options">
              <h4 class="product-card__options-title">Opciones de bebida:</h4>
              <ul class="product-card__options-list">
                ${productData.drinkOptions.map(option => `<li class="product-card__option">${option}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
        <div class="product-card__footer">
          <div class="product-card__price">
            <span class="product-card__price-label">Precio:</span>
            <span class="product-card__price-value">$${productData.price.toFixed(2)}</span>
          </div>
          <div class="product-card__actions">
            <button class="product-card__add-btn btn btn--primary" 
                    data-action="add-product" 
                    data-product-id="${productData.id}">
              Agregar a Orden
            </button>
            <button class="product-card__details-btn btn btn--secondary" 
                    data-action="view-product" 
                    data-product-id="${productData.id}">
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Presentar detalle de producto
   */
  presentProductDetail(product: Product): void {
    console.log('[ProductPresenter] Presentando detalle de producto:', product.getName());

    this.clearErrors();

    const productData = {
      id: product.getId().getValue(),
      name: product.getName(),
      category: product.getCategory().value,
      price: product.getPrice(),
      description: product.getDescription(),
      drinkOptions: product.getDrinkOptions()
    };

    // Crear modal de detalle
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
      <div class="product-modal__overlay" data-action="close-modal"></div>
      <div class="product-modal__content">
        <div class="product-modal__header">
          <h2 class="product-modal__title">${productData.name}</h2>
          <button class="product-modal__close" data-action="close-modal">×</button>
        </div>
        <div class="product-modal__body">
          <div class="product-detail">
            <div class="product-detail__info">
              <span class="product-detail__category">${productData.category}</span>
              <p class="product-detail__description">${productData.description}</p>
              <div class="product-detail__price">
                <span class="product-detail__price-label">Precio:</span>
                <span class="product-detail__price-value">$${productData.price.toFixed(2)}</span>
              </div>
            </div>
            ${productData.drinkOptions.length > 0 ? `
              <div class="product-detail__options">
                <h3 class="product-detail__options-title">Opciones de bebida:</h3>
                <div class="product-detail__options-grid">
                  ${productData.drinkOptions.map(option => `
                    <label class="product-detail__option">
                      <input type="checkbox" class="product-detail__option-input" value="${option}">
                      <span class="product-detail__option-label">${option}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            <div class="product-detail__quantity">
              <label class="product-detail__quantity-label">Cantidad:</label>
              <div class="product-detail__quantity-controls">
                <button class="product-detail__quantity-btn" data-action="decrease-quantity">-</button>
                <input type="number" class="product-detail__quantity-input" value="1" min="1" max="10">
                <button class="product-detail__quantity-btn" data-action="increase-quantity">+</button>
              </div>
            </div>
          </div>
        </div>
        <div class="product-modal__footer">
          <button class="btn btn--secondary" data-action="close-modal">
            Cancelar
          </button>
          <button class="btn btn--primary" data-action="add-product-with-options" data-product-id="${productData.id}">
            Agregar a Orden
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Auto-focus en el modal
    setTimeout(() => {
      modal.classList.add('product-modal--active');
    }, 10);
  }

  /**
   * Presentar categorías
   */
  presentCategories(categories: string[]): void {
    console.log('[ProductPresenter] Presentando categorías:', categories);

    if (!this.filterContainer) return;

    const categoryList = this.filterContainer.querySelector('.product-filters__category-list');
    if (!categoryList) return;

    const categoriesHTML = categories.map(category => `
      <label class="product-filters__category">
        <input type="radio" class="product-filters__category-input" 
               name="category" value="${category}" data-filter="category">
        <span class="product-filters__category-label">${category}</span>
      </label>
    `).join('');

    categoryList.innerHTML = `
      <label class="product-filters__category">
        <input type="radio" class="product-filters__category-input" 
               name="category" value="" data-filter="category" checked>
        <span class="product-filters__category-label">Todas</span>
      </label>
      ${categoriesHTML}
    `;
  }

  /**
   * Presentar error
   */
  presentError(error: string): void {
    console.error('[ProductPresenter] Presentando error:', error);

    if (this.errorContainer) {
      this.errorContainer.innerHTML = `
        <div class="error-message error-message--product">
          <div class="error-message__icon">❌</div>
          <div class="error-message__content">
            <h4 class="error-message__title">Error en Productos</h4>
            <p class="error-message__text">${error}</p>
          </div>
          <button class="error-message__close" data-action="close-error">×</button>
        </div>
      `;
    }
  }

  /**
   * Actualizar título del grid con contexto
   */
  private updateGridTitle(count: number, context?: Partial<ProductFilterCommand & { searchTerm?: string }>): void {
    if (!this.productContainer) return;

    const titleElement = this.productContainer.querySelector('.product-grid__title');
    if (!titleElement) return;

    let title = 'Menú de Productos';
    let subtitle = '';

    if (context?.searchTerm) {
      title = `Resultados de búsqueda: "${context.searchTerm}"`;
      subtitle = `${count} producto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    } else if (context?.category) {
      title = `Categoría: ${context.category}`;
      subtitle = `${count} producto${count !== 1 ? 's' : ''}`;
    } else {
      subtitle = `${count} producto${count !== 1 ? 's' : ''} disponible${count !== 1 ? 's' : ''}`;
    }

    titleElement.innerHTML = `
      ${title}
      ${subtitle ? `<span class="product-grid__subtitle">${subtitle}</span>` : ''}
    `;
  }

  /**
   * Limpiar errores
   */
  private clearErrors(): void {
    if (this.errorContainer) {
      this.errorContainer.innerHTML = '';
    }
  }

  /**
   * Cerrar modal de producto
   */
  closeProductModal(): void {
    const modal = document.querySelector('.product-modal');
    if (modal) {
      modal.classList.remove('product-modal--active');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  }

  /**
   * Actualizar filtros activos
   */
  updateActiveFilters(filters: Partial<ProductFilterCommand>): void {
    if (!this.filterContainer) return;

    // Actualizar input de búsqueda
    const searchInput = this.filterContainer.querySelector('.product-filters__search-input') as HTMLInputElement;
    if (searchInput && filters.searchTerm !== undefined) {
      searchInput.value = filters.searchTerm;
    }

    // Actualizar categoría seleccionada
    if (filters.category) {
      const categoryInputs = this.filterContainer.querySelectorAll('input[name="category"]') as NodeListOf<HTMLInputElement>;
      categoryInputs.forEach(input => {
        input.checked = input.value === filters.category;
      });
    }

    // Actualizar rango de precio
    if (filters.priceRange) {
      const minInput = this.filterContainer.querySelector('.product-filters__price-min') as HTMLInputElement;
      const maxInput = this.filterContainer.querySelector('.product-filters__price-max') as HTMLInputElement;
      
      if (minInput) minInput.value = filters.priceRange.min.toString();
      if (maxInput) maxInput.value = filters.priceRange.max.toString();
    }
  }
}