"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategory = void 0;
/**
 * Value Object para categorías de productos
 * Parte del dominio - define categorías válidas del negocio
 */
class ProductCategory {
    constructor(value) {
        this.value = value;
        if (!value || value.trim().length === 0) {
            throw new Error('Product category cannot be empty');
        }
        const normalizedValue = value.toLowerCase().trim();
        if (!ProductCategory.VALID_CATEGORIES.includes(normalizedValue)) {
            throw new Error(`Invalid product category: ${value}. Valid categories: ${ProductCategory.VALID_CATEGORIES.join(', ')}`);
        }
        this.value = normalizedValue;
    }
    equals(other) {
        return this.value === other.value;
    }
    isLiquor() {
        return this.value === 'licores';
    }
    isBeverage() {
        return ['bebidas', 'refrescos', 'cervezas'].includes(this.value);
    }
    isFood() {
        return this.value === 'comida';
    }
    isCocktail() {
        return this.value === 'cocteles';
    }
    static getValidCategories() {
        return [...ProductCategory.VALID_CATEGORIES];
    }
    toString() {
        return this.value;
    }
}
exports.ProductCategory = ProductCategory;
ProductCategory.VALID_CATEGORIES = [
    'bebidas',
    'comida',
    'licores',
    'cocteles',
    'refrescos',
    'digestivos',
    'espumosos',
    'vinos',
    'cervezas'
];
