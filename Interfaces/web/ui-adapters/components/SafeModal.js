/**
 * SafeModal Component - Optimized Modal Implementation
 * Enhanced with accessibility, event handling, and better UX
 * Follows modern web component standards
 */

class SafeModal extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.focusableElements = [];
    this.previousActiveElement = null;
    
    // Bind methods to preserve context
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
  }

  connectedCallback() {
    // Set initial attributes for accessibility
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('aria-hidden', 'true');
    
    // Ensure initial hidden state
    if (!this.classList.contains('modal-hidden')) {
      this.classList.remove('modal-flex');
      this.classList.add('modal-hidden');
    }
    
    // Add backdrop click listener
    this.addEventListener('click', this.handleBackdropClick);
  }

  disconnectedCallback() {
    // Clean up event listeners
    this.removeEventListener('click', this.handleBackdropClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Show modal with enhanced functionality
   * @param {Object} options - Configuration options
   */
  show(options = {}) {
    if (this.isOpen) return;
    
    // Store current active element for focus restoration
    this.previousActiveElement = document.activeElement;
    
    // Show modal
    this.classList.remove('modal-hidden');
    this.classList.add('modal-flex');
    this.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    
    // Add keyboard event listener
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Focus management
    this.updateFocusableElements();
    this.focusFirstElement();
    
    // Prevent body scroll
    document.body.className = document.body.className.replace('body-scroll', '').trim() + ' body-no-scroll';
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('modal:show', {
      detail: { modal: this, options }
    }));
  }

  /**
   * Hide modal with cleanup
   */
  hide() {
    if (!this.isOpen) return;
    
    // Hide modal
    this.classList.remove('modal-flex');
    this.classList.add('modal-hidden');
    this.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    
    // Remove keyboard event listener
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Restore focus
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
    
    // Restore body scroll
    document.body.className = document.body.className.replace('body-no-scroll', '').trim() + ' body-scroll';
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('modal:hide', {
      detail: { modal: this }
    }));
  }

  /**
   * Toggle modal visibility
   */
  toggle() {
    this.isOpen ? this.hide() : this.show();
  }

  /**
   * Handle keyboard events (ESC to close, Tab for focus trap)
   */
  handleKeyDown(event) {
    if (!this.isOpen) return;
    
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.hide();
        break;
      case 'Tab':
        this.trapFocus(event);
        break;
    }
  }

  /**
   * Handle backdrop clicks to close modal
   */
  handleBackdropClick(event) {
    // Only close if clicking the backdrop (this element), not its children
    if (event.target === this) {
      this.hide();
    }
  }

  /**
   * Update list of focusable elements
   */
  updateFocusableElements() {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    this.focusableElements = Array.from(
      this.querySelectorAll(focusableSelectors)
    );
  }

  /**
   * Focus first focusable element
   */
  focusFirstElement() {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    } else {
      // Focus the modal itself if no focusable elements
      this.focus();
    }
  }

  /**
   * Trap focus within modal
   */
  trapFocus(event) {
    if (this.focusableElements.length === 0) return;
    
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    
    if (event.shiftKey) {
      // Shift + Tab: moving backwards
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: moving forwards
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Set modal content
   * @param {string|HTMLElement} content - Content to display
   */
  setContent(content) {
    if (typeof content === 'string') {
      this.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.innerHTML = '';
      this.appendChild(content);
    }
    
    // Update focusable elements after content change
    if (this.isOpen) {
      this.updateFocusableElements();
    }
  }
}

// Register custom element if not already registered
if (!customElements.get('safe-modal')) {
  customElements.define('safe-modal', SafeModal);
}

export default SafeModal;