/**
 * Value Object para nombres de productos
 * Parte del dominio - encapsula validaciones de nombres
 */
export class ProductName {
    constructor(value) {
        this.value = value;
        if (!value || value.trim().length === 0) {
            throw new Error('Product name cannot be empty');
        }
        if (value.length > 100) {
            throw new Error('Product name cannot exceed 100 characters');
        }
    }
    equals(other) {
        return this.value.toLowerCase() === other.value.toLowerCase();
    }
    contains(searchTerm) {
        return this.value.toLowerCase().includes(searchTerm.toLowerCase());
    }
    toString() {
        return this.value;
    }
}
//# sourceMappingURL=ProductName.js.map