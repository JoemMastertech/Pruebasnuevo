import { OrderItem } from '../../Domain/Entities/OrderItem.js';
import { OrderItemId } from '../../Domain/ValueObjects/OrderItemId.js';
import { ValidationResult } from '../../Domain/Ports/DrinkRulesPort.js';
import { DomainEventFactory } from '../../Domain/Ports/EventBusPort.js';
/**
 * Caso de uso para agregar productos a una orden existente
 * Se enfoca específicamente en la lógica de agregar productos
 */
export class AddProductToOrderUseCase {
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
            // 5. Verificar si ya existe un item similar y combinarlo
            const customizations = this.createCustomizations(product, productData);
            const existingItem = order.getItems().find(item => item.product.id.equals(product.id) &&
                this.customizationsMatch(item.customizations, customizations));
            if (existingItem) {
                // Actualizar cantidad del item existente
                const newQuantity = existingItem.quantity + productData.quantity;
                order.updateItemQuantity(existingItem.id, newQuantity);
            }
            else {
                // 6. Crear nuevo item de orden
                const orderItem = new OrderItem(OrderItemId.generate(), product, productData.quantity, customizations);
                // 7. Agregar item a la orden
                order.addItem(orderItem);
            }
            // 8. Guardar orden actualizada
            await this.orderRepository.save(order);
            // 9. Publicar evento de producto agregado
            const productAddedEvent = DomainEventFactory.createProductAddedToOrderEvent(order.id.value, product.id.value, product.name.value, productData.quantity, product.price.toNumber());
            await this.eventBus.publish(productAddedEvent);
            const finalOrderItem = existingItem ?
                order.getItems().find(item => item.id.equals(existingItem.id)) :
                order.getItems().find(item => item.product.id.equals(product.id));
            return {
                success: true,
                orderItem: finalOrderItem
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
                customizations.push({
                    type: 'drink',
                    name: drink.drinkName,
                    value: drink.drinkName
                });
            });
        }
        // Agregar término de cocción
        if (productData.cookingTerm) {
            customizations.push({
                type: 'cooking_term',
                name: 'cooking_term',
                value: productData.cookingTerm
            });
        }
        // Agregar solicitudes especiales
        if (productData.specialRequests && productData.specialRequests.length > 0) {
            productData.specialRequests.forEach(request => {
                customizations.push({
                    type: 'special_request',
                    name: 'special_request',
                    value: request
                });
            });
        }
        return customizations;
    }
    /**
     * Verifica si dos arrays de personalizaciones son equivalentes
     */
    customizationsMatch(customizations1, customizations2) {
        if (customizations1.length !== customizations2.length) {
            return false;
        }
        return customizations1.every(c1 => customizations2.some(c2 => c1.type === c2.type &&
            c1.value === c2.value &&
            true // Las personalizaciones no tienen cantidad
        ));
    }
    /**
     * Verifica si un producto puede ser agregado a la orden actual
     */
    async canAddProduct(productName, quantity = 1) {
        try {
            // Buscar el producto
            const product = await this.productRepository.findByName(productName);
            if (!product) {
                return ValidationResult.failure(`Producto no encontrado: ${productName}`);
            }
            // Verificar si hay una orden activa
            const order = await this.orderRepository.getCurrentOrder();
            if (!order) {
                return ValidationResult.failure('No hay una orden activa');
            }
            // Verificar límites de cantidad
            if (quantity <= 0 || quantity > 10) {
                return ValidationResult.failure('Cantidad inválida (debe ser entre 1 y 10)');
            }
            // Verificar reglas específicas del producto
            if (product.requiresDrinkSelection()) {
                const availableOptions = this.drinkRules.getAvailableOptions(product);
                if (!availableOptions.hasOptions()) {
                    return ValidationResult.failure('No hay opciones de bebida disponibles para este producto');
                }
            }
            return ValidationResult.success();
        }
        catch (error) {
            return ValidationResult.failure(error instanceof Error ? error.message : 'Error al validar producto');
        }
    }
}
