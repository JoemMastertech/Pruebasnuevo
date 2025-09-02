import { Order } from '../../Domain/Entities/Order.js';
import { OrderRepositoryPort } from '../../Domain/Ports/OrderRepositoryPort.js';
import { DrinkRulesPort, ValidationResult } from '../../Domain/Ports/DrinkRulesPort.js';
import { OrderItem } from '../../Domain/Entities/OrderItem.js';
import { EventBusPort, DomainEventFactory } from '../../Domain/Ports/EventBusPort.js';

/**
 * Resultado de la validación de orden
 */
export interface OrderValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canProceedToPayment: boolean;
  totalAmount?: number;
}

/**
 * Opciones para la validación
 */
export interface ValidationOptions {
  validateDrinks: boolean;
  validatePricing: boolean;
  validateBusinessRules: boolean;
  strictMode: boolean;
}

/**
 * Caso de uso para validar órdenes completas
 * Verifica que la orden cumple con todas las reglas de negocio
 */
export class ValidateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepositoryPort,
    private readonly drinkRules: DrinkRulesPort,
    private readonly eventBus: EventBusPort
  ) {}

  /**
   * Valida la orden actual
   */
  async execute(options: Partial<ValidationOptions> = {}): Promise<OrderValidationResult> {
    const validationOptions: ValidationOptions = {
      validateDrinks: true,
      validatePricing: true,
      validateBusinessRules: true,
      strictMode: false,
      ...options
    };

    try {
      // 1. Obtener orden actual
      const order = await this.orderRepository.getCurrentOrder();
      if (!order) {
        return {
          isValid: false,
          errors: ['No hay una orden activa para validar'],
          warnings: [],
          canProceedToPayment: false
        };
      }

      // 2. Realizar validaciones
      const errors: string[] = [];
      const warnings: string[] = [];

      // Validación básica de la orden
      this.validateBasicOrder(order, errors, warnings);

      // Validación de items
      this.validateOrderItems(order, errors, warnings, validationOptions);

      // Validación de bebidas
      if (validationOptions.validateDrinks) {
        await this.validateDrinkSelections(order, errors, warnings);
      }

      // Validación de precios
      if (validationOptions.validatePricing) {
        this.validatePricing(order, errors, warnings);
      }

      // Validación de reglas de negocio
      if (validationOptions.validateBusinessRules) {
        this.validateBusinessRules(order, errors, warnings, validationOptions.strictMode);
      }

      // 3. Determinar si puede proceder al pago
      const canProceedToPayment = errors.length === 0 && 
        (!validationOptions.strictMode || warnings.length === 0);

      const result = {
        isValid: errors.length === 0,
        errors,
        warnings,
        canProceedToPayment,
        totalAmount: order.getTotal().toNumber()
      };

      // 4. Publicar evento de validación
      const orderValidatedEvent = DomainEventFactory.createOrderValidatedEvent(
        order.id.value,
        result.isValid,
        result.totalAmount || 0,
        result.errors.length > 0 ? result.errors : undefined
      );
      await this.eventBus.publish(orderValidatedEvent);

      return result;

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Error desconocido en validación'],
        warnings: [],
        canProceedToPayment: false
      };
    }
  }

  /**
   * Valida una orden específica (no necesariamente la actual)
   */
  async validateSpecificOrder(order: Order, options: Partial<ValidationOptions> = {}): Promise<OrderValidationResult> {
    const validationOptions: ValidationOptions = {
      validateDrinks: true,
      validatePricing: true,
      validateBusinessRules: true,
      strictMode: false,
      ...options
    };

    const errors: string[] = [];
    const warnings: string[] = [];

    // Realizar todas las validaciones
    this.validateBasicOrder(order, errors, warnings);
    this.validateOrderItems(order, errors, warnings, validationOptions);
    
    if (validationOptions.validateDrinks) {
      await this.validateDrinkSelections(order, errors, warnings);
    }
    
    if (validationOptions.validatePricing) {
      this.validatePricing(order, errors, warnings);
    }
    
    if (validationOptions.validateBusinessRules) {
      this.validateBusinessRules(order, errors, warnings, validationOptions.strictMode);
    }

    const canProceedToPayment = errors.length === 0 && 
      (!validationOptions.strictMode || warnings.length === 0);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceedToPayment,
      totalAmount: order.getTotal().toNumber()
    };
  }

  /**
   * Validación básica de la orden
   */
  private validateBasicOrder(order: Order, errors: string[], warnings: string[]): void {
    // Verificar que la orden tenga items
    if (order.getItems().length === 0) {
      errors.push('La orden debe tener al menos un producto');
      return;
    }

    // Verificar límite máximo de items
    if (order.getItems().length > 20) {
      warnings.push('La orden tiene muchos items (más de 20), considere dividirla');
    }

    // Verificar que la orden tenga un ID válido
    if (!order.id) {
      errors.push('La orden debe tener un ID válido');
    }
  }

  /**
   * Validación de items individuales
   */
  private validateOrderItems(order: Order, errors: string[], warnings: string[], options: ValidationOptions): void {
    const items = order.getItems();
    
    items.forEach((item, index) => {
      // Validar cantidad
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: La cantidad debe ser mayor a 0`);
      }
      
      if (item.quantity > 10) {
        warnings.push(`Item ${index + 1}: Cantidad muy alta (${item.quantity})`);
      }

      // Validar producto
      const product = item.product;
      if (!product) {
        errors.push(`Item ${index + 1}: Producto no válido`);
        return;
      }

      // Validar precio del producto
      if (product.price.toNumber() <= 0) {
        errors.push(`Item ${index + 1}: El producto "${product.name.value}" no tiene un precio válido`);
      }

      // Validar personalizaciones
      this.validateItemCustomizations(item, errors, warnings, index);
    });
  }

  /**
   * Validación de personalizaciones de items
   */
  private validateItemCustomizations(item: OrderItem, errors: string[], warnings: string[], itemIndex: number): void {
    const customizations = item.customizations;
    
    customizations.forEach((customization, custIndex) => {
      if (!customization.type || customization.type.trim() === '') {
        errors.push(`Item ${itemIndex + 1}, personalización ${custIndex + 1}: Tipo de personalización requerido`);
      }
      
      if (!customization.value || customization.value.trim() === '') {
        errors.push(`Item ${itemIndex + 1}, personalización ${custIndex + 1}: Valor de personalización requerido`);
      }
    });
  }

  /**
   * Validación de selecciones de bebidas
   */
  private async validateDrinkSelections(order: Order, errors: string[], warnings: string[]): Promise<void> {
    const items = order.getItems();
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) continue;
      
      const product = item.product;
      
      if (product.requiresDrinkSelection()) {
        // Obtener bebidas seleccionadas de las personalizaciones
        const drinkCustomizations = item.customizations
          .filter(c => c.type === 'drink');
        
        const selectedDrinks = drinkCustomizations.map(c => ({
          drinkName: c.value,
          quantity: 1
        }));
        
        // Validar con las reglas de bebidas
        const validation = this.drinkRules.validateDrinkSelection(product, selectedDrinks);
        
        if (!validation.isValid) {
          errors.push(`Item ${i + 1}: ${validation.errorMessage}`);
        }
        
        // Verificar si hay opciones disponibles
        const availableOptions = this.drinkRules.getAvailableOptions(product);
        if (!availableOptions.hasOptions()) {
          warnings.push(`Item ${i + 1}: No hay opciones de bebida disponibles para "${product.name.value}"`);
        }
      }
    }
  }

  /**
   * Validación de precios
   */
  private validatePricing(order: Order, errors: string[], warnings: string[]): void {
    try {
      const total = order.getTotal().toNumber();
      
      if (total <= 0) {
        errors.push('El total de la orden debe ser mayor a 0');
      }
      
      if (total > 10000) {
        warnings.push(`Total muy alto: $${total.toFixed(2)}. Verifique los precios.`);
      }
      
      // Verificar que el cálculo sea consistente
      const manualTotal = order.getItems().reduce((sum, item) => {
        return sum + (item.product.price.toNumber() * item.quantity);
      }, 0);
      
      if (Math.abs(total - manualTotal) > 0.01) {
        warnings.push('Discrepancia en el cálculo del total. Verifique los precios.');
      }
      
    } catch (error) {
      errors.push('Error al calcular el total de la orden');
    }
  }

  /**
   * Validación de reglas de negocio específicas
   */
  private validateBusinessRules(order: Order, errors: string[], warnings: string[], strictMode: boolean): void {
    const items = order.getItems();
    
    // Regla: No más de 5 items del mismo producto
    const productCounts = new Map<string, number>();
    items.forEach(item => {
      const productName = item.product.name.value;
      const currentCount = productCounts.get(productName) || 0;
      productCounts.set(productName, currentCount + item.quantity);
    });
    
    productCounts.forEach((count, productName) => {
      if (count > 5) {
        if (strictMode) {
          errors.push(`Demasiadas unidades del producto "${productName}" (${count}). Máximo permitido: 5`);
        } else {
          warnings.push(`Muchas unidades del producto "${productName}" (${count})`);
        }
      }
    });
    
    // Regla: Verificar combinaciones especiales
    this.validateSpecialCombinations(order, errors, warnings, strictMode);
  }

  /**
   * Validación de combinaciones especiales de productos
   */
  private validateSpecialCombinations(order: Order, errors: string[], warnings: string[], strictMode: boolean): void {
    const items = order.getItems();
    const productNames = items.map(item => item.product.name.value.toLowerCase());
    
    // Ejemplo: Si hay hamburguesa, sugerir papas
    const hasHamburger = productNames.some(name => name.includes('hamburguesa') || name.includes('burger'));
    const hasFries = productNames.some(name => name.includes('papas') || name.includes('fries'));
    
    if (hasHamburger && !hasFries) {
      warnings.push('Sugerencia: Considere agregar papas para acompañar la hamburguesa');
    }
    
    // Ejemplo: Verificar bebidas con comidas
    const hasFood = items.some(item => item.product.requiresDrinkSelection());
    const hasDrinks = items.some(item => 
      item.customizations.some((c: any) => c.type === 'drink')
    );
    
    if (hasFood && !hasDrinks && strictMode) {
      warnings.push('Considere agregar bebidas para acompañar la comida');
    }
  }

  /**
   * Validación rápida para verificar si la orden puede proceder
   */
  async canProceedToPayment(): Promise<boolean> {
    try {
      const result = await this.execute({ strictMode: false });
      return result.canProceedToPayment;
    } catch {
      return false;
    }
  }
}