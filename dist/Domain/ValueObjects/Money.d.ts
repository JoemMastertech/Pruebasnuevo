/**
 * Value Object para representar dinero de manera inmutable
 * Parte del dominio - encapsula reglas de negocio monetarias
 */
export declare class Money {
    readonly amount: number;
    constructor(amount: number);
    add(other: Money): Money;
    subtract(other: Money): Money;
    multiply(factor: number): Money;
    equals(other: Money): boolean;
    isGreaterThan(other: Money): boolean;
    isZero(): boolean;
    static zero(): Money;
    toString(): string;
    toNumber(): number;
}
//# sourceMappingURL=Money.d.ts.map