export default ProductCarousel;
declare class ProductCarousel {
    constructor(container: any, products?: any[]);
    container: any;
    products: any[];
    currentIndex: number;
    isInitialized: boolean;
    boundHandlers: Map<any, any>;
    renderCache: Map<any, any>;
    lastRenderHash: any;
    /**
     * Initialize carousel with products
     * @param {Array} products - Array of product objects
     */
    init(products?: any[]): void;
    /**
     * Render carousel HTML structure with optimization
     */
    render(): void;
    /**
     * Generate hash for current render state
     */
    _generateRenderHash(): string;
    /**
     * Attach event listeners using intelligent event delegation
     */
    attachEvents(): void;
    /**
     * Remove event listeners for memory cleanup
     */
    removeEvents(): void;
    /**
     * Go to next item
     */
    next(): void;
    /**
     * Go to previous item
     */
    prev(): void;
    /**
     * Go to specific index
     * @param {number} index - Target index
     */
    goTo(index: number): void;
    /**
     * Update display to show current item
     */
    updateDisplay(): void;
    /**
     * Update products and re-render with optimization
     * @param {Array} newProducts - New product array
     */
    updateProducts(newProducts: any[]): void;
    /**
     * Cleanup method for memory management
     */
    destroy(): void;
}
//# sourceMappingURL=ProductCarousel.d.ts.map