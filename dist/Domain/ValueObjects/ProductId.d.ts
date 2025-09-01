/**
 * Value Object para identificar productos de manera única
 * Parte del dominio - no depende de infraestructura
 */
export declare class ProductId {
    readonly value: string;
    constructor(value: string);
    equals(other: ProductId): boolean;
    getValue(): string;
    toString(): string;
}
//# sourceMappingURL=ProductId.d.ts.map