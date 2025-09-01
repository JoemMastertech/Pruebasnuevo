export default SafeModal;
/**
 * SafeModal Component - Optimized Modal Implementation
 * Enhanced with accessibility, event handling, and better UX
 * Follows modern web component standards
 */
declare class SafeModal extends HTMLElement {
    isOpen: boolean;
    focusableElements: any[];
    previousActiveElement: Element | null;
    /**
     * Handle keyboard events (ESC to close, Tab for focus trap)
     */
    handleKeyDown(event: any): void;
    /**
     * Handle backdrop clicks to close modal
     */
    handleBackdropClick(event: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Show modal with enhanced functionality
     * @param {Object} options - Configuration options
     */
    show(options?: Object): void;
    /**
     * Hide modal with cleanup
     */
    hide(): void;
    /**
     * Toggle modal visibility
     */
    toggle(): void;
    /**
     * Update list of focusable elements
     */
    updateFocusableElements(): void;
    /**
     * Focus first focusable element
     */
    focusFirstElement(): void;
    /**
     * Trap focus within modal
     */
    trapFocus(event: any): void;
    /**
     * Set modal content
     * @param {string|HTMLElement} content - Content to display
     */
    setContent(content: string | HTMLElement): void;
}
//# sourceMappingURL=SafeModal.d.ts.map