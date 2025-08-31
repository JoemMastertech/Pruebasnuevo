import { Product } from '../../Domain/Entities/Product.js';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort.js';
import { DrinkRulesPort, ValidationResult, DrinkSelection, DrinkOptions } from '../../Domain/Ports/DrinkRulesPort.js';
/**
 * Resultado de validación de producto
 */
export interface ProductValidationResult {
    isValid: boolean;
    product?: Product;
    drinkOptions?: DrinkOptions;
    errors: string[];
    warnings: string[];
}
/**
 * Datos de validación de producto
 */
export interface ProductValidationData {
    productName: string;
    selectedDrinks?: DrinkSelection[];
    cookingTerm?: string;
    quantity?: number;
}
/**
 * Caso de uso para validar productos y sus reglas de negocio
 * Centraliza toda la lógica de validación de productos
 */
export declare class ValidateProductUseCase {
    private readonly productRepository;
    private readonly drinkRules;
    constructor(productRepository: ProductRepositoryPort, drinkRules: DrinkRulesPort);
    /**
     * Valida un producto y sus selecciones
     */
    validateProduct(data: ProductValidationData): Promise<ProductValidationResult>;
    /**
     * Obtiene las opciones de bebida para un producto
     */
    getDrinkOptionsForProduct(productName: string): Promise<DrinkOptions | null>;
    /**
     * Verifica si un producto existe
     */
    productExists(productName: string): Promise<boolean>;
    /**
     * Valida solo la selección de bebidas para un producto
     */
    validateDrinkSelectionOnly(productName: string, selectedDrinks: DrinkSelection[]): Promise<ValidationResult>;
    /**
     * Obtiene información completa de un producto
     */
    getProductInfo(productName: string): Promise<{
        product: Product | null;
        drinkOptions: DrinkOptions | null;
        requiresDrinks: boolean;
        maxDrinks: number;
        minDrinks: number;
    }>;
    /**
     * Valida la cantidad de un producto
     */
    private validateQuantity;
    /**
     * Valida la selección de bebidas para un producto
     */
    private validateDrinkSelection;
    /**
     * Valida el término de cocción para un producto
     */
    private validateCookingTerm;
}
//# sourceMappingURL=ValidateProductUseCase.d.ts.map