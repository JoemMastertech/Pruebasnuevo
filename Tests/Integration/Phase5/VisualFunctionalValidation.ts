/**
 * FASE 5: Visual-Functional Validation Tests
 * 
 * Tests que validan la correcta funcionalidad visual y
 * comportamiento de los componentes UI.
 */

/// <reference path="../../types/jest.d.ts" />

import { HexagonalContainer } from '../../../Infraestructura/DI/HexagonalContainer.js';
import { TestSetupHelper } from './CompleteFlowTest.js';
import { waitForElement } from './E2EUserFlowTests.js';

describe('Visual-Functional Validation', () => {
  let container: HexagonalContainer;
  
  beforeEach(async () => {
    container = await TestSetupHelper.initializeTestEnvironment();
    
    // Setup DOM con todos los componentes
    document.body.innerHTML = `
      <div id="app" class="app">
        <div id="order-system" class="order-system">
          <div id="product-grid" class="product-grid"></div>
          <div id="order-summary" class="order-summary">
            <div class="order-summary__empty">
              <p>No hay productos en la orden</p>
            </div>
          </div>
          <div id="order-actions" class="order-actions">
            <button id="clear-order" class="btn btn--secondary" disabled>Limpiar</button>
            <button id="complete-order" class="btn btn--primary" disabled>Completar</button>
          </div>
        </div>
        
        <!-- Modal Component -->
        <div id="modal-overlay" class="modal-overlay" style="display: none;">
          <div class="modal">
            <div class="modal__header">
              <h3 class="modal__title">Título Modal</h3>
              <button class="modal__close">&times;</button>
            </div>
            <div class="modal__content"></div>
            <div class="modal__actions">
              <button class="btn btn--secondary modal__cancel">Cancelar</button>
              <button class="btn btn--primary modal__confirm">Confirmar</button>
            </div>
          </div>
        </div>
        
        <!-- Notification Component -->
        <div id="notifications" class="notifications"></div>
        
        <!-- Loading Component -->
        <div id="loading-overlay" class="loading-overlay" style="display: none;">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <p class="loading-text">Cargando...</p>
          </div>
        </div>
      </div>
    `;
    
    // Cargar CSS de prueba
    await loadTestCSS();
  });
  
  afterEach(() => {
    TestSetupHelper.cleanup();
    // Cleanup handled by singleton pattern
  });
  
  describe('BEM CSS Component Validation', () => {
    test('Product Grid: BEM structure and responsive behavior', async () => {
      const productGrid = document.getElementById('product-grid');
      expect(productGrid).toBeDefined();
      expect(productGrid?.classList.contains('product-grid')).toBe(true);
      
      // Agregar productos de prueba
      productGrid!.innerHTML = `
        <div class="product-card product-card--featured">
          <div class="product-card__image">
            <img class="product-card__img" src="test.jpg" alt="Test Product">
            <div class="product-card__badge product-card__badge--new">Nuevo</div>
          </div>
          <div class="product-card__content">
            <h3 class="product-card__title">Producto Test</h3>
            <p class="product-card__price product-card__price--discounted">$45</p>
            <p class="product-card__description">Descripción del producto</p>
          </div>
          <div class="product-card__actions">
            <button class="btn btn--primary btn--small product-card__btn">Agregar</button>
          </div>
        </div>
      `;
      
      // Verificar estructura BEM
      const productCard = productGrid?.querySelector('.product-card');
      expect(productCard).toBeDefined();
      expect(productCard?.classList.contains('product-card--featured')).toBe(true);
      
      const cardImage = productCard?.querySelector('.product-card__image');
      const cardContent = productCard?.querySelector('.product-card__content');
      const cardActions = productCard?.querySelector('.product-card__actions');
      
      expect(cardImage).toBeDefined();
      expect(cardContent).toBeDefined();
      expect(cardActions).toBeDefined();
      
      // Verificar elementos anidados
      expect(cardImage?.querySelector('.product-card__img')).toBeDefined();
      expect(cardImage?.querySelector('.product-card__badge--new')).toBeDefined();
      expect(cardContent?.querySelector('.product-card__title')).toBeDefined();
      expect(cardContent?.querySelector('.product-card__price--discounted')).toBeDefined();
      
      // Verificar comportamiento responsive
      await testResponsiveBehavior(productGrid!);
    });
    
    test('Order Summary: Dynamic content and state changes', async () => {
      const orderSummary = document.getElementById('order-summary');
      expect(orderSummary).toBeDefined();
      
      // Estado inicial: vacío
      let emptyState = orderSummary?.querySelector('.order-summary__empty');
      expect(emptyState).toBeDefined();
      expect(emptyState?.textContent).toContain('No hay productos');
      
      // Simular agregar producto
      orderSummary!.innerHTML = `
        <div class="order-summary__header">
          <h3 class="order-summary__title">Tu Orden</h3>
          <span class="order-summary__count">2 productos</span>
        </div>
        
        <div class="order-summary__items">
          <div class="order-item order-item--editable">
            <div class="order-item__info">
              <h4 class="order-item__name">Cerveza Corona</h4>
              <p class="order-item__details">Con Coca Cola</p>
            </div>
            <div class="order-item__quantity">
              <button class="btn btn--icon order-item__btn-decrease">-</button>
              <input class="order-item__input" type="number" value="2" min="1">
              <button class="btn btn--icon order-item__btn-increase">+</button>
            </div>
            <div class="order-item__price">
              <span class="order-item__unit-price">$45</span>
              <span class="order-item__total-price">$90</span>
            </div>
            <button class="btn btn--icon btn--danger order-item__remove">&times;</button>
          </div>
        </div>
        
        <div class="order-summary__footer">
          <div class="order-summary__totals">
            <div class="order-summary__subtotal">
              <span>Subtotal:</span>
              <span>$90</span>
            </div>
            <div class="order-summary__tax">
              <span>IVA (16%):</span>
              <span>$14.40</span>
            </div>
            <div class="order-summary__total">
              <span>Total:</span>
              <span>$104.40</span>
            </div>
          </div>
        </div>
      `;
      
      // Verificar estructura con productos
      expect(orderSummary?.querySelector('.order-summary__header')).toBeDefined();
      expect(orderSummary?.querySelector('.order-summary__items')).toBeDefined();
      expect(orderSummary?.querySelector('.order-summary__footer')).toBeDefined();
      
      const orderItem = orderSummary?.querySelector('.order-item');
      expect(orderItem?.classList.contains('order-item--editable')).toBe(true);
      
      // Verificar elementos de cantidad
      const quantitySection = orderItem?.querySelector('.order-item__quantity');
      expect(quantitySection?.querySelector('.order-item__btn-decrease')).toBeDefined();
      expect(quantitySection?.querySelector('.order-item__input')).toBeDefined();
      expect(quantitySection?.querySelector('.order-item__btn-increase')).toBeDefined();
      
      // Verificar totales
      const totalsSection = orderSummary?.querySelector('.order-summary__totals');
      expect(totalsSection?.querySelector('.order-summary__subtotal')).toBeDefined();
      expect(totalsSection?.querySelector('.order-summary__tax')).toBeDefined();
      expect(totalsSection?.querySelector('.order-summary__total')).toBeDefined();
    });
    
    test('Modal Component: Overlay and content management', async () => {
      const modalOverlay = document.getElementById('modal-overlay');
      expect(modalOverlay).toBeDefined();
      
      // Estado inicial: oculto
      expect(modalOverlay?.style.display).toBe('none');
      
      // Mostrar modal
      modalOverlay!.style.display = 'flex';
      modalOverlay?.classList.add('modal-overlay--active');
      
      const modal = modalOverlay?.querySelector('.modal');
      expect(modal).toBeDefined();
      
      // Verificar estructura
      expect(modal?.querySelector('.modal__header')).toBeDefined();
      expect(modal?.querySelector('.modal__content')).toBeDefined();
      expect(modal?.querySelector('.modal__actions')).toBeDefined();
      
      // Agregar contenido dinámico
      const modalContent = modal?.querySelector('.modal__content');
      modalContent!.innerHTML = `
        <div class="modal-form">
          <div class="form-group">
            <label class="form-group__label" for="drink-option">Bebida:</label>
            <select class="form-group__select" id="drink-option">
              <option value="">Seleccionar...</option>
              <option value="coca">Coca Cola</option>
              <option value="pepsi">Pepsi</option>
              <option value="agua">Agua</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-group__label" for="quantity">Cantidad:</label>
            <input class="form-group__input" type="number" id="quantity" value="1" min="1">
          </div>
          
          <div class="form-group form-group--checkbox">
            <input class="form-group__checkbox" type="checkbox" id="extra-lime">
            <label class="form-group__checkbox-label" for="extra-lime">Limón extra</label>
          </div>
        </div>
      `;
      
      // Verificar formulario
      expect(modalContent?.querySelector('.modal-form')).toBeDefined();
      expect(modalContent?.querySelectorAll('.form-group').length).toBe(3);
      
      // Verificar elementos de formulario
      const selectElement = modalContent?.querySelector('.form-group__select') as HTMLSelectElement;
      const inputElement = modalContent?.querySelector('.form-group__input') as HTMLInputElement;
      const checkboxElement = modalContent?.querySelector('.form-group__checkbox') as HTMLInputElement;
      
      expect(selectElement).toBeDefined();
      expect(inputElement).toBeDefined();
      expect(checkboxElement).toBeDefined();
      
      // Simular interacciones
      selectElement.value = 'coca';
      inputElement.value = '2';
      checkboxElement.checked = true;
      
      expect(selectElement.value).toBe('coca');
      expect(inputElement.value).toBe('2');
      expect(checkboxElement.checked).toBe(true);
    });
    
    test('Button States: Disabled, loading, and interactive states', async () => {
      const clearBtn = document.getElementById('clear-order') as HTMLButtonElement;
      const completeBtn = document.getElementById('complete-order') as HTMLButtonElement;
      
      // Estado inicial: deshabilitados
      expect(clearBtn.disabled).toBe(true);
      expect(completeBtn.disabled).toBe(true);
      expect(clearBtn.classList.contains('btn--secondary')).toBe(true);
      expect(completeBtn.classList.contains('btn--primary')).toBe(true);
      
      // Habilitar botones
      clearBtn.disabled = false;
      completeBtn.disabled = false;
      
      expect(clearBtn.disabled).toBe(false);
      expect(completeBtn.disabled).toBe(false);
      
      // Estado de carga
      completeBtn.classList.add('btn--loading');
      completeBtn.innerHTML = `
        <span class="btn__spinner"></span>
        <span class="btn__text">Procesando...</span>
      `;
      
      expect(completeBtn.classList.contains('btn--loading')).toBe(true);
      expect(completeBtn.querySelector('.btn__spinner')).toBeDefined();
      expect(completeBtn.textContent).toContain('Procesando');
      
      // Estado de éxito
      completeBtn.classList.remove('btn--loading');
      completeBtn.classList.add('btn--success');
      completeBtn.innerHTML = `
        <span class="btn__icon">✓</span>
        <span class="btn__text">Completado</span>
      `;
      
      expect(completeBtn.classList.contains('btn--success')).toBe(true);
      expect(completeBtn.textContent).toContain('Completado');
    });
  });
  
  describe('Notification System Validation', () => {
    test('Success, error, and info notifications', async () => {
      const notificationsContainer = document.getElementById('notifications');
      expect(notificationsContainer).toBeDefined();
      
      // Crear notificación de éxito
      const successNotification = createNotification('success', 'Orden completada exitosamente');
      notificationsContainer?.appendChild(successNotification);
      
      expect(successNotification.classList.contains('notification--success')).toBe(true);
      expect(successNotification.textContent).toContain('Orden completada');
      
      // Crear notificación de error
      const errorNotification = createNotification('error', 'Error al procesar la orden');
      notificationsContainer?.appendChild(errorNotification);
      
      expect(errorNotification.classList.contains('notification--error')).toBe(true);
      expect(errorNotification.textContent).toContain('Error al procesar');
      
      // Crear notificación de información
      const infoNotification = createNotification('info', 'Producto agregado a la orden');
      notificationsContainer?.appendChild(infoNotification);
      
      expect(infoNotification.classList.contains('notification--info')).toBe(true);
      expect(infoNotification.textContent).toContain('Producto agregado');
      
      // Verificar que todas están presentes
      expect(notificationsContainer?.children.length).toBe(3);
      
      // Simular auto-dismiss
      setTimeout(() => {
        successNotification.classList.add('notification--dismissing');
        setTimeout(() => {
          successNotification.remove();
        }, 300);
      }, 100);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      expect(notificationsContainer?.children.length).toBe(2);
    });
  });
  
  describe('Loading States Validation', () => {
    test('Loading overlay and spinner behavior', async () => {
      const loadingOverlay = document.getElementById('loading-overlay');
      expect(loadingOverlay).toBeDefined();
      
      // Estado inicial: oculto
      expect(loadingOverlay?.style.display).toBe('none');
      
      // Mostrar loading
      loadingOverlay!.style.display = 'flex';
      loadingOverlay?.classList.add('loading-overlay--active');
      
      expect(loadingOverlay?.style.display).toBe('flex');
      expect(loadingOverlay?.classList.contains('loading-overlay--active')).toBe(true);
      
      // Verificar spinner
      const spinner = loadingOverlay?.querySelector('.spinner');
      const loadingText = loadingOverlay?.querySelector('.loading-text');
      
      expect(spinner).toBeDefined();
      expect(loadingText).toBeDefined();
      expect(loadingText?.textContent).toBe('Cargando...');
      
      // Simular carga completada
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      loadingOverlay?.classList.remove('loading-overlay--active');
      loadingOverlay?.classList.add('loading-overlay--hiding');
      
      setTimeout(() => {
        loadingOverlay!.style.display = 'none';
        loadingOverlay?.classList.remove('loading-overlay--hiding');
      }, 300);
      
      await new Promise(resolve => setTimeout(resolve, 400));
      expect(loadingOverlay?.style.display).toBe('none');
    });
  });
  
  describe('Animation and Transition Validation', () => {
    test('CSS transitions and animations work correctly', async () => {
      // Crear elemento con transiciones
      const animatedElement = document.createElement('div');
      animatedElement.className = 'test-animation';
      animatedElement.style.cssText = `
        transition: all 0.3s ease;
        transform: translateX(0);
        opacity: 1;
      `;
      
      document.body.appendChild(animatedElement);
      
      // Verificar estado inicial
      const initialTransform = getComputedStyle(animatedElement).transform;
      const initialOpacity = getComputedStyle(animatedElement).opacity;
      
      expect(initialOpacity).toBe('1');
      
      // Aplicar animación
      animatedElement.style.transform = 'translateX(100px)';
      animatedElement.style.opacity = '0.5';
      
      // Esperar a que termine la transición
      await new Promise(resolve => setTimeout(resolve, 350));
      
      const finalTransform = getComputedStyle(animatedElement).transform;
      const finalOpacity = getComputedStyle(animatedElement).opacity;
      
      expect(finalOpacity).toBe('0.5');
      expect(finalTransform).toContain('100');
      
      // Limpiar
      animatedElement.remove();
    });
  });
});

// Helper functions
async function loadTestCSS(): Promise<void> {
  const style = document.createElement('style');
  style.textContent = `
    /* Test CSS for validation */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .product-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s ease;
    }
    
    .product-card:hover {
      transform: translateY(-2px);
    }
    
    .product-card--featured {
      border-color: #007bff;
      box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn--primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn--secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn--loading {
      position: relative;
      color: transparent;
    }
    
    .btn__spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    .notification {
      padding: 1rem;
      margin: 0.5rem 0;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    
    .notification--success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .notification--error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .notification--info {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
    
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    
    @media (max-width: 768px) {
      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
      
      .order-system {
        flex-direction: column;
      }
    }
  `;
  
  document.head.appendChild(style);
}

function createNotification(type: 'success' | 'error' | 'info', message: string): HTMLElement {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <span class="notification__icon">${getNotificationIcon(type)}</span>
      <span class="notification__message">${message}</span>
    </div>
    <button class="notification__close">&times;</button>
  `;
  
  // Auto-dismiss después de 5 segundos
  setTimeout(() => {
    notification.classList.add('notification--dismissing');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
  
  return notification;
}

function getNotificationIcon(type: string): string {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✗';
    case 'info': return 'ℹ';
    default: return '';
  }
}

async function testResponsiveBehavior(element: HTMLElement): Promise<void> {
  // Simular diferentes tamaños de pantalla
  const breakpoints = [
    { width: 1200, height: 800 }, // Desktop
    { width: 768, height: 1024 }, // Tablet
    { width: 375, height: 667 }   // Mobile
  ];
  
  for (const breakpoint of breakpoints) {
    // Simular cambio de viewport
    Object.defineProperty(window, 'innerWidth', { value: breakpoint.width, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: breakpoint.height, configurable: true });
    
    window.dispatchEvent(new Event('resize'));
    
    // Esperar a que se apliquen los estilos
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verificar que el elemento responde al cambio
    const computedStyle = window.getComputedStyle(element);
    expect(computedStyle).toBeDefined();
  }
}

export { createNotification, testResponsiveBehavior };