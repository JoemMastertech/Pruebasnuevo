import { Order } from '../../Domain/Entities/Order.js';
import { OrderId } from '../../Domain/ValueObjects/OrderId.js';
import { OrderRepositoryPort } from '../../Domain/Ports/OrderRepositoryPort.js';

/**
 * Implementación en memoria del repositorio de órdenes
 * Para desarrollo y testing
 */
export class InMemoryOrderRepository implements OrderRepositoryPort {
  private orders: Map<string, Order> = new Map();
  private currentOrderId: string | null = null;

  /**
   * Obtiene la orden actual en progreso
   */
  async getCurrentOrder(): Promise<Order | null> {
    if (!this.currentOrderId) {
      return null;
    }
    return this.orders.get(this.currentOrderId) || null;
  }

  /**
   * Crea una nueva orden
   */
  async createOrder(customerId?: string): Promise<Order> {
    const order = Order.create(customerId);
    this.orders.set(order.id.value, order);
    this.currentOrderId = order.id.value;
    return order;
  }

  /**
   * Guarda una orden
   */
  async save(order: Order): Promise<Order> {
    this.orders.set(order.id.value, order);
    return order;
  }

  /**
   * Busca una orden por ID
   */
  async findById(orderId: OrderId): Promise<Order | null> {
    return this.orders.get(orderId.value) || null;
  }

  /**
   * Obtiene todas las órdenes
   */
  async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  /**
   * Elimina una orden
   */
  async delete(orderId: OrderId): Promise<boolean> {
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
  async completeOrder(orderId: OrderId): Promise<Order> {
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
  async cancelOrder(orderId: OrderId): Promise<Order> {
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
  async clearCurrentOrder(): Promise<void> {
    this.currentOrderId = null;
  }

  /**
   * Métodos adicionales para testing y debugging
   */
  
  /**
   * Limpia todas las órdenes (útil para testing)
   */
  async clear(): Promise<void> {
    this.orders.clear();
    this.currentOrderId = null;
  }

  /**
   * Obtiene el número total de órdenes
   */
  getOrderCount(): number {
    return this.orders.size;
  }

  /**
   * Verifica si hay una orden actual
   */
  hasCurrentOrder(): boolean {
    return this.currentOrderId !== null;
  }
}