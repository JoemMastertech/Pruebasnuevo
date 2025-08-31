import { Money } from '../ValueObjects/Money.js';
/**
 * Entidad OrderItem del dominio
 * Representa un producto específico dentro de una orden con sus personalizaciones
 */
export class OrderItem {
    constructor(id, product, quantity, customizations = [], unitPrice = product.price) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.customizations = customizations;
        this.unitPrice = unitPrice;
        if (quantity <= 0) {
            throw new Error('Order item quantity must be greater than zero');
        }
        if (!Number.isInteger(quantity)) {
            throw new Error('Order item quantity must be a whole number');
        }
    }
    /**
     * Calcula el subtotal del item (precio unitario * cantidad + costos adicionales)
     */
    getSubtotal() {
        const baseAmount = this.unitPrice.multiply(this.quantity);
        const additionalCosts = this.customizations
            .filter(c => c.additionalCost)
            .reduce((sum, c) => sum.add(c.additionalCost.multiply(this.quantity)), Money.zero());
        return baseAmount.add(additionalCosts);
    }
    /**
     * Obtiene las bebidas seleccionadas como acompañamiento
     */
    getSelectedDrinks() {
        return this.customizations.filter(c => c.type === 'drink');
    }
    /**
     * Obtiene el término de cocción si aplica
     */
    getCookingTerm() {
        const cookingCustomization = this.customizations.find(c => c.type === 'cooking_term');
        return cookingCustomization ? cookingCustomization.value : null;
    }
    /**
     * Obtiene las solicitudes especiales
     */
    getSpecialRequests() {
        return this.customizations.filter(c => c.type === 'special_request');
    }
    /**
     * Verifica si el item tiene personalizaciones
     */
    hasCustomizations() {
        return this.customizations.length > 0;
    }
    /**
     * Verifica si el item tiene bebidas seleccionadas
     */
    hasDrinkSelection() {
        return this.getSelectedDrinks().length > 0;
    }
    /**
     * Cuenta el total de bebidas seleccionadas
     */
    getTotalDrinksCount() {
        return this.getSelectedDrinks().reduce((count, drink) => {
            // Si la personalización tiene una cantidad específica, la usamos
            const drinkQuantity = parseInt(drink.value) || 1;
            return count + drinkQuantity;
        }, 0);
    }
    /**
     * Crea una copia del item con nueva cantidad
     */
    withQuantity(newQuantity) {
        return new OrderItem(this.id, this.product, newQuantity, this.customizations, this.unitPrice);
    }
    /**
     * Crea una copia del item con nuevas personalizaciones
     */
    withCustomizations(newCustomizations) {
        return new OrderItem(this.id, this.product, this.quantity, newCustomizations, this.unitPrice);
    }
    /**
     * Compara items por igualdad
     */
    equals(other) {
        return this.id.equals(other.id);
    }
    /**
     * Representación en string del item
     */
    toString() {
        const customizationsStr = this.customizations.length > 0
            ? ` (${this.customizations.map(c => `${c.name}: ${c.value}`).join(', ')})`
            : '';
        return `${this.quantity}x ${this.product.name.value}${customizationsStr} - ${this.getSubtotal().toString()}`;
    }
}
//# sourceMappingURL=OrderItem.js.map