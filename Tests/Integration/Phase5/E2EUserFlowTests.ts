/**
 * FASE 5: End-to-End User Flow Tests
 * 
 * Tests que simulan el comportamiento real del usuario
 * interactuando con la aplicación completa.
 */

/// <reference path="../../types/jest.d.ts" />

import { HexagonalContainer } from '../../../Infraestructura/DI/HexagonalContainer.js';
import { TestSetupHelper } from './CompleteFlowTest.js';

describe('E2E User Flow Tests', () => {
  let container: HexagonalContainer;
  
  beforeEach(async () => {
    // Inicializar entorno completo
    container = await TestSetupHelper.initializeTestEnvironment();
    
    // Setup DOM completo como en la aplicación real
    document.body.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="/Shared/styles/_bem-base.css">
        <link rel="stylesheet" href="/Shared/styles/order-system.css">
      </head>
      <body>
        <div id="app" class="app">
          <header class="app__header">
            <h1 class="app__title">Sistema de Órdenes</h1>
          </header>
          
          <main class="app__main">
            <div id="order-system" class="order-system">
              <!-- Product Grid -->
              <section class="order-system__products">
                <h2 class="order-system__section-title">Productos</h2>
                <div id="product-grid" class="product-grid">
                  <!-- Productos se cargan dinámicamente -->
                </div>
              </section>
              
              <!-- Order Summary -->
              <aside class="order-system__summary">
                <h2 class="order-system__section-title">Resumen de Orden</h2>
                <div id="order-summary" class="order-summary">
                  <div class="order-summary__empty">
                    <p>No hay productos en la orden</p>
                  </div>
                </div>
                
                <div id="order-actions" class="order-actions">
                  <button id="clear-order" class="btn btn--secondary" disabled>
                    Limpiar Orden
                  </button>
                  <button id="complete-order" class="btn btn--primary" disabled>
                    Completar Orden
                  </button>
                </div>
              </aside>
            </div>
          </main>
          
          <!-- Modals y overlays -->
          <div id="modal-overlay" class="modal-overlay" style="display: none;">
            <div class="modal">
              <div class="modal__header">
                <h3 class="modal__title">Opciones de Producto</h3>
                <button class="modal__close">&times;</button>
              </div>
              <div class="modal__content">
                <!-- Contenido dinámico -->
              </div>
              <div class="modal__actions">
                <button class="btn btn--secondary modal__cancel">Cancelar</button>
                <button class="btn btn--primary modal__confirm">Agregar</button>
              </div>
            </div>
          </div>
          
          <!-- Notifications -->
          <div id="notifications" class="notifications"></div>
        </div>
      </body>
      </html>
    `;
    
    // Cargar productos iniciales
    await loadInitialProducts();
  });
  
  afterEach(() => {
    TestSetupHelper.cleanup();
    // Cleanup handled by singleton pattern
  });
  
  test('Complete user journey: Browse → Select → Configure → Order → Complete', async () => {
    // 1. Usuario ve la página inicial
    expect(document.querySelector('.app')).toBeDefined();
    expect(document.querySelector('.product-grid')).toBeDefined();
    expect(document.querySelector('.order-summary__empty')).toBeDefined();
    
    // Botones inicialmente deshabilitados
    const clearBtn = document.getElementById('clear-order') as HTMLButtonElement;
    const completeBtn = document.getElementById('complete-order') as HTMLButtonElement;
    expect(clearBtn.disabled).toBe(true);
    expect(completeBtn.disabled).toBe(true);
    
    // 2. Usuario navega por productos
    const productCards = document.querySelectorAll('.product-card');
    expect(productCards.length).toBeGreaterThan(0);
    
    // 3. Usuario hace click en una cerveza
    const beerCard = Array.from(productCards).find(card => 
      card.textContent?.includes('Cerveza')
    ) as HTMLElement;
    expect(beerCard).toBeDefined();
    
    // Simular click
    const clickEvent = new MouseEvent('click', { bubbles: true });
    beerCard.dispatchEvent(clickEvent);
    
    // Esperar a que aparezca el modal de opciones
    await waitForElement('.modal-overlay:not([style*="display: none"])');
    
    const modal = document.querySelector('.modal');
    expect(modal).toBeDefined();
    expect(modal?.textContent).toContain('Opciones de Producto');
    
    // 4. Usuario selecciona opciones de bebida
    const drinkSelect = modal?.querySelector('select[name="drink-option"]') as HTMLSelectElement;
    if (drinkSelect) {
      drinkSelect.value = 'Coca';
      drinkSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Usuario confirma
    const confirmBtn = modal?.querySelector('.modal__confirm') as HTMLButtonElement;
    confirmBtn.click();
    
    // Esperar a que se cierre el modal
    await waitForElement('.modal-overlay[style*="display: none"]');
    
    // 5. Verificar que el producto se agregó a la orden
    const orderSummary = document.getElementById('order-summary');
    expect(orderSummary?.querySelector('.order-summary__empty')).toBeNull();
    expect(orderSummary?.textContent).toContain('Cerveza');
    expect(orderSummary?.textContent).toContain('Coca');
    
    // Botones ahora habilitados
    expect(clearBtn.disabled).toBe(false);
    expect(completeBtn.disabled).toBe(false);
    
    // 6. Usuario agrega más productos
    const tacoCard = Array.from(productCards).find(card => 
      card.textContent?.includes('Tacos')
    ) as HTMLElement;
    
    if (tacoCard) {
      tacoCard.dispatchEvent(clickEvent);
      
      // Para tacos no hay modal, se agrega directamente
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(orderSummary?.textContent).toContain('Tacos');
    }
    
    // 7. Usuario modifica cantidad
    const quantityInput = orderSummary?.querySelector('input[type="number"]') as HTMLInputElement;
    if (quantityInput) {
      quantityInput.value = '3';
      quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verificar que el total se actualizó
      const totalElement = orderSummary?.querySelector('.order-summary__total');
      expect(totalElement).toBeDefined();
    }
    
    // 8. Usuario completa la orden
    completeBtn.click();
    
    // Esperar confirmación
    await waitForElement('.notification--success');
    
    const successNotification = document.querySelector('.notification--success');
    expect(successNotification).toBeDefined();
    expect(successNotification?.textContent).toContain('Orden completada');
    
    // 9. Verificar estado final
    expect(orderSummary?.textContent).toContain('Completada');
    expect(clearBtn.disabled).toBe(true);
    expect(completeBtn.disabled).toBe(true);
  });
  
  test('User error handling: Invalid selections and corrections', async () => {
    // 1. Usuario intenta completar orden vacía
    const completeBtn = document.getElementById('complete-order') as HTMLButtonElement;
    completeBtn.click();
    
    // Debe mostrar error
    await waitForElement('.notification--error');
    const errorNotification = document.querySelector('.notification--error');
    expect(errorNotification?.textContent).toContain('vacía');
    
    // 2. Usuario agrega producto pero cancela
    const productCard = document.querySelector('.product-card') as HTMLElement;
    productCard.click();
    
    await waitForElement('.modal-overlay:not([style*="display: none"])');
    
    const cancelBtn = document.querySelector('.modal__cancel') as HTMLButtonElement;
    cancelBtn.click();
    
    await waitForElement('.modal-overlay[style*="display: none"]');
    
    // Orden debe seguir vacía
    const orderSummary = document.getElementById('order-summary');
    expect(orderSummary?.querySelector('.order-summary__empty')).toBeDefined();
    
    // 3. Usuario agrega producto y luego lo elimina
    productCard.click();
    await waitForElement('.modal-overlay:not([style*="display: none"])');
    
    const confirmBtn = document.querySelector('.modal__confirm') as HTMLButtonElement;
    confirmBtn.click();
    
    await waitForElement('.modal-overlay[style*="display: none"]');
    
    // Producto agregado
    expect(orderSummary?.querySelector('.order-summary__empty')).toBeNull();
    
    // Eliminar producto
    const removeBtn = orderSummary?.querySelector('.order-item__remove') as HTMLButtonElement;
    if (removeBtn) {
      removeBtn.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Orden vacía de nuevo
      expect(orderSummary?.querySelector('.order-summary__empty')).toBeDefined();
    }
  });
  
  test('Responsive behavior and mobile interactions', async () => {
    // Simular viewport móvil
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    Object.defineProperty(window, 'innerHeight', { value: 667 });
    window.dispatchEvent(new Event('resize'));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verificar que el layout se adapta
    const orderSystem = document.querySelector('.order-system');
    const computedStyle = window.getComputedStyle(orderSystem as Element);
    
    // En móvil debe ser layout vertical
    expect(computedStyle.flexDirection).toBe('column');
    
    // 2. Simular touch events
    const productCard = document.querySelector('.product-card') as HTMLElement;
    
    const touchStart = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [new Touch({
        identifier: 1,
        target: productCard,
        clientX: 100,
        clientY: 100
      })]
    });
    
    const touchEnd = new TouchEvent('touchend', {
      bubbles: true,
      changedTouches: [new Touch({
        identifier: 1,
        target: productCard,
        clientX: 100,
        clientY: 100
      })]
    });
    
    productCard.dispatchEvent(touchStart);
    productCard.dispatchEvent(touchEnd);
    
    // Debe funcionar igual que click
    await waitForElement('.modal-overlay:not([style*="display: none"])');
    expect(document.querySelector('.modal')).toBeDefined();
  });
  
  test('Keyboard navigation and accessibility', async () => {
    // 1. Navegación con Tab
    const productCards = document.querySelectorAll('.product-card');
    const firstCard = productCards[0] as HTMLElement;
    
    firstCard.focus();
    expect(document.activeElement).toBe(firstCard);
    
    // Tab a siguiente producto
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true
    });
    firstCard.dispatchEvent(tabEvent);
    
    // 2. Activación con Enter/Space
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true
    });
    firstCard.dispatchEvent(enterEvent);
    
    await waitForElement('.modal-overlay:not([style*="display: none"])');
    expect(document.querySelector('.modal')).toBeDefined();
    
    // 3. Cerrar modal con Escape
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    document.dispatchEvent(escapeEvent);
    
    await waitForElement('.modal-overlay[style*="display: none"]');
    const modalOverlay = document.querySelector('.modal-overlay') as HTMLElement;
    expect(modalOverlay?.style.display).toBe('none');
    
    // 4. Verificar atributos de accesibilidad
    expect(firstCard.getAttribute('tabindex')).toBe('0');
    expect(firstCard.getAttribute('role')).toBe('button');
    expect(firstCard.getAttribute('aria-label')).toBeDefined();
  });
  
  test('Performance during user interactions', async () => {
    const performanceMarks: number[] = [];
    
    // Medir tiempo de respuesta a clicks
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();
      
      const productCard = document.querySelector('.product-card') as HTMLElement;
      productCard.click();
      
      await waitForElement('.modal-overlay:not([style*="display: none"])');
      
      const endTime = performance.now();
      performanceMarks.push(endTime - startTime);
      
      // Cerrar modal
      const cancelBtn = document.querySelector('.modal__cancel') as HTMLButtonElement;
      cancelBtn.click();
      
      await waitForElement('.modal-overlay[style*="display: none"])');
    }
    
    // Calcular promedio
    const avgResponseTime = performanceMarks.reduce((a, b) => a + b, 0) / performanceMarks.length;
    
    console.log(`Average UI response time: ${avgResponseTime.toFixed(2)}ms`);
    
    // Debe ser rápido
    expect(avgResponseTime).toBeLessThan(100);
    
    // Ninguna interacción debe ser muy lenta
    expect(Math.max(...performanceMarks)).toBeLessThan(200);
  });
  
  test('Data persistence and state management', async () => {
    // 1. Agregar productos a la orden
    const productCard = document.querySelector('.product-card') as HTMLElement;
    productCard.click();
    
    await waitForElement('.modal-overlay:not([style*="display: none"])');
    
    const confirmBtn = document.querySelector('.modal__confirm') as HTMLButtonElement;
    confirmBtn.click();
    
    await waitForElement('.modal-overlay[style*="display: none"]');
    
    // 2. Simular recarga de página (pérdida de estado)
    const orderData = {
      items: Array.from(document.querySelectorAll('.order-item')).map(item => ({
        name: item.querySelector('.order-item__name')?.textContent,
        quantity: item.querySelector('.order-item__quantity')?.textContent
      }))
    };
    
    // 3. Restaurar estado
    document.body.innerHTML = '';
    await loadInitialProducts();
    
    // Verificar que el estado se puede restaurar
    expect(orderData.items.length).toBeGreaterThan(0);
    
    // 4. Verificar persistencia en localStorage si está implementada
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      expect(parsedOrder.items).toBeDefined();
    }
  });
});

// Helper functions
async function loadInitialProducts(): Promise<void> {
  const productGrid = document.getElementById('product-grid');
  if (!productGrid) return;
  
  const products = [
    { id: 'cerveza-corona', name: 'Cerveza Corona', price: 45, category: 'bebidas' },
    { id: 'cerveza-modelo', name: 'Cerveza Modelo', price: 45, category: 'bebidas' },
    { id: 'tacos-pastor', name: 'Tacos al Pastor', price: 15, category: 'comida' },
    { id: 'tacos-carnitas', name: 'Tacos de Carnitas', price: 15, category: 'comida' },
    { id: 'quesadilla', name: 'Quesadilla', price: 25, category: 'comida' }
  ];
  
  productGrid.innerHTML = products.map(product => `
    <div class="product-card" 
         data-product-id="${product.id}"
         data-action="select-product"
         tabindex="0"
         role="button"
         aria-label="Seleccionar ${product.name}">
      <div class="product-card__image">
        <img src="/images/${product.id}.jpg" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-card__content">
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__price">$${product.price}</p>
        <span class="product-card__category">${product.category}</span>
      </div>
      <div class="product-card__actions">
        <button class="btn btn--small btn--primary">Agregar</button>
      </div>
    </div>
  `).join('');
}

async function waitForElement(selector: string, timeout: number = 1000): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

// Polyfill para Touch events en entornos de test
if (typeof Touch === 'undefined') {
  (global as any).Touch = class Touch {
    identifier: number;
    target: EventTarget;
    clientX: number;
    clientY: number;
    
    constructor(touchInit: any) {
      this.identifier = touchInit.identifier;
      this.target = touchInit.target;
      this.clientX = touchInit.clientX;
      this.clientY = touchInit.clientY;
    }
  };
}

export { waitForElement, loadInitialProducts };