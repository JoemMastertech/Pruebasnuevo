import { Order } from '../../Domain/Entities/Order.js';
import { OrderRepositoryPort } from '../../Domain/Ports/OrderRepositoryPort.js';
import { DrinkRulesPort } from '../../Domain/Ports/DrinkRulesPort.js';
import { EventBusPort } from '../../Domain/Ports/EventBusPort.js';
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
export declare class ValidateOrderUseCase {
    private readonly orderRepository;
    private readonly drinkRules;
    private readonly eventBus;
    constructor(orderRepository: OrderRepositoryPort, drinkRules: DrinkRulesPort, eventBus: EventBusPort);
    /**
     * Valida la orden actual
     */
    execute(options?: Partial<ValidationOptions>): Promise<OrderValidationResult>;
    /**
     * Valida una orden específica (no necesariamente la actual)
     */
    validateSpecificOrder(order: Order, options?: Partial<ValidationOptions>): Promise<OrderValidationResult>;
    /**
     * Validación básica de la orden
     */
    private validateBasicOrder;
    /**
     * Validación de items individuales
     */
    private validateOrderItems;
    /**
     * Validación de personalizaciones de items
     */
    private validateItemCustomizations;
    /**
     * Validación de selecciones de bebidas
     */
    private validateDrinkSelections;
    /**
     * Validación de precios
     */
    private validatePricing;
    /**
     * Validación de reglas de negocio específicas
     */
    private validateBusinessRules;
    /**
     * Validación de combinaciones especiales de productos
     */
    private validateSpecialCombinations;
    /**
     * Validación rápida para verificar si la orden puede proceder
     */
    canProceedToPayment(): Promise<boolean>;
}
//# sourceMappingURL=ValidateOrderUseCase.d.ts.map