/**
 * OrderController - Controlador de órdenes siguiendo arquitectura hexagonal
 * Fase 4: UI + CSS Final
 *
 * Responsabilidades:
 * - Coordinar casos de uso de órdenes
 * - Manejar entrada del usuario
 * - Delegar presentación al presenter
 */
import { ProductId } from '../../../Domain/ValueObjects/ProductId';
export class OrderController {
    constructor(createOrderUseCase, addProductUseCase, validateOrderUseCase, presenter) {
        this.createOrderUseCase = createOrderUseCase;
        this.addProductUseCase = addProductUseCase;
        this.validateOrderUseCase = validateOrderUseCase;
        this.presenter = presenter;
    }
    /**
     * Crear nueva orden
     */
    async createOrder() {
        try {
            console.log('[OrderController] Iniciando creación de orden');
            const result = await this.createOrderUseCase.execute();
            if (result.isSuccess()) {
                const orderId = result.getValue();
                console.log('[OrderController] Orden creada exitosamente:', orderId.getValue());
                // Delegar presentación al presenter
                this.presenter.presentOrderCreated(orderId);
                return {
                    success: true,
                    data: { orderId: orderId.getValue() }
                };
            }
            else {
                const error = result.getError();
                console.error('[OrderController] Error creando orden:', error);
                this.presenter.presentError(error);
                return {
                    success: false,
                    error: error
                };
            }
        }
        catch (error) {
            console.error('[OrderController] Excepción no controlada:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.presenter.presentError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    /**
     * Agregar producto a orden activa
     */
    async addProduct(command) {
        try {
            console.log('[OrderController] Agregando producto:', command);
            const productId = new ProductId(command.productId);
            const result = await this.addProductUseCase.execute({
                productId,
                drinkOptions: command.drinkOptions || [],
                quantity: command.quantity || 1
            });
            if (result.isSuccess()) {
                const orderItem = result.getValue();
                console.log('[OrderController] Producto agregado exitosamente:', orderItem.getId().getValue());
                this.presenter.presentProductAdded(orderItem);
                return {
                    success: true,
                    data: {
                        orderItemId: orderItem.getId().getValue(),
                        productId: orderItem.getProductId().getValue()
                    }
                };
            }
            else {
                const error = result.getError();
                console.error('[OrderController] Error agregando producto:', error);
                this.presenter.presentError(error);
                return {
                    success: false,
                    error: error
                };
            }
        }
        catch (error) {
            console.error('[OrderController] Excepción agregando producto:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.presenter.presentError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    /**
     * Validar orden actual
     */
    async validateOrder() {
        try {
            console.log('[OrderController] Validando orden actual');
            const result = await this.validateOrderUseCase.execute();
            if (result.isValid) {
                console.log('[OrderController] Orden válida');
                this.presenter.presentOrderValid(result);
                return {
                    success: true,
                    data: {
                        isValid: true,
                        validationDetails: result
                    }
                };
            }
            else {
                console.log('[OrderController] Orden inválida:', result.errors);
                this.presenter.presentOrderInvalid(result);
                return {
                    success: false,
                    error: 'Orden no válida',
                    data: {
                        isValid: false,
                        errors: result.errors
                    }
                };
            }
        }
        catch (error) {
            console.error('[OrderController] Excepción validando orden:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.presenter.presentError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    /**
     * Completar orden actual
     */
    async completeOrder() {
        try {
            console.log('[OrderController] Completando orden');
            // Primero validar
            const validationResult = await this.validateOrder();
            if (!validationResult.success) {
                return validationResult;
            }
            // TODO: Implementar CompleteOrderUseCase cuando esté disponible
            console.log('[OrderController] Orden completada (simulado)');
            this.presenter.presentOrderCompleted();
            return {
                success: true,
                data: { completed: true }
            };
        }
        catch (error) {
            console.error('[OrderController] Excepción completando orden:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.presenter.presentError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    /**
     * Obtener estado actual de la orden
     */
    async getCurrentOrderStatus() {
        try {
            console.log('[OrderController] Obteniendo estado de orden actual');
            // TODO: Implementar GetCurrentOrderUseCase cuando esté disponible
            const mockOrderStatus = {
                orderId: 'current-order-id',
                items: [],
                total: 0,
                status: 'active'
            };
            this.presenter.presentOrderStatus(mockOrderStatus);
            return {
                success: true,
                data: mockOrderStatus
            };
        }
        catch (error) {
            console.error('[OrderController] Excepción obteniendo estado:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.presenter.presentError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
}
//# sourceMappingURL=OrderController.js.map