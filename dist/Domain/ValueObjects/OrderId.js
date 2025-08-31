/**
 * Value Object para identificar órdenes de manera única
 * Parte del dominio - garantiza unicidad de identificadores
 */
export class OrderId {
    constructor(value) {
        this.value = value;
        if (!value || value.trim().length === 0) {
            throw new Error('OrderId cannot be empty');
        }
    }
    static generate() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return new OrderId(`order_${timestamp}_${random}`);
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
//# sourceMappingURL=OrderId.js.map