import { Product } from '../Entities/Product.js';
/**
 * Selección de bebida realizada por el usuario
 */
export interface DrinkSelection {
    drinkName: string;
    quantity: number;
}
/**
 * Opciones de bebida disponibles para un producto
 */
export declare class DrinkOptions {
    readonly availableOptions: string[];
    readonly config: {
        maxCount: number;
        minCount?: number;
        allowMultiple?: boolean;
    };
    constructor(availableOptions: string[], config: {
        maxCount: number;
        minCount?: number;
        allowMultiple?: boolean;
    });
    static none(): DrinkOptions;
    hasOptions(): boolean;
    isValidOption(drinkName: string): boolean;
}
/**
 * Resultado de validación
 */
export declare class ValidationResult {
    readonly isValid: boolean;
    readonly errorMessage?: string | undefined;
    readonly warnings: string[];
    constructor(isValid: boolean, errorMessage?: string | undefined, warnings?: string[]);
    static success(): ValidationResult;
    static failure(message: string): ValidationResult;
    static warning(message: string): ValidationResult;
}
/**
 * Puerto del dominio para las reglas de bebidas
 * Define el contrato para la lógica de negocio de bebidas acompañantes
 */
export interface DrinkRulesPort {
    /**
     * Obtiene las opciones de bebida disponibles para un producto
     * @param product Producto
     * @returns DrinkOptions Opciones de bebida
     */
    getAvailableOptions(product: Product): DrinkOptions;
    /**
     * Valida una selección de bebidas
     * @param product Producto
     * @param selectedDrinks Bebidas seleccionadas
     * @returns ValidationResult Resultado de validación
     */
    validateDrinkSelection(product: Product, selectedDrinks: DrinkSelection[]): ValidationResult;
    /**
     * Obtiene el límite máximo de bebidas para un producto
     * @param product Producto
     * @returns number Límite máximo
     */
    getMaxDrinkLimit(product: Product): number;
    /**
     * Obtiene el límite mínimo de bebidas para un producto
     * @param product Producto
     * @returns number Límite mínimo
     */
    getMinDrinkLimit(product: Product): number;
    /**
     * Verifica si un producto requiere selección de bebidas
     * @param product Producto
     * @returns boolean True si requiere selección
     */
    requiresDrinkSelection(product: Product): boolean;
    /**
     * Verifica si un producto permite múltiples bebidas del mismo tipo
     * @param product Producto
     * @returns boolean True si permite múltiples
     */
    allowsMultipleDrinks(product: Product): boolean;
    /**
     * Obtiene las reglas específicas para un tipo de licor
     * @param liquorType Tipo de licor
     * @returns DrinkOptions Opciones específicas
     */
    getRulesForLiquorType(liquorType: string): DrinkOptions;
    /**
     * Valida si una bebida específica es compatible con un producto
     * @param product Producto
     * @param drinkName Nombre de la bebida
     * @returns ValidationResult Resultado de validación
     */
    validateDrinkCompatibility(product: Product, drinkName: string): ValidationResult;
}
//# sourceMappingURL=DrinkRulesPort.d.ts.map