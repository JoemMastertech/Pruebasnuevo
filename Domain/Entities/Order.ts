import { OrderId } from '../ValueObjects/OrderId.js';
import { OrderItemId } from '../ValueObjects/OrderItemId.js';
import { OrderItem } from './OrderItem.js';
import { Money } from '../ValueObjects/Money.js';

/**
 * Estados posibles de una orden
 */
export enum OrderStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Entidad Order del dominio - Agregado raíz
 * Encapsula toda la lógica de negocio relacionada con órdenes
 */
export class Order {
  private items: OrderItem[] = [];
  private _total: Money = Money.zero();
  private _status: OrderStatus = OrderStatus.DRAFT;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    public readonly id: OrderId,
    public readonly customerId?: string
  ) {
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * Método estático para crear una nueva orden
   */
  static create(customerId?: string): Order {
    const orderId = OrderId.generate();
    return new Order(orderId, customerId);
  }

  /**
   * Agrega un item a la orden
   */
  addItem(item: OrderItem): void {
    if (this._status !== OrderStatus.DRAFT) {
      throw new Error('Cannot add items to a non-draft order');
    }

    // Verificar si ya existe un item similar (mismo producto y personalizaciones)
    const existingItemIndex = this.findSimilarItemIndex(item);
    
    if (existingItemIndex >= 0) {
      // Si existe, incrementar la cantidad
      const existingItem = this.items[existingItemIndex];
      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;
        this.items[existingItemIndex] = existingItem.withQuantity(newQuantity);
      }
    } else {
      // Si no existe, agregar como nuevo item
      this.items.push(item);
    }

    this.calculateTotal();
    this._updatedAt = new Date();
  }

  /**
   * Remueve un item de la orden
   */
  removeItem(itemId: OrderItemId): boolean {
    if (this._status !== OrderStatus.DRAFT) {
      throw new Error('Cannot remove items from a non-draft order');
    }

    const initialLength = this.items.length;
    this.items = this.items.filter(item => !item.id.equals(itemId));
    
    if (this.items.length < initialLength) {
      this.calculateTotal();
      this._updatedAt = new Date();
      return true;
    }
    return false;
  }

  /**
   * Actualiza la cantidad de un item específico
   */
  updateItemQuantity(itemId: OrderItemId, newQuantity: number): boolean {
    if (this._status !== OrderStatus.DRAFT) {
      throw new Error('Cannot update items in a non-draft order');
    }

    if (newQuantity <= 0) {
      return this.removeItem(itemId);
    }

    const itemIndex = this.items.findIndex(item => item.id.equals(itemId));
    if (itemIndex >= 0) {
      const existingItem = this.items[itemIndex];
      if (existingItem) {
        this.items[itemIndex] = existingItem.withQuantity(newQuantity);
        this.calculateTotal();
        this._updatedAt = new Date();
        return true;
      }
    }
    return false;
  }

  /**
   * Obtiene todos los items de la orden
   */
  getItems(): OrderItem[] {
    return [...this.items];
  }

  /**
   * Busca un item por ID
   */
  findItemById(itemId: OrderItemId): OrderItem | null {
    return this.items.find(item => item.id.equals(itemId)) || null;
  }

  /**
   * Obtiene el total de la orden
   */
  getTotal(): Money {
    return this._total;
  }

  /**
   * Obtiene el estado de la orden
   */
  getStatus(): OrderStatus {
    return this._status;
  }

  /**
   * Obtiene la cantidad total de items
   */
  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Verifica si la orden está vacía
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Verifica si la orden puede ser completada
   */
  canBeCompleted(): boolean {
    return this._status === OrderStatus.DRAFT && !this.isEmpty();
  }

  /**
   * Completa la orden
   */
  complete(): void {
    if (!this.canBeCompleted()) {
      throw new Error('Order cannot be completed: must be in draft status and contain items');
    }
    
    this._status = OrderStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  /**
   * Cancela la orden
   */
  cancel(): void {
    if (this._status === OrderStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed order');
    }
    
    this._status = OrderStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  /**
   * Limpia todos los items de la orden
   */
  clear(): void {
    if (this._status !== OrderStatus.DRAFT) {
      throw new Error('Cannot clear a non-draft order');
    }
    
    this.items = [];
    this.calculateTotal();
    this._updatedAt = new Date();
  }

  /**
   * Obtiene la fecha de creación
   */
  getCreatedAt(): Date {
    return new Date(this._createdAt);
  }

  /**
   * Obtiene la fecha de última actualización
   */
  getUpdatedAt(): Date {
    return new Date(this._updatedAt);
  }

  /**
   * Busca un item similar (mismo producto y personalizaciones)
   */
  private findSimilarItemIndex(newItem: OrderItem): number {
    return this.items.findIndex(existingItem => 
      existingItem.product.equals(newItem.product) &&
      this.areCustomizationsEqual(existingItem.customizations, newItem.customizations)
    );
  }

  /**
   * Compara si dos arrays de personalizaciones son iguales
   */
  private areCustomizationsEqual(customizations1: any[], customizations2: any[]): boolean {
    if (customizations1.length !== customizations2.length) {
      return false;
    }

    const sorted1 = [...customizations1].sort((a, b) => `${a.type}-${a.name}`.localeCompare(`${b.type}-${b.name}`));
    const sorted2 = [...customizations2].sort((a, b) => `${a.type}-${a.name}`.localeCompare(`${b.type}-${b.name}`));

    return sorted1.every((c1, index) => {
      const c2 = sorted2[index];
      return c1.type === c2.type && c1.name === c2.name && c1.value === c2.value;
    });
  }

  /**
   * Recalcula el total de la orden
   */
  private calculateTotal(): void {
    this._total = this.items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      Money.zero()
    );
  }

  /**
   * Compara órdenes por igualdad
   */
  equals(other: Order): boolean {
    return this.id.equals(other.id);
  }

  /**
   * Representación en string de la orden
   */
  toString(): string {
    const itemsStr = this.items.map(item => `  ${item.toString()}`).join('\n');
    return `Order ${this.id.value} (${this._status}):\n${itemsStr}\nTotal: ${this._total.toString()}`;
  }
}