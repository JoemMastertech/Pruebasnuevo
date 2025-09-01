"use strict";
/**
 * Test de exposición global para Fase 3
 * Verifica que todos los adaptadores y puertos registrados en el DI Container
 * estén accesibles desde el namespace global según contrato
 */
class Phase3GlobalExposureTest {
    constructor() {
        this.expectedAdapters = [
            'BaseAdapter',
            'ProductDataAdapter',
            'AIInterface',
            'SupabaseAdapterTS'
        ];
        this.expectedPorts = [
            'OrderRepositoryPort',
            'ProductRepositoryPort',
            'DrinkRulesPort',
            'EventBusPort'
        ];
        this.expectedUseCases = [
            'CreateOrderUseCase',
            'ValidateProductUseCase',
            'AddProductToOrderUseCase',
            'ValidateOrderUseCase'
        ];
        this.results = {
            adapters: {},
            ports: {},
            useCases: {},
            global: {},
            summary: {}
        };
    }
    /**
     * Ejecuta todos los tests de exposición global
     */
    async runAllTests() {
        console.log('🧪 INICIANDO TESTS DE EXPOSICIÓN GLOBAL - FASE 3');
        console.log('='.repeat(60));
        try {
            // Test 1: Verificar HexagonalContainer disponible
            await this.testHexagonalContainerAvailability();
            // Test 2: Verificar adaptadores en DI Container
            await this.testAdaptersInContainer();
            // Test 3: Verificar puertos en DI Container
            await this.testPortsInContainer();
            // Test 4: Verificar casos de uso en DI Container
            await this.testUseCasesInContainer();
            // Test 5: Verificar exposición global de adaptadores
            await this.testGlobalAdapterExposure();
            // Test 6: Verificar _bem-base.css cargado
            await this.testBemBaseCssLoaded();
            // Generar resumen final
            this.generateSummary();
            return this.results;
        }
        catch (error) {
            console.error('❌ Error ejecutando tests:', error);
            throw error;
        }
    }
    /**
     * Test 1: Verificar disponibilidad de HexagonalContainer
     */
    async testHexagonalContainerAvailability() {
        console.log('\n📦 Test 1: Disponibilidad de HexagonalContainer');
        const containerAvailable = typeof window.HexagonalContainer !== 'undefined';
        const bootstrapAvailable = typeof window.HexagonalBootstrap !== 'undefined';
        this.results.global.containerAvailable = containerAvailable;
        this.results.global.bootstrapAvailable = bootstrapAvailable;
        console.log(`   HexagonalContainer: ${containerAvailable ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   HexagonalBootstrap: ${bootstrapAvailable ? '✅ PASS' : '❌ FAIL'}`);
        if (!containerAvailable) {
            throw new Error('HexagonalContainer no está disponible globalmente');
        }
    }
    /**
     * Test 2: Verificar adaptadores en DI Container
     */
    async testAdaptersInContainer() {
        console.log('\n🔌 Test 2: Adaptadores en DI Container');
        const container = window.HexagonalContainer;
        for (const adapter of this.expectedAdapters) {
            try {
                const resolved = container.resolve(adapter);
                const success = resolved !== null && resolved !== undefined;
                this.results.adapters[adapter] = {
                    resolvable: success,
                    instance: success ? typeof resolved : null,
                    error: null
                };
                console.log(`   ${adapter}: ${success ? '✅ PASS' : '❌ FAIL'}`);
                if (!success) {
                    console.log(`      Error: No se pudo resolver ${adapter}`);
                }
            }
            catch (error) {
                this.results.adapters[adapter] = {
                    resolvable: false,
                    instance: null,
                    error: error.message
                };
                console.log(`   ${adapter}: ❌ FAIL (${error.message})`);
            }
        }
    }
    /**
     * Test 3: Verificar puertos en DI Container
     */
    async testPortsInContainer() {
        console.log('\n🚪 Test 3: Puertos en DI Container');
        const container = window.HexagonalContainer;
        for (const port of this.expectedPorts) {
            try {
                const resolved = container.resolve(port);
                const success = resolved !== null && resolved !== undefined;
                this.results.ports[port] = {
                    resolvable: success,
                    instance: success ? typeof resolved : null,
                    error: null
                };
                console.log(`   ${port}: ${success ? '✅ PASS' : '❌ FAIL'}`);
                if (!success) {
                    console.log(`      Error: No se pudo resolver ${port}`);
                }
            }
            catch (error) {
                this.results.ports[port] = {
                    resolvable: false,
                    instance: null,
                    error: error.message
                };
                console.log(`   ${port}: ❌ FAIL (${error.message})`);
            }
        }
    }
    /**
     * Test 4: Verificar casos de uso en DI Container
     */
    async testUseCasesInContainer() {
        console.log('\n⚙️ Test 4: Casos de Uso en DI Container');
        const container = window.HexagonalContainer;
        for (const useCase of this.expectedUseCases) {
            try {
                const resolved = container.resolve(useCase);
                const success = resolved !== null && resolved !== undefined;
                this.results.useCases[useCase] = {
                    resolvable: success,
                    instance: success ? typeof resolved : null,
                    error: null
                };
                console.log(`   ${useCase}: ${success ? '✅ PASS' : '❌ FAIL'}`);
                if (!success) {
                    console.log(`      Error: No se pudo resolver ${useCase}`);
                }
            }
            catch (error) {
                this.results.useCases[useCase] = {
                    resolvable: false,
                    instance: null,
                    error: error.message
                };
                console.log(`   ${useCase}: ❌ FAIL (${error.message})`);
            }
        }
    }
    /**
     * Test 5: Verificar exposición global de adaptadores
     */
    async testGlobalAdapterExposure() {
        console.log('\n🌐 Test 5: Exposición Global de Adaptadores');
        for (const adapter of this.expectedAdapters) {
            const globallyAvailable = typeof window[adapter] !== 'undefined';
            this.results.global[adapter] = {
                available: globallyAvailable,
                type: globallyAvailable ? typeof window[adapter] : null
            };
            console.log(`   window.${adapter}: ${globallyAvailable ? '✅ PASS' : '❌ FAIL'}`);
            if (!globallyAvailable) {
                console.log(`      Error: ${adapter} no está expuesto globalmente`);
            }
        }
    }
    /**
     * Test 6: Verificar _bem-base.css cargado
     */
    async testBemBaseCssLoaded() {
        console.log('\n🎨 Test 6: _bem-base.css Cargado');
        const stylesheets = Array.from(document.styleSheets);
        const bemBaseLoaded = stylesheets.some(sheet => sheet.href && sheet.href.includes('_bem-base.css'));
        this.results.global.bemBaseCssLoaded = bemBaseLoaded;
        console.log(`   _bem-base.css: ${bemBaseLoaded ? '✅ PASS' : '❌ FAIL'}`);
        if (!bemBaseLoaded) {
            console.log('      Error: _bem-base.css no está cargado');
        }
    }
    /**
     * Genera resumen final de todos los tests
     */
    generateSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMEN FINAL DE TESTS DE EXPOSICIÓN GLOBAL');
        console.log('='.repeat(60));
        // Contar éxitos y fallos
        let totalTests = 0;
        let passedTests = 0;
        // Contar adaptadores
        Object.values(this.results.adapters).forEach(result => {
            totalTests++;
            if (result.resolvable)
                passedTests++;
        });
        // Contar puertos
        Object.values(this.results.ports).forEach(result => {
            totalTests++;
            if (result.resolvable)
                passedTests++;
        });
        // Contar casos de uso
        Object.values(this.results.useCases).forEach(result => {
            totalTests++;
            if (result.resolvable)
                passedTests++;
        });
        // Contar tests globales
        if (this.results.global.containerAvailable)
            passedTests++;
        totalTests++;
        if (this.results.global.bootstrapAvailable)
            passedTests++;
        totalTests++;
        if (this.results.global.bemBaseCssLoaded)
            passedTests++;
        totalTests++;
        // Contar exposición global de adaptadores
        this.expectedAdapters.forEach(adapter => {
            totalTests++;
            if (this.results.global[adapter] && this.results.global[adapter].available) {
                passedTests++;
            }
        });
        const successRate = ((passedTests / totalTests) * 100).toFixed(1);
        this.results.summary = {
            totalTests,
            passedTests,
            failedTests: totalTests - passedTests,
            successRate: parseFloat(successRate)
        };
        console.log(`\n📈 RESULTADO: ${passedTests}/${totalTests} tests pasados (${successRate}%)`);
        if (passedTests === totalTests) {
            console.log('\n🎉 ¡TODOS LOS TESTS PASARON! FASE 3 COMPLETADA AL 100%');
            console.log('\n🏆 CRITERIOS DE ACEPTACIÓN CUMPLIDOS:');
            console.log('   ✅ Todos los tests en verde');
            console.log('   ✅ _bem-base.css cargado automáticamente');
            console.log('   ✅ Adaptadores y puertos accesibles globalmente');
            console.log('   ✅ Contrato de exposición global cumplido');
        }
        else {
            console.log('\n⚠️ TESTS FALLIDOS:');
            // Mostrar fallos específicos
            Object.entries(this.results.adapters).forEach(([name, result]) => {
                if (!result.resolvable) {
                    console.log(`   ❌ Adapter ${name}: ${result.error || 'No resolvible'}`);
                }
            });
            Object.entries(this.results.ports).forEach(([name, result]) => {
                if (!result.resolvable) {
                    console.log(`   ❌ Port ${name}: ${result.error || 'No resolvible'}`);
                }
            });
            Object.entries(this.results.useCases).forEach(([name, result]) => {
                if (!result.resolvable) {
                    console.log(`   ❌ UseCase ${name}: ${result.error || 'No resolvible'}`);
                }
            });
            this.expectedAdapters.forEach(adapter => {
                if (!this.results.global[adapter] || !this.results.global[adapter].available) {
                    console.log(`   ❌ Global ${adapter}: No expuesto globalmente`);
                }
            });
            if (!this.results.global.bemBaseCssLoaded) {
                console.log('   ❌ _bem-base.css: No cargado');
            }
        }
        console.log('\n' + '='.repeat(60));
    }
    /**
     * Método estático para ejecutar tests desde consola
     */
    static async run() {
        const test = new Phase3GlobalExposureTest();
        return await test.runAllTests();
    }
}
// Exponer globalmente para uso en consola
window.Phase3GlobalExposureTest = Phase3GlobalExposureTest;
// Auto-ejecutar si se carga como script independiente
if (typeof module === 'undefined') {
    // Esperar a que el DOM y HexagonalBootstrap estén listos
    const waitForBootstrap = () => {
        if (typeof window.HexagonalBootstrap !== 'undefined' && window.HexagonalBootstrap.isReady()) {
            Phase3GlobalExposureTest.run().catch(console.error);
        }
        else {
            setTimeout(waitForBootstrap, 100);
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForBootstrap);
    }
    else {
        waitForBootstrap();
    }
}
//# sourceMappingURL=phase3-global-exposure-test.js.map