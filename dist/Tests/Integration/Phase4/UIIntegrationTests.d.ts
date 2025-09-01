/**
 * UI Integration Tests - Fase 4
 *
 * Tests de integración para validar la interacción completa entre
 * controladores, presenters, event handlers y componentes UI
 */
interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    duration: number;
}
declare class UIIntegrationTestSuite {
    private results;
    private container;
    private orderController;
    private productController;
    private orderPresenter;
    private productPresenter;
    private eventHandler;
    private orderSystemComponent;
    private productGridComponent;
    private performanceOptimizer;
    constructor();
    private setupComponents;
    runTest(name: string, testFn: () => Promise<void> | void): Promise<void>;
    runAllTests(): Promise<void>;
    private cleanup;
    private showSummary;
    getResults(): TestResult[];
}
export { UIIntegrationTestSuite, TestResult };
//# sourceMappingURL=UIIntegrationTests.d.ts.map