/**
 * OrderController - Controlador de órdenes siguiendo arquitectura hexagonal
 * Fase 4: UI + CSS Final
 *
 * Responsabilidades:
 * - Coordinar casos de uso de órdenes
 * - Manejar entrada del usuario
 * - Delegar presentación al presenter
 */
import { CreateOrderUseCase } from '../../../Aplicacion/UseCases/CreateOrderUseCase';
import { AddProductToOrderUseCase } from '../../../Aplicacion/UseCases/AddProductToOrderUseCase';
import { ValidateOrderUseCase } from '../../../Aplicacion/UseCases/ValidateOrderUseCase';
import { OrderPresenter } from '../presenters/OrderPresenter';
export interface AddProductCommand {
    productId: string;
    drinkOptions?: string[];
    quantity?: number;
}
export interface OrderControllerResult {
    success: boolean;
    data?: any;
    error?: string;
}
export declare class OrderController {
    private createOrderUseCase;
    private addProductUseCase;
    private validateOrderUseCase;
    private presenter;
    constructor(createOrderUseCase: CreateOrderUseCase, addProductUseCase: AddProductToOrderUseCase, validateOrderUseCase: ValidateOrderUseCase, presenter: OrderPresenter);
    /**
     * Crear nueva orden
     */
    createOrder(): Promise<OrderControllerResult>;
    /**
     * Agregar producto a orden activa
     */
    addProduct(command: AddProductCommand): Promise<OrderControllerResult>;
    /**
     * Validar orden actual
     */
    validateOrder(): Promise<OrderControllerResult>;
    /**
     * Completar orden actual
     */
    completeOrder(): Promise<OrderControllerResult>;
    /**
     * Obtener estado actual de la orden
     */
    getCurrentOrderStatus(): Promise<OrderControllerResult>;
}
//# sourceMappingURL=OrderController.d.ts.map