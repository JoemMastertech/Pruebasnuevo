/**
 * ProductController - Controlador de productos siguiendo arquitectura hexagonal
 * Fase 4: UI + CSS Final
 *
 * Responsabilidades:
 * - Coordinar casos de uso de productos
 * - Manejar filtrado y búsqueda
 * - Delegar presentación al presenter
 */
import { GetProductsUseCase } from '../../../Aplicacion/UseCases/GetProductsUseCase';
import { GetProductByIdUseCase } from '../../../Aplicacion/UseCases/GetProductByIdUseCase';
import { ProductPresenter } from '../presenters/ProductPresenter';
export interface ProductFilterCommand {
    category?: string;
    searchTerm?: string;
    priceRange?: {
        min: number;
        max: number;
    };
}
export interface ProductControllerResult {
    success: boolean;
    data?: any;
    error?: string;
}
export declare class ProductController {
    private getProductsUseCase;
    private getProductByIdUseCase;
    private presenter;
    constructor(getProductsUseCase: GetProductsUseCase, getProductByIdUseCase: GetProductByIdUseCase, presenter: ProductPresenter);
    /**
     * Obtener todos los productos
     */
    getAllProducts(): Promise<ProductControllerResult>;
    /**
     * Obtener producto por ID
     */
    getProductById(productId: string): Promise<ProductControllerResult>;
    /**
     * Filtrar productos por categoría
     */
    getProductsByCategory(categoryName: string): Promise<ProductControllerResult>;
    /**
     * Buscar productos por término
     */
    searchProducts(searchTerm: string): Promise<ProductControllerResult>;
    /**
     * Aplicar filtros complejos
     */
    filterProducts(filter: ProductFilterCommand): Promise<ProductControllerResult>;
    /**
     * Obtener categorías disponibles
     */
    getAvailableCategories(): Promise<ProductControllerResult>;
}
//# sourceMappingURL=ProductController.d.ts.map