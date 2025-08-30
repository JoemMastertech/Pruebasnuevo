import { Order } from '../../Domain/Entities/Order.js';
import { OrderItem, Customization } from '../../Domain/Entities/OrderItem.js';
import { Product } from '../../Domain/Entities/Product.js';
import { OrderItemId } from '../../Domain/ValueObjects/OrderItemId.js';
import { OrderRepositoryPort } from '../../Domain/Ports/OrderRepositoryPort.js';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort.js';
import { DrinkRulesPort, ValidationResult, DrinkSelection } from '../../Domain/Ports/DrinkRulesPort.js';

/**
 * Datos de selección de producto del usuario
 */
export interface ProductSelectionData {
  productName: string;
  quantity: number;
  selectedDrinks?: DrinkSelection[];
  cookingTerm?: string;
  specialRequests?: string[];
}

/**
 * Caso de uso para crear y gestionar órdenes
 * Orquesta la lógica de aplicación sin contener lógica de dominio
 */
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepositoryPort,
    private readonly productRepository: ProductRepositoryPort,
    private readonly drinkRules: DrinkRulesPort
  ) {}

  /**
   * Obtiene o crea la orden actual
   */
  async getCurrentOrder(): Promise<Order> {
    let currentOrder = await this.orderRepository.getCurrentOrder();
    
    if (!currentOrder) {
      currentOrder = await this.orderRepository.createOrder();
    }
    
    return currentOrder;
  }

  /**
   * Agrega un producto a la orden actual
   */
  async addProductToOrder(productData: ProductSelectionData): Promise<OrderItem> {
    // 1. Validar datos de entrada
    this.validateProductSelectionData(productData);

    // 2. Buscar el producto
    const product = await this.productRepository.findByName(productData.productName);
    if (!product) {
      throw new Error(`Product not found: ${productData.productName}`);
    }

    // 3. Validar selección de bebidas si es necesario
    if (product.requiresDrinkSelection()) {
      const drinkValidation = this.drinkRules.validateDrinkSelection(
        product,
        productData.selectedDrinks || []
      );
      
      if (!drinkValidation.isValid) {
        throw new Error(`Invalid drink selection: ${drinkValidation.errorMessage}`);
      }
    }

    // 4. Crear personalizaciones
    const customizations = this.createCustomizations(product, productData);

    // 5. Crear item de orden
    const orderItem = new OrderItem(
      OrderItemId.generate(),
      product,
      productData.quantity,
      customizations
    );

    // 6. Obtener orden actual y agregar item
    const order = await this.getCurrentOrder();
    order.addItem(orderItem);

    // 7. Guardar orden
    await this.orderRepository.save(order);

    return orderItem;
  }

  /**
   * Remueve un item de la orden actual
   */
  async removeItemFromOrder(itemId: OrderItemId): Promise<boolean> {
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
  async updateItemQuantity(itemId: OrderItemId, newQuantity: number): Promise<boolean> {
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
  async completeCurrentOrder(): Promise<Order> {
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
  async cancelCurrentOrder(): Promise<void> {
    const order = await this.getCurrentOrder();
    order.cancel();
    await this.orderRepository.save(order);
    await this.orderRepository.clearCurrentOrder();
  }

  /**
   * Limpia la orden actual
   */
  async clearCurrentOrder(): Promise<void> {
    const order = await this.getCurrentOrder();
    order.clear();
    await this.orderRepository.save(order);
  }

  /**
   * Obtiene el resumen de la orden actual
   */
  async getOrderSummary(): Promise<{
    order: Order;
    itemCount: number;
    total: number;
    canBeCompleted: boolean;
  }> {
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
  private validateProductSelectionData(data: ProductSelectionData): void {
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
  private createCustomizations(product: Product, data: ProductSelectionData): Customization[] {
    const customizations: Customization[] = [];

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