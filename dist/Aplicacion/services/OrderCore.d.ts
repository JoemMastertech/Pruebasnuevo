export default OrderSystemCore;
declare class OrderSystemCore {
    items: any[];
    idCounter: number;
    addProduct(itemData: any): any;
    /**
     * Generate unique ID for order items
     * @returns {string} Unique identifier
     */
    generateUniqueId(): string;
    removeItem(itemId: any): boolean;
    getTotal(): any;
    getItems(): any[];
    getItemCount(): number;
    findItemById(itemId: any): any;
    clearItems(): number;
    isEmpty(): boolean;
}
//# sourceMappingURL=OrderCore.d.ts.map