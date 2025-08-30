import { Order } from '../Entities/Order.js';
import { OrderId } from '../ValueObjects/OrderId.js';

/**
 * Puerto del dominio para el repositorio de órdenes
 * Define el contrato que debe implementar la infraestructura
 */
export interface OrderRepositoryPort {
  /**
   * Obtiene la orden actual en progreso
   * @returns Promise<Order | null> La orden actual o null si no existe
   */
  getCurrentOrder(): Promise<Order | null>;

  /**
   * Crea una nueva orden
   * @param customerId ID del cliente (opcional)
   * @returns Promise<Order> Nueva orden creada
   */
  createOrder(customerId?: string): Promise<Order>;

  /**
   * Guarda una orden
   * @param order Orden a guardar
   * @returns Promise<Order> Orden guardada
   */
  save(order: Order): Promise<Order>;

  /**
   * Busca una orden por ID
   * @param orderId ID de la orden
   * @returns Promise<Order | null> Orden encontrada o null
   */
  findById(orderId: OrderId): Promise<Order | null>;

  /**
   * Obtiene todas las órdenes
   * @returns Promise<Order[]> Lista de órdenes
   */
  findAll(): Promise<Order[]>;

  /**
   * Elimina una orden
   * @param orderId ID de la orden a eliminar
   * @returns Promise<boolean> True si se eliminó correctamente
   */
  delete(orderId: OrderId): Promise<boolean>;

  /**
   * Finaliza una orden (cambia estado a completada)
   * @param orderId ID de la orden
   * @returns Promise<Order> Orden finalizada
   */
  completeOrder(orderId: OrderId): Promise<Order>;

  /**
   * Cancela una orden
   * @param orderId ID de la orden
   * @returns Promise<Order> Orden cancelada
   */
  cancelOrder(orderId: OrderId): Promise<Order>;

  /**
   * Limpia la orden actual (la marca como no actual)
   * @returns Promise<void>
   */
  clearCurrentOrder(): Promise<void>;
}