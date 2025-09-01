export default CSSClassManager;
/**
 * CSS CLASS MANAGER - FASE 3: CONSOLIDACIÓN DE LÓGICA JAVASCRIPT
 * Módulo centralizado para manipulación de clases CSS
 * Implementa naming conventions BEM y reduce duplicación
 */
declare class CSSClassManager {
    state: {
        topNavVisible: boolean;
        gridEnhanced: boolean;
        orderModeActive: boolean;
        drawerOpen: boolean;
        viewMode: string;
    };
    elements: {
        body: HTMLElement;
        topNav: null;
        drawerMenu: null;
        drawerOverlay: null;
        hamburgerBtn: null;
        viewToggleBtn: null;
    };
    /**
     * Inicializa el manager y cachea elementos DOM
     */
    init(): void;
    /**
     * Cachea elementos DOM frecuentemente utilizados
     */
    cacheElements(): void;
    /**
     * Vincula eventos globales
     */
    bindEvents(): void;
    /**
     * === MÉTODOS PARA TOP NAVIGATION ===
     */
    /**
     * Muestra la navegación superior
     */
    showTopNav(): void;
    /**
     * Oculta la navegación superior
     */
    hideTopNav(): void;
    /**
     * Alterna la visibilidad de la navegación superior
     */
    toggleTopNav(): void;
    /**
     * === MÉTODOS PARA DRAWER MENU ===
     */
    /**
     * Abre el menú drawer
     */
    openDrawer(): void;
    /**
     * Cierra el menú drawer
     */
    closeDrawer(): void;
    /**
     * Alterna el menú drawer
     */
    toggleDrawer(): void;
    /**
     * === MÉTODOS PARA GRID ENHANCEMENT ===
     */
    /**
     * Activa el modo grid mejorado
     */
    enableGridEnhancement(): void;
    /**
     * Desactiva el modo grid mejorado
     */
    disableGridEnhancement(): void;
    /**
     * GRID ENHANCEMENT - Activa/desactiva modo grid mejorado
     * Ahora utiliza clases BEM optimizadas
     */
    toggleGridEnhancement(force?: null): boolean;
    /**
     * Aplica clases BEM optimizadas para grid enhancement
     */
    applyEnhancedGridClasses(): void;
    /**
     * Remueve clases BEM optimizadas para grid enhancement
     */
    removeEnhancedGridClasses(): void;
    /**
     * Aplica clases de tipo de grid según contexto
     */
    applyGridTypeClasses(): void;
    /**
     * === MÉTODOS PARA VIEW MODE ===
     */
    /**
     * Cambia el modo de vista
     * @param {string} mode - 'list' | 'grid'
     */
    setViewMode(mode: string): void;
    /**
     * === MÉTODOS PARA ORDER MODE ===
     */
    /**
     * Activa el modo de pedidos
     */
    enableOrderMode(): void;
    /**
     * Desactiva el modo de pedidos
     */
    disableOrderMode(): void;
    /**
     * ORDER MODE - Activa/desactiva modo de pedidos
     * Ahora utiliza clases BEM optimizadas
     */
    toggleOrderMode(force?: null): boolean;
    /**
     * Aplica clases BEM optimizadas para order mode
     */
    applyOrderModeClasses(): void;
    /**
     * Remueve clases BEM optimizadas para order mode
     */
    removeOrderModeClasses(): void;
    /**
     * === MÉTODOS UTILITARIOS PARA CLASES CSS ===
     */
    /**
     * Agrega una clase a un elemento
     * @param {Element} element - Elemento DOM
     * @param {string} className - Nombre de la clase
     */
    addClass(element: Element, className: string): void;
    /**
     * Remueve una clase de un elemento
     * @param {Element} element - Elemento DOM
     * @param {string} className - Nombre de la clase
     */
    removeClass(element: Element, className: string): void;
    /**
     * Alterna una clase en un elemento
     * @param {Element} element - Elemento DOM
     * @param {string} className - Nombre de la clase
     * @param {boolean} force - Forzar estado (opcional)
     */
    toggleClass(element: Element, className: string, force: boolean): void;
    /**
     * Verifica si un elemento tiene una clase
     * @param {Element} element - Elemento DOM
     * @param {string} className - Nombre de la clase
     * @returns {boolean}
     */
    hasClass(element: Element, className: string): boolean;
    /**
     * === MÉTODOS DE ESTADO ===
     */
    /**
     * Obtiene el estado actual
     * @returns {Object} Estado actual
     */
    getState(): Object;
    /**
     * Maneja cambios de estado externos
     * @param {Object} stateChange - Cambio de estado
     */
    handleStateChange(stateChange: Object): void;
    /**
     * Emite un evento de cambio de estado
     * @param {string} property - Propiedad que cambió
     * @param {*} value - Nuevo valor
     */
    emitStateChange(property: string, value: any): void;
    /**
     * === MÉTODOS DE COMPATIBILIDAD LEGACY ===
     */
    /**
     * Mapea clases legacy a clases BEM
     * @param {string} legacyClass - Clase legacy
     * @returns {string} Clase BEM equivalente
     */
    mapLegacyToBEM(legacyClass: string): string;
    /**
     * Aplica clase con mapeo automático legacy -> BEM
     * @param {Element} element - Elemento DOM
     * @param {string} className - Clase (legacy o BEM)
     */
    addClassWithMapping(element: Element, className: string): void;
    /**
     * Remueve clase con mapeo automático legacy -> BEM
     * @param {Element} element - Elemento DOM
     * @param {string} className - Clase (legacy o BEM)
     */
    removeClassWithMapping(element: Element, className: string): void;
}
//# sourceMappingURL=CSSClassManager.d.ts.map