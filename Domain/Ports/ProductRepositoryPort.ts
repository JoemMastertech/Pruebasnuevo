import { Product } from '../Entities/Product.js';
import { ProductId } from '../ValueObjects/ProductId.js';
import { ProductCategory } from '../ValueObjects/ProductCategory.js';

/**
 * Opciones de bebida disponibles para un producto
 */
export interface DrinkOption {
  name: string;
  type: 'juice' | 'soda' | 'water' | 'mixer';
  additionalCost?: number;
}

/**
 * Puerto del dominio para el repositorio de productos
 * Define el contrato que debe implementar la infraestructura
 */
export interface ProductRepositoryPort {
  /**
   * Busca un producto por nombre
   * @param name Nombre del producto
   * @returns Promise<Product | null> Producto encontrado o null
   */
  findByName(name: string): Promise<Product | null>;

  /**
   * Busca productos por categoría
   * @param category Categoría del producto
   * @returns Promise<Product[]> Lista de productos
   */
  findByCategory(category: ProductCategory): Promise<Product[]>;

  /**
   * Obtiene todos los productos
   * @returns Promise<Product[]> Lista de todos los productos
   */
  findAll(): Promise<Product[]>;

  /**
   * Busca productos por texto (nombre o ingredientes)
   * @param query Texto de búsqueda
   * @returns Promise<Product[]> Lista de productos que coinciden
   */
  search(query: string): Promise<Product[]>;

  /**
   * Verifica si un producto existe
   * @param productId ID del producto
   * @returns Promise<boolean> True si existe
   */
  exists(productId: ProductId): Promise<boolean>;

  /**
   * Obtiene las opciones de bebida para un producto
   * @param product Producto
   * @returns Promise<DrinkOption[]> Opciones de bebida disponibles
   */
  getDrinkOptions(product: Product): Promise<DrinkOption[]>;

  /**
   * Busca productos por múltiples categorías
   * @param categories Lista de categorías
   * @returns Promise<Product[]> Lista de productos
   */
  findByCategories(categories: ProductCategory[]): Promise<Product[]>;

  /**
   * Busca productos que contengan ciertos ingredientes
   * @param ingredients Lista de ingredientes
   * @returns Promise<Product[]> Lista de productos
   */
  findByIngredients(ingredients: string[]): Promise<Product[]>;

  /**
   * Obtiene productos en un rango de precios
   * @param minPrice Precio mínimo
   * @param maxPrice Precio máximo
   * @returns Promise<Product[]> Lista de productos
   */
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
}