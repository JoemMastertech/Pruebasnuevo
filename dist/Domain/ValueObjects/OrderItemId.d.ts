/**
 * Value Object para identificar items de orden de manera única
 * Parte del dominio - garantiza unicidad de items en órdenes
 */
export declare class OrderItemId {
    readonly value: string;
    constructor(value: string);
    static generate(): OrderItemId;
    equals(other: OrderItemId): boolean;
    toString(): string;
}
//# sourceMappingURL=OrderItemId.d.ts.map