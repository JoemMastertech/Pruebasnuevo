import { ProductRepositoryPort, DrinkOption } from '../../Domain/Ports/ProductRepositoryPort.js';
import { Product } from '../../Domain/Entities/Product.js';
import { ProductId } from '../../Domain/ValueObjects/ProductId.js';
import { ProductCategory } from '../../Domain/ValueObjects/ProductCategory.js';
/**
 * TypeScript Supabase Adapter - Infrastructure implementation of ProductRepositoryPort
 * Migrates existing SupabaseAdapter.js functionality to TypeScript with proper domain types
 * Part of Hexagonal Architecture - Infrastructure layer adapter for Supabase integration
 * Provides real-time database connectivity with fallback strategies
 */
export declare class SupabaseAdapterTS implements ProductRepositoryPort {
    private client;
    private supabaseUrl;
    private supabaseKey;
    constructor();
    /**
     * Get environment variables safely
     */
    private getEnvironmentVariables;
    /**
     * Create Supabase client
     */
    private createSupabaseClient;
    /**
     * Create mock client for development/testing
     */
    private createMockClient;
    /**
     * Safe async execution with error handling
     */
    private safeExecuteAsync;
    /**
     * Find product by name
     */
    findByName(name: string): Promise<Product | null>;
    /**
     * Find products by category
     */
    findByCategory(category: ProductCategory): Promise<Product[]>;
    /**
     * Find all products
     */
    findAll(): Promise<Product[]>;
    /**
     * Search products by text
     */
    search(query: string): Promise<Product[]>;
    /**
     * Check if product exists
     */
    exists(productId: ProductId): Promise<boolean>;
    /**
     * Get drink options for a product
     */
    getDrinkOptions(product: Product): Promise<DrinkOption[]>;
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
}
//# sourceMappingURL=SupabaseAdapterTS.d.ts.map