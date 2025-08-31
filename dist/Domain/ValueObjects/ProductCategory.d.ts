/**
 * Value Object para categorías de productos
 * Parte del dominio - define categorías válidas del negocio
 */
export declare class ProductCategory {
    readonly value: string;
    private static readonly VALID_CATEGORIES;
    constructor(value: string);
    equals(other: ProductCategory): boolean;
    isLiquor(): boolean;
    isBeverage(): boolean;
    isFood(): boolean;
    isCocktail(): boolean;
    static getValidCategories(): string[];
    toString(): string;
}
//# sourceMappingURL=ProductCategory.d.ts.map