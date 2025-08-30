"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEventFactory = void 0;
/**
 * Factory para crear eventos de dominio
 */
class DomainEventFactory {
    /**
     * Crea un evento OrderCreated
     */
    static createOrderCreatedEvent(orderId, customerId) {
        return {
            eventId: this.generateEventId(),
            occurredOn: new Date(),
            eventVersion: 1,
            aggregateId: orderId,
            eventType: 'OrderCreated',
            orderId,
            customerId,
            createdAt: new Date()
        };
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
        return {
            eventId: this.generateEventId(),
            occurredOn: new Date(),
            eventVersion: 1,
            aggregateId: orderId,
            eventType: 'OrderValidated',
            orderId,
            isValid,
            validationErrors,
            totalAmount
        };
    }
    /**
     * Crea un evento OrderCompleted
     */
    static createOrderCompletedEvent(orderId, totalAmount, paymentMethod) {
        return {
            eventId: this.generateEventId(),
            occurredOn: new Date(),
            eventVersion: 1,
            aggregateId: orderId,
            eventType: 'OrderCompleted',
            orderId,
            totalAmount,
            completedAt: new Date(),
            paymentMethod
        };
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
exports.DomainEventFactory = DomainEventFactory;
