/**
 * Value Object para nombres de productos
 * Parte del dominio - encapsula validaciones de nombres
 */
export declare class ProductName {
    readonly value: string;
    constructor(value: string);
    equals(other: ProductName): boolean;
    contains(searchTerm: string): boolean;
    toString(): string;
}
//# sourceMappingURL=ProductName.d.ts.map