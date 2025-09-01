/**
 * Test de Optimización de Performance - Fase 4
 *
 * Pruebas para verificar las optimizaciones de rendering CSS y event handling
 */
declare class PerformanceOptimizationTest {
    private optimizer;
    private testContainer;
    constructor();
    private createTestContainer;
    /**
     * Test de optimización de rendering con virtualización
     */
    testRenderingOptimization(): Promise<boolean>;
    /**
     * Test de optimización de event handling
     */
    testEventHandlingOptimization(): boolean;
    /**
     * Test de optimización CSS
     */
    testCSSOptimization(): boolean;
    /**
     * Test de métricas de performance
     */
    testPerformanceMetrics(): boolean;
    /**
     * Ejecutar todos los tests
     */
    runAllTests(): Promise<void>;
    /**
     * Limpiar recursos de test
     */
    private cleanup;
}
export default PerformanceOptimizationTest;
//# sourceMappingURL=PerformanceOptimizationTest.d.ts.map