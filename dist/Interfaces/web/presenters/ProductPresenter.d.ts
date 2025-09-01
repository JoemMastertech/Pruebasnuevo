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
export declare class ProductPresenter {
    private productContainer;
    private filterContainer;
    private errorContainer;
    constructor();
    /**
     * Inicializar contenedores del DOM
     */
    private initializeContainers;
    /**
     * Crear contenedor principal de productos
     */
    private createProductContainer;
    /**
     * Crear contenedor de filtros
     */
    private createFilterContainer;
    /**
     * Crear contenedor de errores
     */
    private createErrorContainer;
    /**
     * Presentar lista de productos
     */
    presentProductList(products: Product[], context?: Partial<ProductFilterCommand & {
        searchTerm?: string;
    }>): void;
    /**
     * Crear tarjeta de producto
     */
    private createProductCard;
    /**
     * Presentar detalle de producto
     */
    presentProductDetail(product: Product): void;
    /**
     * Presentar categorías
     */
    presentCategories(categories: string[]): void;
    /**
     * Presentar error
     */
    presentError(error: string): void;
    /**
     * Actualizar título del grid con contexto
     */
    private updateGridTitle;
    /**
     * Limpiar errores
     */
    private clearErrors;
    /**
     * Cerrar modal de producto
     */
    closeProductModal(): void;
    /**
     * Actualizar filtros activos
     */
    updateActiveFilters(filters: Partial<ProductFilterCommand>): void;
}
//# sourceMappingURL=ProductPresenter.d.ts.map