/**
 * Centralized validation module for OrderSystem
 * Contains all validation logic extracted from order-system.js
 * Provides consistent validation methods with proper error handling
 */
export class OrderSystemValidations {
    /**
     * Validates if a product selection is allowed
     * @param {Event} event - The click event
     * @param {boolean} isOrderMode - Current order mode state
     * @returns {boolean} True if selection is valid
     */
    static validateSelection(event: Event, isOrderMode: boolean): boolean;
    /**
     * Validates drink options result from product lookup
     * @param {Object} drinkOptionsResult - Result from getDrinkOptionsForProduct
     * @param {string} productName - Name of the product for logging
     * @returns {boolean} True if drink options are valid
     */
    static validateDrinkOptions(drinkOptionsResult: Object, productName: string): boolean;
    /**
     * Validates if current drink selection is valid for confirmation
     * @param {Array} selectedDrinks - Currently selected drinks
     * @param {Object} drinkCounts - Drink count mappings
     * @param {Object} currentProduct - Current product being processed
     * @returns {boolean} True if selection is valid
     */
    static hasValidDrinkSelection(selectedDrinks: any[], drinkCounts: Object, currentProduct: Object): boolean;
    /**
     * Validates cooking term selection for meat products
     * @param {string} selectedCookingTerm - Currently selected cooking term
     * @returns {boolean} True if cooking term is selected
     */
    static validateCookingTerm(selectedCookingTerm: string): boolean;
    /**
     * Validates product name input
     * @param {string} productName - Product name to validate
     * @returns {Object} Validation result with isValid and message
     */
    static validateProductName(productName: string): Object;
    /**
     * Validates if order has items before completion
     * @param {Array} orderItems - Current order items
     * @returns {Object} Validation result
     */
    static validateOrderCompletion(orderItems: any[]): Object;
    /**
     * Validates special bottle rules for drink selection
     * @param {boolean} isJuice - Whether the drink being added is a juice
     * @param {number} totalJuices - Current total juice count
     * @param {number} totalRefrescos - Current total soda count
     * @param {string} bottleCategory - Category of the bottle product
     * @param {string} productName - Name of the current product
     * @returns {boolean} True if the drink can be added
     */
    static validateSpecialBottleRules(isJuice: boolean, totalJuices: number, totalRefrescos: number, bottleCategory: string, productName: string): boolean;
    /**
     * Validates special drink limits for button disabling
     * @param {boolean} isJuice - Whether the drink is a juice
     * @param {number} totalJuices - Current total juice count
     * @param {number} totalRefrescos - Current total soda count
     * @param {string} bottleCategory - Category of the bottle product
     * @param {string} productName - Name of the current product
     * @returns {boolean} True if the button should be disabled
     */
    static validateSpecialDrinkLimits(isJuice: boolean, totalJuices: number, totalRefrescos: number, bottleCategory: string, productName: string): boolean;
    /**
     * Validates if a drink can be added based on current counts and limits
     * @param {boolean} isJuice - Whether the drink being added is a juice
     * @param {number} totalCount - Total current drink count
     * @param {number} maxDrinkCount - Maximum allowed drinks
     * @param {number} totalJuices - Current total juice count
     * @param {number} totalRefrescos - Current total soda count
     * @param {string} bottleCategory - Category of the bottle product
     * @param {string} productName - Name of the current product
     * @returns {boolean} True if drink can be added
     */
    static canAddDrink(isJuice: boolean, totalCount: number, maxDrinkCount: number, totalJuices: number, totalRefrescos: number, bottleCategory: string, productName: string): boolean;
    /**
     * Checks if the bottle category is special (Vodka, Ginebra, or specific Ron products)
     * @param {string} bottleCategory - Category of the bottle
     * @param {string} productName - Name of the product
     * @returns {boolean} True if it's a special bottle category
     */
    static _isSpecialBottleCategory(bottleCategory: string, productName: string): boolean;
    /**
     * Checks if the category only allows sodas
     * @param {string} bottleCategory - Category of the bottle
     * @returns {boolean} True if only sodas are allowed
     */
    static _isOnlySodaCategory(bottleCategory: string): boolean;
    /**
     * Validates DOM element existence
     * @param {HTMLElement} element - Element to validate
     * @param {string} elementName - Name of the element for logging
     * @returns {boolean} True if element exists
     */
    static validateDOMElement(element: HTMLElement, elementName: string): boolean;
    /**
     * Validates modal element and its required methods
     * @param {HTMLElement} modal - Modal element to validate
     * @returns {boolean} True if modal is valid
     */
    static validateModalElement(modal: HTMLElement): boolean;
    /**
     * Validates price text format
     * @param {string} priceText - Price text to validate
     * @returns {Object} Validation result
     */
    static validatePriceText(priceText: string): Object;
    /**
     * Validates event target for product selection
     * @param {Event} event - The event to validate
     * @returns {Object} Validation result
     */
    static validateEventTarget(event: Event): Object;
    /**
     * Shows validation modal with message
     * @param {string} message - Validation message to display
     * @param {Function} createModalCallback - Callback to create modal
     */
    static showValidationModal(message: string, createModalCallback: Function): void;
}
//# sourceMappingURL=order-system-validations.d.ts.map