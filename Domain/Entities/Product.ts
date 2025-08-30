import { ProductId } from '../ValueObjects/ProductId.js';
import { ProductName } from '../ValueObjects/ProductName.js';
import { ProductCategory } from '../ValueObjects/ProductCategory.js';
import { Money } from '../ValueObjects/Money.js';

/**
 * Entidad Product del dominio
 * Encapsula la lógica de negocio relacionada con productos
 */
export class Product {
  constructor(
    public readonly id: ProductId,
    public readonly name: ProductName,
    public readonly category: ProductCategory,
    public readonly price: Money,
    public readonly ingredients: string = ''
  ) {
    if (!id || !name || !category || !price) {
      throw new Error('Product requires all mandatory fields: id, name, category, price');
    }
  }

  /**
   * Determina si el producto es un licor
   */
  isLiquor(): boolean {
    return this.category.isLiquor();
  }

  /**
   * Determina si el producto es Jägermeister
   */
  isJagermeister(): boolean {
    return this.name.value.toUpperCase().includes('JAGERMEISTER') ||
           this.name.value.toUpperCase().includes('JÄGERMEISTER');
  }

  /**
   * Determina si el producto es una botella
   * Basado en reglas de negocio específicas
   */
  isBottle(): boolean {
    const nameUpper = this.name.value.toUpperCase();
    return nameUpper.includes('BOTELLA') || 
           nameUpper.includes('BOTTLE') ||
           (this.isJagermeister() && nameUpper.includes('700'));
  }

  /**
   * Determina si el producto es un digestivo
   */
  isDigestivo(): boolean {
    return this.category.value === 'digestivos' ||
           this.name.value.toUpperCase().includes('DIGESTIVO');
  }

  /**
   * Determina si el producto es espumoso
   */
  isEspumoso(): boolean {
    return this.category.value === 'espumosos' ||
           this.name.value.toUpperCase().includes('CHAMPAGNE') ||
           this.name.value.toUpperCase().includes('PROSECCO');
  }

  /**
   * Determina si el producto es una bebida
   */
  isBeverage(): boolean {
    return this.category.isBeverage();
  }

  /**
   * Determina si el producto es comida
   */
  isFood(): boolean {
    return this.category.isFood();
  }

  /**
   * Determina si el producto es un cóctel
   */
  isCocktail(): boolean {
    return this.category.isCocktail();
  }

  /**
   * Determina si el producto requiere selección de bebidas acompañantes
   */
  requiresDrinkSelection(): boolean {
    return this.isLiquor() && !this.isDigestivo() && !this.isEspumoso();
  }

  /**
   * Obtiene el tipo de producto para reglas de bebidas
   */
  getLiquorType(): string {
    if (!this.isLiquor()) {
      return 'NONE';
    }

    const name = this.name.value.toUpperCase();
    
    if (name.includes('RON')) return 'RON';
    if (name.includes('TEQUILA')) return 'TEQUILA';
    if (name.includes('BRANDY')) return 'BRANDY';
    if (name.includes('WHISKY') || name.includes('WHISKEY')) return 'WHISKY';
    if (name.includes('VODKA')) return 'VODKA';
    if (name.includes('GINEBRA') || name.includes('GIN')) return 'GINEBRA';
    if (name.includes('MEZCAL')) return 'MEZCAL';
    if (name.includes('COGNAC')) return 'COGNAC';
    if (name.includes('JAGERMEISTER') || name.includes('JÄGERMEISTER')) return 'JAGERMEISTER';
    
    return 'DEFAULT';
  }

  /**
   * Verifica si el producto contiene ciertos ingredientes
   */
  hasIngredient(ingredient: string): boolean {
    return this.ingredients.toLowerCase().includes(ingredient.toLowerCase());
  }

  /**
   * Compara productos por igualdad
   */
  equals(other: Product): boolean {
    return this.id.equals(other.id);
  }

  /**
   * Representación en string del producto
   */
  toString(): string {
    return `${this.name.value} (${this.category.value}) - ${this.price.toString()}`;
  }
}