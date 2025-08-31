/**
 * Value Object para identificar órdenes de manera única
 * Parte del dominio - garantiza unicidad de identificadores
 */
export declare class OrderId {
    readonly value: string;
    constructor(value: string);
    static generate(): OrderId;
    equals(other: OrderId): boolean;
    toString(): string;
}
//# sourceMappingURL=OrderId.d.ts.map