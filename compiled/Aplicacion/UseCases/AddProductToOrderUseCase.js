"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProductToOrderUseCase = void 0;
const OrderItem_js_1 = require("../../Domain/Entities/OrderItem.js");
const OrderItemId_js_1 = require("../../Domain/ValueObjects/OrderItemId.js");
const DrinkRulesPort_js_1 = require("../../Domain/Ports/DrinkRulesPort.js");
const EventBusPort_js_1 = require("../../Domain/Ports/EventBusPort.js");
/**
 * Caso de uso para agregar productos a una orden existente
 * Se enfoca específicamente en la lógica de agregar productos
 */
class AddProductToOrderUseCase {
    constructor(orderRepository, productRepository, drinkRules, eventBus) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.drinkRules = drinkRules;
        this.eventBus = eventBus;
    }
    /**
     * Agrega un producto a la orden actual
     */
    async execute(productData) {
        try {
            // 1. Validar datos de entrada
            this.validateProductData(productData);
            // 2. Buscar el producto
            const product = await this.productRepository.findByName(productData.productName);
            if (!product) {
                return {
                    success: false,
                    errorMessage: `Producto no encontrado: ${productData.productName}`
                };
            }
            // 3. Validar selección de bebidas si es necesario
            if (product.requiresDrinkSelection()) {
                const drinkValidation = this.drinkRules.validateDrinkSelection(product, productData.selectedDrinks || []);
                if (!drinkValidation.isValid) {
                    return {
                        success: false,
                        errorMessage: `Selección de bebidas inválida: ${drinkValidation.errorMessage}`
                    };
                }
            }
            // 4. Obtener orden actual
            const order = await this.orderRepository.getCurrentOrder();
            if (!order) {
                return {
                    success: false,
                    errorMessage: 'No hay una orden activa. Cree una orden primero.'
                };
            }
            // 5. Crear personalizaciones
            const customizations = this.createCustomizations(product, productData);
            // 6. Crear item de orden
            const orderItem = new OrderItem_js_1.OrderItem(OrderItemId_js_1.OrderItemId.generate(), product, productData.quantity, customizations);
            // 7. Agregar item a la orden
            order.addItem(orderItem);
            // 8. Guardar orden actualizada
            await this.orderRepository.save(order);
            // 9. Publicar evento de producto agregado
            const productAddedEvent = EventBusPort_js_1.DomainEventFactory.createProductAddedToOrderEvent(order.getId().getValue(), product.getId().getValue(), product.getName(), productData.quantity, product.getPrice().getValue());
            await this.eventBus.publish(productAddedEvent);
            return {
                success: true,
                orderItem
            };
        }
        catch (error) {
            return {
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Error desconocido al agregar producto'
            };
        }
    }
    /**
     * Valida los datos del producto
     */
    validateProductData(productData) {
        if (!productData.productName || productData.productName.trim() === '') {
            throw new Error('El nombre del producto es requerido');
        }
        if (!productData.quantity || productData.quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }
        if (productData.quantity > 10) {
            throw new Error('La cantidad máxima por producto es 10');
        }
    }
    /**
     * Crea las personalizaciones basadas en los datos del producto
     */
    createCustomizations(product, productData) {
        const customizations = [];
        // Agregar selección de bebidas
        if (productData.selectedDrinks && productData.selectedDrinks.length > 0) {
            productData.selectedDrinks.forEach(drink => {
                customizations.push(new OrderItem_js_1.Customization('drink', drink.name, drink.quantity || 1));
            });
        }
        // Agregar término de cocción
        if (productData.cookingTerm) {
            customizations.push(new OrderItem_js_1.Customization('cooking', productData.cookingTerm, 1));
        }
        // Agregar solicitudes especiales
        if (productData.specialRequests && productData.specialRequests.length > 0) {
            productData.specialRequests.forEach(request => {
                customizations.push(new OrderItem_js_1.Customization('special_request', request, 1));
            });
        }
        return customizations;
    }
    /**
     * Verifica si un producto puede ser agregado a la orden actual
     */
    async canAddProduct(productName, quantity = 1) {
        try {
            // Buscar el producto
            const product = await this.productRepository.findByName(productName);
            if (!product) {
                return DrinkRulesPort_js_1.ValidationResult.failure(`Producto no encontrado: ${productName}`);
            }
            // Verificar si hay una orden activa
            const order = await this.orderRepository.getCurrentOrder();
            if (!order) {
                return DrinkRulesPort_js_1.ValidationResult.failure('No hay una orden activa');
            }
            // Verificar límites de cantidad
            if (quantity <= 0 || quantity > 10) {
                return DrinkRulesPort_js_1.ValidationResult.failure('Cantidad inválida (debe ser entre 1 y 10)');
            }
            // Verificar reglas específicas del producto
            if (product.requiresDrinkSelection()) {
                const availableOptions = this.drinkRules.getAvailableDrinkOptions(product);
                if (availableOptions.length === 0) {
                    return DrinkRulesPort_js_1.ValidationResult.failure('No hay opciones de bebida disponibles para este producto');
                }
            }
            return DrinkRulesPort_js_1.ValidationResult.success();
        }
        catch (error) {
            return DrinkRulesPort_js_1.ValidationResult.failure(error instanceof Error ? error.message : 'Error al validar producto');
        }
    }
}
exports.AddProductToOrderUseCase = AddProductToOrderUseCase;
