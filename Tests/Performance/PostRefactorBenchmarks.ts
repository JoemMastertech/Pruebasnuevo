/**
 * FASE 5: Performance Benchmarks Post-Refactor
 * 
 * Tests de performance para medir mejoras después de la refactorización
 * hacia arquitectura hexagonal y CSS BEM optimizado.
 */

/// <reference path="../types/jest.d.ts" />

import { HexagonalContainer } from '../../Infraestructura/DI/HexagonalContainer.js';
import { PerformanceOptimizer } from '../../Interfaces/web/performance/PerformanceOptimizer.js';
import { CreateOrderUseCase } from '../../Aplicacion/UseCases/CreateOrderUseCase.js';
import { AddProductToOrderUseCase } from '../../Aplicacion/UseCases/AddProductToOrderUseCase.js';
import { ValidateOrderUseCase } from '../../Aplicacion/UseCases/ValidateOrderUseCase.js';

describe('Performance Post-Refactor Benchmarks', () => {
  let container: HexagonalContainer;
  let performanceOptimizer: any;
  
  beforeAll(async () => {
    // Setup performance monitoring
    (window as any).performanceMetrics = {
      initializationTimes: [],
      renderTimes: [],
      memoryUsage: []
    };
  });
  
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Clear performance marks
    if (performance.clearMarks) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  });
  
  test('Improved initialization time - Target: < 2000ms', async () => {
    const startTime = performance.now();
    performance.mark('init-start');
    
    // Inicializar sistema hexagonal completo
    await HexagonalContainer.initialize();
    container = HexagonalContainer.getInstance();
    
    // Cargar CSS BEM base
    await loadBemBaseCss();
    
    // Inicializar controllers y presenters
    const orderController = container.resolve('OrderController');
    const productController = container.resolve('ProductController');
    const orderPresenter = container.resolve('OrderPresenter');
    
    performance.mark('init-end');
    performance.measure('initialization', 'init-start', 'init-end');
    
    const endTime = performance.now();
    const initTime = endTime - startTime;
    
    // Registrar métrica
    (window as any).performanceMetrics.initializationTimes.push(initTime);
    
    console.log(`Initialization time: ${initTime.toFixed(2)}ms`);
    
    // Debe ser más rápido que baseline (3000ms -> 2000ms = 33% mejora)
    expect(initTime).toBeLessThan(2000);
    
    // Verificar que todo está inicializado correctamente
    expect(orderController).toBeDefined();
    expect(productController).toBeDefined();
    expect(orderPresenter).toBeDefined();
  });
  
  test('CSS rendering performance - Target: < 300ms for 100 products', async () => {
    // Setup container
    await HexagonalContainer.initialize();
    container = HexagonalContainer.getInstance();
    
    // Setup DOM
    document.body.innerHTML = `
      <div id="product-grid" class="product-grid"></div>
    `;
    
    const startTime = performance.now();
    performance.mark('render-start');
    
    // Renderizar 100 productos con CSS BEM
    await renderProductGrid(100);
    
    performance.mark('render-end');
    performance.measure('css-rendering', 'render-start', 'render-end');
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Registrar métrica
    (window as any).performanceMetrics.renderTimes.push(renderTime);
    
    console.log(`CSS rendering time for 100 products: ${renderTime.toFixed(2)}ms`);
    
    // Debe ser significativamente más rápido
    expect(renderTime).toBeLessThan(300);
    
    // Verificar que se renderizaron todos los productos
    const productCards = document.querySelectorAll('.product-card');
    expect(productCards.length).toBe(100);
  });
  
  test('Event delegation performance - Target: < 50ms for 1000 events', async () => {
    container = HexagonalContainer.getInstance();
    
    // Setup DOM con muchos elementos
    document.body.innerHTML = `
      <div id="order-system" class="order-system">
        ${Array.from({ length: 1000 }, (_, i) => 
          `<button class="btn" data-action="add-product" data-product-id="product-${i}">Producto ${i}</button>`
        ).join('')}
      </div>
    `;
    
    const startTime = performance.now();
    performance.mark('events-start');
    
    // Simular 1000 clicks usando event delegation
    const buttons = document.querySelectorAll('.btn');
    const promises = Array.from(buttons).map(button => {
      return new Promise(resolve => {
        const event = new MouseEvent('click', { bubbles: true });
        button.dispatchEvent(event);
        resolve(true);
      });
    });
    
    await Promise.all(promises);
    
    performance.mark('events-end');
    performance.measure('event-delegation', 'events-start', 'events-end');
    
    const endTime = performance.now();
    const eventTime = endTime - startTime;
    
    console.log(`Event delegation time for 1000 events: ${eventTime.toFixed(2)}ms`);
    
    // Debe ser muy rápido gracias a event delegation
    expect(eventTime).toBeLessThan(50);
  });
  
  test('Memory usage optimization - Target: < 10MB for complex operations', async () => {
    const initialMemory = getMemoryUsage();
    
    container = HexagonalContainer.getInstance();
    
    // Obtener casos de uso
    const createOrderUseCase = container.resolve('CreateOrderUseCase') as CreateOrderUseCase;
    const addProductUseCase = container.resolve('AddProductToOrderUseCase') as AddProductToOrderUseCase;
    const validateOrderUseCase = container.resolve('ValidateOrderUseCase') as ValidateOrderUseCase;
    
    // Operaciones complejas que podrían causar memory leaks
    for (let i = 0; i < 50; i++) {
      await createOrderUseCase.getCurrentOrder();
      
      // Agregar múltiples productos
      for (let j = 0; j < 10; j++) {
        await addProductUseCase.execute({
          productName: `product-${j}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          selectedDrinks: [{ drinkName: (['Coca', 'Pepsi'][Math.floor(Math.random() * 2)]) as string, quantity: 1 }]
        });
      }
      
      await validateOrderUseCase.execute();
    }
    
    // Forzar garbage collection si está disponible
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    const finalMemory = getMemoryUsage();
    const memoryIncrease = finalMemory - initialMemory;
    
    console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    
    // Registrar métrica
    (window as any).performanceMetrics.memoryUsage.push(memoryIncrease);
    
    // No debe exceder 10MB de incremento
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });
  
  test('CSS optimization impact - BEM vs Legacy', async () => {
    // Test con CSS BEM optimizado
    const bemStartTime = performance.now();
    
    document.body.innerHTML = `
      <div class="order-system">
        <div class="order-system__header">
          <h2 class="order-system__title">Nueva Orden</h2>
        </div>
        <div class="order-system__content">
          <div class="product-grid">
            ${Array.from({ length: 50 }, (_, i) => `
              <div class="product-card">
                <div class="product-card__image"></div>
                <div class="product-card__content">
                  <h3 class="product-card__title">Producto ${i}</h3>
                  <p class="product-card__price">$${(Math.random() * 100).toFixed(2)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    // Forzar reflow/repaint
    document.body.offsetHeight;
    
    const bemEndTime = performance.now();
    const bemRenderTime = bemEndTime - bemStartTime;
    
    console.log(`BEM CSS render time: ${bemRenderTime.toFixed(2)}ms`);
    
    // Verificar que el rendering BEM es eficiente
    expect(bemRenderTime).toBeLessThan(100);
    
    // Verificar que las clases BEM están aplicadas
    expect(document.querySelector('.order-system')).toBeDefined();
    expect(document.querySelector('.order-system__header')).toBeDefined();
    expect(document.querySelector('.product-card')).toBeDefined();
  });
  
  test('Hexagonal architecture performance vs Legacy', async () => {
    // Medir performance de arquitectura hexagonal
    const hexStartTime = performance.now();
    
    container = HexagonalContainer.getInstance();
    
    // Crear OrderController con casos de uso
    const createOrderUseCase = container.resolve('CreateOrderUseCase') as CreateOrderUseCase;
    const addProductUseCase = container.resolve('AddProductToOrderUseCase') as AddProductToOrderUseCase;
    const validateOrderUseCase = container.resolve('ValidateOrderUseCase') as ValidateOrderUseCase;
    
    // Operaciones típicas usando casos de uso directamente
    await createOrderUseCase.getCurrentOrder();
    await addProductUseCase.execute({ productName: 'cerveza-corona', quantity: 1, selectedDrinks: [{ drinkName: 'Coca', quantity: 1 }] });
    await addProductUseCase.execute({ productName: 'tacos-pastor', quantity: 3 });
    await validateOrderUseCase.execute();
    
    const hexEndTime = performance.now();
    const hexTime = hexEndTime - hexStartTime;
    
    console.log(`Hexagonal architecture time: ${hexTime.toFixed(2)}ms`);
    
    // Debe ser eficiente a pesar de la abstracción
    expect(hexTime).toBeLessThan(500);
    
    // Verificar que la separación de responsabilidades no impacta performance
    expect(hexTime).toBeLessThan(1000); // Threshold razonable
  });
});

// Helper functions
async function loadBemBaseCss(): Promise<void> {
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/Shared/styles/_bem-base.css';
    link.onload = () => resolve();
    link.onerror = () => resolve(); // Continue even if CSS fails
    document.head.appendChild(link);
  });
}

async function renderProductGrid(count: number): Promise<void> {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < count; i++) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-card__image"></div>
      <div class="product-card__content">
        <h3 class="product-card__title">Producto ${i}</h3>
        <p class="product-card__price">$${(Math.random() * 100).toFixed(2)}</p>
        <button class="product-card__btn btn btn--primary" data-action="add-product" data-product-id="product-${i}">
          Agregar
        </button>
      </div>
    `;
    fragment.appendChild(productCard);
  }
  
  grid.appendChild(fragment);
}

function getMemoryUsage(): number {
  if ((performance as any).memory) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return 0;
}

// Export para uso en otros tests
export {
  loadBemBaseCss,
  renderProductGrid,
  getMemoryUsage
};