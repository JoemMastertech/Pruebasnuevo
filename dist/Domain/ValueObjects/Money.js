/**
 * Value Object para representar dinero de manera inmutable
 * Parte del dominio - encapsula reglas de negocio monetarias
 */
export class Money {
    constructor(amount) {
        this.amount = amount;
        if (amount < 0) {
            throw new Error('Money amount cannot be negative');
        }
        if (!Number.isFinite(amount)) {
            throw new Error('Money amount must be a finite number');
        }
    }
    add(other) {
        return new Money(this.amount + other.amount);
    }
    subtract(other) {
        return new Money(this.amount - other.amount);
    }
    multiply(factor) {
        if (!Number.isFinite(factor) || factor < 0) {
            throw new Error('Multiplication factor must be a positive finite number');
        }
        return new Money(this.amount * factor);
    }
    equals(other) {
        return this.amount === other.amount;
    }
    isGreaterThan(other) {
        return this.amount > other.amount;
    }
    isZero() {
        return this.amount === 0;
    }
    static zero() {
        return new Money(0);
    }
    toString() {
        return `$${this.amount.toFixed(2)}`;
    }
    toNumber() {
        return this.amount;
    }
}
//# sourceMappingURL=Money.js.map