/**
 * FASE 3 - TESTS DE INTEGRACIÓN ESPECÍFICOS
 * Validación completa de infraestructura, adaptadores y CSS variables
 * Requisitos para cierre formal de Fase 3
 */
class Phase3IntegrationTests {
    constructor() {
        this.testResults = {
            adaptersValidation: { passed: 0, failed: 0, details: [] },
            cssVariablesSystem: { passed: 0, failed: 0, details: [] },
            diContainerIntegration: { passed: 0, failed: 0, details: [] },
            gridSystemModular: { passed: 0, failed: 0, details: [] },
            overallStatus: 'PENDING'
        };
    }
    /**
     * Ejecutar todos los tests de integración de Fase 3
     */
    async runAllTests() {
        console.log('🔧 INICIANDO TESTS DE INTEGRACIÓN - FASE 3');
        console.log('='.repeat(60));
        try {
            await this.testAdaptersValidation();
            await this.testCSSVariablesSystem();
            await this.testDIContainerIntegration();
            await this.testGridSystemModular();
            this.calculateOverallStatus();
            this.generateReport();
        }
        catch (error) {
            console.error('❌ Error crítico en tests de Fase 3:', error);
            this.testResults.overallStatus = 'CRITICAL_FAILURE';
        }
        return this.testResults;
    }
    /**
     * Test 1: Validación de todos los adaptadores migrados
     */
    async testAdaptersValidation() {
        console.log('\n📋 Test 1: Validación de Adaptadores');
        const adaptersToTest = [
            { name: 'BaseAdapter', path: 'Infraestructura/adapters/BaseAdapter.js' },
            { name: 'ProductDataAdapter', path: 'Infraestructura/adapters/ProductDataAdapter.js' },
            { name: 'SupabaseAdapterTS', path: 'Infraestructura/adapters/SupabaseAdapterTS.ts' },
            { name: 'AIInterface', path: 'Infraestructura/integrations/AIInterface.js' }
        ];
        for (const adapter of adaptersToTest) {
            try {
                // Test 1.1: Verificar existencia del adaptador
                const exists = await this.checkAdapterExists(adapter.name);
                if (exists) {
                    this.testResults.adaptersValidation.passed++;
                    this.testResults.adaptersValidation.details.push(`✅ ${adapter.name}: Existe y es accesible`);
                }
                else {
                    this.testResults.adaptersValidation.failed++;
                    this.testResults.adaptersValidation.details.push(`❌ ${adapter.name}: No encontrado o no accesible`);
                }
                // Test 1.2: Verificar integración en DI Container
                const integrated = await this.checkDIIntegration(adapter.name);
                if (integrated) {
                    this.testResults.adaptersValidation.passed++;
                    this.testResults.adaptersValidation.details.push(`✅ ${adapter.name}: Integrado en DI Container`);
                }
                else {
                    this.testResults.adaptersValidation.failed++;
                    this.testResults.adaptersValidation.details.push(`⚠️ ${adapter.name}: No integrado en DI Container`);
                }
            }
            catch (error) {
                this.testResults.adaptersValidation.failed++;
                this.testResults.adaptersValidation.details.push(`❌ ${adapter.name}: Error en validación - ${error.message}`);
            }
        }
    }
    /**
     * Test 2: Sistema completo de CSS variables
     */
    async testCSSVariablesSystem() {
        console.log('\n🎨 Test 2: Sistema de CSS Variables');
        const cssTests = [
            { name: 'Variables Unificadas', selector: ':root', property: '--primary' },
            { name: 'Breakpoints Responsive', selector: ':root', property: '--bp-mobile' },
            { name: 'Grid System Variables', selector: ':root', property: '--grid-columns-mobile' },
            { name: 'Spacing System', selector: ':root', property: '--spacing-xs' },
            { name: 'Typography Variables', selector: ':root', property: '--font-size-base' }
        ];
        for (const test of cssTests) {
            try {
                const value = getComputedStyle(document.documentElement)
                    .getPropertyValue(test.property).trim();
                if (value && value !== '') {
                    this.testResults.cssVariablesSystem.passed++;
                    this.testResults.cssVariablesSystem.details.push(`✅ ${test.name}: ${test.property} = ${value}`);
                }
                else {
                    this.testResults.cssVariablesSystem.failed++;
                    this.testResults.cssVariablesSystem.details.push(`❌ ${test.name}: ${test.property} no definida`);
                }
            }
            catch (error) {
                this.testResults.cssVariablesSystem.failed++;
                this.testResults.cssVariablesSystem.details.push(`❌ ${test.name}: Error - ${error.message}`);
            }
        }
        // Test adicional: Verificar archivos CSS cargados
        const cssFiles = [
            '_variables-unified.css',
            '_grid-system.css',
            '_bem-base.css'
        ];
        for (const file of cssFiles) {
            const loaded = this.checkCSSFileLoaded(file);
            if (loaded) {
                this.testResults.cssVariablesSystem.passed++;
                this.testResults.cssVariablesSystem.details.push(`✅ Archivo CSS: ${file} cargado correctamente`);
            }
            else {
                this.testResults.cssVariablesSystem.failed++;
                this.testResults.cssVariablesSystem.details.push(`❌ Archivo CSS: ${file} no encontrado`);
            }
        }
    }
    /**
     * Test 3: Integración del DI Container hexagonal
     */
    async testDIContainerIntegration() {
        console.log('\n🔧 Test 3: DI Container Hexagonal');
        try {
            // Test 3.1: Verificar HexagonalContainer existe
            const containerExists = typeof window.HexagonalContainer !== 'undefined' ||
                typeof window.HexagonalOrderCore !== 'undefined';
            if (containerExists) {
                this.testResults.diContainerIntegration.passed++;
                this.testResults.diContainerIntegration.details.push('✅ HexagonalContainer: Disponible globalmente');
            }
            else {
                this.testResults.diContainerIntegration.failed++;
                this.testResults.diContainerIntegration.details.push('❌ HexagonalContainer: No disponible globalmente');
            }
            // Test 3.2: Verificar casos de uso registrados
            const useCases = [
                'CreateOrderUseCase',
                'ValidateProductUseCase',
                'AddProductToOrderUseCase',
                'ValidateOrderUseCase'
            ];
            for (const useCase of useCases) {
                try {
                    const instance = this.getDIInstance(useCase);
                    if (instance) {
                        this.testResults.diContainerIntegration.passed++;
                        this.testResults.diContainerIntegration.details.push(`✅ Caso de Uso: ${useCase} registrado y resuelto`);
                    }
                    else {
                        this.testResults.diContainerIntegration.failed++;
                        this.testResults.diContainerIntegration.details.push(`❌ Caso de Uso: ${useCase} no registrado`);
                    }
                }
                catch (error) {
                    this.testResults.diContainerIntegration.failed++;
                    this.testResults.diContainerIntegration.details.push(`❌ Caso de Uso: ${useCase} error - ${error.message}`);
                }
            }
            // Test 3.3: Verificar puertos registrados
            const ports = [
                'OrderRepositoryPort',
                'ProductRepositoryPort',
                'DrinkRulesPort',
                'EventBusPort'
            ];
            for (const port of ports) {
                try {
                    const instance = this.getDIInstance(port);
                    if (instance) {
                        this.testResults.diContainerIntegration.passed++;
                        this.testResults.diContainerIntegration.details.push(`✅ Puerto: ${port} registrado y resuelto`);
                    }
                    else {
                        this.testResults.diContainerIntegration.failed++;
                        this.testResults.diContainerIntegration.details.push(`❌ Puerto: ${port} no registrado`);
                    }
                }
                catch (error) {
                    this.testResults.diContainerIntegration.failed++;
                    this.testResults.diContainerIntegration.details.push(`❌ Puerto: ${port} error - ${error.message}`);
                }
            }
        }
        catch (error) {
            this.testResults.diContainerIntegration.failed++;
            this.testResults.diContainerIntegration.details.push(`❌ Error general en DI Container: ${error.message}`);
        }
    }
    /**
     * Test 4: Grid system modular
     */
    async testGridSystemModular() {
        console.log('\n📐 Test 4: Grid System Modular');
        // Test 4.1: Verificar clases BEM de grid
        const gridClasses = [
            '.grid',
            '.grid--products',
            '.grid--categories',
            '.grid--compact',
            '.grid--spacious'
        ];
        for (const className of gridClasses) {
            const element = document.querySelector(className);
            if (element) {
                this.testResults.gridSystemModular.passed++;
                this.testResults.gridSystemModular.details.push(`✅ Clase Grid: ${className} encontrada en DOM`);
            }
            else {
                this.testResults.gridSystemModular.failed++;
                this.testResults.gridSystemModular.details.push(`❌ Clase Grid: ${className} no encontrada en DOM`);
            }
        }
        // Test 4.2: Verificar variables de grid responsive
        const gridVariables = [
            '--grid-columns-mobile',
            '--grid-columns-tablet',
            '--grid-columns-desktop',
            '--grid-gap-standard',
            '--grid-padding-standard'
        ];
        for (const variable of gridVariables) {
            const value = getComputedStyle(document.documentElement)
                .getPropertyValue(variable).trim();
            if (value && value !== '') {
                this.testResults.gridSystemModular.passed++;
                this.testResults.gridSystemModular.details.push(`✅ Variable Grid: ${variable} = ${value}`);
            }
            else {
                this.testResults.gridSystemModular.failed++;
                this.testResults.gridSystemModular.details.push(`❌ Variable Grid: ${variable} no definida`);
            }
        }
        // Test 4.3: Verificar responsividad del grid
        const testElement = document.createElement('div');
        testElement.className = 'grid grid--products';
        document.body.appendChild(testElement);
        try {
            const computedStyle = getComputedStyle(testElement);
            const display = computedStyle.display;
            const gridTemplateColumns = computedStyle.gridTemplateColumns;
            if (display === 'grid' && gridTemplateColumns !== 'none') {
                this.testResults.gridSystemModular.passed++;
                this.testResults.gridSystemModular.details.push(`✅ Grid Funcional: display=${display}, columns=${gridTemplateColumns}`);
            }
            else {
                this.testResults.gridSystemModular.failed++;
                this.testResults.gridSystemModular.details.push(`❌ Grid No Funcional: display=${display}, columns=${gridTemplateColumns}`);
            }
        }
        finally {
            document.body.removeChild(testElement);
        }
    }
    /**
     * Métodos auxiliares
     */
    async checkAdapterExists(adapterName) {
        try {
            // Verificar en window global
            if (typeof window !== 'undefined' && window[adapterName]) {
                return true;
            }
            // Verificar en HexagonalContainer si existe
            if (typeof window !== 'undefined' && window.HexagonalOrderCore) {
                const container = window.HexagonalOrderCore;
                return container.isRegistered && container.isRegistered(adapterName);
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    async checkDIIntegration(adapterName) {
        try {
            if (typeof window !== 'undefined' && window.HexagonalOrderCore) {
                const container = window.HexagonalOrderCore;
                return container.isRegistered && container.isRegistered(adapterName);
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    checkCSSFileLoaded(fileName) {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        for (const link of links) {
            if (link.href.includes(fileName)) {
                return true;
            }
        }
        return false;
    }
    getDIInstance(key) {
        try {
            if (typeof window !== 'undefined' && window.HexagonalOrderCore) {
                const container = window.HexagonalOrderCore;
                return container.resolve && container.resolve(key);
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    calculateOverallStatus() {
        const totalPassed = Object.values(this.testResults)
            .filter(result => typeof result === 'object' && result.passed !== undefined)
            .reduce((sum, result) => sum + result.passed, 0);
        const totalFailed = Object.values(this.testResults)
            .filter(result => typeof result === 'object' && result.failed !== undefined)
            .reduce((sum, result) => sum + result.failed, 0);
        const totalTests = totalPassed + totalFailed;
        const successRate = totalTests > 0 ? (totalPassed / totalTests * 100).toFixed(2) : 0;
        if (successRate >= 95) {
            this.testResults.overallStatus = 'PASS';
        }
        else if (successRate >= 80) {
            this.testResults.overallStatus = 'PASS_WITH_WARNINGS';
        }
        else {
            this.testResults.overallStatus = 'FAIL';
        }
        this.testResults.successRate = successRate;
        this.testResults.totalTests = totalTests;
        this.testResults.totalPassed = totalPassed;
        this.testResults.totalFailed = totalFailed;
    }
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 REPORTE FINAL - TESTS DE INTEGRACIÓN FASE 3');
        console.log('='.repeat(60));
        console.log(`\n🎯 ESTADO GENERAL: ${this.testResults.overallStatus}`);
        console.log(`📈 TASA DE ÉXITO: ${this.testResults.successRate}%`);
        console.log(`✅ TESTS PASADOS: ${this.testResults.totalPassed}`);
        console.log(`❌ TESTS FALLIDOS: ${this.testResults.totalFailed}`);
        console.log(`📊 TOTAL TESTS: ${this.testResults.totalTests}`);
        // Detalles por categoría
        Object.entries(this.testResults).forEach(([category, result]) => {
            if (typeof result === 'object' && result.details) {
                console.log(`\n📋 ${category.toUpperCase()}:`);
                result.details.forEach(detail => console.log(`  ${detail}`));
            }
        });
        // Recomendaciones
        console.log('\n💡 RECOMENDACIONES PARA CIERRE DE FASE 3:');
        if (this.testResults.overallStatus === 'PASS') {
            console.log('  ✅ Fase 3 lista para cierre formal');
            console.log('  ✅ Proceder con Fase 4: UI + CSS Final');
        }
        else {
            console.log('  ⚠️ Resolver issues pendientes antes del cierre');
            console.log('  ⚠️ Completar integración de adaptadores faltantes');
            console.log('  ⚠️ Validar sistema CSS variables completo');
        }
        console.log('\n' + '='.repeat(60));
    }
}
// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Phase3IntegrationTests = Phase3IntegrationTests;
}
export default Phase3IntegrationTests;
//# sourceMappingURL=phase3-integration-tests.js.map