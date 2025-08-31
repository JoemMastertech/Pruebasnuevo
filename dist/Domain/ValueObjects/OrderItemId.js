/**
 * Value Object para identificar items de orden de manera única
 * Parte del dominio - garantiza unicidad de items en órdenes
 */
export class OrderItemId {
    constructor(value) {
        this.value = value;
        if (!value || value.trim().length === 0) {
            throw new Error('OrderItemId cannot be empty');
        }
    }
    static generate() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return new OrderItemId(`item_${timestamp}_${random}`);
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
