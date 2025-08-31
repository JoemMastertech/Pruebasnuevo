import { OrderItem } from '../../Domain/Entities/OrderItem.js';
import { OrderRepositoryPort } from '../../Domain/Ports/OrderRepositoryPort.js';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort.js';
import { DrinkRulesPort, ValidationResult, DrinkSelection } from '../../Domain/Ports/DrinkRulesPort.js';
import { EventBusPort } from '../../Domain/Ports/EventBusPort.js';
/**
 * Datos para agregar un producto a la orden
 */
export interface AddProductData {
    productName: string;
    quantity: number;
    selectedDrinks?: DrinkSelection[];
    cookingTerm?: string;
    specialRequests?: string[];
}
/**
 * Resultado de agregar un producto
 */
export interface AddProductResult {
    success: boolean;
    orderItem?: OrderItem;
    errorMessage?: string;
}
/**
 * Caso de uso para agregar productos a una orden existente
 * Se enfoca específicamente en la lógica de agregar productos
 */
export declare class AddProductToOrderUseCase {
    private readonly orderRepository;
    private readonly productRepository;
    private readonly drinkRules;
    private readonly eventBus;
    constructor(orderRepository: OrderRepositoryPort, productRepository: ProductRepositoryPort, drinkRules: DrinkRulesPort, eventBus: EventBusPort);
    /**
     * Agrega un producto a la orden actual
     */
    execute(productData: AddProductData): Promise<AddProductResult>;
    /**
     * Valida los datos del producto
     */
    private validateProductData;
    /**
     * Crea las personalizaciones basadas en los datos del producto
     */
    private createCustomizations;
    /**
     * Verifica si dos arrays de personalizaciones son equivalentes
     */
    private customizationsMatch;
    /**
     * Verifica si un producto puede ser agregado a la orden actual
     */
    canAddProduct(productName: string, quantity?: number): Promise<ValidationResult>;
}
//# sourceMappingURL=AddProductToOrderUseCase.d.ts.map