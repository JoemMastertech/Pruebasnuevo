var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _ErrorHandler_getUserFriendlyMessage;
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
        return __classPrivateFieldGet(this, _a, "m", _ErrorHandler_getUserFriendlyMessage).call(this, error);
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
        // Import ValidationError dynamically to avoid circular dependencies
        import('../../Dominio/exceptions/ValidationError.js')
            .then(({ default: ValidationError }) => {
            throw new ValidationError(message);
        })
            .catch(importError => {
            // Fallback if ValidationError is not available
            throw new Error(message);
        });
    }
    static showUserError(message, elementId = null) {
        this.handle(`User error: ${message}`, 'UI');
        if (elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = message;
                element.className = element.className.replace('error-hidden', '').trim() + ' error-red error-visible';
            }
        }
        else {
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
        // Trigger debugger in development
        if (process.env.NODE_ENV === 'development') {
            debugger;
        }
    }
    static async handleAsync(promise, context = '') {
        try {
            const result = await promise;
            return [null, result];
        }
        catch (error) {
            const userMessage = this.handle(error, context);
            return [{ originalError: error, userMessage }, null];
        }
    }
}
_a = ErrorHandler, _ErrorHandler_getUserFriendlyMessage = function _ErrorHandler_getUserFriendlyMessage(error) {
    if (!error)
        return 'Algo salió mal. Por favor intenta de nuevo.';
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
};
// Export the main ErrorHandler class
export { ErrorHandler };
export default ErrorHandler;
// Legacy exports for backward compatibility
export const logError = (message, error = null, context = {}) => {
    ErrorHandler.handle(error || message, context.module || 'Unknown', {
        additionalInfo: context
    });
};
// Expose ErrorHandler globally
// Expose ErrorHandler globally (only in browser environment)
if (typeof window !== 'undefined') {
    window.ErrorHandler = ErrorHandler;
}
if (typeof window !== 'undefined') {
    window.logError = logError;
    window.logWarning = ErrorHandler.logWarning;
}
if (typeof window !== 'undefined') {
    window.handleValidationError = ErrorHandler.handleValidationError;
    window.handleMissingElementError = ErrorHandler.handle;
}
if (typeof window !== 'undefined') {
    window.showUserError = ErrorHandler.showUserError;
    window.clearUserError = ErrorHandler.clearUserError;
}
if (typeof window !== 'undefined') {
    window.handleXSSError = ErrorHandler.handleXSSError;
}
export const logWarning = ErrorHandler.logWarning;
export const handleValidationError = ErrorHandler.handleValidationError;
export const handleMissingElementError = ErrorHandler.handle;
export const showUserError = ErrorHandler.showUserError;
export const clearUserError = ErrorHandler.clearUserError;
export const handleXSSError = ErrorHandler.handleXSSError;
//# sourceMappingURL=errorHandler.js.map