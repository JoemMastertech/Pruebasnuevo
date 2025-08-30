/**
 * Value Object para categorías de productos
 * Parte del dominio - define categorías válidas del negocio
 */
export class ProductCategory {
  private static readonly VALID_CATEGORIES = [
    'bebidas',
    'comida',
    'licores',
    'cocteles',
    'refrescos',
    'digestivos',
    'espumosos',
    'vinos',
    'cervezas'
  ];

  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product category cannot be empty');
    }
    
    const normalizedValue = value.toLowerCase().trim();
    if (!ProductCategory.VALID_CATEGORIES.includes(normalizedValue)) {
      throw new Error(`Invalid product category: ${value}. Valid categories: ${ProductCategory.VALID_CATEGORIES.join(', ')}`);
    }
    
    this.value = normalizedValue;
  }

  equals(other: ProductCategory): boolean {
    return this.value === other.value;
  }

  isLiquor(): boolean {
    return this.value === 'licores';
  }

  isBeverage(): boolean {
    return ['bebidas', 'refrescos', 'cervezas'].includes(this.value);
  }

  isFood(): boolean {
    return this.value === 'comida';
  }

  isCocktail(): boolean {
    return this.value === 'cocteles';
  }

  static getValidCategories(): string[] {
    return [...ProductCategory.VALID_CATEGORIES];
  }

  toString(): string {
    return this.value;
  }
}