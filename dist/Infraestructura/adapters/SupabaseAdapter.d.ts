/**
 * Supabase Database Adapter
 * Handles all interactions with the Supabase backend for product data
 * Implements CocktailRepositoryPort interface for cocktail operations
 * Implements error handling and fallback strategies for reliability
 * Used as alternative to local ProductData for live database integration
 *
 * @class SupabaseAdapter
 * @extends CocktailRepositoryPort
 */
export default class SupabaseAdapter extends CocktailRepositoryPort {
    client: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
    port: CocktailRepositoryPort;
    /**
     * Retrieves products by category with error handling
     * @param {string} type - Product category (cocteleria, refrescos, etc.)
     * @returns {Array} Array of product objects or empty array on error
     */
    getProducts(type: string): any[];
    /**
     * Implements CocktailRepositoryPort.getAllCocktails()
     * Retrieves all cocktails from the database
     * Maps to specific columns needed for cocktail display
     *
     * @returns {Promise<Array>} Array of cocktail objects with required fields
     * @throws {Error} When database query fails
     */
    getAllCocktails(): Promise<any[]>;
    /**
     * Legacy method for backward compatibility
     * @deprecated Use getAllCocktails() instead
     * @returns {Promise<Array>} Array of cocktail objects
     */
    getCocktails(): Promise<any[]>;
    /**
     * Get products by specific category
     * @param {string} category - Product category (refrescos, licores, etc.)
     * @returns {Promise<Array>} Array of products in the category
     */
    getProductsByCategory(category: string): Promise<any[]>;
}
import CocktailRepositoryPort from '../../Dominio/ports/CocktailRepositoryPort.js';
//# sourceMappingURL=SupabaseAdapter.d.ts.map