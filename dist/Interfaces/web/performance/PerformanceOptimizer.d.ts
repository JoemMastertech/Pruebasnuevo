/**
 * Performance Optimizer - Fase 4
 *
 * Optimizaciones de performance para rendering CSS y event handling
 * Implementa técnicas avanzadas de optimización para UI controllers
 */
export interface PerformanceMetrics {
    renderTime: number;
    eventHandlingTime: number;
    memoryUsage: number;
    domNodes: number;
    cssRules: number;
    timestamp: number;
    cssOptimizationTime: number;
}
export interface OptimizationConfig {
    enableVirtualization: boolean;
    enableLazyLoading: boolean;
    enableCSSOptimization: boolean;
    enableEventDelegation: boolean;
    enableMemoryOptimization: boolean;
    debounceDelay: number;
    throttleDelay: number;
    maxDOMNodes: number;
}
export declare class PerformanceOptimizer {
    private config;
    private metrics;
    private observers;
    private rafId;
    private isOptimizing;
    private cssCache;
    private eventCache;
    constructor(config?: Partial<OptimizationConfig>);
    /**
     * Inicializar optimizador
     */
    private initialize;
    /**
     * Optimizar rendering de componentes
     */
    optimizeRendering(element: HTMLElement, data: any[]): Promise<void>;
    /**
     * Rendering virtualizado para listas grandes
     */
    private virtualizeRendering;
    /**
     * Renderizar items visibles
     */
    private renderVisibleItems;
    /**
     * Crear elemento de item (debe ser implementado por el componente)
     */
    private createItemElement;
    /**
     * Rendering estándar optimizado
     */
    private standardRendering;
    /**
     * Optimizar event handling
     */
    optimizeEventHandling(container: HTMLElement): void;
    /**
     * Crear handler delegado
     */
    private createDelegatedHandler;
    /**
     * Extraer datos del elemento
     */
    private extractElementData;
    /**
     * Remover event listeners existentes
     */
    private removeExistingListeners;
    /**
     * Optimizar CSS
     */
    optimizeCSS(): void;
    /**
     * Remover CSS no utilizado
     */
    private removeUnusedCSS;
    /**
     * Verificar si un selector está siendo utilizado
     */
    private isSelectorUsed;
    /**
     * Optimizar selectores CSS
     */
    private optimizeCSSSelectors;
    /**
     * Minimizar reflows y repaints
     */
    private minimizeReflows;
    /**
     * Configurar optimización de memoria
     */
    private setupMemoryOptimization;
    /**
     * Manejar lazy loading
     */
    private handleLazyLoading;
    /**
     * Manejar mutaciones DOM
     */
    private handleDOMMutations;
    /**
     * Configurar optimización CSS
     */
    private setupCSSOptimization;
    /**
     * Precargar CSS crítico
     */
    private preloadCriticalCSS;
    /**
     * Optimizar CSS custom properties
     */
    private optimizeCSSCustomProperties;
    /**
     * Iniciar monitoreo de performance
     */
    private startPerformanceMonitoring;
    /**
     * Recopilar métricas
     */
    private collectMetrics;
    /**
     * Obtener uso de memoria
     */
    private getMemoryUsage;
    /**
     * Obtener cantidad de reglas CSS
     */
    private getCSSRulesCount;
    /**
     * Registrar métrica
     */
    private recordMetric;
    /**
     * Throttle function
     */
    private throttle;
    /**
     * Debounce function
     */
    private debounce;
    /**
     * Obtener métricas de performance
     */
    getMetrics(): PerformanceMetrics[];
    /**
     * Obtener resumen de performance
     */
    getPerformanceSummary(): any;
    /**
     * Destruir optimizador
     */
    destroy(): void;
    /**
     * Logging
     */
    private log;
}
export default PerformanceOptimizer;
//# sourceMappingURL=PerformanceOptimizer.d.ts.map