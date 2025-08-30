/**
 * Value Object para nombres de productos
 * Parte del dominio - encapsula validaciones de nombres
 */
export class ProductName {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (value.length > 100) {
      throw new Error('Product name cannot exceed 100 characters');
    }
  }

  equals(other: ProductName): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  contains(searchTerm: string): boolean {
    return this.value.toLowerCase().includes(searchTerm.toLowerCase());
  }

  toString(): string {
    return this.value;
  }
}