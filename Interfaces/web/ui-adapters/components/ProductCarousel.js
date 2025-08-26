/**
 * ProductCarousel Component - Phase 3 Optimized Implementation
 * Lightweight carousel with event delegation, memory cleanup, and re-render optimization
 * Follows YAGNI principles with advanced performance optimizations
 */

import { formatPrice, formatProductName } from '../../../../Shared/utils/formatters.js';

class ProductCarousel {
  constructor(container, products = []) {
    this.container = container;
    this.products = products;
    this.currentIndex = 0;
    this.isInitialized = false;
    this.boundHandlers = new Map();
    this.renderCache = new Map();
    this.lastRenderHash = null;
  }

  /**
   * Initialize carousel with products
   * @param {Array} products - Array of product objects
   */
  init(products = null) {
    if (products) this.products = products;
    if (this.products.length === 0) return;
    
    this.render();
    this.attachEvents();
    this.isInitialized = true;
  }

  /**
   * Render carousel HTML structure with optimization
   */
  render() {
    if (!this.container) return;
    
    // Generate hash for current state to avoid unnecessary re-renders
    const currentHash = this._generateRenderHash();
    if (this.lastRenderHash === currentHash) {
      return; // Skip re-render if content hasn't changed
    }
    
    // Check cache first
    if (this.renderCache.has(currentHash)) {
      this.container.innerHTML = this.renderCache.get(currentHash);
      this.lastRenderHash = currentHash;
      return;
    }
    
    const html = `
      <div class="carousel-wrapper">
        <div class="carousel-track" id="carousel-track">
          ${this.products.map((product, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}" data-index="${index}">
              <img src="${product.imagen || product.ruta_archivo || '/placeholder.jpg'}" 
                   alt="${product.nombre}" 
                   loading="lazy">
              <h3>${formatProductName(product.nombre)}</h3>
              <p class="price">${formatPrice(product.precio)}</p>
            </div>
          `).join('')}
        </div>
        ${this.products.length > 1 ? `
          <button class="carousel-btn prev" id="carousel-prev">‹</button>
          <button class="carousel-btn next" id="carousel-next">›</button>
          <div class="carousel-dots">
            ${this.products.map((_, index) => `
              <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
    
    // Cache the rendered HTML
    this.renderCache.set(currentHash, html);
    this.container.innerHTML = html;
    this.lastRenderHash = currentHash;
    
    // Limit cache size to prevent memory bloat
    if (this.renderCache.size > 10) {
      const firstKey = this.renderCache.keys().next().value;
      this.renderCache.delete(firstKey);
    }
  }
  
  /**
   * Generate hash for current render state
   */
  _generateRenderHash() {
    return JSON.stringify({
      products: this.products.map(p => ({ nombre: p.nombre, precio: p.precio, imagen: p.imagen || p.ruta_archivo })),
      currentIndex: this.currentIndex
    });
  }

  /**
   * Attach event listeners using intelligent event delegation
   */
  attachEvents() {
    if (this.products.length <= 1) return;
    
    // Remove existing listeners to prevent memory leaks
    this.removeEvents();
    
    // Single delegated event listener for all carousel interactions
    const delegatedHandler = (e) => {
      e.preventDefault();
      
      if (e.target.id === 'carousel-prev') {
        this.prev();
      } else if (e.target.id === 'carousel-next') {
        this.next();
      } else if (e.target.classList.contains('dot')) {
        const index = parseInt(e.target.dataset.index);
        this.goTo(index);
      }
    };
    
    this.boundHandlers.set('click', delegatedHandler);
    this.container.addEventListener('click', delegatedHandler);
  }
  
  /**
   * Remove event listeners for memory cleanup
   */
  removeEvents() {
    this.boundHandlers.forEach((handler, event) => {
      this.container.removeEventListener(event, handler);
    });
    this.boundHandlers.clear();
  }

  /**
   * Go to next item
   */
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.products.length;
    this.updateDisplay();
  }

  /**
   * Go to previous item
   */
  prev() {
    this.currentIndex = this.currentIndex === 0 ? this.products.length - 1 : this.currentIndex - 1;
    this.updateDisplay();
  }

  /**
   * Go to specific index
   * @param {number} index - Target index
   */
  goTo(index) {
    if (index >= 0 && index < this.products.length) {
      this.currentIndex = index;
      this.updateDisplay();
    }
  }

  /**
   * Update display to show current item
   */
  updateDisplay() {
    const items = this.container.querySelectorAll('.carousel-item');
    const dots = this.container.querySelectorAll('.dot');
    
    items.forEach((item, index) => {
      if (item && item.classList) {
        item.classList.toggle('active', index === this.currentIndex);
      }
    });
    
    dots.forEach((dot, index) => {
      if (dot && dot.classList) {
        dot.classList.toggle('active', index === this.currentIndex);
      }
    });
  }

  /**
   * Update products and re-render with optimization
   * @param {Array} newProducts - New product array
   */
  updateProducts(newProducts) {
    this.products = newProducts;
    this.currentIndex = 0;
    this.lastRenderHash = null; // Force re-render
    if (this.isInitialized) {
      this.render();
      this.attachEvents();
    }
  }
  
  /**
   * Cleanup method for memory management
   */
  destroy() {
    this.removeEvents();
    this.renderCache.clear();
    this.boundHandlers.clear();
    this.container = null;
    this.products = null;
    this.isInitialized = false;
  }
}

export default ProductCarousel;