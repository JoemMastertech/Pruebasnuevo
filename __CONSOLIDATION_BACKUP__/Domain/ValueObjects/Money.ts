/**
 * Value Object para representar dinero de manera inmutable
 * Parte del dominio - encapsula reglas de negocio monetarias
 */
export class Money {
  constructor(public readonly amount: number) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    if (!Number.isFinite(amount)) {
      throw new Error('Money amount must be a finite number');
    }
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  subtract(other: Money): Money {
    return new Money(this.amount - other.amount);
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor) || factor < 0) {
      throw new Error('Multiplication factor must be a positive finite number');
    }
    return new Money(this.amount * factor);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount;
  }

  isGreaterThan(other: Money): boolean {
    return this.amount > other.amount;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  static zero(): Money {
    return new Money(0);
  }

  toString(): string {
    return `$${this.amount.toFixed(2)}`;
  }

  toNumber(): number {
    return this.amount;
  }
}