export default Validator;
/**
 * Unified Validator Class
 * Provides both generic and domain-specific validation methods
 * Centralized validation logic with consistent error handling
 */
declare class Validator {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email format
     */
    static isValidEmail(email: string): boolean;
    /**
     * Validate phone number format
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid phone format
     */
    static isValidPhone(phone: string): boolean;
    /**
     * Validate if value is a positive number
     * @param {*} value - Value to validate
     * @returns {boolean} True if positive number
     */
    static isPositiveNumber(value: any): boolean;
    /**
     * Validate text length
     * @param {string} text - Text to validate
     * @param {number} minLength - Minimum length
     * @param {number} maxLength - Maximum length
     * @returns {boolean} True if within length bounds
     */
    static isValidLength(text: string, minLength?: number, maxLength?: number): boolean;
    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid URL
     */
    static isValidUrl(url: string): boolean;
    static validate(value: any, type: any, options?: {}): {
        isValid: boolean;
        message: string;
    };
    static validateFields(fields: any, rules: any): {
        isValid: boolean;
        errors: {};
    };
    static "__#1@#isEmpty"(value: any): boolean;
    static "__#1@#validateEmail"(email: any): {
        isValid: boolean;
        message: string;
    };
    static "__#1@#validatePhone"(phone: any): {
        isValid: boolean;
        message: string;
    };
    static "__#1@#validateNumber"(value: any, options?: {}): {
        isValid: boolean;
        message: string;
    };
    static "__#1@#validateText"(text: any, options?: {}): {
        isValid: boolean;
        message: string;
    };
    static "__#1@#validatePassword"(password: any): {
        isValid: boolean;
        message: string;
    };
    static sanitizeText(text: any): string;
    static validateBatch: (validations: any) => any;
    static validateAndSanitize: (value: any, type: any, options?: {}) => {
        sanitizedValue: string;
        isValid: boolean;
        message: string;
    };
    /**
     * Validate product data
     * @param {Object} product - Product to validate
     * @returns {Object} Validation result
     */
    static validateProduct(product: Object): Object;
    /**
     * Validate cocktail data
     * @param {Object} cocktail - Cocktail to validate
     * @returns {Object} Validation result
     */
    static validateCocktail(cocktail: Object): Object;
    /**
     * Validate order data
     * @param {Object} order - Order to validate
     * @returns {Object} Validation result
     */
    static validateOrder(order: Object): Object;
    /**
     * Validate beer data
     * @param {Object} beer - Beer to validate
     * @returns {Object} Validation result
     */
    static validateBeer(beer: Object): Object;
    /**
     * Validate food data
     * @param {Object} food - Food to validate
     * @returns {Object} Validation result
     */
    static validateFood(food: Object): Object;
    /**
     * Throw error if validation fails
     * @param {Object} validation - Validation result
     * @param {string} context - Error context
     */
    static throwIfInvalid(validation: Object, context?: string): void;
}
//# sourceMappingURL=validator.d.ts.map