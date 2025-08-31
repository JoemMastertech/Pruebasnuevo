import { Order } from '../../Domain/Entities/Order.js';
import { OrderId } from '../../Domain/ValueObjects/OrderId.js';
import { OrderRepositoryPort } from '../../Domain/Ports/OrderRepositoryPort.js';
/**
 * Implementación en memoria del repositorio de órdenes
 * Para desarrollo y testing
 */
export declare class InMemoryOrderRepository implements OrderRepositoryPort {
    private orders;
    private currentOrderId;
    /**
     * Obtiene la orden actual en progreso
     */
    getCurrentOrder(): Promise<Order | null>;
    /**
     * Crea una nueva orden
     */
    createOrder(customerId?: string): Promise<Order>;
    /**
     * Guarda una orden
     */
    save(order: Order): Promise<Order>;
    /**
     * Busca una orden por ID
     */
    findById(orderId: OrderId): Promise<Order | null>;
    /**
     * Obtiene todas las órdenes
     */
    findAll(): Promise<Order[]>;
    /**
     * Elimina una orden
     */
    delete(orderId: OrderId): Promise<boolean>;
    /**
     * Finaliza una orden (cambia estado a completada)
     */
    completeOrder(orderId: OrderId): Promise<Order>;
    /**
     * Cancela una orden
     */
    cancelOrder(orderId: OrderId): Promise<Order>;
    /**
     * Limpia la orden actual (la marca como no actual)
     */
    clearCurrentOrder(): Promise<void>;
    /**
     * Métodos adicionales para testing y debugging
     */
    /**
     * Limpia todas las órdenes (útil para testing)
     */
    clear(): Promise<void>;
    /**
     * Obtiene el número total de órdenes
     */
    getOrderCount(): number;
    /**
     * Verifica si hay una orden actual
     */
    hasCurrentOrder(): boolean;
}
//# sourceMappingURL=InMemoryOrderRepository.d.ts.map