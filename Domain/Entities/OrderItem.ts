import { OrderItemId } from '../ValueObjects/OrderItemId.js';
import { Product } from './Product.js';
import { Money } from '../ValueObjects/Money.js';

/**
 * Representa las personalizaciones de un producto en una orden
 */
export interface Customization {
  type: 'drink' | 'cooking_term' | 'special_request';
  name: string;
  value: string;
  additionalCost?: Money;
}

/**
 * Entidad OrderItem del dominio
 * Representa un producto específico dentro de una orden con sus personalizaciones
 */
export class OrderItem {
  constructor(
    public readonly id: OrderItemId,
    public readonly product: Product,
    public readonly quantity: number,
    public readonly customizations: Customization[] = [],
    public readonly unitPrice: Money = product.price
  ) {
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
  getSubtotal(): Money {
    const baseAmount = this.unitPrice.multiply(this.quantity);
    const additionalCosts = this.customizations
      .filter(c => c.additionalCost)
      .reduce((sum, c) => sum.add(c.additionalCost!.multiply(this.quantity)), Money.zero());
    
    return baseAmount.add(additionalCosts);
  }

  /**
   * Obtiene las bebidas seleccionadas como acompañamiento
   */
  getSelectedDrinks(): Customization[] {
    return this.customizations.filter(c => c.type === 'drink');
  }

  /**
   * Obtiene el término de cocción si aplica
   */
  getCookingTerm(): string | null {
    const cookingCustomization = this.customizations.find(c => c.type === 'cooking_term');
    return cookingCustomization ? cookingCustomization.value : null;
  }

  /**
   * Obtiene las solicitudes especiales
   */
  getSpecialRequests(): Customization[] {
    return this.customizations.filter(c => c.type === 'special_request');
  }

  /**
   * Verifica si el item tiene personalizaciones
   */
  hasCustomizations(): boolean {
    return this.customizations.length > 0;
  }

  /**
   * Verifica si el item tiene bebidas seleccionadas
   */
  hasDrinkSelection(): boolean {
    return this.getSelectedDrinks().length > 0;
  }

  /**
   * Cuenta el total de bebidas seleccionadas
   */
  getTotalDrinksCount(): number {
    return this.getSelectedDrinks().reduce((count, drink) => {
      // Si la personalización tiene una cantidad específica, la usamos
      const drinkQuantity = parseInt(drink.value) || 1;
      return count + drinkQuantity;
    }, 0);
  }

  /**
   * Crea una copia del item con nueva cantidad
   */
  withQuantity(newQuantity: number): OrderItem {
    return new OrderItem(
      this.id,
      this.product,
      newQuantity,
      this.customizations,
      this.unitPrice
    );
  }

  /**
   * Crea una copia del item con nuevas personalizaciones
   */
  withCustomizations(newCustomizations: Customization[]): OrderItem {
    return new OrderItem(
      this.id,
      this.product,
      this.quantity,
      newCustomizations,
      this.unitPrice
    );
  }

  /**
   * Compara items por igualdad
   */
  equals(other: OrderItem): boolean {
    return this.id.equals(other.id);
  }

  /**
   * Representación en string del item
   */
  toString(): string {
    const customizationsStr = this.customizations.length > 0 
      ? ` (${this.customizations.map(c => `${c.name}: ${c.value}`).join(', ')})`
      : '';
    
    return `${this.quantity}x ${this.product.name.value}${customizationsStr} - ${this.getSubtotal().toString()}`;
  }
}