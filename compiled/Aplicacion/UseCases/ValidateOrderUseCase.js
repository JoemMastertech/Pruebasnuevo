"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateOrderUseCase = void 0;
const EventBusPort_js_1 = require("../../Domain/Ports/EventBusPort.js");
/**
 * Caso de uso para validar órdenes completas
 * Verifica que la orden cumple con todas las reglas de negocio
 */
class ValidateOrderUseCase {
    constructor(orderRepository, drinkRules, eventBus) {
        this.orderRepository = orderRepository;
        this.drinkRules = drinkRules;
        this.eventBus = eventBus;
    }
    /**
     * Valida la orden actual
     */
    async execute(options = {}) {
        const validationOptions = {
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
            const errors = [];
            const warnings = [];
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
                totalAmount: order.calculateTotal()
            };
            // 4. Publicar evento de validación
            const orderValidatedEvent = EventBusPort_js_1.DomainEventFactory.createOrderValidatedEvent(order.getId().getValue(), result.isValid, result.totalAmount || 0, result.errors.length > 0 ? result.errors : undefined);
            await this.eventBus.publish(orderValidatedEvent);
            return result;
        }
        catch (error) {
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
    async validateSpecificOrder(order, options = {}) {
        const validationOptions = {
            validateDrinks: true,
            validatePricing: true,
            validateBusinessRules: true,
            strictMode: false,
            ...options
        };
        const errors = [];
        const warnings = [];
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
            totalAmount: order.calculateTotal()
        };
    }
    /**
     * Validación básica de la orden
     */
    validateBasicOrder(order, errors, warnings) {
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
        if (!order.getId()) {
            errors.push('La orden debe tener un ID válido');
        }
    }
    /**
     * Validación de items individuales
     */
    validateOrderItems(order, errors, warnings, options) {
        const items = order.getItems();
        items.forEach((item, index) => {
            // Validar cantidad
            if (item.getQuantity() <= 0) {
                errors.push(`Item ${index + 1}: La cantidad debe ser mayor a 0`);
            }
            if (item.getQuantity() > 10) {
                warnings.push(`Item ${index + 1}: Cantidad muy alta (${item.getQuantity()})`);
            }
            // Validar producto
            const product = item.getProduct();
            if (!product) {
                errors.push(`Item ${index + 1}: Producto no válido`);
                return;
            }
            // Validar precio del producto
            if (product.getPrice() <= 0) {
                errors.push(`Item ${index + 1}: El producto "${product.getName()}" no tiene un precio válido`);
            }
            // Validar personalizaciones
            this.validateItemCustomizations(item, errors, warnings, index);
        });
    }
    /**
     * Validación de personalizaciones de items
     */
    validateItemCustomizations(item, errors, warnings, itemIndex) {
        const customizations = item.getCustomizations();
        customizations.forEach((customization, custIndex) => {
            if (!customization.getType() || customization.getType().trim() === '') {
                errors.push(`Item ${itemIndex + 1}, personalización ${custIndex + 1}: Tipo de personalización requerido`);
            }
            if (!customization.getValue() || customization.getValue().trim() === '') {
                errors.push(`Item ${itemIndex + 1}, personalización ${custIndex + 1}: Valor de personalización requerido`);
            }
            if (customization.getQuantity() <= 0) {
                errors.push(`Item ${itemIndex + 1}, personalización ${custIndex + 1}: Cantidad debe ser mayor a 0`);
            }
        });
    }
    /**
     * Validación de selecciones de bebidas
     */
    async validateDrinkSelections(order, errors, warnings) {
        const items = order.getItems();
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const product = item.getProduct();
            if (product.requiresDrinkSelection()) {
                // Obtener bebidas seleccionadas de las personalizaciones
                const drinkCustomizations = item.getCustomizations()
                    .filter(c => c.getType() === 'drink');
                const selectedDrinks = drinkCustomizations.map(c => ({
                    name: c.getValue(),
                    quantity: c.getQuantity()
                }));
                // Validar con las reglas de bebidas
                const validation = this.drinkRules.validateDrinkSelection(product, selectedDrinks);
                if (!validation.isValid) {
                    errors.push(`Item ${i + 1}: ${validation.errorMessage}`);
                }
                // Verificar si hay opciones disponibles
                const availableOptions = this.drinkRules.getAvailableDrinkOptions(product);
                if (availableOptions.length === 0) {
                    warnings.push(`Item ${i + 1}: No hay opciones de bebida disponibles para "${product.getName()}"`);
                }
            }
        }
    }
    /**
     * Validación de precios
     */
    validatePricing(order, errors, warnings) {
        try {
            const total = order.calculateTotal();
            if (total <= 0) {
                errors.push('El total de la orden debe ser mayor a 0');
            }
            if (total > 10000) {
                warnings.push(`Total muy alto: $${total.toFixed(2)}. Verifique los precios.`);
            }
            // Verificar que el cálculo sea consistente
            const manualTotal = order.getItems().reduce((sum, item) => {
                return sum + (item.getProduct().getPrice() * item.getQuantity());
            }, 0);
            if (Math.abs(total - manualTotal) > 0.01) {
                warnings.push('Discrepancia en el cálculo del total. Verifique los precios.');
            }
        }
        catch (error) {
            errors.push('Error al calcular el total de la orden');
        }
    }
    /**
     * Validación de reglas de negocio específicas
     */
    validateBusinessRules(order, errors, warnings, strictMode) {
        const items = order.getItems();
        // Regla: No más de 5 items del mismo producto
        const productCounts = new Map();
        items.forEach(item => {
            const productName = item.getProduct().getName();
            const currentCount = productCounts.get(productName) || 0;
            productCounts.set(productName, currentCount + item.getQuantity());
        });
        productCounts.forEach((count, productName) => {
            if (count > 5) {
                if (strictMode) {
                    errors.push(`Demasiadas unidades del producto "${productName}" (${count}). Máximo permitido: 5`);
                }
                else {
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
    validateSpecialCombinations(order, errors, warnings, strictMode) {
        const items = order.getItems();
        const productNames = items.map(item => item.getProduct().getName().toLowerCase());
        // Ejemplo: Si hay hamburguesa, sugerir papas
        const hasHamburger = productNames.some(name => name.includes('hamburguesa') || name.includes('burger'));
        const hasFries = productNames.some(name => name.includes('papas') || name.includes('fries'));
        if (hasHamburger && !hasFries) {
            warnings.push('Sugerencia: Considere agregar papas para acompañar la hamburguesa');
        }
        // Ejemplo: Verificar bebidas con comidas
        const hasFood = items.some(item => item.getProduct().requiresDrinkSelection());
        const hasDrinks = items.some(item => item.getCustomizations().some(c => c.getType() === 'drink'));
        if (hasFood && !hasDrinks && strictMode) {
            warnings.push('Considere agregar bebidas para acompañar la comida');
        }
    }
    /**
     * Validación rápida para verificar si la orden puede proceder
     */
    async canProceedToPayment() {
        try {
            const result = await this.execute({ strictMode: false });
            return result.canProceedToPayment;
        }
        catch {
            return false;
        }
    }
}
exports.ValidateOrderUseCase = ValidateOrderUseCase;
