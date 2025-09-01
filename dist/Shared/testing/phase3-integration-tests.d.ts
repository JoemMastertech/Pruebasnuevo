export default Phase3IntegrationTests;
/**
 * FASE 3 - TESTS DE INTEGRACIÓN ESPECÍFICOS
 * Validación completa de infraestructura, adaptadores y CSS variables
 * Requisitos para cierre formal de Fase 3
 */
declare class Phase3IntegrationTests {
    testResults: {
        adaptersValidation: {
            passed: number;
            failed: number;
            details: never[];
        };
        cssVariablesSystem: {
            passed: number;
            failed: number;
            details: never[];
        };
        diContainerIntegration: {
            passed: number;
            failed: number;
            details: never[];
        };
        gridSystemModular: {
            passed: number;
            failed: number;
            details: never[];
        };
        overallStatus: string;
    };
    /**
     * Ejecutar todos los tests de integración de Fase 3
     */
    runAllTests(): Promise<{
        adaptersValidation: {
            passed: number;
            failed: number;
            details: never[];
        };
        cssVariablesSystem: {
            passed: number;
            failed: number;
            details: never[];
        };
        diContainerIntegration: {
            passed: number;
            failed: number;
            details: never[];
        };
        gridSystemModular: {
            passed: number;
            failed: number;
            details: never[];
        };
        overallStatus: string;
    }>;
    /**
     * Test 1: Validación de todos los adaptadores migrados
     */
    testAdaptersValidation(): Promise<void>;
    /**
     * Test 2: Sistema completo de CSS variables
     */
    testCSSVariablesSystem(): Promise<void>;
    /**
     * Test 3: Integración del DI Container hexagonal
     */
    testDIContainerIntegration(): Promise<void>;
    /**
     * Test 4: Grid system modular
     */
    testGridSystemModular(): Promise<void>;
    /**
     * Métodos auxiliares
     */
    checkAdapterExists(adapterName: any): Promise<any>;
    checkDIIntegration(adapterName: any): Promise<any>;
    checkCSSFileLoaded(fileName: any): boolean;
    getDIInstance(key: any): any;
    calculateOverallStatus(): void;
    generateReport(): void;
}
//# sourceMappingURL=phase3-integration-tests.d.ts.map