/**
 * Value Object para identificar productos de manera única
 * Parte del dominio - no depende de infraestructura
 */
export class ProductId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ProductId cannot be empty');
    }
  }

  equals(other: ProductId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}