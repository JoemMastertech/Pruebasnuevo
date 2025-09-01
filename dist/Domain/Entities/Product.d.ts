import { ProductId } from '../ValueObjects/ProductId.js';
import { ProductName } from '../ValueObjects/ProductName.js';
import { ProductCategory } from '../ValueObjects/ProductCategory.js';
import { Money } from '../ValueObjects/Money.js';
/**
 * Entidad Product del dominio
 * Encapsula la lógica de negocio relacionada con productos
 */
export declare class Product {
    readonly id: ProductId;
    readonly name: ProductName;
    readonly category: ProductCategory;
    readonly price: Money;
    readonly ingredients: string;
    constructor(id: ProductId, name: ProductName, category: ProductCategory, price: Money, ingredients?: string);
    /**
     * Determina si el producto es un licor
     */
    isLiquor(): boolean;
    /**
     * Determina si el producto es Jägermeister
     */
    isJagermeister(): boolean;
    /**
     * Determina si el producto es una botella
     * Basado en reglas de negocio específicas
     */
    isBottle(): boolean;
    /**
     * Determina si el producto es un digestivo
     */
    isDigestivo(): boolean;
    /**
     * Determina si el producto es espumoso
     */
    isEspumoso(): boolean;
    /**
     * Determina si el producto es una bebida
     */
    isBeverage(): boolean;
    /**
     * Determina si el producto es comida
     */
    isFood(): boolean;
    /**
     * Determina si el producto es un cóctel
     */
    isCocktail(): boolean;
    /**
     * Determina si el producto requiere selección de bebidas acompañantes
     */
    requiresDrinkSelection(): boolean;
    /**
     * Obtiene el tipo de producto para reglas de bebidas
     */
    getLiquorType(): string;
    /**
     * Verifica si el producto contiene ciertos ingredientes
     */
    hasIngredient(ingredient: string): boolean;
    /**
     * Compara productos por igualdad
     */
    equals(other: Product): boolean;
    /**
     * Representación en string del producto
     */
    toString(): string;
    getId(): ProductId;
    getName(): string;
    getCategory(): ProductCategory;
    getPrice(): number;
    getDescription(): string;
    getDrinkOptions(): string[];
}
//# sourceMappingURL=Product.d.ts.map