import { Product } from '../../Domain/Entities/Product.js';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort.js';
import { DrinkRulesPort, ValidationResult, DrinkSelection, DrinkOptions } from '../../Domain/Ports/DrinkRulesPort.js';

/**
 * Resultado de validación de producto
 */
export interface ProductValidationResult {
  isValid: boolean;
  product?: Product;
  drinkOptions?: DrinkOptions;
  errors: string[];
  warnings: string[];
}

/**
 * Datos de validación de producto
 */
export interface ProductValidationData {
  productName: string;
  selectedDrinks?: DrinkSelection[];
  cookingTerm?: string;
  quantity?: number;
}

/**
 * Caso de uso para validar productos y sus reglas de negocio
 * Centraliza toda la lógica de validación de productos
 */
export class ValidateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryPort,
    private readonly drinkRules: DrinkRulesPort
  ) {}

  /**
   * Valida un producto y sus selecciones
   */
  async validateProduct(data: ProductValidationData): Promise<ProductValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Validar datos básicos
    if (!data.productName || data.productName.trim().length === 0) {
      errors.push('El nombre del producto es requerido');
      return { isValid: false, errors, warnings };
    }

    // 2. Buscar el producto
    const product = await this.productRepository.findByName(data.productName);
    if (!product) {
      errors.push(`Producto no encontrado: ${data.productName}`);
      return { isValid: false, errors, warnings };
    }

    // 3. Obtener opciones de bebida
    const drinkOptions = this.drinkRules.getAvailableOptions(product);

    // 4. Validar cantidad si se proporciona
    if (data.quantity !== undefined) {
      const quantityValidation = this.validateQuantity(data.quantity);
      if (!quantityValidation.isValid) {
        errors.push(quantityValidation.errorMessage!);
      }
    }

    // 5. Validar selección de bebidas
    if (product.requiresDrinkSelection()) {
      const drinkValidation = this.validateDrinkSelection(product, data.selectedDrinks || []);
      if (!drinkValidation.isValid) {
        errors.push(drinkValidation.errorMessage!);
      }
      warnings.push(...drinkValidation.warnings);
    } else if (data.selectedDrinks && data.selectedDrinks.length > 0) {
      warnings.push('Este producto no requiere selección de bebidas');
    }

    // 6. Validar término de cocción
    if (data.cookingTerm) {
      const cookingValidation = this.validateCookingTerm(product, data.cookingTerm);
      if (!cookingValidation.isValid) {
        errors.push(cookingValidation.errorMessage!);
      }
      warnings.push(...cookingValidation.warnings);
    }

    return {
      isValid: errors.length === 0,
      product,
      drinkOptions,
      errors,
      warnings
    };
  }

  /**
   * Obtiene las opciones de bebida para un producto
   */
  async getDrinkOptionsForProduct(productName: string): Promise<DrinkOptions | null> {
    const product = await this.productRepository.findByName(productName);
    if (!product) {
      return null;
    }

    return this.drinkRules.getAvailableOptions(product);
  }

  /**
   * Verifica si un producto existe
   */
  async productExists(productName: string): Promise<boolean> {
    const product = await this.productRepository.findByName(productName);
    return product !== null;
  }

  /**
   * Valida solo la selección de bebidas para un producto
   */
  async validateDrinkSelectionOnly(
    productName: string,
    selectedDrinks: DrinkSelection[]
  ): Promise<ValidationResult> {
    const product = await this.productRepository.findByName(productName);
    if (!product) {
      return ValidationResult.failure(`Producto no encontrado: ${productName}`);
    }

    return this.validateDrinkSelection(product, selectedDrinks);
  }

  /**
   * Obtiene información completa de un producto
   */
  async getProductInfo(productName: string): Promise<{
    product: Product | null;
    drinkOptions: DrinkOptions | null;
    requiresDrinks: boolean;
    maxDrinks: number;
    minDrinks: number;
  }> {
    const product = await this.productRepository.findByName(productName);
    
    if (!product) {
      return {
        product: null,
        drinkOptions: null,
        requiresDrinks: false,
        maxDrinks: 0,
        minDrinks: 0
      };
    }

    const drinkOptions = this.drinkRules.getAvailableOptions(product);
    const requiresDrinks = this.drinkRules.requiresDrinkSelection(product);
    const maxDrinks = this.drinkRules.getMaxDrinkLimit(product);
    const minDrinks = this.drinkRules.getMinDrinkLimit(product);

    return {
      product,
      drinkOptions,
      requiresDrinks,
      maxDrinks,
      minDrinks
    };
  }

  /**
   * Valida la cantidad de un producto
   */
  private validateQuantity(quantity: number): ValidationResult {
    if (quantity <= 0) {
      return ValidationResult.failure('La cantidad debe ser mayor a cero');
    }

    if (!Number.isInteger(quantity)) {
      return ValidationResult.failure('La cantidad debe ser un número entero');
    }

    if (quantity > 50) {
      return ValidationResult.warning('Cantidad muy alta, verifique si es correcta');
    }

    return ValidationResult.success();
  }

  /**
   * Valida la selección de bebidas para un producto
   */
  private validateDrinkSelection(product: Product, selectedDrinks: DrinkSelection[]): ValidationResult {
    // Usar el puerto de reglas de bebidas para validar
    const validation = this.drinkRules.validateDrinkSelection(product, selectedDrinks);
    
    if (!validation.isValid) {
      return validation;
    }

    // Validaciones adicionales específicas del caso de uso
    const drinkOptions = this.drinkRules.getAvailableOptions(product);
    
    // Verificar que todas las bebidas seleccionadas sean válidas
    for (const drink of selectedDrinks) {
      if (!drinkOptions.isValidOption(drink.drinkName)) {
        return ValidationResult.failure(
          `Bebida no válida para este producto: ${drink.drinkName}`
        );
      }

      if (drink.quantity <= 0) {
        return ValidationResult.failure(
          `La cantidad de ${drink.drinkName} debe ser mayor a cero`
        );
      }
    }

    return ValidationResult.success();
  }

  /**
   * Valida el término de cocción para un producto
   */
  private validateCookingTerm(product: Product, cookingTerm: string): ValidationResult {
    if (!product.isFood()) {
      return ValidationResult.failure('Solo los alimentos pueden tener término de cocción');
    }

    const validTerms = ['crudo', 'poco cocido', 'término medio', 'bien cocido', 'muy cocido'];
    const normalizedTerm = cookingTerm.toLowerCase().trim();
    
    if (!validTerms.includes(normalizedTerm)) {
      return ValidationResult.failure(
        `Término de cocción no válido. Opciones: ${validTerms.join(', ')}`
      );
    }

    return ValidationResult.success();
  }
}