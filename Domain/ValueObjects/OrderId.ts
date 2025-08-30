/**
 * Value Object para identificar órdenes de manera única
 * Parte del dominio - garantiza unicidad de identificadores
 */
export class OrderId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('OrderId cannot be empty');
    }
  }

  static generate(): OrderId {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return new OrderId(`order_${timestamp}_${random}`);
  }

  equals(other: OrderId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}