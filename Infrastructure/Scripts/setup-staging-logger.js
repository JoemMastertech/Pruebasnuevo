/**
 * Configuración del Logger de Módulos para Staging
 * Integra el sistema de logging en el entorno de staging
 */

// Importar el logger
const { RuntimeModuleLogger, initializeRuntimeLogging } = require('./runtime-module-logger.js');
const fs = require('fs').promises;
const path = require('path');

class StagingLoggerSetup {
    constructor() {
        this.projectRoot = process.cwd();
        this.expectedInventoryFile = 'expected-files-inventory.json';
        this.logger = null;
        this.monitoringActive = false;
    }

    async initialize() {
        console.log('🔍 Inicializando logger de módulos para staging...');
        
        // Crear inventario esperado si no existe
        await this.createExpectedInventory();
        
        // Inicializar logger
        this.logger = initializeRuntimeLogging({
            environment: 'staging',
            logFile: 'staging-module-analysis.json'
        });
        
        this.monitoringActive = true;
        console.log('✅ Logger de módulos activo en staging');
        
        return this.logger;
    }

    async createExpectedInventory() {
        const inventoryPath = path.join(this.projectRoot, this.expectedInventoryFile);
        
        try {
            // Verificar si ya existe
            await fs.access(inventoryPath);
            console.log('📋 Inventario esperado encontrado:', inventoryPath);
            return;
        } catch {
            // Crear inventario basado en archivos actuales
            console.log('📋 Creando inventario esperado de archivos...');
            
            const inventory = await this.scanCurrentFiles();
            await fs.writeFile(inventoryPath, JSON.stringify(inventory, null, 2));
            
            console.log(`✅ Inventario creado con ${inventory.files.length} archivos`);
        }
    }

    async scanCurrentFiles() {
        const files = [];
        const excludePatterns = [
            /node_modules/,
            /\.git/,
            /dist/,
            /build/,
            /compiled/,
            /\.log$/,
            /\.tmp$/
        ];

        async function scanDirectory(dir) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.relative(process.cwd(), fullPath);
                
                // Verificar patrones de exclusión
                if (excludePatterns.some(pattern => pattern.test(relativePath))) {
                    continue;
                }
                
                if (entry.isDirectory()) {
                    await scanDirectory(fullPath);
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name);
                    if (['.js', '.ts', '.jsx', '.tsx', '.css', '.scss'].includes(ext)) {
                        files.push({
                            path: relativePath,
                            name: entry.name,
                            extension: ext,
                            size: (await fs.stat(fullPath)).size
                        });
                    }
                }
            }
        }

        await scanDirectory(this.projectRoot);
        
        return {
            timestamp: new Date().toISOString(),
            environment: 'staging',
            totalFiles: files.length,
            files: files.sort((a, b) => a.path.localeCompare(b.path))
        };
    }

    async runAnalysis(duration = 60000) {
        if (!this.logger) {
            throw new Error('Logger no inicializado. Ejecuta initialize() primero.');
        }

        console.log(`🔍 Ejecutando análisis de uso de módulos por ${duration/1000} segundos...`);
        
        // Simular carga de la aplicación
        await this.simulateAppUsage();
        
        // Esperar el tiempo especificado
        await new Promise(resolve => setTimeout(resolve, duration));
        
        // Generar reporte
        const report = await this.logger.saveReport(`staging-analysis-${Date.now()}.json`);
        
        // Comparar con inventario esperado
        const comparison = await this.compareWithExpectedInventory(report);
        
        return {
            report,
            comparison,
            alerts: this.generateAlerts(comparison)
        };
    }

    async simulateAppUsage() {
        console.log('🎭 Simulando uso típico de la aplicación...');
        
        try {
            // Cargar módulos principales
            const mainModules = [
                './hexagonal-bootstrap.js',
                './Shared/core/AppConfig.js',
                './Shared/core/DIContainer.js'
            ];

            for (const module of mainModules) {
                try {
                    const modulePath = path.join(this.projectRoot, module);
                    if (await this.fileExists(modulePath)) {
                        require(modulePath);
                        console.log(`✅ Cargado: ${module}`);
                    }
                } catch (error) {
                    console.log(`⚠️  Error cargando ${module}: ${error.message}`);
                }
            }

            // Simular imports dinámicos
            const dynamicModules = [
                './Domain/Entities/Product.js',
                './Aplicacion/UseCases/GetProductsUseCase.js'
            ];

            for (const module of dynamicModules) {
                try {
                    const modulePath = path.join(this.projectRoot, module);
                    if (await this.fileExists(modulePath)) {
                        // Simular import dinámico
                        console.log(`🔄 Import dinámico simulado: ${module}`);
                    }
                } catch (error) {
                    console.log(`⚠️  Error en import dinámico ${module}: ${error.message}`);
                }
            }

        } catch (error) {
            console.log('⚠️  Error en simulación:', error.message);
        }
    }

    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async compareWithExpectedInventory(report) {
        const inventoryPath = path.join(this.projectRoot, this.expectedInventoryFile);
        
        try {
            const inventoryData = await fs.readFile(inventoryPath, 'utf8');
            const inventory = JSON.parse(inventoryData);
            
            const expectedFiles = inventory.files.map(f => f.path);
            return this.logger.compareWithInventory(expectedFiles);
        } catch (error) {
            console.error('❌ Error al comparar con inventario:', error.message);
            return {
                error: 'No se pudo cargar el inventario esperado',
                unexpectedLoads: [],
                missingExpected: [],
                matches: [],
                alerts: []
            };
        }
    }

    generateAlerts(comparison) {
        const alerts = [];
        
        // Alertas críticas por archivos inesperados
        comparison.unexpectedLoads.forEach(module => {
            alerts.push({
                level: 'CRITICAL',
                type: 'UNEXPECTED_MODULE_LOAD',
                module,
                message: `🚨 ALERTA: Se cargó un archivo que debería estar eliminado: ${module}`,
                action: 'Verificar por qué este archivo se está cargando y eliminar la dependencia'
            });
        });

        // Alertas de advertencia por archivos faltantes
        comparison.missingExpected.forEach(module => {
            alerts.push({
                level: 'WARNING',
                type: 'MISSING_EXPECTED_MODULE',
                module,
                message: `⚠️  ADVERTENCIA: Archivo esperado no se cargó: ${module}`,
                action: 'Verificar si este archivo es realmente necesario o actualizar inventario'
            });
        });

        return alerts;
    }

    async generateDetailedReport() {
        if (!this.logger) {
            throw new Error('Logger no inicializado');
        }

        const report = this.logger.generateReport();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = `detailed-staging-report-${timestamp}.json`;
        
        const detailedReport = {
            ...report,
            stagingInfo: {
                projectRoot: this.projectRoot,
                nodeVersion: process.version,
                platform: process.platform,
                memoryUsage: process.memoryUsage()
            },
            recommendations: this.generateRecommendations(report)
        };

        await fs.writeFile(reportPath, JSON.stringify(detailedReport, null, 2));
        console.log(`📊 Reporte detallado guardado: ${reportPath}`);
        
        return detailedReport;
    }

    generateRecommendations(report) {
        const recommendations = [];

        // Recomendaciones basadas en el análisis
        if (report.metadata.errorCount > 0) {
            recommendations.push({
                type: 'ERROR_CLEANUP',
                priority: 'HIGH',
                message: `Se detectaron ${report.metadata.errorCount} errores de carga de módulos`,
                action: 'Revisar y corregir las dependencias faltantes o rutas incorrectas'
            });
        }

        if (report.metadata.dynamicImportCount > 10) {
            recommendations.push({
                type: 'DYNAMIC_IMPORT_OPTIMIZATION',
                priority: 'MEDIUM',
                message: `Se detectaron ${report.metadata.dynamicImportCount} imports dinámicos`,
                action: 'Considerar optimizar o cachear los imports dinámicos frecuentes'
            });
        }

        if (report.metadata.totalImports > report.metadata.totalModules * 3) {
            recommendations.push({
                type: 'REDUNDANT_LOADS',
                priority: 'MEDIUM',
                message: 'Se detectaron múltiples cargas del mismo módulo',
                action: 'Implementar cacheo o revisar la arquitectura de imports'
            });
        }

        return recommendations;
    }

    stop() {
        if (this.logger) {
            this.monitoringActive = false;
            return this.logger.stop();
        }
    }
}

// Función principal para ejecutar desde línea de comandos
async function main() {
    const setup = new StagingLoggerSetup();
    
    try {
        // Inicializar
        await setup.initialize();
        
        // Ejecutar análisis por 2 minutos
        const results = await setup.runAnalysis(120000);
        
        // Mostrar resultados
        console.log('\n📊 RESULTADOS DEL ANÁLISIS:');
        console.log(`Total de módulos cargados: ${results.report.metadata.totalModules}`);
        console.log(`Total de imports: ${results.report.metadata.totalImports}`);
        console.log(`Errores detectados: ${results.report.metadata.errorCount}`);
        
        if (results.alerts.length > 0) {
            console.log('\n🚨 ALERTAS DETECTADAS:');
            results.alerts.forEach(alert => {
                console.log(`${alert.level}: ${alert.message}`);
            });
        } else {
            console.log('\n✅ No se detectaron problemas críticos');
        }
        
        // Generar reporte detallado
        await setup.generateDetailedReport();
        
    } catch (error) {
        console.error('❌ Error en el análisis:', error.message);
    } finally {
        setup.stop();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { StagingLoggerSetup };