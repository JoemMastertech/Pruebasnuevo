/**
 * Puerto para el sistema de eventos del dominio
 * Define el contrato para publicar y suscribirse a eventos de dominio
 */
export interface DomainEvent {
    eventId: string;
    occurredOn: Date;
    eventVersion: number;
    aggregateId: string;
    eventType: string;
}
/**
 * Manejador de eventos de dominio
 */
export interface EventHandler<T extends DomainEvent> {
    handle(event: T): Promise<void> | void;
}
/**
 * Resultado de la publicación de eventos
 */
export interface PublishResult {
    success: boolean;
    eventId: string;
    errorMessage?: string;
}
/**
 * Resultado de la suscripción a eventos
 */
export interface SubscriptionResult {
    success: boolean;
    subscriptionId: string;
    errorMessage?: string;
}
/**
 * Puerto para el bus de eventos del dominio
 * Permite la comunicación asíncrona entre diferentes partes del sistema
 */
export interface EventBusPort {
    /**
     * Publica un evento de dominio
     * @param event El evento a publicar
     * @returns Resultado de la publicación
     */
    publish<T extends DomainEvent>(event: T): Promise<PublishResult>;
    /**
     * Publica múltiples eventos de dominio
     * @param events Los eventos a publicar
     * @returns Resultados de las publicaciones
     */
    publishMany<T extends DomainEvent>(events: T[]): Promise<PublishResult[]>;
    /**
     * Se suscribe a un tipo específico de evento
     * @param eventType El tipo de evento al que suscribirse
     * @param handler El manejador del evento
     * @returns Resultado de la suscripción
     */
    subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): Promise<SubscriptionResult>;
    /**
     * Se desuscribe de un tipo de evento
     * @param eventType El tipo de evento
     * @param subscriptionId El ID de la suscripción
     * @returns True si se desuscribió exitosamente
     */
    unsubscribe(eventType: string, subscriptionId: string): Promise<boolean>;
    /**
     * Obtiene todos los eventos publicados (útil para debugging)
     * @param eventType Filtrar por tipo de evento (opcional)
     * @returns Lista de eventos
     */
    getEventHistory(eventType?: string): Promise<DomainEvent[]>;
    /**
     * Limpia el historial de eventos
     * @param eventType Tipo específico a limpiar (opcional, si no se especifica limpia todo)
     */
    clearEventHistory(eventType?: string): Promise<void>;
    /**
     * Verifica si hay suscriptores para un tipo de evento
     * @param eventType El tipo de evento
     * @returns True si hay suscriptores
     */
    hasSubscribers(eventType: string): boolean;
    /**
     * Obtiene el número de suscriptores para un tipo de evento
     * @param eventType El tipo de evento
     * @returns Número de suscriptores
     */
    getSubscriberCount(eventType: string): number;
    /**
     * Obtiene estadísticas del bus de eventos
     * @returns Estadísticas del sistema de eventos
     */
    getStats(): Promise<EventBusStats>;
}
/**
 * Estadísticas del bus de eventos
 */
export interface EventBusStats {
    totalEventsPublished: number;
    totalSubscriptions: number;
    eventTypeStats: Record<string, {
        published: number;
        subscribers: number;
        lastPublished?: Date;
    }>;
    uptime: number;
}
/**
 * Eventos específicos del dominio de órdenes
 */
export interface OrderCreatedEvent extends DomainEvent {
    eventType: 'OrderCreated';
    orderId: string;
    customerId?: string;
    createdAt: Date;
}
export interface ProductAddedToOrderEvent extends DomainEvent {
    eventType: 'ProductAddedToOrder';
    orderId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}
export interface OrderValidatedEvent extends DomainEvent {
    eventType: 'OrderValidated';
    orderId: string;
    isValid: boolean;
    validationErrors?: string[];
    totalAmount: number;
}
export interface OrderCompletedEvent extends DomainEvent {
    eventType: 'OrderCompleted';
    orderId: string;
    totalAmount: number;
    completedAt: Date;
    paymentMethod?: string;
}
export interface OrderCancelledEvent extends DomainEvent {
    eventType: 'OrderCancelled';
    orderId: string;
    reason: string;
    cancelledAt: Date;
}
/**
 * Factory para crear eventos de dominio
 */
export declare class DomainEventFactory {
    /**
     * Crea un evento OrderCreated
     */
    static createOrderCreatedEvent(orderId: string, customerId?: string): OrderCreatedEvent;
    /**
     * Crea un evento ProductAddedToOrder
     */
    static createProductAddedToOrderEvent(orderId: string, productId: string, productName: string, quantity: number, unitPrice: number): ProductAddedToOrderEvent;
    /**
     * Crea un evento OrderValidated
     */
    static createOrderValidatedEvent(orderId: string, isValid: boolean, totalAmount: number, validationErrors?: string[]): OrderValidatedEvent;
    /**
     * Crea un evento OrderCompleted
     */
    static createOrderCompletedEvent(orderId: string, totalAmount: number, paymentMethod?: string): OrderCompletedEvent;
    /**
     * Crea un evento OrderCancelled
     */
    static createOrderCancelledEvent(orderId: string, reason: string): OrderCancelledEvent;
    /**
     * Genera un ID único para el evento
     */
    private static generateEventId;
}
/**
 * Tipos de eventos disponibles
 */
export type DomainEventType = 'OrderCreated' | 'ProductAddedToOrder' | 'OrderValidated' | 'OrderCompleted' | 'OrderCancelled';
/**
 * Union type de todos los eventos de dominio
 */
export type AllDomainEvents = OrderCreatedEvent | ProductAddedToOrderEvent | OrderValidatedEvent | OrderCompletedEvent | OrderCancelledEvent;
//# sourceMappingURL=EventBusPort.d.ts.map