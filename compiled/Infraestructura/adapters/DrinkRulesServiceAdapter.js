"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrinkRulesServiceAdapter = void 0;
const DrinkRulesPort_js_1 = require("../../Domain/Ports/DrinkRulesPort.js");
/**
 * Adaptador que implementa las reglas de bebidas
 * Conecta con el sistema de validación existente
 */
class DrinkRulesServiceAdapter {
    constructor(validationService) {
        /**
         * Reglas específicas por tipo de licor
         */
        this.liquorRules = {
            RON: {
                allowedDrinks: ['Coca Cola', 'Sprite', 'Agua Mineral', 'Hielos'],
                maxDrinks: 2,
                minDrinks: 1,
                allowMultiple: false,
                specialRules: ['no_citrus']
            },
            TEQUILA: {
                allowedDrinks: ['Coca Cola', 'Sprite', 'Agua Mineral', 'Jugo de Naranja', 'Hielos'],
                maxDrinks: 2,
                minDrinks: 1,
                allowMultiple: false
            },
            VODKA: {
                allowedDrinks: ['Coca Cola', 'Sprite', 'Jugo de Naranja', 'Jugo de Arándano', 'Agua Mineral', 'Hielos'],
                maxDrinks: 2,
                minDrinks: 1,
                allowMultiple: false
            },
            WHISKY: {
                allowedDrinks: ['Coca Cola', 'Sprite', 'Agua Mineral', 'Hielos'],
                maxDrinks: 2,
                minDrinks: 1,
                allowMultiple: false
            },
            JAGERMEISTER: {
                allowedDrinks: [],
                maxDrinks: 0,
                minDrinks: 0,
                allowMultiple: false,
                specialRules: ['no_drinks']
            },
            BOTELLA: {
                allowedDrinks: ['Coca Cola', 'Sprite', 'Agua Mineral', 'Jugo de Naranja', 'Hielos'],
                maxDrinks: 4,
                minDrinks: 2,
                allowMultiple: true
            },
            DEFAULT: {
                allowedDrinks: ['Coca Cola', 'Sprite', 'Agua Mineral', 'Hielos'],
                maxDrinks: 2,
                minDrinks: 1,
                allowMultiple: false
            }
        };
        this.validationService = validationService;
    }
    /**
     * Obtiene las opciones de bebida disponibles para un producto
     */
    getAvailableOptions(product) {
        if (!product.requiresDrinkSelection()) {
            return DrinkRulesPort_js_1.DrinkOptions.none();
        }
        const liquorType = product.getLiquorType();
        return this.getRulesForLiquorType(liquorType);
    }
    /**
     * Valida una selección de bebidas para un producto
     */
    validateDrinkSelection(product, selectedDrinks) {
        // 1. Verificar si el producto requiere bebidas
        if (!product.requiresDrinkSelection()) {
            if (selectedDrinks.length > 0) {
                return DrinkRulesPort_js_1.ValidationResult.failure('Este producto no permite selección de bebidas');
            }
            return DrinkRulesPort_js_1.ValidationResult.success();
        }
        // 2. Verificar límites de cantidad
        const maxLimit = this.getMaxDrinkLimit(product);
        const minLimit = this.getMinDrinkLimit(product);
        const totalDrinks = selectedDrinks.reduce((sum, drink) => sum + drink.quantity, 0);
        if (totalDrinks < minLimit) {
            return DrinkRulesPort_js_1.ValidationResult.failure(`Debe seleccionar al menos ${minLimit} bebida(s)`);
        }
        if (totalDrinks > maxLimit) {
            return DrinkRulesPort_js_1.ValidationResult.failure(`No puede seleccionar más de ${maxLimit} bebida(s)`);
        }
        // 3. Verificar disponibilidad de bebidas
        const availableOptions = this.getAvailableOptions(product);
        for (const drink of selectedDrinks) {
            if (!availableOptions.isValidOption(drink.drinkName)) {
                return DrinkRulesPort_js_1.ValidationResult.failure(`Bebida no disponible: ${drink.drinkName}`);
            }
            if (drink.quantity <= 0) {
                return DrinkRulesPort_js_1.ValidationResult.failure(`La cantidad debe ser mayor a cero para: ${drink.drinkName}`);
            }
        }
        // 4. Validar reglas específicas del licor
        const liquorValidation = this.validateLiquorSpecificRules(product, selectedDrinks);
        if (!liquorValidation.isValid) {
            return liquorValidation;
        }
        // 5. Validar compatibilidad entre bebidas
        const compatibilityValidation = this.validateDrinkCompatibilityInternal(selectedDrinks);
        if (!compatibilityValidation.isValid) {
            return compatibilityValidation;
        }
        return DrinkRulesPort_js_1.ValidationResult.success();
    }
    /**
     * Obtiene el límite máximo de bebidas para un producto
     */
    getMaxDrinkLimit(product) {
        if (!product.requiresDrinkSelection()) {
            return 0;
        }
        const liquorType = product.getLiquorType();
        const rules = this.liquorRules[liquorType] || this.liquorRules.DEFAULT;
        return rules.maxDrinks;
    }
    /**
     * Obtiene el límite mínimo de bebidas para un producto
     */
    getMinDrinkLimit(product) {
        if (!product.requiresDrinkSelection()) {
            return 0;
        }
        const liquorType = product.getLiquorType();
        const rules = this.liquorRules[liquorType] || this.liquorRules.DEFAULT;
        return rules.minDrinks || 1;
    }
    /**
     * Verifica si un producto requiere selección de bebidas
     */
    requiresDrinkSelection(product) {
        return product.requiresDrinkSelection();
    }
    /**
     * Verifica si un producto permite múltiples bebidas del mismo tipo
     */
    allowsMultipleDrinks(product) {
        if (!product.requiresDrinkSelection()) {
            return false;
        }
        const liquorType = product.getLiquorType();
        const rules = this.liquorRules[liquorType] || this.liquorRules.DEFAULT;
        return rules.allowMultiple || false;
    }
    /**
     * Obtiene las reglas específicas para un tipo de licor
     */
    getRulesForLiquorType(liquorType) {
        const rules = this.liquorRules[liquorType] || this.liquorRules.DEFAULT;
        return new DrinkRulesPort_js_1.DrinkOptions(rules.allowedDrinks, {
            maxCount: rules.maxDrinks,
            minCount: rules.minDrinks || 1,
            allowMultiple: rules.allowMultiple || false
        });
    }
    /**
     * Valida si una bebida específica es compatible con un producto
     */
    validateDrinkCompatibility(product, drinkName) {
        const availableOptions = this.getAvailableOptions(product);
        if (!availableOptions.isValidOption(drinkName)) {
            return DrinkRulesPort_js_1.ValidationResult.failure(`Bebida no compatible con este producto: ${drinkName}`);
        }
        return this.validateLiquorSpecificRules(product, [{ drinkName, quantity: 1 }]);
    }
    /**
     * Valida reglas específicas del licor
     */
    validateLiquorSpecificRules(product, selectedDrinks) {
        const liquorType = product.getLiquorType();
        const rules = this.liquorRules[liquorType] || this.liquorRules.DEFAULT;
        if ('specialRules' in rules && rules.specialRules) {
            for (const rule of rules.specialRules) {
                switch (rule) {
                    case 'no_drinks':
                        if (selectedDrinks.length > 0) {
                            return DrinkRulesPort_js_1.ValidationResult.failure('Jägermeister se sirve solo, sin bebidas acompañantes');
                        }
                        break;
                    case 'no_citrus':
                        const hasCitrus = selectedDrinks.some(drink => drink.drinkName.toLowerCase().includes('naranja') ||
                            drink.drinkName.toLowerCase().includes('limón') ||
                            drink.drinkName.toLowerCase().includes('lima'));
                        if (hasCitrus) {
                            return DrinkRulesPort_js_1.ValidationResult.failure('El ron no se puede mezclar con jugos cítricos');
                        }
                        break;
                }
            }
        }
        return DrinkRulesPort_js_1.ValidationResult.success();
    }
    /**
     * Valida compatibilidad entre bebidas seleccionadas
     */
    validateDrinkCompatibilityInternal(selectedDrinks) {
        const drinkNames = selectedDrinks.map(drink => drink.drinkName.toLowerCase());
        // Regla: No mezclar jugos con refrescos
        const hasJuice = drinkNames.some(name => name.includes('jugo'));
        const hasSoda = drinkNames.some(name => name.includes('coca') || name.includes('sprite') || name.includes('refresco'));
        if (hasJuice && hasSoda) {
            return DrinkRulesPort_js_1.ValidationResult.failure('No se pueden mezclar jugos con refrescos');
        }
        return DrinkRulesPort_js_1.ValidationResult.success();
    }
}
exports.DrinkRulesServiceAdapter = DrinkRulesServiceAdapter;
