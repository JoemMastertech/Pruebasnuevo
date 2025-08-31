var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Validator_isEmpty, _Validator_validateEmail, _Validator_validatePhone, _Validator_validateNumber, _Validator_validateText, _Validator_validatePassword;
import { VALIDATION } from '../config/constants.js';
/**
 * Unified Validator Class
 * Provides both generic and domain-specific validation methods
 * Centralized validation logic with consistent error handling
 */
class Validator {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email format
     */
    static isValidEmail(email) {
        if (!email || typeof email !== 'string')
            return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }
    /**
     * Validate phone number format
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid phone format
     */
    static isValidPhone(phone) {
        if (!phone || typeof phone !== 'string')
            return false;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    /**
     * Validate if value is a positive number
     * @param {*} value - Value to validate
     * @returns {boolean} True if positive number
     */
    static isPositiveNumber(value) {
        const num = Number(value);
        return !isNaN(num) && num > 0;
    }
    /**
     * Validate text length
     * @param {string} text - Text to validate
     * @param {number} minLength - Minimum length
     * @param {number} maxLength - Maximum length
     * @returns {boolean} True if within length bounds
     */
    static isValidLength(text, minLength = 0, maxLength = Infinity) {
        if (typeof text !== 'string')
            return false;
        const length = text.trim().length;
        return length >= minLength && length <= maxLength;
    }
    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid URL
     */
    static isValidUrl(url) {
        if (!url || typeof url !== 'string')
            return false;
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    static validate(value, type, options = {}) {
        try {
            if (__classPrivateFieldGet(this, _a, "m", _Validator_isEmpty).call(this, value) && !options.optional) {
                return { isValid: false, message: 'Este campo es requerido' };
            }
            if (__classPrivateFieldGet(this, _a, "m", _Validator_isEmpty).call(this, value) && options.optional) {
                return { isValid: true, message: '' };
            }
            switch (type) {
                case 'email': return __classPrivateFieldGet(this, _a, "m", _Validator_validateEmail).call(this, value);
                case 'phone': return __classPrivateFieldGet(this, _a, "m", _Validator_validatePhone).call(this, value);
                case 'number': return __classPrivateFieldGet(this, _a, "m", _Validator_validateNumber).call(this, value, options);
                case 'text': return __classPrivateFieldGet(this, _a, "m", _Validator_validateText).call(this, value, options);
                case 'password': return __classPrivateFieldGet(this, _a, "m", _Validator_validatePassword).call(this, value);
                default:
                    return { isValid: true, message: '' };
            }
        }
        catch (error) {
            return { isValid: false, message: 'Error en la validación' };
        }
    }
    static validateFields(fields, rules) {
        const errors = {};
        let isValid = true;
        for (const [fieldName, rule] of Object.entries(rules)) {
            const value = fields[fieldName];
            const result = this.validate(value, rule.type, rule.options || {});
            if (!result.isValid) {
                errors[fieldName] = result.message;
                isValid = false;
            }
        }
        return { isValid, errors };
    }
    static sanitizeText(text) {
        if (typeof text !== 'string')
            return '';
        return text
            .trim()
            .replace(/[<>"'&]/g, '')
            .substring(0, 1000);
    }
    // Domain-specific validation methods
    /**
     * Validate product data
     * @param {Object} product - Product to validate
     * @returns {Object} Validation result
     */
    static validateProduct(product) {
        const errors = [];
        if (!product?.name?.trim())
            errors.push('Product name is required');
        if (!this.isPositiveNumber(product?.price))
            errors.push('Valid price is required');
        if (!product?.category?.trim())
            errors.push('Product category is required');
        return { isValid: errors.length === 0, errors };
    }
    /**
     * Validate cocktail data
     * @param {Object} cocktail - Cocktail to validate
     * @returns {Object} Validation result
     */
    static validateCocktail(cocktail) {
        const errors = [];
        if (!cocktail?.name?.trim())
            errors.push('Cocktail name is required');
        if (!this.isPositiveNumber(cocktail?.price))
            errors.push('Valid price is required');
        if (!cocktail?.ingredients?.length)
            errors.push('At least one ingredient is required');
        return { isValid: errors.length === 0, errors };
    }
    /**
     * Validate order data
     * @param {Object} order - Order to validate
     * @returns {Object} Validation result
     */
    static validateOrder(order) {
        const errors = [];
        if (!order?.items?.length)
            errors.push('Order must contain at least one item');
        if (!this.isPositiveNumber(order?.total))
            errors.push('Valid order total is required');
        return { isValid: errors.length === 0, errors };
    }
    /**
     * Validate beer data
     * @param {Object} beer - Beer to validate
     * @returns {Object} Validation result
     */
    static validateBeer(beer) {
        const errors = [];
        if (!beer?.nombre?.trim())
            errors.push('Beer name is required');
        if (!this.isPositiveNumber(beer?.precio))
            errors.push('Valid price is required');
        return { isValid: errors.length === 0, errors };
    }
    /**
     * Validate food data
     * @param {Object} food - Food to validate
     * @returns {Object} Validation result
     */
    static validateFood(food) {
        const errors = [];
        if (!food?.nombre?.trim())
            errors.push('Food name is required');
        if (!this.isPositiveNumber(food?.precio))
            errors.push('Valid price is required');
        return { isValid: errors.length === 0, errors };
    }
    /**
     * Throw error if validation fails
     * @param {Object} validation - Validation result
     * @param {string} context - Error context
     */
    static throwIfInvalid(validation, context = 'Validation') {
        if (!validation.isValid) {
            throw new Error(`${context} failed: ${validation.errors.join(', ')}`);
        }
    }
}
_a = Validator, _Validator_isEmpty = function _Validator_isEmpty(value) {
    return value === null || value === undefined || value === '' ||
        (typeof value === 'string' && value.trim() === '');
}, _Validator_validateEmail = function _Validator_validateEmail(email) {
    if (!VALIDATION.EMAIL_PATTERN.test(email)) {
        return { isValid: false, message: 'Email no válido' };
    }
    return { isValid: true, message: '' };
}, _Validator_validatePhone = function _Validator_validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!VALIDATION.PHONE_PATTERN.test(cleanPhone)) {
        return { isValid: false, message: 'Teléfono no válido' };
    }
    return { isValid: true, message: '' };
}, _Validator_validateNumber = function _Validator_validateNumber(value, options = {}) {
    const num = Number(value);
    if (isNaN(num)) {
        return { isValid: false, message: 'Debe ser un número válido' };
    }
    if (options.integer && !Number.isInteger(num)) {
        return { isValid: false, message: 'Debe ser un número entero' };
    }
    if (options.min !== undefined && num < options.min) {
        return { isValid: false, message: `Debe ser mayor o igual a ${options.min}` };
    }
    if (options.max !== undefined && num > options.max) {
        return { isValid: false, message: `Debe ser menor o igual a ${options.max}` };
    }
    return { isValid: true, message: '' };
}, _Validator_validateText = function _Validator_validateText(text, options = {}) {
    const minLength = options.minLength || VALIDATION.MIN_NAME_LENGTH;
    const maxLength = options.maxLength || VALIDATION.MAX_NAME_LENGTH;
    if (text.length < minLength) {
        return { isValid: false, message: `Debe tener al menos ${minLength} caracteres` };
    }
    if (text.length > maxLength) {
        return { isValid: false, message: `No puede exceder ${maxLength} caracteres` };
    }
    return { isValid: true, message: '' };
}, _Validator_validatePassword = function _Validator_validatePassword(password) {
    if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
        return {
            isValid: false,
            message: `La contraseña debe tener al menos ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`
        };
    }
    return { isValid: true, message: '' };
};
Validator.validateBatch = (validations) => validations.map(({ value, type, options = {} }) => _a.validate(value, type, options));
Validator.validateAndSanitize = (value, type, options = {}) => {
    const validation = _a.validate(value, type, options);
    const sanitizedValue = validation.isValid ? _a.sanitizeText(value) : '';
    return {
        ...validation,
        sanitizedValue
    };
};
export default Validator;
//# sourceMappingURL=validator.js.map