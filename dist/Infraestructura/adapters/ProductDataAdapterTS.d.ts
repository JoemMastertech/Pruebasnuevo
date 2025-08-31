import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort.js';
import { Product } from '../../Domain/Entities/Product.js';
import { ProductId } from '../../Domain/ValueObjects/ProductId.js';
import { ProductCategory } from '../../Domain/ValueObjects/ProductCategory.js';
/**
 * TypeScript Product Data Adapter - Infrastructure implementation of ProductRepositoryPort
 * Migrates existing ProductDataAdapter.js functionality to TypeScript with proper domain types
 * Part of Hexagonal Architecture - Infrastructure layer adapter
 * Maintains compatibility with existing ProductData while providing type safety
 */
export declare class ProductDataAdapterTS implements ProductRepositoryPort {
    private productDataAdapter;
    constructor(existingAdapter?: any);
    /**
     * Get existing ProductDataAdapter from global scope or create fallback
     */
    private getExistingAdapter;
    /**
     * Create mock adapter for development/testing
     */
    private createMockAdapter;
    /**
     * Find product by name
     */
    findByName(name: string): Promise<Product | null>;
    /**
     * Find all products
     */
    findAll(): Promise<Product[]>;
    /**
     * Find products by category
     */
    findByCategory(category: ProductCategory): Promise<Product[]>;
    /**
     * Search products by text (name or ingredients)
     */
    search(query: string): Promise<Product[]>;
    /**
     * Check if product exists
     */
    exists(productId: ProductId): Promise<boolean>;
    /**
     * Get drink options for a product
     */
    getDrinkOptions(product: Product): Promise<any[]>;
    /**
     * Find products by multiple categories
     */
    findByCategories(categories: ProductCategory[]): Promise<Product[]>;
    /**
     * Find products by ingredients
     */
    findByIngredients(ingredients: string[]): Promise<Product[]>;
    /**
     * Find products by price range
     */
    findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
    /**
     * Map raw product data to domain entities
     */
    private mapRawProductsToDomain;
    /**
     * Map single raw product to domain entity
     */
    private mapRawProductToDomain;
    /**
     * Extract price from raw product data
     */
    private extractPrice;
    /**
     * Get available categories
     */
    getAvailableCategories(): Promise<ProductCategory[]>;
}
//# sourceMappingURL=ProductDataAdapterTS.d.ts.map