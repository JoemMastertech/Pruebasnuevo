import { Product } from '../../Domain/Entities/Product.js';
import { DrinkRulesPort, DrinkOptions, DrinkSelection, ValidationResult } from '../../Domain/Ports/DrinkRulesPort.js';

/**
 * Adaptador que implementa las reglas de bebidas
 * Conecta con el sistema de validación existente
 */
export class DrinkRulesServiceAdapter implements DrinkRulesPort {
  private readonly validationService: any;

  constructor(validationService?: any) {
    this.validationService = validationService;
  }

  /**
   * Obtiene las opciones de bebida disponibles para un producto
   */
  getAvailableOptions(product: Product): DrinkOptions {
    if (!product.requiresDrinkSelection()) {
      return DrinkOptions.none();
    }

    const liquorType = product.getLiquorType();
    return this.getRulesForLiquorType(liquorType);
  }

  /**
   * Valida una selección de bebidas para un producto
   */
  validateDrinkSelection(product: Product, selectedDrinks: DrinkSelection[]): ValidationResult {
    // 1. Verificar si el producto requiere bebidas
    if (!product.requiresDrinkSelection()) {
      if (selectedDrinks.length > 0) {
        return ValidationResult.failure('Este producto no permite selección de bebidas');
      }
      return ValidationResult.success();
    }

    // 2. Verificar límites de cantidad
    const maxLimit = this.getMaxDrinkLimit(product);
    const minLimit = this.getMinDrinkLimit(product);
    const totalDrinks = selectedDrinks.reduce((sum, drink) => sum + drink.quantity, 0);

    if (totalDrinks < minLimit) {
      return ValidationResult.failure(`Debe seleccionar al menos ${minLimit} bebida(s)`);
    }

    if (totalDrinks > maxLimit) {
      return ValidationResult.failure(`No puede seleccionar más de ${maxLimit} bebida(s)`);
    }

    // 3. Verificar disponibilidad de bebidas
    const availableOptions = this.getAvailableOptions(product);
    for (const drink of selectedDrinks) {
      if (!availableOptions.isValidOption(drink.drinkName)) {
        return ValidationResult.failure(`Bebida no disponible: ${drink.drinkName}`);
      }

      if (drink.quantity <= 0) {
        return ValidationResult.failure(`La cantidad debe ser mayor a cero para: ${drink.drinkName}`);
      }
    }

    // 4. Validar reglas específicas del licor
    const liquorValidation = this.validateLiquorSpecificRules(product, selectedDrinks);
    if (!liquorValidation.isValid) {
      return liquorValidation;
    }

    // 5. Validar compatibilidad entre bebidas
    const compatibilityValidation = this.validateDrinkCompatibilityInternal(selectedDrinks);
    if (!compatibilityValidation.isValid) {
      return compatibilityValidation;
    }

    return ValidationResult.success();
  }

  /**
   * Obtiene el límite máximo de bebidas para un producto
   */
  getMaxDrinkLimit(product: Product): number {
    if (!product.requiresDrinkSelection()) {
      return 0;
    }

    const liquorType = product.getLiquorType();
    const rules = this.liquorRules[liquorType as keyof typeof this.liquorRules] || this.liquorRules.DEFAULT;
    return rules.maxDrinks;
  }

  /**
   * Obtiene el límite mínimo de bebidas para un producto
   */
  getMinDrinkLimit(product: Product): number {
    if (!product.requiresDrinkSelection()) {
      return 0;
    }

    const liquorType = product.getLiquorType();
    const rules = this.liquorRules[liquorType as keyof typeof this.liquorRules] || this.liquorRules.DEFAULT;
    return rules.minDrinks || 1;
  }

  /**
   * Verifica si un producto requiere selección de bebidas
   */
  requiresDrinkSelection(product: Product): boolean {
    return product.requiresDrinkSelection();
  }

  /**
   * Verifica si un producto permite múltiples bebidas del mismo tipo
   */
  allowsMultipleDrinks(product: Product): boolean {
    if (!product.requiresDrinkSelection()) {
      return false;
    }

    const liquorType = product.getLiquorType();
    const rules = this.liquorRules[liquorType as keyof typeof this.liquorRules] || this.liquorRules.DEFAULT;
    return rules.allowMultiple || false;
  }

  /**
   * Obtiene las reglas específicas para un tipo de licor
   */
  getRulesForLiquorType(liquorType: string): DrinkOptions {
    const rules = this.liquorRules[liquorType as keyof typeof this.liquorRules] || this.liquorRules.DEFAULT;
    
    return new DrinkOptions(rules.allowedDrinks, {
      maxCount: rules.maxDrinks,
      minCount: rules.minDrinks || 1,
      allowMultiple: rules.allowMultiple || false
    });
  }

  /**
   * Valida si una bebida específica es compatible con un producto
   */
  validateDrinkCompatibility(product: Product, drinkName: string): ValidationResult {
    const availableOptions = this.getAvailableOptions(product);
    
    if (!availableOptions.isValidOption(drinkName)) {
      return ValidationResult.failure(`Bebida no compatible con este producto: ${drinkName}`);
    }

    return this.validateLiquorSpecificRules(product, [{ drinkName, quantity: 1 }]);
  }

  /**
   * Reglas específicas por tipo de licor
   */
  private readonly liquorRules = {
    RON: {
      allowedDrinks: ['Coca Cola', 'Sprite', 'Agua Mineral', 'Hielos'],
      maxDrinks: 2,
      minDrinks: 1,
      allowMultiple: false,
      specialRules: ['no_citrus']
    },
    TEQUILA: {
      allowedDrinks: ['Coca Cola', 'Sprite', 'Agua Mineral', 'Jugo de Naranja', 'Hielos'],
      maxDrinks: 2,
      minDrinks: 1,
      allowMultiple: false
    },
    VODKA: {
      allowedDrinks: ['Coca Cola', 'Sprite', 'Jugo de Naranja', 'Jugo de Arándano', 'Agua Mineral', 'Hielos'],
      maxDrinks: 2,
      minDrinks: 1,
      allowMultiple: false
    },
    WHISKY: {
      allowedDrinks: ['Coca Cola', 'Sprite', 'Agua Mineral', 'Hielos'],
      maxDrinks: 2,
      minDrinks: 1,
      allowMultiple: false
    },
    JAGERMEISTER: {
      allowedDrinks: [],
      maxDrinks: 0,
      minDrinks: 0,
      allowMultiple: false,
      specialRules: ['no_drinks']
    },
    BOTELLA: {
      allowedDrinks: ['Coca Cola', 'Sprite', 'Agua Mineral', 'Jugo de Naranja', 'Hielos'],
      maxDrinks: 4,
      minDrinks: 2,
      allowMultiple: true
    },
    DEFAULT: {
      allowedDrinks: ['Coca Cola', 'Sprite', 'Agua Mineral', 'Hielos'],
      maxDrinks: 2,
      minDrinks: 1,
      allowMultiple: false
    }
  };

  /**
   * Valida reglas específicas del licor
   */
  private validateLiquorSpecificRules(product: Product, selectedDrinks: DrinkSelection[]): ValidationResult {
    const liquorType = product.getLiquorType();
    const rules = this.liquorRules[liquorType as keyof typeof this.liquorRules] || this.liquorRules.DEFAULT;

    if ('specialRules' in rules && rules.specialRules) {
      for (const rule of rules.specialRules) {
        switch (rule) {
          case 'no_drinks':
            if (selectedDrinks.length > 0) {
              return ValidationResult.failure('Jägermeister se sirve solo, sin bebidas acompañantes');
            }
            break;
          case 'no_citrus':
            const hasCitrus = selectedDrinks.some(drink => 
              drink.drinkName.toLowerCase().includes('naranja') ||
              drink.drinkName.toLowerCase().includes('limón') ||
              drink.drinkName.toLowerCase().includes('lima')
            );
            if (hasCitrus) {
              return ValidationResult.failure('El ron no se puede mezclar con jugos cítricos');
            }
            break;
        }
      }
    }

    return ValidationResult.success();
  }

  /**
   * Valida compatibilidad entre bebidas seleccionadas
   */
  private validateDrinkCompatibilityInternal(selectedDrinks: DrinkSelection[]): ValidationResult {
    const drinkNames = selectedDrinks.map(drink => drink.drinkName.toLowerCase());
    
    // Regla: No mezclar jugos con refrescos
    const hasJuice = drinkNames.some(name => name.includes('jugo'));
    const hasSoda = drinkNames.some(name => 
      name.includes('coca') || name.includes('sprite') || name.includes('refresco')
    );
    
    if (hasJuice && hasSoda) {
      return ValidationResult.failure('No se pueden mezclar jugos con refrescos');
    }

    return ValidationResult.success();
  }
}