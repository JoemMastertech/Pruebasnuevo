export function setSafeInnerHTML(element: any, html: any): boolean;
/**
 * Simplified modal management
 * @param {string} modalId - Modal element ID
 */
export function showModal(modalId: string): void;
export function hideModal(modalId: any): void;
/**
 * Add basic modal functionality (click outside to close, escape key)
 * @param {HTMLElement} modal - Modal element
 */
export function enhanceModal(modal: HTMLElement): void;
export function getElementSafely(elementId: any, required?: boolean): HTMLElement | null;
export function updateElementText(elementId: any, content: any): void;
export function toggleElementClass(elementId: any, className: any, force: any): void;
//# sourceMappingURL=domUtils.d.ts.map