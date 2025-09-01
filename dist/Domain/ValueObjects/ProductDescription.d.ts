/**
 * Value Object para descripción de productos
 * Parte del dominio - define descripciones válidas del negocio
 */
export declare class ProductDescription {
    readonly value: string;
    constructor(value: string);
    equals(other: ProductDescription): boolean;
    toString(): string;
    getLength(): number;
    getPreview(maxLength?: number): string;
}
//# sourceMappingURL=ProductDescription.d.ts.map