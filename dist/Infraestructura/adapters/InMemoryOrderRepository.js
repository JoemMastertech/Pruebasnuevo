import { Order } from '../../Domain/Entities/Order.js';
/**
 * Implementación en memoria del repositorio de órdenes
 * Para desarrollo y testing
 */
export class InMemoryOrderRepository {
    constructor() {
        this.orders = new Map();
        this.currentOrderId = null;
    }
    /**
     * Obtiene la orden actual en progreso
     */
    async getCurrentOrder() {
        if (!this.currentOrderId) {
            return null;
        }
        return this.orders.get(this.currentOrderId) || null;
    }
    /**
     * Crea una nueva orden
     */
    async createOrder(customerId) {
        const order = Order.create(customerId);
        this.orders.set(order.id.value, order);
        this.currentOrderId = order.id.value;
        return order;
    }
    /**
     * Guarda una orden
     */
    async save(order) {
        this.orders.set(order.id.value, order);
        return order;
    }
    /**
     * Busca una orden por ID
     */
    async findById(orderId) {
        return this.orders.get(orderId.value) || null;
    }
    /**
     * Obtiene todas las órdenes
     */
    async findAll() {
        return Array.from(this.orders.values());
    }
    /**
     * Elimina una orden
     */
    async delete(orderId) {
        const existed = this.orders.has(orderId.value);
        if (existed) {
            this.orders.delete(orderId.value);
            // Si era la orden actual, limpiarla
            if (this.currentOrderId === orderId.value) {
                this.currentOrderId = null;
            }
        }
        return existed;
    }
    /**
     * Finaliza una orden (cambia estado a completada)
     */
    async completeOrder(orderId) {
        const order = this.orders.get(orderId.value);
        if (!order) {
            throw new Error(`Orden no encontrada: ${orderId.value}`);
        }
        order.complete();
        this.orders.set(orderId.value, order);
        // Si era la orden actual, limpiarla
        if (this.currentOrderId === orderId.value) {
            this.currentOrderId = null;
        }
        return order;
    }
    /**
     * Cancela una orden
     */
    async cancelOrder(orderId) {
        const order = this.orders.get(orderId.value);
        if (!order) {
            throw new Error(`Orden no encontrada: ${orderId.value}`);
        }
        order.cancel();
        this.orders.set(orderId.value, order);
        // Si era la orden actual, limpiarla
        if (this.currentOrderId === orderId.value) {
            this.currentOrderId = null;
        }
        return order;
    }
    /**
     * Limpia la orden actual (la marca como no actual)
     */
    async clearCurrentOrder() {
        this.currentOrderId = null;
    }
    /**
     * Métodos adicionales para testing y debugging
     */
    /**
     * Limpia todas las órdenes (útil para testing)
     */
    async clear() {
        this.orders.clear();
        this.currentOrderId = null;
    }
    /**
     * Obtiene el número total de órdenes
     */
    getOrderCount() {
        return this.orders.size;
    }
    /**
     * Verifica si hay una orden actual
     */
    hasCurrentOrder() {
        return this.currentOrderId !== null;
    }
}
//# sourceMappingURL=InMemoryOrderRepository.js.map