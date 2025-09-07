/**
 * Utils Index - Punto único de entrada para todas las utilidades
 * Centraliza exports para importaciones más limpias y mejor tree shaking
 * 
 * Uso:
 * import { Logger, formatPrice, showModal } from '../utils';
 * 
 * En lugar de:
 * import Logger from '../utils/logger.js';
 * import { formatPrice } from '../utils/formatters.js';
 * import { showModal } from '../utils/domUtils.js';
 */

// Logger - Sistema de logging centralizado
export { default as Logger } from './logger.js';

// Error Handler - Manejo centralizado de errores
export { 
  logError, 
  logWarning, 
  ErrorHandler,
  handleMissingElementError,
  showUserError,
  clearUserError,
  handleXSSError
} from './errorHandler.js';

// Formatters - Utilidades de formateo
export { 
  formatPrice, 
  formatProductName, 
  formatIngredients,
  formatTitle,
  formatNumber,
  cleanText
} from './formatters.js';

// DOM Utils - Manipulación DOM y modales
export { 
  setSafeInnerHTML, 
  showModal, 
  hideModal,
  enhanceModal,
  getElementSafely,
  updateElementText,
  toggleElementClass
} from './domUtils.js';

// Validator - Validaciones centralizadas
export { default as Validator } from './validator.js';

// DI Utils - Utilidades de Dependency Injection
export { 
  getProductRepository, 
  resolveService,
  isDIContainerAvailable
} from './diUtils.js';

// Calculation Utils - Cálculos de negocio
export { 
  calculateTotalDrinkCount,
  calculateTotalJuiceCount,
  calculateTotalJagerDrinkCount,
  calculatePrice,
  calculateOrderTotal,
  isJuiceOption,
  getIngredientPrice
} from './calculationUtils.js';

// Simple Cache - Sistema de caché
export { default as SimpleCache } from './simpleCache.js';

// Sanitizer - Sanitización XSS
export { 
  sanitizeHTML, 
  sanitizeText, 
  sanitizeURL,
  sanitize,
  sanitizeBatch
} from './sanitizer.js';

// Sync Monitor - Solo en desarrollo
export { default as SyncMonitor } from './syncMonitor.js';

// Re-export individual modules for backward compatibility
export { default as calculationUtils } from './calculationUtils.js';
export { default as diUtils } from './diUtils.js';
export { default as domUtils } from './domUtils.js';
export { default as errorHandler } from './errorHandler.js';
export { default as formatters } from './formatters.js';
export { default as sanitizer } from './sanitizer.js';
export { default as simpleCache } from './simpleCache.js';
export { default as syncMonitor } from './syncMonitor.js';
export { default as validator } from './validator.js';

/**
 * Utilidades más comunes - Shortcuts para imports frecuentes
 */
export const utils = {
  Logger,
  formatPrice: (price, presentation) => formatPrice(price, presentation),
  showModal: (modalId) => showModal(modalId),
  hideModal: (modalId) => hideModal(modalId),
  logError: (error, context) => logError(error, context),
  sanitizeHTML: (html, options) => sanitizeHTML(html, options)
};

/**
 * Información del módulo
 */
export const UTILS_INFO = {
  version: '1.0.0',
  description: 'Utilidades centralizadas del proyecto',
  modules: [
    'calculationUtils',
    'diUtils', 
    'domUtils',
    'errorHandler',
    'formatters',
    'logger',
    'sanitizer',
    'simpleCache',
    'syncMonitor',
    'validator'
  ]
};