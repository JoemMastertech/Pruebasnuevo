import { Order } from '../../Domain/Entities/Order.js';
import { OrderItem } from '../../Domain/Entities/OrderItem.js';
import { OrderItemId } from '../../Domain/ValueObjects/OrderItemId.js';
import { OrderRepositoryPort } from '../../Domain/Ports/OrderRepositoryPort.js';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort.js';
import { DrinkRulesPort, DrinkSelection } from '../../Domain/Ports/DrinkRulesPort.js';
import { EventBusPort } from '../../Domain/Ports/EventBusPort.js';
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
export declare class CreateOrderUseCase {
    private readonly orderRepository;
    private readonly productRepository;
    private readonly drinkRules;
    private readonly eventBus;
    constructor(orderRepository: OrderRepositoryPort, productRepository: ProductRepositoryPort, drinkRules: DrinkRulesPort, eventBus: EventBusPort);
    /**
     * Obtiene o crea la orden actual
     */
    getCurrentOrder(): Promise<Order>;
    /**
     * Agrega un producto a la orden actual
     */
    addProductToOrder(productData: ProductSelectionData): Promise<OrderItem>;
    /**
     * Remueve un item de la orden actual
     */
    removeItemFromOrder(itemId: OrderItemId): Promise<boolean>;
    /**
     * Actualiza la cantidad de un item
     */
    updateItemQuantity(itemId: OrderItemId, newQuantity: number): Promise<boolean>;
    /**
     * Completa la orden actual
     */
    completeCurrentOrder(): Promise<Order>;
    /**
     * Cancela la orden actual
     */
    cancelCurrentOrder(): Promise<void>;
    /**
     * Limpia la orden actual
     */
    clearCurrentOrder(): Promise<void>;
    /**
     * Obtiene el resumen de la orden actual
     */
    getOrderSummary(): Promise<{
        order: Order;
        itemCount: number;
        total: number;
        canBeCompleted: boolean;
    }>;
    /**
     * Valida los datos de selección de producto
     */
    private validateProductSelectionData;
    /**
     * Crea las personalizaciones basadas en los datos del producto
     */
    private createCustomizations;
}
//# sourceMappingURL=CreateOrderUseCase.d.ts.map