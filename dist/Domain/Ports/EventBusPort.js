/**
 * Factory para crear eventos de dominio
 */
export class DomainEventFactory {
    /**
     * Crea un evento OrderCreated
     */
    static createOrderCreatedEvent(orderId, customerId) {
        const event = {
            eventId: this.generateEventId(),
            occurredOn: new Date(),
            eventVersion: 1,
            aggregateId: orderId,
            eventType: 'OrderCreated',
            orderId,
            createdAt: new Date()
        };
        if (customerId !== undefined) {
            event.customerId = customerId;
        }
        return event;
    }
    /**
     * Crea un evento ProductAddedToOrder
     */
    static createProductAddedToOrderEvent(orderId, productId, productName, quantity, unitPrice) {
        return {
            eventId: this.generateEventId(),
            occurredOn: new Date(),
            eventVersion: 1,
            aggregateId: orderId,
            eventType: 'ProductAddedToOrder',
            orderId,
            productId,
            productName,
            quantity,
            unitPrice
        };
    }
    /**
     * Crea un evento OrderValidated
     */
    static createOrderValidatedEvent(orderId, isValid, totalAmount, validationErrors) {
        const event = {
            eventId: this.generateEventId(),
            occurredOn: new Date(),
            eventVersion: 1,
            aggregateId: orderId,
            eventType: 'OrderValidated',
            orderId,
            isValid,
            totalAmount
        };
        if (validationErrors !== undefined) {
            event.validationErrors = validationErrors;
        }
        return event;
    }
    /**
     * Crea un evento OrderCompleted
     */
    static createOrderCompletedEvent(orderId, totalAmount, paymentMethod) {
        const event = {
            eventId: this.generateEventId(),
            occurredOn: new Date(),
            eventVersion: 1,
            aggregateId: orderId,
            eventType: 'OrderCompleted',
            orderId,
            totalAmount,
            completedAt: new Date()
        };
        if (paymentMethod !== undefined) {
            event.paymentMethod = paymentMethod;
        }
        return event;
    }
    /**
     * Crea un evento OrderCancelled
     */
    static createOrderCancelledEvent(orderId, reason) {
        return {
            eventId: this.generateEventId(),
            occurredOn: new Date(),
            eventVersion: 1,
            aggregateId: orderId,
            eventType: 'OrderCancelled',
            orderId,
            reason,
            cancelledAt: new Date()
        };
    }
    /**
     * Genera un ID único para el evento
     */
    static generateEventId() {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
//# sourceMappingURL=EventBusPort.js.map