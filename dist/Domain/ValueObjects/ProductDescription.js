/**
 * Value Object para descripción de productos
 * Parte del dominio - define descripciones válidas del negocio
 */
export class ProductDescription {
    constructor(value) {
        this.value = value;
        if (!value || value.trim().length === 0) {
            throw new Error('Product description cannot be empty');
        }
        if (value.trim().length < 3) {
            throw new Error('Product description must be at least 3 characters long');
        }
        if (value.trim().length > 500) {
            throw new Error('Product description cannot exceed 500 characters');
        }
        this.value = value.trim();
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
    getLength() {
        return this.value.length;
    }
    getPreview(maxLength = 100) {
        if (this.value.length <= maxLength) {
            return this.value;
        }
        return this.value.substring(0, maxLength - 3) + '...';
    }
}
//# sourceMappingURL=ProductDescription.js.map