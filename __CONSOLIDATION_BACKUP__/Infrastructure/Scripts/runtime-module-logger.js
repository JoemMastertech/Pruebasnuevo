/**
 * Sistema de Logging de Módulos en Tiempo de Ejecución
 * Detecta qué archivos se cargan realmente durante la ejecución
 * para identificar dependencias ocultas y archivos no utilizados
 */

class RuntimeModuleLogger {
    constructor(options = {}) {
        this.logFile = options.logFile || 'module-usage-log.json';
        this.environment = options.environment || 'staging';
        this.startTime = Date.now();
        this.loadedModules = new Set();
        this.importHistory = [];
        this.errorModules = new Set();
        this.dynamicImports = new Set();
        
        this.initializeLogging();
    }

    initializeLogging() {
        // Interceptar require() en Node.js
        if (typeof require !== 'undefined') {
            this.interceptRequire();
        }

        // Interceptar import() dinámico
        this.interceptDynamicImports();

        // Interceptar cargas de scripts en el navegador
        if (typeof window !== 'undefined') {
            this.interceptBrowserLoads();
        }

        // Registrar módulos ya cargados
        this.logInitialModules();
    }

    interceptRequire() {
        const originalRequire = require;
        const self = this;

        // Sobrescribir require global
        require = function(modulePath) {
            const timestamp = Date.now();
            const stackTrace = new Error().stack;
            
            try {
                const result = originalRequire.apply(this, arguments);
                
                self.logModuleLoad({
                    type: 'require',
                    module: modulePath,
                    timestamp,
                    success: true,
                    caller: self.extractCaller(stackTrace),
                    resolved: require.resolve(modulePath)
                });
                
                return result;
            } catch (error) {
                self.logModuleLoad({
                    type: 'require',
                    module: modulePath,
                    timestamp,
                    success: false,
                    error: error.message,
                    caller: self.extractCaller(stackTrace)
                });
                
                throw error;
            }
        };

        // Preservar propiedades de require
        Object.setPrototypeOf(require, originalRequire);
        Object.defineProperty(require, 'cache', {
            get: () => originalRequire.cache,
            set: (value) => { originalRequire.cache = value; }
        });
        Object.defineProperty(require, 'resolve', {
            value: originalRequire.resolve
        });
    }

    interceptDynamicImports() {
        const self = this;
        
        // Interceptar import() dinámico
        if (typeof window !== 'undefined' && window.import) {
            const originalImport = window.import;
            window.import = function(modulePath) {
                const timestamp = Date.now();
                const stackTrace = new Error().stack;
                
                self.logModuleLoad({
                    type: 'dynamic-import',
                    module: modulePath,
                    timestamp,
                    caller: self.extractCaller(stackTrace)
                });
                
                return originalImport.apply(this, arguments)
                    .then(result => {
                        self.logModuleLoad({
                            type: 'dynamic-import-success',
                            module: modulePath,
                            timestamp: Date.now(),
                            success: true
                        });
                        return result;
                    })
                    .catch(error => {
                        self.logModuleLoad({
                            type: 'dynamic-import-error',
                            module: modulePath,
                            timestamp: Date.now(),
                            success: false,
                            error: error.message
                        });
                        throw error;
                    });
            };
        }
    }

    interceptBrowserLoads() {
        const self = this;
        
        // Interceptar cargas de scripts
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.apply(this, arguments);
            
            if (tagName.toLowerCase() === 'script') {
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name === 'src') {
                        self.logModuleLoad({
                            type: 'script-load',
                            module: value,
                            timestamp: Date.now(),
                            caller: self.extractCaller(new Error().stack)
                        });
                    }
                    return originalSetAttribute.apply(this, arguments);
                };
            }
            
            return element;
        };

        // Interceptar fetch para módulos ES6
        const originalFetch = window.fetch;
        window.fetch = function(resource, options) {
            if (typeof resource === 'string' && 
                (resource.endsWith('.js') || resource.endsWith('.ts') || 
                 resource.endsWith('.jsx') || resource.endsWith('.tsx'))) {
                
                self.logModuleLoad({
                    type: 'fetch-module',
                    module: resource,
                    timestamp: Date.now(),
                    caller: self.extractCaller(new Error().stack)
                });
            }
            
            return originalFetch.apply(this, arguments);
        };
    }

    logInitialModules() {
        // Registrar módulos ya cargados en Node.js
        if (typeof require !== 'undefined' && require.cache) {
            Object.keys(require.cache).forEach(modulePath => {
                this.logModuleLoad({
                    type: 'initial-cache',
                    module: modulePath,
                    timestamp: this.startTime,
                    success: true,
                    preloaded: true
                });
            });
        }
    }

    logModuleLoad(logEntry) {
        this.loadedModules.add(logEntry.module);
        this.importHistory.push(logEntry);
        
        if (!logEntry.success) {
            this.errorModules.add(logEntry.module);
        }
        
        if (logEntry.type.includes('dynamic')) {
            this.dynamicImports.add(logEntry.module);
        }

        // Log inmediato para debugging
        if (this.environment === 'development') {
            console.log(`[MODULE-LOGGER] ${logEntry.type}: ${logEntry.module}`);
        }
    }

    extractCaller(stackTrace) {
        const lines = stackTrace.split('\n');
        // Buscar la primera línea que no sea del logger
        for (let i = 2; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line.includes('runtime-module-logger') && 
                !line.includes('at require') &&
                !line.includes('at Module.require')) {
                return line;
            }
        }
        return 'unknown';
    }

    generateReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        return {
            metadata: {
                environment: this.environment,
                startTime: new Date(this.startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                duration: `${duration}ms`,
                totalModules: this.loadedModules.size,
                totalImports: this.importHistory.length,
                errorCount: this.errorModules.size,
                dynamicImportCount: this.dynamicImports.size
            },
            summary: {
                loadedModules: Array.from(this.loadedModules).sort(),
                errorModules: Array.from(this.errorModules).sort(),
                dynamicImports: Array.from(this.dynamicImports).sort(),
                importTypes: this.getImportTypeStats()
            },
            detailedHistory: this.importHistory,
            analysis: this.analyzeUsage()
        };
    }

    getImportTypeStats() {
        const stats = {};
        this.importHistory.forEach(entry => {
            stats[entry.type] = (stats[entry.type] || 0) + 1;
        });
        return stats;
    }

    analyzeUsage() {
        const analysis = {
            suspiciousPatterns: [],
            recommendations: [],
            potentialIssues: []
        };

        // Detectar módulos cargados múltiples veces
        const loadCounts = {};
        this.importHistory.forEach(entry => {
            loadCounts[entry.module] = (loadCounts[entry.module] || 0) + 1;
        });

        Object.entries(loadCounts).forEach(([module, count]) => {
            if (count > 3) {
                analysis.suspiciousPatterns.push({
                    type: 'multiple-loads',
                    module,
                    count,
                    recommendation: 'Considerar cachear o optimizar las cargas'
                });
            }
        });

        // Detectar imports fallidos
        if (this.errorModules.size > 0) {
            analysis.potentialIssues.push({
                type: 'failed-imports',
                modules: Array.from(this.errorModules),
                recommendation: 'Revisar dependencias faltantes o rutas incorrectas'
            });
        }

        // Detectar patrones de imports dinámicos
        if (this.dynamicImports.size > 0) {
            analysis.recommendations.push({
                type: 'dynamic-imports-detected',
                count: this.dynamicImports.size,
                recommendation: 'Verificar que estos imports dinámicos sean necesarios'
            });
        }

        return analysis;
    }

    async saveReport(filename) {
        const report = this.generateReport();
        const reportFilename = filename || `module-usage-report-${Date.now()}.json`;
        
        try {
            if (typeof require !== 'undefined') {
                // Node.js environment
                const fs = require('fs').promises;
                await fs.writeFile(reportFilename, JSON.stringify(report, null, 2));
                console.log(`[MODULE-LOGGER] Reporte guardado en: ${reportFilename}`);
            } else {
                // Browser environment
                const blob = new Blob([JSON.stringify(report, null, 2)], 
                    { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = reportFilename;
                a.click();
                URL.revokeObjectURL(url);
                console.log(`[MODULE-LOGGER] Reporte descargado: ${reportFilename}`);
            }
        } catch (error) {
            console.error('[MODULE-LOGGER] Error al guardar reporte:', error);
        }
        
        return report;
    }

    compareWithInventory(expectedInventory) {
        const loadedSet = new Set(this.loadedModules);
        const expectedSet = new Set(expectedInventory);
        
        const comparison = {
            unexpectedLoads: [],
            missingExpected: [],
            matches: [],
            alerts: []
        };

        // Archivos cargados que no deberían estar
        loadedSet.forEach(module => {
            if (!expectedSet.has(module)) {
                comparison.unexpectedLoads.push(module);
                comparison.alerts.push({
                    type: 'unexpected-load',
                    module,
                    severity: 'high',
                    message: `Archivo cargado que debería estar eliminado: ${module}`
                });
            } else {
                comparison.matches.push(module);
            }
        });

        // Archivos esperados que no se cargaron
        expectedSet.forEach(module => {
            if (!loadedSet.has(module)) {
                comparison.missingExpected.push(module);
                comparison.alerts.push({
                    type: 'missing-expected',
                    module,
                    severity: 'medium',
                    message: `Archivo esperado no se cargó: ${module}`
                });
            }
        });

        return comparison;
    }

    stop() {
        console.log('[MODULE-LOGGER] Deteniendo logging de módulos...');
        return this.generateReport();
    }
}

// Función de inicialización para staging
function initializeRuntimeLogging(options = {}) {
    const logger = new RuntimeModuleLogger({
        environment: 'staging',
        logFile: 'staging-module-usage.json',
        ...options
    });

    // Auto-guardar reporte cada 5 minutos
    const autoSaveInterval = setInterval(() => {
        logger.saveReport(`auto-save-${Date.now()}.json`);
    }, 5 * 60 * 1000);

    // Guardar reporte al cerrar
    const cleanup = () => {
        clearInterval(autoSaveInterval);
        logger.saveReport('final-module-usage-report.json');
    };

    if (typeof process !== 'undefined') {
        process.on('exit', cleanup);
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
    } else if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', cleanup);
    }

    return logger;
}

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RuntimeModuleLogger, initializeRuntimeLogging };
} else if (typeof window !== 'undefined') {
    window.RuntimeModuleLogger = RuntimeModuleLogger;
    window.initializeRuntimeLogging = initializeRuntimeLogging;
}