"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
/**
 * Entidad Product del dominio
 * Encapsula la lógica de negocio relacionada con productos
 */
class Product {
    constructor(id, name, category, price, ingredients = '') {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.ingredients = ingredients;
        if (!id || !name || !category || !price) {
            throw new Error('Product requires all mandatory fields: id, name, category, price');
        }
    }
    /**
     * Determina si el producto es un licor
     */
    isLiquor() {
        return this.category.isLiquor();
    }
    /**
     * Determina si el producto es Jägermeister
     */
    isJagermeister() {
        return this.name.value.toUpperCase().includes('JAGERMEISTER') ||
            this.name.value.toUpperCase().includes('JÄGERMEISTER');
    }
    /**
     * Determina si el producto es una botella
     * Basado en reglas de negocio específicas
     */
    isBottle() {
        const nameUpper = this.name.value.toUpperCase();
        return nameUpper.includes('BOTELLA') ||
            nameUpper.includes('BOTTLE') ||
            (this.isJagermeister() && nameUpper.includes('700'));
    }
    /**
     * Determina si el producto es un digestivo
     */
    isDigestivo() {
        return this.category.value === 'digestivos' ||
            this.name.value.toUpperCase().includes('DIGESTIVO');
    }
    /**
     * Determina si el producto es espumoso
     */
    isEspumoso() {
        return this.category.value === 'espumosos' ||
            this.name.value.toUpperCase().includes('CHAMPAGNE') ||
            this.name.value.toUpperCase().includes('PROSECCO');
    }
    /**
     * Determina si el producto es una bebida
     */
    isBeverage() {
        return this.category.isBeverage();
    }
    /**
     * Determina si el producto es comida
     */
    isFood() {
        return this.category.isFood();
    }
    /**
     * Determina si el producto es un cóctel
     */
    isCocktail() {
        return this.category.isCocktail();
    }
    /**
     * Determina si el producto requiere selección de bebidas acompañantes
     */
    requiresDrinkSelection() {
        return this.isLiquor() && !this.isDigestivo() && !this.isEspumoso();
    }
    /**
     * Obtiene el tipo de producto para reglas de bebidas
     */
    getLiquorType() {
        if (!this.isLiquor()) {
            return 'NONE';
        }
        const name = this.name.value.toUpperCase();
        if (name.includes('RON'))
            return 'RON';
        if (name.includes('TEQUILA'))
            return 'TEQUILA';
        if (name.includes('BRANDY'))
            return 'BRANDY';
        if (name.includes('WHISKY') || name.includes('WHISKEY'))
            return 'WHISKY';
        if (name.includes('VODKA'))
            return 'VODKA';
        if (name.includes('GINEBRA') || name.includes('GIN'))
            return 'GINEBRA';
        if (name.includes('MEZCAL'))
            return 'MEZCAL';
        if (name.includes('COGNAC'))
            return 'COGNAC';
        if (name.includes('JAGERMEISTER') || name.includes('JÄGERMEISTER'))
            return 'JAGERMEISTER';
        return 'DEFAULT';
    }
    /**
     * Verifica si el producto contiene ciertos ingredientes
     */
    hasIngredient(ingredient) {
        return this.ingredients.toLowerCase().includes(ingredient.toLowerCase());
    }
    /**
     * Compara productos por igualdad
     */
    equals(other) {
        return this.id.equals(other.id);
    }
    /**
     * Representación en string del producto
     */
    toString() {
        return `${this.name.value} (${this.category.value}) - ${this.price.toString()}`;
    }
    // Métodos getter para compatibilidad con UI
    getId() {
        return this.id;
    }
    getName() {
        return this.name.value;
    }
    getCategory() {
        return this.category;
    }
    getPrice() {
        return this.price.amount;
    }
    getDescription() {
        return this.ingredients || '';
    }
    getDrinkOptions() {
        if (this.requiresDrinkSelection()) {
            return ['Con hielo', 'Sin hielo', 'Mezclado'];
        }
        return [];
    }
}
exports.Product = Product;
