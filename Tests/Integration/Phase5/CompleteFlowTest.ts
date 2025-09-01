/**
 * FASE 5: Testing + Validación
 * Test de flujo completo end-to-end con arquitectura hexagonal
 * 
 * Este test valida el flujo completo de creación de órdenes
 * utilizando la arquitectura hexagonal implementada.
 */

/// <reference path="../../types/jest.d.ts" />

import { HexagonalContainer } from '../../../Infraestructura/DI/HexagonalContainer.js';
import { OrderController } from '../../../Interfaces/web/controllers/OrderController.js';
import { ProductController } from '../../../Interfaces/web/controllers/ProductController.js';
import { OrderPresenter } from '../../../Interfaces/web/presenters/OrderPresenter.js';

describe('Complete Order Flow - Hexagonal Architecture', () => {
  let container: HexagonalContainer;
  let orderController: any;
  let productController: any;
  let orderPresenter: any;
  
  beforeEach(async () => {
    // Inicializar contenedor hexagonal
    await HexagonalContainer.initialize();
    container = HexagonalContainer.getInstance();
    
    // Resolver dependencias
    orderController = container.resolve('OrderController');
    productController = container.resolve('ProductController');
    orderPresenter = container.resolve('OrderPresenter');
    
    // Setup DOM para tests
    document.body.innerHTML = `
      <div id="order-system" class="order-system">
        <div id="product-grid" class="product-grid"></div>
        <div id="order-summary" class="order-summary"></div>
        <div id="order-actions" class="order-actions">
          <button id="complete-order" class="btn btn--primary">Completar Orden</button>
        </div>
      </div>
    `;
  });
  
  afterEach(() => {
    // Cleanup
    document.body.innerHTML = '';
    // Cleanup handled by singleton pattern
  });
  
  test('End-to-end order creation and completion', async () => {
    // 1. Crear nueva orden
    const createResult = await orderController.createOrder();
    expect(createResult.success).toBe(true);
    expect(createResult.orderId).toBeDefined();
    
    // Verificar que el presenter actualizó la UI
    const orderElement = document.querySelector('#order-summary');
    expect(orderElement?.textContent).toContain('Nueva Orden');
    
    // 2. Agregar producto con opciones
    const addResult = await orderController.addProduct('cerveza-corona', {
      drinkOptions: ['Coca'],
      quantity: 2,
      notes: 'Sin hielo'
    });
    expect(addResult.success).toBe(true);
    expect(addResult.item).toBeDefined();
    
    // Verificar actualización de UI
    expect(orderElement?.textContent).toContain('cerveza-corona');
    expect(orderElement?.textContent).toContain('Coca');
    
    // 3. Validar reglas de negocio
    const validation = await orderController.validateOrder();
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
    
    // 4. Calcular total
    const total = await orderController.calculateTotal();
    expect(total.amount).toBeGreaterThan(0);
    expect(total.currency).toBe('MXN');
    
    // 5. Completar orden
    const completeResult = await orderController.completeOrder();
    expect(completeResult.success).toBe(true);
    expect(completeResult.orderNumber).toBeDefined();
    
    // Verificar estado final en UI
    expect(orderElement?.textContent).toContain('Completada');
  });
  
  test('Product grid interaction with hexagonal architecture', async () => {
    // Cargar productos
    const products = await productController.loadProducts();
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
    
    // Verificar rendering en grid
    const gridElement = document.querySelector('#product-grid');
    expect(gridElement?.children.length).toBeGreaterThan(0);
    
    // Simular click en producto
    const firstProduct = gridElement?.querySelector('.product-card');
    expect(firstProduct).toBeDefined();
    
    // Trigger event delegation
    const clickEvent = new MouseEvent('click', { bubbles: true });
    firstProduct?.dispatchEvent(clickEvent);
    
    // Verificar que se agregó al order
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for async
    const orderSummary = document.querySelector('#order-summary');
    expect(orderSummary?.children.length).toBeGreaterThan(0);
  });
  
  test('Error handling in complete flow', async () => {
    // Intentar completar orden vacía
    const emptyOrderResult = await orderController.completeOrder();
    expect(emptyOrderResult.success).toBe(false);
    expect(emptyOrderResult.error).toContain('vacía');
    
    // Verificar que el presenter muestra el error
    const errorElement = document.querySelector('.error-message');
    expect(errorElement).toBeDefined();
    expect(errorElement?.textContent).toContain('vacía');
  });
  
  test('Performance metrics collection', async () => {
    const startTime = performance.now();
    
    // Flujo completo con medición
    await orderController.createOrder();
    await orderController.addProduct('cerveza-corona', { drinkOptions: ['Coca'] });
    await orderController.addProduct('tacos-pastor', { quantity: 3 });
    await orderController.calculateTotal();
    await orderController.completeOrder();
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Verificar que el flujo completo es rápido
    expect(duration).toBeLessThan(1000); // Menos de 1 segundo
    
    // Verificar que se recolectaron métricas
    const metrics = (window as any).performanceMetrics;
    expect(metrics).toBeDefined();
    expect(metrics.orderCreationTime).toBeDefined();
  });
  
  test('Memory management and cleanup', async () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Crear múltiples órdenes para test de memoria
    for (let i = 0; i < 10; i++) {
      await orderController.createOrder();
      await orderController.addProduct('cerveza-corona', { quantity: 1 });
      await orderController.completeOrder();
    }
    
    // Forzar garbage collection si está disponible
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Verificar que no hay memory leaks significativos
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // Menos de 5MB
    }
  });
  
  test('CSS BEM components integration', async () => {
    // Verificar que los estilos BEM se aplican correctamente
    const orderSystem = document.querySelector('.order-system');
    expect(orderSystem).toBeDefined();
    
    // Crear orden y verificar clases BEM
    await orderController.createOrder();
    await orderController.addProduct('cerveza-corona', { drinkOptions: ['Coca'] });
    
    // Verificar estructura BEM
    const orderItems = document.querySelectorAll('.order-system__item');
    expect(orderItems.length).toBeGreaterThan(0);
    
    const orderItemName = document.querySelector('.order-system__item-name');
    expect(orderItemName).toBeDefined();
    
    const orderItemOptions = document.querySelector('.order-system__item-options');
    expect(orderItemOptions).toBeDefined();
  });
});

// Helper para setup de tests
export class TestSetupHelper {
  static async initializeTestEnvironment(): Promise<HexagonalContainer> {
    await HexagonalContainer.initialize();
    const container = HexagonalContainer.getInstance();
    return container;
  }
  
  static createMockDOM(): void {
    document.body.innerHTML = `
      <div id="app" class="app">
        <div id="order-system" class="order-system">
          <div id="product-grid" class="product-grid"></div>
          <div id="order-summary" class="order-summary"></div>
          <div id="order-actions" class="order-actions"></div>
        </div>
      </div>
    `;
  }
  
  static cleanup(): void {
    document.body.innerHTML = '';
  }
}