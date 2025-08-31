import { Product } from '../../Domain/Entities/Product.js';
import { ProductId } from '../../Domain/ValueObjects/ProductId.js';
import { ProductCategory } from '../../Domain/ValueObjects/ProductCategory.js';
import { ProductName } from '../../Domain/ValueObjects/ProductName.js';
import { Money } from '../../Domain/ValueObjects/Money.js';
/**
 * TypeScript Product Data Adapter - Infrastructure implementation of ProductRepositoryPort
 * Migrates existing ProductDataAdapter.js functionality to TypeScript with proper domain types
 * Part of Hexagonal Architecture - Infrastructure layer adapter
 * Maintains compatibility with existing ProductData while providing type safety
 */
export class ProductDataAdapterTS {
    constructor(existingAdapter) {
        // Use existing ProductDataAdapter if provided, otherwise create new instance
        if (existingAdapter) {
            this.productDataAdapter = existingAdapter;
        }
        else {
            // Fallback: try to get from window or create mock
            this.productDataAdapter = this.getExistingAdapter();
        }
    }
    /**
     * Get existing ProductDataAdapter from global scope or create fallback
     */
    getExistingAdapter() {
        try {
            // Try to get from window
            if (typeof window !== 'undefined' && window.ProductDataAdapter) {
                return new window.ProductDataAdapter();
            }
            // Try to get from container
            if (typeof window !== 'undefined' && window.container) {
                const container = window.container;
                if (container.has && container.has('ProductRepository')) {
                    return container.get('ProductRepository');
                }
            }
            // Fallback to mock
            return this.createMockAdapter();
        }
        catch (error) {
            console.warn('ProductDataAdapterTS: Error getting existing adapter, using mock:', error);
            return this.createMockAdapter();
        }
    }
    /**
     * Create mock adapter for development/testing
     */
    createMockAdapter() {
        return {
            getProducts: () => [],
            getProductsByCategory: () => [],
            getAllProducts: () => [],
            searchProducts: () => []
        };
    }
    /**
     * Find product by name
     */
    async findByName(name) {
        try {
            const allProducts = await this.findAll();
            return allProducts.find(product => product.name.value.toLowerCase().includes(name.toLowerCase())) || null;
        }
        catch (error) {
            console.error('ProductDataAdapterTS.findByName error:', error);
            return null;
        }
    }
    /**
     * Find all products
     */
    async findAll() {
        try {
            const rawProducts = await this.productDataAdapter.getAllProducts?.() || [];
            return this.mapRawProductsToDomain(rawProducts);
        }
        catch (error) {
            console.error('ProductDataAdapterTS.findAll error:', error);
            return [];
        }
    }
    /**
     * Find products by category
     */
    async findByCategory(category) {
        try {
            const rawProducts = await this.productDataAdapter.getProductsByCategory?.(category.value) ||
                await this.productDataAdapter.getProducts?.(category.value) || [];
            return this.mapRawProductsToDomain(rawProducts);
        }
        catch (error) {
            console.error('ProductDataAdapterTS.findByCategory error:', error);
            return [];
        }
    }
    /**
     * Search products by text (name or ingredients)
     */
    async search(query) {
        try {
            const searchResults = await this.productDataAdapter.searchProducts?.(query) || [];
            if (searchResults.length > 0) {
                return this.mapRawProductsToDomain(searchResults);
            }
            // Fallback: search in all products
            const allProducts = await this.findAll();
            return allProducts.filter(product => product.name.value.toLowerCase().includes(query.toLowerCase()) ||
                product.ingredients.toLowerCase().includes(query.toLowerCase()));
        }
        catch (error) {
            console.error('ProductDataAdapterTS.search error:', error);
            return [];
        }
    }
    /**
     * Check if product exists
     */
    async exists(productId) {
        try {
            const product = await this.findByName(productId.value);
            return product !== null;
        }
        catch (error) {
            console.error('ProductDataAdapterTS.exists error:', error);
            return false;
        }
    }
    /**
     * Get drink options for a product
     */
    async getDrinkOptions(product) {
        try {
            // Return basic drink options - can be enhanced later
            if (product.isLiquor()) {
                return [
                    { name: 'Jugo de naranja', type: 'juice', additionalCost: 0 },
                    { name: 'Refresco de cola', type: 'soda', additionalCost: 0 },
                    { name: 'Agua mineral', type: 'water', additionalCost: 0 }
                ];
            }
            return [];
        }
        catch (error) {
            console.error('ProductDataAdapterTS.getDrinkOptions error:', error);
            return [];
        }
    }
    /**
     * Find products by multiple categories
     */
    async findByCategories(categories) {
        try {
            const results = [];
            for (const category of categories) {
                const categoryProducts = await this.findByCategory(category);
                results.push(...categoryProducts);
            }
            return results;
        }
        catch (error) {
            console.error('ProductDataAdapterTS.findByCategories error:', error);
            return [];
        }
    }
    /**
     * Find products by ingredients
     */
    async findByIngredients(ingredients) {
        try {
            const allProducts = await this.findAll();
            return allProducts.filter(product => ingredients.some(ingredient => product.ingredients.toLowerCase().includes(ingredient.toLowerCase())));
        }
        catch (error) {
            console.error('ProductDataAdapterTS.findByIngredients error:', error);
            return [];
        }
    }
    /**
     * Find products by price range
     */
    async findByPriceRange(minPrice, maxPrice) {
        try {
            const allProducts = await this.findAll();
            return allProducts.filter(product => {
                const price = product.price.toNumber();
                return price >= minPrice && price <= maxPrice;
            });
        }
        catch (error) {
            console.error('ProductDataAdapterTS.findByPriceRange error:', error);
            return [];
        }
    }
    /**
     * Map raw product data to domain entities
     */
    mapRawProductsToDomain(rawProducts) {
        return rawProducts.map(rawProduct => this.mapRawProductToDomain(rawProduct)).filter(Boolean);
    }
    /**
     * Map single raw product to domain entity
     */
    mapRawProductToDomain(rawProduct) {
        try {
            // Handle different possible field names from various data sources
            const id = rawProduct.id || rawProduct.productId || String(Math.random());
            const name = rawProduct.nombre || rawProduct.name || rawProduct.productName || 'Unknown Product';
            const price = this.extractPrice(rawProduct);
            const category = rawProduct.category || rawProduct.categoria || rawProduct.type || 'general';
            return new Product(new ProductId(String(id)), new ProductName(name), new ProductCategory(category), new Money(price), rawProduct.descripcion || rawProduct.description || rawProduct.ingredientes || rawProduct.ingredients || '');
        }
        catch (error) {
            console.warn('ProductDataAdapterTS: Error mapping product:', rawProduct, error);
            return null;
        }
    }
    /**
     * Extract price from raw product data
     */
    extractPrice(rawProduct) {
        // Try different possible price fields
        const priceFields = [
            'precio', 'price', 'cost', 'amount',
            'precioBotella', 'precioLitro', 'precioCopa'
        ];
        for (const field of priceFields) {
            const value = rawProduct[field];
            if (value !== undefined && value !== null) {
                const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));
                if (!isNaN(numericValue) && numericValue > 0) {
                    return numericValue;
                }
            }
        }
        return 0; // Default price
    }
    /**
     * Get available categories
     */
    async getAvailableCategories() {
        try {
            const allProducts = await this.findAll();
            const uniqueCategories = [...new Set(allProducts.map(p => p.category.value))];
            return uniqueCategories.map(cat => new ProductCategory(cat));
        }
        catch (error) {
            console.error('ProductDataAdapterTS.getAvailableCategories error:', error);
            return [];
        }
    }
}
//# sourceMappingURL=ProductDataAdapterTS.js.map