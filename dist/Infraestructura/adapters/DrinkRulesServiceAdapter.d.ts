import { Product } from '../../Domain/Entities/Product.js';
import { DrinkRulesPort, DrinkOptions, DrinkSelection, ValidationResult } from '../../Domain/Ports/DrinkRulesPort.js';
/**
 * Adaptador que implementa las reglas de bebidas
 * Conecta con el sistema de validación existente
 */
export declare class DrinkRulesServiceAdapter implements DrinkRulesPort {
    private readonly validationService;
    constructor(validationService?: any);
    /**
     * Obtiene las opciones de bebida disponibles para un producto
     */
    getAvailableOptions(product: Product): DrinkOptions;
    /**
     * Valida una selección de bebidas para un producto
     */
    validateDrinkSelection(product: Product, selectedDrinks: DrinkSelection[]): ValidationResult;
    /**
     * Obtiene el límite máximo de bebidas para un producto
     */
    getMaxDrinkLimit(product: Product): number;
    /**
     * Obtiene el límite mínimo de bebidas para un producto
     */
    getMinDrinkLimit(product: Product): number;
    /**
     * Verifica si un producto requiere selección de bebidas
     */
    requiresDrinkSelection(product: Product): boolean;
    /**
     * Verifica si un producto permite múltiples bebidas del mismo tipo
     */
    allowsMultipleDrinks(product: Product): boolean;
    /**
     * Obtiene las reglas específicas para un tipo de licor
     */
    getRulesForLiquorType(liquorType: string): DrinkOptions;
    /**
     * Valida si una bebida específica es compatible con un producto
     */
    validateDrinkCompatibility(product: Product, drinkName: string): ValidationResult;
    /**
     * Reglas específicas por tipo de licor
     */
    private readonly liquorRules;
    /**
     * Valida reglas específicas del licor
     */
    private validateLiquorSpecificRules;
    /**
     * Valida compatibilidad entre bebidas seleccionadas
     */
    private validateDrinkCompatibilityInternal;
}
//# sourceMappingURL=DrinkRulesServiceAdapter.d.ts.map