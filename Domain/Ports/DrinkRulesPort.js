"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationResult = exports.DrinkOptions = void 0;
/**
 * Opciones de bebida disponibles para un producto
 */
class DrinkOptions {
    constructor(availableOptions, config) {
        this.availableOptions = availableOptions;
        this.config = config;
    }
    static none() {
        return new DrinkOptions([], { maxCount: 0 });
    }
    hasOptions() {
        return this.availableOptions.length > 0;
    }
    isValidOption(drinkName) {
        return this.availableOptions.includes(drinkName);
    }
}
exports.DrinkOptions = DrinkOptions;
/**
 * Resultado de validación
 */
class ValidationResult {
    constructor(isValid, errorMessage, warnings = []) {
        this.isValid = isValid;
        this.errorMessage = errorMessage;
        this.warnings = warnings;
    }
    static success() {
        return new ValidationResult(true);
    }
    static failure(message) {
        return new ValidationResult(false, message);
    }
    static warning(message) {
        return new ValidationResult(true, undefined, [message]);
    }
}
exports.ValidationResult = ValidationResult;
