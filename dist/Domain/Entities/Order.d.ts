import { OrderId } from '../ValueObjects/OrderId.js';
import { OrderItemId } from '../ValueObjects/OrderItemId.js';
import { OrderItem } from './OrderItem.js';
import { Money } from '../ValueObjects/Money.js';
/**
 * Estados posibles de una orden
 */
export declare enum OrderStatus {
    DRAFT = "draft",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Entidad Order del dominio - Agregado raíz
 * Encapsula toda la lógica de negocio relacionada con órdenes
 */
export declare class Order {
    readonly id: OrderId;
    readonly customerId?: string | undefined;
    private items;
    private _total;
    private _status;
    private _createdAt;
    private _updatedAt;
    constructor(id: OrderId, customerId?: string | undefined);
    /**
     * Método estático para crear una nueva orden
     */
    static create(customerId?: string): Order;
    /**
     * Agrega un item a la orden
     */
    addItem(item: OrderItem): void;
    /**
     * Remueve un item de la orden
     */
    removeItem(itemId: OrderItemId): boolean;
    /**
     * Actualiza la cantidad de un item específico
     */
    updateItemQuantity(itemId: OrderItemId, newQuantity: number): boolean;
    /**
     * Obtiene todos los items de la orden
     */
    getItems(): OrderItem[];
    /**
     * Busca un item por ID
     */
    findItemById(itemId: OrderItemId): OrderItem | null;
    /**
     * Obtiene el total de la orden
     */
    getTotal(): Money;
    /**
     * Obtiene el estado de la orden
     */
    getStatus(): OrderStatus;
    /**
     * Obtiene la cantidad total de items
     */
    getItemCount(): number;
    /**
     * Verifica si la orden está vacía
     */
    isEmpty(): boolean;
    /**
     * Verifica si la orden puede ser completada
     */
    canBeCompleted(): boolean;
    /**
     * Completa la orden
     */
    complete(): void;
    /**
     * Cancela la orden
     */
    cancel(): void;
    /**
     * Limpia todos los items de la orden
     */
    clear(): void;
    /**
     * Obtiene la fecha de creación
     */
    getCreatedAt(): Date;
    /**
     * Obtiene la fecha de última actualización
     */
    getUpdatedAt(): Date;
    /**
     * Busca un item similar (mismo producto y personalizaciones)
     */
    private findSimilarItemIndex;
    /**
     * Compara si dos arrays de personalizaciones son iguales
     */
    private areCustomizationsEqual;
    /**
     * Recalcula el total de la orden
     */
    private calculateTotal;
    /**
     * Compara órdenes por igualdad
     */
    equals(other: Order): boolean;
    /**
     * Representación en string de la orden
     */
    toString(): string;
}
//# sourceMappingURL=Order.d.ts.map