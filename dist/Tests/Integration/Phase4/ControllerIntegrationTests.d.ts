/**
 * Controller Integration Tests - Fase 4
 *
 * Tests de integración para OrderController y ProductController
 * Valida la integración con presenters y event handling
 */
/**
 * Test Suite para Controllers de Fase 4
 */
export declare class ControllerIntegrationTests {
    private container;
    private orderController;
    private productController;
    private orderPresenter;
    private productPresenter;
    private eventHandler;
    private testContainer;
    private testResults;
    constructor();
    /**
     * Configurar entorno de pruebas
     */
    private setupTestEnvironment;
    /**
     * Ejecutar todas las pruebas
     */
    runAllTests(): Promise<void>;
    /**
     * Test 1: Operaciones básicas del OrderController
     */
    private testOrderControllerBasicOperations;
    /**
     * Test 2: Operaciones básicas del ProductController
     */
    private testProductControllerBasicOperations;
    /**
     * Test 3: Integración Controller-Presenter
     */
    private testControllerPresenterIntegration;
    /**
     * Test 4: Integración con EventHandler
     */
    private testEventHandlerIntegration;
    /**
     * Test 5: Manejo de errores en Controllers
     */
    private testControllerErrorHandling;
    /**
     * Test 6: Performance de Controllers
     */
    private testControllerPerformance;
    /**
     * Test 7: Gestión de memoria
     */
    private testControllerMemoryManagement;
    /**
     * Crear producto de prueba
     */
    private createTestProduct;
    /**
     * Contar event listeners (aproximación)
     */
    private countEventListeners;
    /**
     * Función de aserción
     */
    private assert;
    /**
     * Imprimir resultados de tests
     */
    private printTestResults;
    /**
     * Limpiar entorno de pruebas
     */
    private cleanup;
    /**
     * Método estático para ejecutar tests
     */
    static run(): Promise<void>;
}
export default ControllerIntegrationTests;
//# sourceMappingURL=ControllerIntegrationTests.d.ts.map