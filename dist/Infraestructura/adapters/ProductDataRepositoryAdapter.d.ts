import { Product } from '../../Domain/Entities/Product.js';
import { ProductId } from '../../Domain/ValueObjects/ProductId.js';
import { ProductCategory } from '../../Domain/ValueObjects/ProductCategory.js';
import { ProductRepositoryPort, DrinkOption } from '../../Domain/Ports/ProductRepositoryPort.js';
/**
 * Adaptador que conecta el ProductDataAdapter existente con el puerto del dominio
 * Convierte datos del sistema legacy al modelo de dominio
 */
export declare class ProductDataRepositoryAdapter implements ProductRepositoryPort {
    private readonly productDataAdapter;
    constructor(productDataAdapter: any);
    /**
     * Busca un producto por nombre
     */
    findByName(name: string): Promise<Product | null>;
    /**
     * Busca productos por categoría
     */
    findByCategory(category: ProductCategory): Promise<Product[]>;
    /**
     * Obtiene todos los productos
     */
    findAll(): Promise<Product[]>;
    /**
     * Busca productos por texto (nombre o ingredientes)
     */
    search(query: string): Promise<Product[]>;
    /**
     * Busca un producto por ID
     */
    findById(productId: ProductId): Promise<Product | null>;
    /**
     * Verifica si un producto existe
     */
    exists(productId: ProductId): Promise<boolean>;
    /**
     * Obtiene las opciones de bebida para un producto
     */
    getDrinkOptions(product: Product): Promise<DrinkOption[]>;
    /**
     * Busca productos por múltiples categorías
     */
    findByCategories(categories: ProductCategory[]): Promise<Product[]>;
    /**
     * Busca productos que contengan ciertos ingredientes
     */
    findByIngredients(ingredients: string[]): Promise<Product[]>;
    /**
     * Obtiene productos en un rango de precios
     */
    findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
    /**
     * Método privado para obtener productos por categoría y convertirlos al modelo de dominio
     */
    private getProductsByCategory;
    /**
     * Convierte un producto raw del sistema legacy al modelo de dominio
     */
    private convertToDomainModel;
    /**
     * Mapea categorías del sistema legacy a categorías válidas del dominio
     */
    private mapToValidCategory;
    /**
     * Extrae el precio de un producto raw
     */
    private extractPrice;
}
//# sourceMappingURL=ProductDataRepositoryAdapter.d.ts.map