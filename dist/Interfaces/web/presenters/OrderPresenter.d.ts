/**
 * OrderPresenter - Presenter para órdenes siguiendo arquitectura hexagonal
 * Fase 4: UI + CSS Final
 *
 * Responsabilidades:
 * - Formatear datos para la vista
 * - Manejar actualizaciones del DOM
 * - Aplicar estilos BEM
 */
import { OrderId } from '../../../Domain/ValueObjects/OrderId';
import { OrderItem } from '../../../Domain/Entities/OrderItem';
export interface OrderValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}
export interface OrderStatus {
    orderId: string;
    items: any[];
    total: number;
    status: string;
}
export declare class OrderPresenter {
    private orderContainer;
    private statusContainer;
    private errorContainer;
    private currentOrder;
    constructor();
    /**
     * Inicializar contenedores del DOM
     */
    private initializeContainers;
    /**
     * Crear contenedor principal de órdenes
     */
    private createOrderContainer;
    /**
     * Crear contenedor de estado
     */
    private createStatusContainer;
    /**
     * Crear contenedor de errores
     */
    private createErrorContainer;
    /**
     * Obtener orden actual
     */
    getCurrentOrder(): any;
    /**
     * Presentar orden creada
     */
    presentOrderCreated(orderId: OrderId): void;
    /**
     * Presentar producto agregado
     */
    presentProductAdded(orderItem: OrderItem): void;
    /**
     * Actualizar lista de items en el DOM
     */
    private updateOrderItemsList;
    /**
     * Presentar orden válida
     */
    presentOrderValid(validationResult: OrderValidationResult): void;
    /**
     * Presentar orden inválida
     */
    presentOrderInvalid(validationResult: OrderValidationResult): void;
    /**
     * Presentar orden completada
     */
    presentOrderCompleted(): void;
    /**
     * Presentar estado de orden
     */
    presentOrderStatus(orderStatus: OrderStatus): void;
    /**
     * Presentar error
     */
    presentError(error: string): void;
    /**
     * Limpiar errores
     */
    private clearErrors;
    /**
     * Habilitar botón de completar
     */
    private enableCompleteButton;
    /**
     * Deshabilitar botón de completar
     */
    private disableCompleteButton;
    /**
     * Limpiar orden actual
     */
    private clearCurrentOrder;
}
//# sourceMappingURL=OrderPresenter.d.ts.map