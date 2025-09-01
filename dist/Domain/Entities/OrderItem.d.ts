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
export declare class OrderItem {
    readonly id: OrderItemId;
    readonly product: Product;
    readonly quantity: number;
    readonly customizations: Customization[];
    readonly unitPrice: Money;
    constructor(id: OrderItemId, product: Product, quantity: number, customizations?: Customization[], unitPrice?: Money);
    /**
     * Calcula el subtotal del item (precio unitario * cantidad + costos adicionales)
     */
    getSubtotal(): Money;
    /**
     * Obtiene las bebidas seleccionadas como acompañamiento
     */
    getSelectedDrinks(): Customization[];
    /**
     * Obtiene el término de cocción si aplica
     */
    getCookingTerm(): string | null;
    /**
     * Obtiene las solicitudes especiales
     */
    getSpecialRequests(): Customization[];
    /**
     * Verifica si el item tiene personalizaciones
     */
    hasCustomizations(): boolean;
    /**
     * Verifica si el item tiene bebidas seleccionadas
     */
    hasDrinkSelection(): boolean;
    /**
     * Cuenta el total de bebidas seleccionadas
     */
    getTotalDrinksCount(): number;
    /**
     * Crea una copia del item con nueva cantidad
     */
    withQuantity(newQuantity: number): OrderItem;
    /**
     * Crea una copia del item con nuevas personalizaciones
     */
    withCustomizations(newCustomizations: Customization[]): OrderItem;
    /**
     * Compara items por igualdad
     */
    equals(other: OrderItem): boolean;
    /**
     * Representación en string del item
     */
    toString(): string;
    getId(): OrderItemId;
    getProductId(): any;
    getQuantity(): number;
    getDrinkOptions(): string[];
}
//# sourceMappingURL=OrderItem.d.ts.map