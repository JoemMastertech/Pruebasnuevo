import { OrderId } from '../ValueObjects/OrderId.js';
import { Money } from '../ValueObjects/Money.js';
/**
 * Estados posibles de una orden
 */
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DRAFT"] = "draft";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (OrderStatus = {}));
/**
 * Entidad Order del dominio - Agregado raíz
 * Encapsula toda la lógica de negocio relacionada con órdenes
 */
export class Order {
    constructor(id, customerId) {
        this.id = id;
        this.customerId = customerId;
        this.items = [];
        this._total = Money.zero();
        this._status = OrderStatus.DRAFT;
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }
    /**
     * Método estático para crear una nueva orden
     */
    static create(customerId) {
        const orderId = OrderId.generate();
        return new Order(orderId, customerId);
    }
    /**
     * Agrega un item a la orden
     */
    addItem(item) {
        if (this._status !== OrderStatus.DRAFT) {
            throw new Error('Cannot add items to a non-draft order');
        }
        // Verificar si ya existe un item similar (mismo producto y personalizaciones)
        const existingItemIndex = this.findSimilarItemIndex(item);
        if (existingItemIndex >= 0) {
            // Si existe, incrementar la cantidad
            const existingItem = this.items[existingItemIndex];
            if (existingItem) {
                const newQuantity = existingItem.quantity + item.quantity;
                this.items[existingItemIndex] = existingItem.withQuantity(newQuantity);
            }
        }
        else {
            // Si no existe, agregar como nuevo item
            this.items.push(item);
        }
        this.calculateTotal();
        this._updatedAt = new Date();
    }
    /**
     * Remueve un item de la orden
     */
    removeItem(itemId) {
        if (this._status !== OrderStatus.DRAFT) {
            throw new Error('Cannot remove items from a non-draft order');
        }
        const initialLength = this.items.length;
        this.items = this.items.filter(item => !item.id.equals(itemId));
        if (this.items.length < initialLength) {
            this.calculateTotal();
            this._updatedAt = new Date();
            return true;
        }
        return false;
    }
    /**
     * Actualiza la cantidad de un item específico
     */
    updateItemQuantity(itemId, newQuantity) {
        if (this._status !== OrderStatus.DRAFT) {
            throw new Error('Cannot update items in a non-draft order');
        }
        if (newQuantity <= 0) {
            return this.removeItem(itemId);
        }
        const itemIndex = this.items.findIndex(item => item.id.equals(itemId));
        if (itemIndex >= 0) {
            const existingItem = this.items[itemIndex];
            if (existingItem) {
                this.items[itemIndex] = existingItem.withQuantity(newQuantity);
                this.calculateTotal();
                this._updatedAt = new Date();
                return true;
            }
        }
        return false;
    }
    /**
     * Obtiene todos los items de la orden
     */
    getItems() {
        return [...this.items];
    }
    /**
     * Busca un item por ID
     */
    findItemById(itemId) {
        return this.items.find(item => item.id.equals(itemId)) || null;
    }
    /**
     * Obtiene el total de la orden
     */
    getTotal() {
        return this._total;
    }
    /**
     * Obtiene el estado de la orden
     */
    getStatus() {
        return this._status;
    }
    /**
     * Obtiene la cantidad total de items
     */
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    /**
     * Verifica si la orden está vacía
     */
    isEmpty() {
        return this.items.length === 0;
    }
    /**
     * Verifica si la orden puede ser completada
     */
    canBeCompleted() {
        return this._status === OrderStatus.DRAFT && !this.isEmpty();
    }
    /**
     * Completa la orden
     */
    complete() {
        if (!this.canBeCompleted()) {
            throw new Error('Order cannot be completed: must be in draft status and contain items');
        }
        this._status = OrderStatus.COMPLETED;
        this._updatedAt = new Date();
    }
    /**
     * Cancela la orden
     */
    cancel() {
        if (this._status === OrderStatus.COMPLETED) {
            throw new Error('Cannot cancel a completed order');
        }
        this._status = OrderStatus.CANCELLED;
        this._updatedAt = new Date();
    }
    /**
     * Limpia todos los items de la orden
     */
    clear() {
        if (this._status !== OrderStatus.DRAFT) {
            throw new Error('Cannot clear a non-draft order');
        }
        this.items = [];
        this.calculateTotal();
        this._updatedAt = new Date();
    }
    /**
     * Obtiene la fecha de creación
     */
    getCreatedAt() {
        return new Date(this._createdAt);
    }
    /**
     * Obtiene la fecha de última actualización
     */
    getUpdatedAt() {
        return new Date(this._updatedAt);
    }
    /**
     * Busca un item similar (mismo producto y personalizaciones)
     */
    findSimilarItemIndex(newItem) {
        return this.items.findIndex(existingItem => existingItem.product.equals(newItem.product) &&
            this.areCustomizationsEqual(existingItem.customizations, newItem.customizations));
    }
    /**
     * Compara si dos arrays de personalizaciones son iguales
     */
    areCustomizationsEqual(customizations1, customizations2) {
        if (customizations1.length !== customizations2.length) {
            return false;
        }
        const sorted1 = [...customizations1].sort((a, b) => `${a.type}-${a.name}`.localeCompare(`${b.type}-${b.name}`));
        const sorted2 = [...customizations2].sort((a, b) => `${a.type}-${a.name}`.localeCompare(`${b.type}-${b.name}`));
        return sorted1.every((c1, index) => {
            const c2 = sorted2[index];
            return c1.type === c2.type && c1.name === c2.name && c1.value === c2.value;
        });
    }
    /**
     * Recalcula el total de la orden
     */
    calculateTotal() {
        this._total = this.items.reduce((sum, item) => sum.add(item.getSubtotal()), Money.zero());
    }
    /**
     * Compara órdenes por igualdad
     */
    equals(other) {
        return this.id.equals(other.id);
    }
    /**
     * Representación en string de la orden
     */
    toString() {
        const itemsStr = this.items.map(item => `  ${item.toString()}`).join('\n');
        return `Order ${this.id.value} (${this._status}):\n${itemsStr}\nTotal: ${this._total.toString()}`;
    }
}
