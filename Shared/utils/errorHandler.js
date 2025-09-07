import Logger from './logger.js';

class ErrorHandler {
  static handle(error, context = '', options = {}) {
    const errorMessage = error instanceof Error ? error.message : (error || 'Error desconocido');
    const timestamp = new Date().toISOString();
    
    // Log error with context
    window.Logger.error(`[${timestamp}] [${context}] ERROR: ${errorMessage}`, {
      name: error?.name,
      stack: error?.stack,
      context,
      additionalInfo: options.additionalInfo
    });
    
    // Return user-friendly message
    return this.#getUserFriendlyMessage(error);
  }
  
  static #getUserFriendlyMessage(error) {
    if (!error) return 'Algo salió mal. Por favor intenta de nuevo.';
    
    const errorType = error.name || error.constructor?.name || '';
    
    switch (errorType) {
      case 'NetworkError':
      case 'TypeError':
        if (error.message.includes('fetch')) {
          return 'Problema de conexión. Verifica tu internet e intenta de nuevo.';
        }
        break;
        
      case 'ValidationError':
        return error.message || 'Los datos ingresados no son válidos.';
        
      case 'DomainError':
        return error.message || 'Error en la operación solicitada.';
        
      case 'InfrastructureError':
        return 'Problema temporal del servicio. Intenta de nuevo en unos momentos.';
        
      default:
        if (error.message && error.message.length < 100) {
          // Si el mensaje es corto y comprensible, mostrarlo
          return error.message;
        }
    }
    
    return 'Algo salió mal. Por favor intenta de nuevo.';
  }
  
  static handleValidation(error, context = 'Validation') {
    return this.handle(error, context, { type: 'validation' });
  }
  
  static handleDomain(error, context = 'Domain') {
    return this.handle(error, context, { type: 'domain' });
  }

  static logWarning(message, context = {}) {
    window.Logger.warn(message, context);
  }

  static handleValidationError(field, value, rule) {
    const message = `Validation failed for field '${field}' with value '${value}': ${rule}`;
    this.handle(message, 'Validation', { field, value, rule });
    
    // Try to use ValidationError if available, otherwise use generic Error
    try {
      // Check if ValidationError is available globally
      if (typeof window !== 'undefined' && window.ValidationError) {
        throw new window.ValidationError(message);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      // Re-throw the error to maintain the expected behavior
      throw error;
    }
  }

  static showUserError(message, elementId = null) {
    this.handle(`User error: ${message}`, 'UI');
    
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = message;
        element.className = element.className.replace('error-hidden', '').trim() + ' error-red error-visible';
      }
    } else {
      // Fallback to alert if no element specified
      alert(`Error: ${message}`);
    }
  }

  static clearUserError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = '';
      element.className = element.className.replace('error-visible', '').replace('error-red', '').trim() + ' error-hidden';
    }
  }

  static handleXSSError(context, suspiciousData) {
    this.handle('¡ERROR DE SEGURIDAD XSS!', context, {
      type: 'security',
      suspiciousData,
      additionalInfo: `XSS attempt detected in ${context}`
    });
    
    // Trigger debugger in development (check if we're not in production)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      debugger;
    }
  }

  static async handleAsync(promise, context = '') {
    try {
      const result = await promise;
      return [null, result];
    } catch (error) {
      const userMessage = this.handle(error, context);
      return [{ originalError: error, userMessage }, null];
    }
  }
}

// Export the ErrorHandler class
export { ErrorHandler };

// Legacy exports for backward compatibility
export const logError = (message, error = null, context = {}) => {
  ErrorHandler.handle(error || message, context.module || 'Unknown', {
    additionalInfo: context
  });
};

export const logWarning = ErrorHandler.logWarning;
export const handleValidationError = ErrorHandler.handleValidationError;
export const handleMissingElementError = ErrorHandler.handle;
export const showUserError = ErrorHandler.showUserError;
export const clearUserError = ErrorHandler.clearUserError;
export const handleXSSError = ErrorHandler.handleXSSError;

// Expose ErrorHandler globally (only in browser environment)
if (typeof window !== 'undefined') {
  window.ErrorHandler = ErrorHandler;
  window.logError = logError;
  window.logWarning = ErrorHandler.logWarning;
  window.handleValidationError = ErrorHandler.handleValidationError;
  window.handleMissingElementError = ErrorHandler.handle;
  window.showUserError = ErrorHandler.showUserError;
  window.clearUserError = ErrorHandler.clearUserError;
  window.handleXSSError = ErrorHandler.handleXSSError;
}

// Export default object with all functions
export default {
  logError,
  logWarning,
  handleValidationError,
  handleMissingElementError,
  showUserError,
  clearUserError,
  handleXSSError
};