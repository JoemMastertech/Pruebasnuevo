/**
 * ProductGridComponent - Componente del grid de productos
 * Fase 4: UI + CSS Final
 * 
 * Responsabilidades:
 * - Manejar la visualización del grid de productos
 * - Coordinar filtros y búsqueda
 * - Optimizar rendering y performance
 */

import { ProductController } from '../controllers/ProductController';
import { ProductPresenter } from '../presenters/ProductPresenter';
import { Product } from '../../../Domain/Entities/Product';

export interface ProductGridConfig {
  itemsPerPage?: number;
  enableVirtualization?: boolean;
  enableLazyLoading?: boolean;
  defaultView?: 'grid' | 'list';
  enableFilters?: boolean;
  containerSelector?: string;
}

export interface ProductGridState {
  products: Product[];
  filteredProducts: Product[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  currentView: 'grid' | 'list';
  activeFilters: any;
}

export class ProductGridComponent {
  private productController: ProductController;
  private productPresenter: ProductPresenter;
  private config: ProductGridConfig;
  private state: ProductGridState;
  private container: HTMLElement | null = null;
  private isInitialized = false;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor(
    productController: ProductController,
    productPresenter: ProductPresenter,
    config: ProductGridConfig = {}
  ) {
    this.productController = productController;
    this.productPresenter = productPresenter;
    
    this.config = {
      itemsPerPage: 20,
      enableVirtualization: false,
      enableLazyLoading: true,
      defaultView: 'grid',
      enableFilters: true,
      containerSelector: '.product-grid',
      ...config
    };

    this.state = {
      products: [],
      filteredProducts: [],
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      currentView: this.config.defaultView!,
      activeFilters: {}
    };

    this.log('ProductGridComponent creado');
  }

  /**
   * Inicializar el componente
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.log('Componente ya está inicializado');
      return;
    }

    this.log('Inicializando ProductGridComponent');

    try {
      // Encontrar contenedor
      await this.setupContainer();
      
      // Configurar observadores
      this.setupObservers();
      
      // Cargar productos iniciales
      await this.loadProducts();
      
      // Configurar filtros si están habilitados
      if (this.config.enableFilters) {
        await this.setupFilters();
      }
      
      this.isInitialized = true;
      this.log('ProductGridComponent inicializado exitosamente');
      
    } catch (error) {
      console.error('[ProductGridComponent] Error durante inicialización:', error);
      throw error;
    }
  }

  /**
   * Configurar contenedor
   */
  private async setupContainer(): Promise<void> {
    this.container = document.querySelector(this.config.containerSelector!);
    
    if (!this.container) {
      this.container = this.createContainer();
    }

    // Agregar clases para el grid
    this.container.classList.add('product-grid-component');
    this.container.classList.add(`product-grid-component--${this.state.currentView}`);
    
    // Crear estructura si no existe
    if (!this.container.querySelector('.product-grid__content')) {
      this.createGridStructure();
    }
  }

  /**
   * Crear contenedor del grid
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = this.config.containerSelector!.replace('.', '');
    
    const mainContent = document.querySelector('main') || document.body;
    mainContent.appendChild(container);
    
    return container;
  }

  /**
   * Crear estructura del grid
   */
  private createGridStructure(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="product-grid__header">
        <div class="product-grid__title-section">
          <h2 class="product-grid__title">Productos</h2>
          <div class="product-grid__count">
            <span class="product-grid__count-text">0 productos</span>
          </div>
        </div>
        
        <div class="product-grid__controls">
          <div class="product-grid__view-controls">
            <button class="product-grid__view-btn product-grid__view-btn--grid ${this.state.currentView === 'grid' ? 'product-grid__view-btn--active' : ''}" 
                    data-action="set-view" data-view="grid" title="Vista Grid">
              <span class="product-grid__view-icon">⊞</span>
            </button>
            <button class="product-grid__view-btn product-grid__view-btn--list ${this.state.currentView === 'list' ? 'product-grid__view-btn--active' : ''}" 
                    data-action="set-view" data-view="list" title="Vista Lista">
              <span class="product-grid__view-icon">☰</span>
            </button>
          </div>
          
          <div class="product-grid__sort-controls">
            <select class="product-grid__sort-select" data-action="sort-products">
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
              <option value="price-asc">Precio menor</option>
              <option value="price-desc">Precio mayor</option>
              <option value="category">Categoría</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="product-grid__content">
        <div class="product-grid__loading" style="display: none;">
          <div class="product-grid__loading-spinner"></div>
          <span class="product-grid__loading-text">Cargando productos...</span>
        </div>
        
        <div class="product-grid__items"></div>
        
        <div class="product-grid__empty" style="display: none;">
          <div class="product-grid__empty-icon">🍽️</div>
          <h3 class="product-grid__empty-title">No hay productos</h3>
          <p class="product-grid__empty-text">No se encontraron productos que coincidan con los filtros.</p>
        </div>
      </div>
      
      ${this.config.itemsPerPage! > 0 ? `
        <div class="product-grid__pagination">
          <button class="product-grid__page-btn product-grid__page-btn--prev" 
                  data-action="prev-page" disabled>
            ← Anterior
          </button>
          
          <div class="product-grid__page-info">
            <span class="product-grid__page-current">1</span>
            <span class="product-grid__page-separator">de</span>
            <span class="product-grid__page-total">1</span>
          </div>
          
          <button class="product-grid__page-btn product-grid__page-btn--next" 
                  data-action="next-page" disabled>
            Siguiente →
          </button>
        </div>
      ` : ''}
    `;
  }

  /**
   * Configurar observadores para performance
   */
  private setupObservers(): void {
    // Resize Observer para responsive
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        this.handleResize(entries);
      });
      
      if (this.container) {
        this.resizeObserver.observe(this.container);
      }
    }

    // Intersection Observer para lazy loading
    if (this.config.enableLazyLoading && window.IntersectionObserver) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        { rootMargin: '100px' }
      );
    }
  }

  /**
   * Cargar productos
   */
  async loadProducts(): Promise<void> {
    this.setLoading(true);
    
    try {
      const result = await this.productController.getAllProducts();
      
      if (result.success && result.data?.products) {
        // Convertir datos a entidades Product si es necesario
        this.state.products = result.data.products;
        this.state.filteredProducts = [...this.state.products];
        
        this.updatePagination();
        this.renderProducts();
        this.updateProductCount();
        
        this.log(`${this.state.products.length} productos cargados`);
      } else {
        this.showEmpty('Error cargando productos');
      }
    } catch (error) {
      console.error('[ProductGridComponent] Error cargando productos:', error);
      this.showEmpty('Error cargando productos');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Configurar filtros
   */
  private async setupFilters(): Promise<void> {
    try {
      await this.productController.getAvailableCategories();
      this.log('Filtros configurados');
    } catch (error) {
      console.error('[ProductGridComponent] Error configurando filtros:', error);
    }
  }

  /**
   * Renderizar productos
   */
  private renderProducts(): void {
    if (!this.container) return;

    const itemsContainer = this.container.querySelector('.product-grid__items');
    if (!itemsContainer) return;

    const startIndex = (this.state.currentPage - 1) * this.config.itemsPerPage!;
    const endIndex = startIndex + this.config.itemsPerPage!;
    const productsToShow = this.config.itemsPerPage! > 0 
      ? this.state.filteredProducts.slice(startIndex, endIndex)
      : this.state.filteredProducts;

    if (productsToShow.length === 0) {
      this.showEmpty();
      return;
    }

    this.hideEmpty();

    // Usar el presenter para generar el HTML
    this.productPresenter.presentProductList(productsToShow);
    
    // Configurar lazy loading si está habilitado
    if (this.config.enableLazyLoading) {
      this.setupLazyLoading();
    }
  }

  /**
   * Configurar lazy loading para imágenes
   */
  private setupLazyLoading(): void {
    if (!this.intersectionObserver) return;

    const images = this.container?.querySelectorAll('img[data-src]');
    images?.forEach(img => {
      this.intersectionObserver!.observe(img);
    });
  }

  /**
   * Manejar intersección para lazy loading
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          this.intersectionObserver?.unobserve(img);
        }
      }
    });
  }

  /**
   * Manejar resize
   */
  private handleResize(entries: ResizeObserverEntry[]): void {
    // Ajustar número de columnas basado en el ancho
    const entry = entries[0];
    if (!entry) return;
    const width = entry.contentRect.width;
    
    let columns = 1;
    if (width > 1200) columns = 4;
    else if (width > 900) columns = 3;
    else if (width > 600) columns = 2;
    
    if (this.container) {
      this.container.style.setProperty('--grid-columns', columns.toString());
    }
  }

  /**
   * Cambiar vista (grid/list)
   */
  setView(view: 'grid' | 'list'): void {
    if (this.state.currentView === view) return;

    this.state.currentView = view;
    
    if (this.container) {
      this.container.classList.remove('product-grid-component--grid', 'product-grid-component--list');
      this.container.classList.add(`product-grid-component--${view}`);
    }

    // Actualizar botones de vista
    this.updateViewButtons();
    
    this.log(`Vista cambiada a: ${view}`);
  }

  /**
   * Actualizar botones de vista
   */
  private updateViewButtons(): void {
    const viewButtons = this.container?.querySelectorAll('.product-grid__view-btn');
    viewButtons?.forEach(btn => {
      const btnView = btn.getAttribute('data-view');
      btn.classList.toggle('product-grid__view-btn--active', btnView === this.state.currentView);
    });
  }

  /**
   * Ordenar productos
   */
  sortProducts(sortBy: string): void {
    const [field, direction] = sortBy.split('-');
    
    this.state.filteredProducts.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (field) {
        case 'name':
          aValue = a.getName().toLowerCase();
          bValue = b.getName().toLowerCase();
          break;
        case 'price':
          aValue = a.getPrice();
          bValue = b.getPrice();
          break;
        case 'category':
          aValue = a.getCategory().value.toLowerCase();
          bValue = b.getCategory().value.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.state.currentPage = 1;
    this.updatePagination();
    this.renderProducts();
    
    this.log(`Productos ordenados por: ${sortBy}`);
  }

  /**
   * Filtrar productos
   */
  filterProducts(filters: any): void {
    this.state.activeFilters = { ...this.state.activeFilters, ...filters };
    
    this.state.filteredProducts = this.state.products.filter(product => {
      // Aplicar filtros
      if (filters.category && filters.category !== '') {
        if (product.getCategory().value !== filters.category) {
          return false;
        }
      }
      
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const name = product.getName().toLowerCase();
        const description = product.getDescription().toLowerCase();
        if (!name.includes(searchTerm) && !description.includes(searchTerm)) {
          return false;
        }
      }
      
      if (filters.priceRange) {
        const price = product.getPrice();
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }
      
      return true;
    });
    
    this.state.currentPage = 1;
    this.updatePagination();
    this.renderProducts();
    this.updateProductCount();
    
    this.log(`Filtros aplicados. ${this.state.filteredProducts.length} productos mostrados`);
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.state.activeFilters = {};
    this.state.filteredProducts = [...this.state.products];
    this.state.currentPage = 1;
    
    this.updatePagination();
    this.renderProducts();
    this.updateProductCount();
    
    this.log('Filtros limpiados');
  }

  /**
   * Ir a página
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.state.totalPages) return;
    
    this.state.currentPage = page;
    this.updatePagination();
    this.renderProducts();
    
    // Scroll al inicio del grid
    this.container?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Actualizar paginación
   */
  private updatePagination(): void {
    if (this.config.itemsPerPage! <= 0) return;
    
    this.state.totalPages = Math.ceil(this.state.filteredProducts.length / this.config.itemsPerPage!);
    
    const pageInfo = this.container?.querySelector('.product-grid__page-info');
    if (pageInfo) {
      const currentSpan = pageInfo.querySelector('.product-grid__page-current');
      const totalSpan = pageInfo.querySelector('.product-grid__page-total');
      
      if (currentSpan) currentSpan.textContent = this.state.currentPage.toString();
      if (totalSpan) totalSpan.textContent = this.state.totalPages.toString();
    }
    
    // Actualizar botones
    const prevBtn = this.container?.querySelector('.product-grid__page-btn--prev') as HTMLButtonElement;
    const nextBtn = this.container?.querySelector('.product-grid__page-btn--next') as HTMLButtonElement;
    
    if (prevBtn) prevBtn.disabled = this.state.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = this.state.currentPage >= this.state.totalPages;
  }

  /**
   * Actualizar contador de productos
   */
  private updateProductCount(): void {
    const countElement = this.container?.querySelector('.product-grid__count-text');
    if (countElement) {
      const count = this.state.filteredProducts.length;
      const total = this.state.products.length;
      
      if (count === total) {
        countElement.textContent = `${count} producto${count !== 1 ? 's' : ''}`;
      } else {
        countElement.textContent = `${count} de ${total} producto${total !== 1 ? 's' : ''}`;
      }
    }
  }

  /**
   * Mostrar estado de carga
   */
  private setLoading(loading: boolean): void {
    this.state.isLoading = loading;
    
    const loadingElement = this.container?.querySelector('.product-grid__loading') as HTMLElement;
    const contentElement = this.container?.querySelector('.product-grid__items') as HTMLElement;
    
    if (loadingElement) {
      loadingElement.style.display = loading ? 'flex' : 'none';
    }
    
    if (contentElement) {
      contentElement.style.opacity = loading ? '0.5' : '1';
    }
  }

  /**
   * Mostrar estado vacío
   */
  private showEmpty(message?: string): void {
    const emptyElement = this.container?.querySelector('.product-grid__empty') as HTMLElement;
    const itemsElement = this.container?.querySelector('.product-grid__items') as HTMLElement;
    
    if (emptyElement) {
      emptyElement.style.display = 'flex';
      
      if (message) {
        const textElement = emptyElement.querySelector('.product-grid__empty-text');
        if (textElement) textElement.textContent = message;
      }
    }
    
    if (itemsElement) {
      itemsElement.style.display = 'none';
    }
  }

  /**
   * Ocultar estado vacío
   */
  private hideEmpty(): void {
    const emptyElement = this.container?.querySelector('.product-grid__empty') as HTMLElement;
    const itemsElement = this.container?.querySelector('.product-grid__items') as HTMLElement;
    
    if (emptyElement) emptyElement.style.display = 'none';
    if (itemsElement) itemsElement.style.display = 'block';
  }

  /**
   * Obtener estado actual
   */
  getState(): ProductGridState {
    return { ...this.state };
  }

  /**
   * Destruir componente
   */
  destroy(): void {
    this.log('Destruyendo ProductGridComponent');
    
    // Limpiar observadores
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    
    // Limpiar DOM
    if (this.container) {
      this.container.classList.remove('product-grid-component');
    }
    
    this.isInitialized = false;
  }

  /**
   * Logging condicional
   */
  private log(message: string, ...args: any[]): void {
    console.log(`[ProductGridComponent] ${message}`, ...args);
  }
}