/**
 * Value Object para descripción de productos
 * Parte del dominio - define descripciones válidas del negocio
 */
export class ProductDescription {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product description cannot be empty');
    }
    
    if (value.trim().length < 3) {
      throw new Error('Product description must be at least 3 characters long');
    }
    
    if (value.trim().length > 500) {
      throw new Error('Product description cannot exceed 500 characters');
    }
    
    this.value = value.trim();
  }

  equals(other: ProductDescription): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getLength(): number {
    return this.value.length;
  }

  getPreview(maxLength: number = 100): string {
    if (this.value.length <= maxLength) {
      return this.value;
    }
    return this.value.substring(0, maxLength - 3) + '...';
  }
}