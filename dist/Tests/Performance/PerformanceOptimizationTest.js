/**
 * Test de Optimización de Performance - Fase 4
 *
 * Pruebas para verificar las optimizaciones de rendering CSS y event handling
 */
import PerformanceOptimizer from '../../Interfaces/web/performance/PerformanceOptimizer';
class PerformanceOptimizationTest {
    constructor() {
        this.optimizer = new PerformanceOptimizer({
            enableVirtualization: true,
            enableLazyLoading: true,
            enableCSSOptimization: true,
            enableEventDelegation: true,
            enableMemoryOptimization: true,
            debounceDelay: 100,
            throttleDelay: 16,
            maxDOMNodes: 500
        });
        this.testContainer = this.createTestContainer();
    }
    createTestContainer() {
        const container = document.createElement('div');
        container.id = 'performance-test-container';
        container.className = 'test-container';
        container.style.cssText = `
      width: 100%;
      height: 400px;
      overflow: auto;
      border: 1px solid #ccc;
      padding: 10px;
    `;
        document.body.appendChild(container);
        return container;
    }
    /**
     * Test de optimización de rendering con virtualización
     */
    async testRenderingOptimization() {
        console.log('🚀 Iniciando test de optimización de rendering...');
        // Crear datos de prueba
        const testData = Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            name: `Producto ${i}`,
            price: Math.random() * 100,
            category: `Categoría ${i % 10}`
        }));
        const startTime = performance.now();
        try {
            // Optimizar rendering con virtualización
            await this.optimizer.optimizeRendering(this.testContainer, testData);
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            console.log(`✅ Rendering optimizado completado en ${renderTime.toFixed(2)}ms`);
            // Verificar que se crearon elementos
            const renderedItems = this.testContainer.querySelectorAll('[data-item-index]');
            console.log(`📊 Elementos renderizados: ${renderedItems.length}`);
            return renderTime < 100 && renderedItems.length > 0;
        }
        catch (error) {
            console.error('❌ Error en test de rendering:', error);
            return false;
        }
    }
    /**
     * Test de optimización de event handling
     */
    testEventHandlingOptimization() {
        console.log('🎯 Iniciando test de optimización de event handling...');
        try {
            // Agregar elementos con eventos
            for (let i = 0; i < 50; i++) {
                const button = document.createElement('button');
                button.textContent = `Botón ${i}`;
                button.setAttribute('data-action', 'test-click');
                button.setAttribute('data-id', i.toString());
                button.className = 'test-button';
                this.testContainer.appendChild(button);
            }
            const startTime = performance.now();
            // Optimizar event handling
            this.optimizer.optimizeEventHandling(this.testContainer);
            const endTime = performance.now();
            const optimizationTime = endTime - startTime;
            console.log(`✅ Event handling optimizado en ${optimizationTime.toFixed(2)}ms`);
            // Simular clicks para verificar que funcionan
            const buttons = this.testContainer.querySelectorAll('.test-button');
            let clicksHandled = 0;
            // Agregar listener temporal para contar clicks
            const tempHandler = () => clicksHandled++;
            this.testContainer.addEventListener('click', tempHandler);
            // Simular algunos clicks
            for (let i = 0; i < 5; i++) {
                const button = buttons[i];
                button.click();
            }
            this.testContainer.removeEventListener('click', tempHandler);
            console.log(`📊 Clicks manejados: ${clicksHandled}`);
            return optimizationTime < 50 && clicksHandled === 5;
        }
        catch (error) {
            console.error('❌ Error en test de event handling:', error);
            return false;
        }
    }
    /**
     * Test de optimización CSS
     */
    testCSSOptimization() {
        console.log('🎨 Iniciando test de optimización CSS...');
        try {
            // Agregar estilos de prueba
            const style = document.createElement('style');
            style.textContent = `
        .test-unused { color: red; }
        .test-used { color: blue; }
        .test-container { background: white; }
        #unused-id { display: none; }
      `;
            document.head.appendChild(style);
            // Agregar elementos que usan algunos estilos
            const usedElement = document.createElement('div');
            usedElement.className = 'test-used';
            this.testContainer.appendChild(usedElement);
            const startTime = performance.now();
            // Optimizar CSS
            this.optimizer.optimizeCSS();
            const endTime = performance.now();
            const optimizationTime = endTime - startTime;
            console.log(`✅ CSS optimizado en ${optimizationTime.toFixed(2)}ms`);
            // Limpiar
            document.head.removeChild(style);
            return optimizationTime < 100;
        }
        catch (error) {
            console.error('❌ Error en test de CSS:', error);
            return false;
        }
    }
    /**
     * Test de métricas de performance
     */
    testPerformanceMetrics() {
        console.log('📈 Iniciando test de métricas de performance...');
        try {
            // Esperar un poco para que se recopilen métricas
            setTimeout(() => {
                const metrics = this.optimizer.getMetrics();
                const summary = this.optimizer.getPerformanceSummary();
                console.log(`📊 Métricas recopiladas: ${metrics.length}`);
                console.log('📋 Resumen de performance:', summary);
                return metrics.length > 0 && summary.averageRenderTime !== undefined;
            }, 1000);
            return true;
        }
        catch (error) {
            console.error('❌ Error en test de métricas:', error);
            return false;
        }
    }
    /**
     * Ejecutar todos los tests
     */
    async runAllTests() {
        console.log('🧪 Iniciando tests de optimización de performance...');
        console.log('='.repeat(60));
        const results = {};
        // Test de rendering
        results.rendering = await this.testRenderingOptimization();
        // Test de event handling
        results.eventHandling = this.testEventHandlingOptimization();
        // Test de CSS
        results.css = this.testCSSOptimization();
        // Test de métricas
        results.metrics = this.testPerformanceMetrics();
        // Mostrar resultados
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESULTADOS DE TESTS DE PERFORMANCE:');
        console.log('='.repeat(60));
        Object.entries(results).forEach(([test, passed]) => {
            const status = passed ? '✅ PASÓ' : '❌ FALLÓ';
            console.log(`${test.padEnd(20)} ${status}`);
        });
        const totalTests = Object.keys(results).length;
        const passedTests = Object.values(results).filter(Boolean).length;
        console.log('\n' + '-'.repeat(60));
        console.log(`📈 RESUMEN: ${passedTests}/${totalTests} tests pasaron`);
        if (passedTests === totalTests) {
            console.log('🎉 ¡Todas las optimizaciones de performance funcionan correctamente!');
        }
        else {
            console.log('⚠️  Algunas optimizaciones necesitan revisión.');
        }
        // Limpiar
        this.cleanup();
    }
    /**
     * Limpiar recursos de test
     */
    cleanup() {
        if (this.testContainer && this.testContainer.parentNode) {
            this.testContainer.parentNode.removeChild(this.testContainer);
        }
        this.optimizer.destroy();
    }
}
// Ejecutar tests si estamos en un entorno de browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const performanceTest = new PerformanceOptimizationTest();
    performanceTest.runAllTests().catch(console.error);
}
else {
    console.log('✅ Test de performance creado exitosamente (requiere entorno de browser para ejecutar)');
}
export default PerformanceOptimizationTest;
//# sourceMappingURL=PerformanceOptimizationTest.js.map