import { OrderItem } from '../../Domain/Entities/OrderItem.js';
import { OrderItemId } from '../../Domain/ValueObjects/OrderItemId.js';
import { DomainEventFactory } from '../../Domain/Ports/EventBusPort.js';
/**
 * Caso de uso para crear y gestionar órdenes
 * Orquesta la lógica de aplicación sin contener lógica de dominio
 */
export class CreateOrderUseCase {
    constructor(orderRepository, productRepository, drinkRules, eventBus) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.drinkRules = drinkRules;
        this.eventBus = eventBus;
    }
    /**
     * Obtiene o crea la orden actual
     */
    async getCurrentOrder() {
        let currentOrder = await this.orderRepository.getCurrentOrder();
        if (!currentOrder) {
            currentOrder = await this.orderRepository.createOrder();
            // Publicar evento de orden creada
            const orderCreatedEvent = DomainEventFactory.createOrderCreatedEvent(currentOrder.id.value);
            await this.eventBus.publish(orderCreatedEvent);
        }
        return currentOrder;
    }
    /**
     * Agrega un producto a la orden actual
     */
    async addProductToOrder(productData) {
        // 1. Validar datos de entrada
        this.validateProductSelectionData(productData);
        // 2. Buscar el producto
        const product = await this.productRepository.findByName(productData.productName);
        if (!product) {
            throw new Error(`Product not found: ${productData.productName}`);
        }
        // 3. Validar selección de bebidas si es necesario
        if (product.requiresDrinkSelection()) {
            const drinkValidation = this.drinkRules.validateDrinkSelection(product, productData.selectedDrinks || []);
            if (!drinkValidation.isValid) {
                throw new Error(`Invalid drink selection: ${drinkValidation.errorMessage}`);
            }
        }
        // 4. Crear personalizaciones
        const customizations = this.createCustomizations(product, productData);
        // 5. Crear item de orden
        const orderItem = new OrderItem(OrderItemId.generate(), product, productData.quantity, customizations);
        // 6. Obtener orden actual y agregar item
        const order = await this.getCurrentOrder();
        order.addItem(orderItem);
        // 7. Guardar orden
        await this.orderRepository.save(order);
        // 8. Publicar evento de producto agregado
        const productAddedEvent = DomainEventFactory.createProductAddedToOrderEvent(order.id.value, product.id.value, product.name.value, productData.quantity, product.price.toNumber());
        await this.eventBus.publish(productAddedEvent);
        return orderItem;
    }
    /**
     * Remueve un item de la orden actual
     */
    async removeItemFromOrder(itemId) {
        const order = await this.getCurrentOrder();
        const removed = order.removeItem(itemId);
        if (removed) {
            await this.orderRepository.save(order);
        }
        return removed;
    }
    /**
     * Actualiza la cantidad de un item
     */
    async updateItemQuantity(itemId, newQuantity) {
        if (newQuantity < 0) {
            throw new Error('Quantity cannot be negative');
        }
        const order = await this.getCurrentOrder();
        const updated = order.updateItemQuantity(itemId, newQuantity);
        if (updated) {
            await this.orderRepository.save(order);
        }
        return updated;
    }
    /**
     * Completa la orden actual
     */
    async completeCurrentOrder() {
        const order = await this.getCurrentOrder();
        if (!order.canBeCompleted()) {
            throw new Error('Order cannot be completed: must contain items');
        }
        order.complete();
        await this.orderRepository.save(order);
        await this.orderRepository.clearCurrentOrder();
        return order;
    }
    /**
     * Cancela la orden actual
     */
    async cancelCurrentOrder() {
        const order = await this.getCurrentOrder();
        order.cancel();
        await this.orderRepository.save(order);
        await this.orderRepository.clearCurrentOrder();
    }
    /**
     * Limpia la orden actual
     */
    async clearCurrentOrder() {
        const order = await this.getCurrentOrder();
        order.clear();
        await this.orderRepository.save(order);
    }
    /**
     * Obtiene el resumen de la orden actual
     */
    async getOrderSummary() {
        const order = await this.getCurrentOrder();
        return {
            order,
            itemCount: order.getItemCount(),
            total: order.getTotal().toNumber(),
            canBeCompleted: order.canBeCompleted()
        };
    }
    /**
     * Valida los datos de selección de producto
     */
    validateProductSelectionData(data) {
        if (!data.productName || data.productName.trim().length === 0) {
            throw new Error('Product name is required');
        }
        if (!data.quantity || data.quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
        if (!Number.isInteger(data.quantity)) {
            throw new Error('Quantity must be a whole number');
        }
    }
    /**
     * Crea las personalizaciones basadas en los datos del producto
     */
    createCustomizations(product, data) {
        const customizations = [];
        // Agregar bebidas seleccionadas
        if (data.selectedDrinks && data.selectedDrinks.length > 0) {
            data.selectedDrinks.forEach(drink => {
                customizations.push({
                    type: 'drink',
                    name: drink.drinkName,
                    value: drink.quantity.toString()
                });
            });
        }
        // Agregar término de cocción
        if (data.cookingTerm) {
            customizations.push({
                type: 'cooking_term',
                name: 'Término de cocción',
                value: data.cookingTerm
            });
        }
        // Agregar solicitudes especiales
        if (data.specialRequests && data.specialRequests.length > 0) {
            data.specialRequests.forEach(request => {
                customizations.push({
                    type: 'special_request',
                    name: 'Solicitud especial',
                    value: request
                });
            });
        }
        return customizations;
    }
}
