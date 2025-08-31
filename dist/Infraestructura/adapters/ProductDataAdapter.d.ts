export default ProductDataAdapter;
/**
 * Product Data Adapter - Infrastructure implementation of ProductRepositoryPort
 * Adapts the existing ProductData to the domain port interface
 * Part of Hexagonal Architecture - Infrastructure layer adapter
 */
declare class ProductDataAdapter extends BaseAdapter {
    productData: {
        cocteles: {
            id: string;
            nombre: string;
            ingredientes: string;
            video: string;
            precio: string;
            imagen: string;
        }[];
        refrescos: {
            id: string;
            nombre: string;
            categoria: string;
            tipo_contenido: string;
            ruta_archivo: string;
            precio: string;
        }[];
        cervezas: {
            id: string;
            nombre: string;
            categoria: string;
            tipo_contenido: string;
            ruta_archivo: string;
            precio: string;
        }[];
        licoresCategories: {
            id: string;
            nombre: string;
            icono: string;
        }[];
        brandies: {
            id: string;
            nombre: string;
            imagen: string;
            precioBotella: string;
            precioLitro: string;
            precioCopa: string;
        }[];
        cognacs: {
            id: string;
            nombre: string;
            imagen: string;
            precioBotella: string;
            precioLitro: string;
            precioCopa: string;
        }[];
        digestivos: {
            id: string;
            nombre: string;
            imagen: string;
            precioBotella: string;
            precioCopa: string;
        }[];
        espumosos: {
            id: string;
            nombre: string;
            imagen: string;
            precioBotella: string;
        }[];
        ginebras: {
            id: string;
            nombre: string;
            imagen: string;
            precioBotella: string;
            precioLitro: string;
            precioCopa: string;
        }[];
        mezcales: {
            id: string;
            nombre: string;
            imagen: string;
            precioBotella: string;
            precioLitro: string;
            precioCopa: string;
        }[];
        rones: {
            id: string;
            nombre: string;
            imagen: string;
            precioBotella: string;
            precioLitro: string;
            precioCopa: string;
        }[];
        tequilas: {
            id: string;
            nombre: string;
            imagen: string;
            precioBotella: string;
            precioLitro: string;
            precioCopa: string;
        }[];
        vodkas: {
            id: string;
            nombre: string;
            imagen: string;
            precioBotella: string;
            precioLitro: string;
            precioCopa: string;
        }[];
        whiskies: {
            id: string;
            nombre: string;
            imagen: string;
            precioBotella: string;
            precioLitro: string;
            precioCopa: string;
        }[];
        alitas: {
            id: string;
            nombre: string;
            ingredientes: string;
            video: string;
            precio: string;
        }[];
        ensaladas: {
            id: string;
            nombre: string;
            ingredientes: string;
            video: string;
            precio: string;
        }[];
        carnes: {
            id: string;
            nombre: string;
            ingredientes: string;
            video: string;
            precio: string;
        }[];
        cafes: {
            id: string;
            nombre: string;
            ingredientes: string;
            video: string;
            precio: string;
        }[];
        postres: {
            id: string;
            nombre: string;
            ingredientes: string;
            video: string;
            precio: string;
        }[];
        pizzas: {
            id: string;
            nombre: string;
            ingredientes: string;
            video: string;
            precio: string;
        }[];
        sopas: {
            id: string;
            nombre: string;
            ingredientes: string;
            video: string;
            precio: string;
        }[];
    };
    supabaseUrl: any;
    supabaseKey: any;
    syncService: DataSyncService;
    /**
     * Fetch data from Supabase table with immediate local data return
     * @param {string} tableName - Name of the Supabase table
     * @returns {Promise<Array>} Array of records from the table
     * @private
     */
    private _fetchFromSupabase;
    /**
     * Update data from Supabase in background without blocking UI
     * @param {string} tableName - Name of the Supabase table
     * @private
     */
    private _updateFromSupabaseBackground;
    /**
     * Normalize Supabase data to match manual data structure
     * @param {Array} data - Raw data from Supabase
     * @param {string} tableName - Name of the table
     * @returns {Array} Normalized data
     * @private
     */
    private _normalizeSupabaseData;
    /**
     * Get all cocktails (async with Supabase)
     * @returns {Promise<Array>} Array of cocktail objects
     */
    getCocteles(): Promise<any[]>;
    /**
     * Get all beverages (refrescos) (async with Supabase)
     * @returns {Promise<Array>} Array of beverage objects
     */
    getRefrescos(): Promise<any[]>;
    /**
     * Get all liquors (async with Supabase)
     * @returns {Promise<Array>} Array of liquor objects
     */
    getLicores(): Promise<any[]>;
    /**
     * Get all beers (async with Supabase)
     * @returns {Promise<Array>} Array of beer objects
     */
    getCervezas(): Promise<any[]>;
    /**
     * Get all pizzas (async with Supabase)
     * @returns {Promise<Array>} Array of pizza objects
     */
    getPizzas(): Promise<any[]>;
    /**
     * Get all wings (alitas) (async with Supabase)
     * @returns {Promise<Array>} Array of wing objects
     */
    getAlitas(): Promise<any[]>;
    /**
     * Get all soups (async with Supabase)
     * @returns {Promise<Array>} Array of soup objects
     */
    getSopas(): Promise<any[]>;
    /**
     * Get all salads (async with Supabase)
     * @returns {Promise<Array>} Array of salad objects
     */
    getEnsaladas(): Promise<any[]>;
    /**
     * Get all meats (async with Supabase)
     * @returns {Promise<Array>} Array of meat objects
     */
    getCarnes(): Promise<any[]>;
    /**
     * Get all coffee products (async with Supabase)
     * @returns {Promise<Array>} Array of coffee objects
     */
    getCafe(): Promise<any[]>;
    /**
     * Get all sparkling wines (async with Supabase)
     * @returns {Promise<Array>} Array of sparkling wine objects
     */
    getEspumosos(): Promise<any[]>;
    /**
     * Get all desserts (async with Supabase)
     * @returns {Promise<Array>} Array of dessert objects
     */
    getPostres(): Promise<any[]>;
    /**
     * Get product by ID
     * @param {string} id - Product identifier
     * @returns {Object|null} Product object or null if not found
     */
    getProductById(id: string): Object | null;
    /**
     * Get products by category (async with Supabase)
     * @param {string} category - Product category
     * @returns {Promise<Array>} Array of products in the category
     */
    getProductsByCategory(category: string): Promise<any[]>;
    /**
     * Search products by name or ingredients
     * @param {string} query - Search query
     * @returns {Array} Array of matching products
     */
    searchProducts(query: string): any[];
    /**
     * Get all available categories
     * @returns {Array} Array of category names
     */
    getAvailableCategories(): any[];
    /**
     * Get total count of products across all categories
     * @returns {number} Total number of products
     */
    getTotalProductCount(): number;
    /**
     * Get liquor categories for navigation
     * @returns {Array} Array of liquor category objects
     */
    getLicoresCategories(): any[];
    /**
     * Get products by liquor subcategory (async with Supabase)
     * @param {string} subcategory - Liquor subcategory (whiskies, tequilas, etc.)
     * @returns {Promise<Array>} Array of products in the subcategory
     */
    getLiquorSubcategory(subcategory: string): Promise<any[]>;
    /**
     * Force immediate synchronization of all data
     * @returns {Promise<void>}
     */
    forceSyncNow(): Promise<void>;
    /**
     * Get synchronization status
     * @returns {Object} Sync status information
     */
    getSyncStatus(): Object;
    /**
     * Start automatic synchronization
     */
    startAutoSync(): void;
    /**
     * Stop automatic synchronization
     */
    stopAutoSync(): void;
    /**
     * Clean up resources
     */
    destroy(): void;
}
import BaseAdapter from './BaseAdapter.js';
import DataSyncService from '../../Shared/services/DataSyncService.js';
//# sourceMappingURL=ProductDataAdapter.d.ts.map