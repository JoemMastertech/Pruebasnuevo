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
export declare class ProductGridComponent {
    private productController;
    private productPresenter;
    private config;
    private state;
    private container;
    private isInitialized;
    private resizeObserver;
    private intersectionObserver;
    constructor(productController: ProductController, productPresenter: ProductPresenter, config?: ProductGridConfig);
    /**
     * Inicializar el componente
     */
    initialize(): Promise<void>;
    /**
     * Configurar contenedor
     */
    private setupContainer;
    /**
     * Crear contenedor del grid
     */
    private createContainer;
    /**
     * Crear estructura del grid
     */
    private createGridStructure;
    /**
     * Configurar observadores para performance
     */
    private setupObservers;
    /**
     * Cargar productos
     */
    loadProducts(): Promise<void>;
    /**
     * Configurar filtros
     */
    private setupFilters;
    /**
     * Renderizar productos
     */
    private renderProducts;
    /**
     * Configurar lazy loading para imágenes
     */
    private setupLazyLoading;
    /**
     * Manejar intersección para lazy loading
     */
    private handleIntersection;
    /**
     * Manejar resize
     */
    private handleResize;
    /**
     * Cambiar vista (grid/list)
     */
    setView(view: 'grid' | 'list'): void;
    /**
     * Actualizar botones de vista
     */
    private updateViewButtons;
    /**
     * Ordenar productos
     */
    sortProducts(sortBy: string): void;
    /**
     * Filtrar productos
     */
    filterProducts(filters: any): void;
    /**
     * Limpiar filtros
     */
    clearFilters(): void;
    /**
     * Ir a página
     */
    goToPage(page: number): void;
    /**
     * Actualizar paginación
     */
    private updatePagination;
    /**
     * Actualizar contador de productos
     */
    private updateProductCount;
    /**
     * Mostrar estado de carga
     */
    private setLoading;
    /**
     * Mostrar estado vacío
     */
    private showEmpty;
    /**
     * Ocultar estado vacío
     */
    private hideEmpty;
    /**
     * Obtener estado actual
     */
    getState(): ProductGridState;
    /**
     * Destruir componente
     */
    destroy(): void;
    /**
     * Logging condicional
     */
    private log;
}
//# sourceMappingURL=ProductGridComponent.d.ts.map