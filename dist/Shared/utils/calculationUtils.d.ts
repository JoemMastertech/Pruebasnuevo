/**
 * Calculate total drink count from order items
 * @param {Array} items - Order items array
 * @returns {number} Total drink count
 */
export function calculateTotalDrinkCount(items: any[]): number;
/**
 * Calculate total juice count from order items
 * @param {Array} items - Order items array
 * @returns {number} Total juice count
 */
export function calculateTotalJuiceCount(items: any[]): number;
/**
 * Calculate total Jäger drink count from order items
 * @param {Array} items - Order items array
 * @returns {number} Total Jäger drink count
 */
export function calculateTotalJagerDrinkCount(items: any[]): number;
/**
 * Calculate price for a product with options (simplified)
 * @param {Object} product - Product object
 * @param {Array} selectedOptions - Selected options array
 * @param {number} quantity - Quantity
 * @returns {number} Total price
 */
export function calculatePrice(product: Object, selectedOptions?: any[], quantity?: number): number;
/**
 * Calculate total order amount (simplified)
 * @param {Array} items - Order items array
 * @returns {number} Total order amount
 */
export function calculateOrderTotal(items: any[]): number;
export function isJuiceOption(option: any): boolean;
//# sourceMappingURL=calculationUtils.d.ts.map