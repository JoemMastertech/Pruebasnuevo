/**
 * Test de exposición global para Fase 3
 * Verifica que todos los adaptadores y puertos registrados en el DI Container
 * estén accesibles desde el namespace global según contrato
 */
declare class Phase3GlobalExposureTest {
    /**
     * Método estático para ejecutar tests desde consola
     */
    static run(): Promise<{
        adapters: {};
        ports: {};
        useCases: {};
        global: {};
        summary: {};
    }>;
    expectedAdapters: string[];
    expectedPorts: string[];
    expectedUseCases: string[];
    results: {
        adapters: {};
        ports: {};
        useCases: {};
        global: {};
        summary: {};
    };
    /**
     * Ejecuta todos los tests de exposición global
     */
    runAllTests(): Promise<{
        adapters: {};
        ports: {};
        useCases: {};
        global: {};
        summary: {};
    }>;
    /**
     * Test 1: Verificar disponibilidad de HexagonalContainer
     */
    testHexagonalContainerAvailability(): Promise<void>;
    /**
     * Test 2: Verificar adaptadores en DI Container
     */
    testAdaptersInContainer(): Promise<void>;
    /**
     * Test 3: Verificar puertos en DI Container
     */
    testPortsInContainer(): Promise<void>;
    /**
     * Test 4: Verificar casos de uso en DI Container
     */
    testUseCasesInContainer(): Promise<void>;
    /**
     * Test 5: Verificar exposición global de adaptadores
     */
    testGlobalAdapterExposure(): Promise<void>;
    /**
     * Test 6: Verificar _bem-base.css cargado
     */
    testBemBaseCssLoaded(): Promise<void>;
    /**
     * Genera resumen final de todos los tests
     */
    generateSummary(): void;
}
//# sourceMappingURL=phase3-global-exposure-test.d.ts.map