/**
 * Value Object para identificar productos de manera única
 * Parte del dominio - no depende de infraestructura
 */
export class ProductId {
    constructor(value) {
        this.value = value;
        if (!value || value.trim().length === 0) {
            throw new Error('ProductId cannot be empty');
        }
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
//# sourceMappingURL=ProductId.js.map