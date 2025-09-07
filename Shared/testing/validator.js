/**
 * Simplified Validator Class for Testing
 * Standalone version without external dependencies
 */
class Validator {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email format
   */
  static isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid phone format
   */
  static isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
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
    if (typeof text !== 'string') return false;
    const length = text.trim().length;
    return length >= minLength && length <= maxLength;
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  static isValidUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Constants for validation
  static get VALIDATION() {
    return {
      EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      PHONE_PATTERN: /^[\+]?[1-9][\d]{0,15}$/,
      MIN_NAME_LENGTH: 2,
      MAX_NAME_LENGTH: 100,
      MIN_PASSWORD_LENGTH: 6
    };
  }

  static validate(value, type, options = {}) {
    try {
      if (this.#isEmpty(value) && !options.optional) {
        return { isValid: false, message: 'Este campo es requerido' };
      }
      
      if (this.#isEmpty(value) && options.optional) {
        return { isValid: true, message: '' };
      }
      
      switch (type) {
        case 'email': return this.#validateEmail(value);
        case 'phone': return this.#validatePhone(value);
        case 'number': return this.#validateNumber(value, options);
        case 'text': return this.#validateText(value, options);
        case 'password': return this.#validatePassword(value);
        default:
          return { isValid: true, message: '' };
      }
    } catch (error) {
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
  
  static #isEmpty(value) {
    return value === null || value === undefined || value === '' || 
           (typeof value === 'string' && value.trim() === '');
  }
  
  static #validateEmail(email) {
    if (!this.VALIDATION.EMAIL_PATTERN.test(email)) {
      return { isValid: false, message: 'Email no válido' };
    }
    return { isValid: true, message: '' };
  }
  
  static #validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!this.VALIDATION.PHONE_PATTERN.test(cleanPhone)) {
      return { isValid: false, message: 'Teléfono no válido' };
    }
    return { isValid: true, message: '' };
  }
  
  static #validateNumber(value, options = {}) {
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
  }
  
  static #validateText(text, options = {}) {
    const minLength = options.minLength || this.VALIDATION.MIN_NAME_LENGTH;
    const maxLength = options.maxLength || this.VALIDATION.MAX_NAME_LENGTH;
    
    if (text.length < minLength) {
      return { isValid: false, message: `Debe tener al menos ${minLength} caracteres` };
    }
    
    if (text.length > maxLength) {
      return { isValid: false, message: `No puede exceder ${maxLength} caracteres` };
    }
    
    return { isValid: true, message: '' };
  }
  
  static #validatePassword(password) {
    if (password.length < this.VALIDATION.MIN_PASSWORD_LENGTH) {
      return { 
        isValid: false, 
        message: `La contraseña debe tener al menos ${this.VALIDATION.MIN_PASSWORD_LENGTH} caracteres` 
      };
    }
    
    return { isValid: true, message: '' };
  }
  
  static sanitizeText(text) {
    if (typeof text !== 'string') return '';
    
    return text
      .trim()
      .replace(/[<>"'&]/g, '')
      .substring(0, 1000);
  }

  // Domain-specific validation methods
  static validateProduct(product) {
    const errors = [];
    if (!product?.name?.trim()) errors.push('Product name is required');
    if (!this.isPositiveNumber(product?.price)) errors.push('Valid price is required');
    if (!product?.category?.trim()) errors.push('Product category is required');
    return { isValid: errors.length === 0, errors };
  }

  static validateCocktail(cocktail) {
    const errors = [];
    if (!cocktail?.name?.trim()) errors.push('Cocktail name is required');
    if (!this.isPositiveNumber(cocktail?.price)) errors.push('Valid price is required');
    if (!cocktail?.ingredients?.length) errors.push('At least one ingredient is required');
    return { isValid: errors.length === 0, errors };
  }

  static validateOrder(order) {
    const errors = [];
    if (!order?.items?.length) errors.push('Order must contain at least one item');
    if (!this.isPositiveNumber(order?.total)) errors.push('Valid order total is required');
    return { isValid: errors.length === 0, errors };
  }

  static validateBeer(beer) {
    const errors = [];
    if (!beer?.nombre?.trim()) errors.push('Beer name is required');
    if (!this.isPositiveNumber(beer?.precio)) errors.push('Valid price is required');
    return { isValid: errors.length === 0, errors };
  }

  static validateFood(food) {
    const errors = [];
    if (!food?.nombre?.trim()) errors.push('Food name is required');
    if (!this.isPositiveNumber(food?.precio)) errors.push('Valid price is required');
    return { isValid: errors.length === 0, errors };
  }

  static throwIfInvalid(validation, context = 'Validation') {
    if (!validation.isValid) {
      throw new Error(`${context} failed: ${validation.errors.join(', ')}`);
    }
  }
}

export default Validator;