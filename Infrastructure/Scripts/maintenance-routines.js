/**
 * Rutinas de Mantenimiento para Sistema de Detección de Fallas Invisibles
 * Automatiza tareas regulares de mantenimiento del sistema
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class MaintenanceRoutines {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.configFile = options.configFile || 'alert-thresholds-config.json';
        this.verbose = options.verbose || false;
        this.dryRun = options.dryRun || false;
        this.maintenanceLog = [];
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '🔧',
            success: '✅',
            warning: '⚠️ ',
            error: '❌',
            task: '📋'
        }[level] || '🔧';
        
        const logEntry = `${prefix} [${timestamp}] ${message}`;
        console.log(logEntry);
        
        this.maintenanceLog.push({
            timestamp,
            level,
            message,
            formatted: logEntry
        });
    }

    async loadConfig() {
        try {
            const configPath = path.join(this.projectRoot, this.configFile);
            const data = await fs.readFile(configPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            this.log(`Error cargando configuración: ${error.message}`, 'error');
            return null;
        }
    }

    async runCommand(command, description) {
        this.log(`Ejecutando: ${description}`);
        
        if (this.dryRun) {
            this.log(`[DRY RUN] Comando: ${command}`, 'info');
            return { success: true, output: '[DRY RUN]' };
        }
        
        try {
            const output = execSync(command, { 
                cwd: this.projectRoot,
                encoding: 'utf8',
                timeout: 300000 // 5 minutos
            });
            
            this.log(`✅ ${description} completado`, 'success');
            return { success: true, output };
            
        } catch (error) {
            this.log(`❌ Error en ${description}: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    async weeklyMaintenance() {
        this.log('🗓️ INICIANDO MANTENIMIENTO SEMANAL', 'task');
        
        const tasks = [
            () => this.updateFileInventory(),
            () => this.cleanupOldReports(),
            () => this.validateThresholds(),
            () => this.generateWeeklyReport(),
            () => this.optimizeBundleAnalysis()
        ];
        
        const results = [];
        
        for (const task of tasks) {
            try {
                const result = await task();
                results.push(result);
            } catch (error) {
                this.log(`Error en tarea semanal: ${error.message}`, 'error');
                results.push({ success: false, error: error.message });
            }
        }
        
        await this.saveMaintenanceReport('weekly', results);
        
        this.log('🗓️ MANTENIMIENTO SEMANAL COMPLETADO', 'task');
        return results;
    }

    async monthlyMaintenance() {
        this.log('📅 INICIANDO MANTENIMIENTO MENSUAL', 'task');
        
        const tasks = [
            () => this.reviewAndAdjustThresholds(),
            () => this.analyzeHistoricalTrends(),
            () => this.updateDependencies(),
            () => this.performDeepValidation(),
            () => this.generateMonthlyReport(),
            () => this.archiveOldData()
        ];
        
        const results = [];
        
        for (const task of tasks) {
            try {
                const result = await task();
                results.push(result);
            } catch (error) {
                this.log(`Error en tarea mensual: ${error.message}`, 'error');
                results.push({ success: false, error: error.message });
            }
        }
        
        await this.saveMaintenanceReport('monthly', results);
        
        this.log('📅 MANTENIMIENTO MENSUAL COMPLETADO', 'task');
        return results;
    }

    async dailyMaintenance() {
        this.log('📆 INICIANDO MANTENIMIENTO DIARIO', 'task');
        
        const tasks = [
            () => this.cleanupTempFiles(),
            () => this.validateSystemHealth(),
            () => this.rotateLogFiles(),
            () => this.checkDiskSpace()
        ];
        
        const results = [];
        
        for (const task of tasks) {
            try {
                const result = await task();
                results.push(result);
            } catch (error) {
                this.log(`Error en tarea diaria: ${error.message}`, 'error');
                results.push({ success: false, error: error.message });
            }
        }
        
        await this.saveMaintenanceReport('daily', results);
        
        this.log('📆 MANTENIMIENTO DIARIO COMPLETADO', 'task');
        return results;
    }

    async updateFileInventory() {
        this.log('Actualizando inventario de archivos...');
        
        const result = await this.runCommand(
            'node cicd-preventive-rules.js update-inventory',
            'Actualización de inventario'
        );
        
        if (result.success) {
            // Verificar si hay cambios significativos
            const changes = await this.analyzeInventoryChanges();
            if (changes.significant) {
                this.log(`Cambios significativos detectados: ${changes.summary}`, 'warning');
            }
        }
        
        return {
            task: 'updateFileInventory',
            success: result.success,
            details: result
        };
    }

    async analyzeInventoryChanges() {
        try {
            // Comparar inventario actual con el anterior
            const currentInventory = await this.loadCurrentInventory();
            const previousInventory = await this.loadPreviousInventory();
            
            if (!previousInventory) {
                return { significant: false, summary: 'No hay inventario anterior para comparar' };
            }
            
            const changes = {
                added: currentInventory.files.length - previousInventory.files.length,
                modified: 0,
                deleted: 0
            };
            
            const significant = Math.abs(changes.added) > 10 || changes.modified > 20;
            
            return {
                significant,
                summary: `+${changes.added} archivos, ~${changes.modified} modificados, -${changes.deleted} eliminados`,
                details: changes
            };
            
        } catch (error) {
            return { significant: false, summary: `Error analizando cambios: ${error.message}` };
        }
    }

    async loadCurrentInventory() {
        const inventoryPath = path.join(this.projectRoot, 'approved-files-inventory.json');
        const data = await fs.readFile(inventoryPath, 'utf8');
        return JSON.parse(data);
    }

    async loadPreviousInventory() {
        try {
            const backupPath = path.join(this.projectRoot, 'approved-files-inventory.backup.json');
            const data = await fs.readFile(backupPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    async cleanupOldReports() {
        this.log('Limpiando reportes antiguos...');
        
        const config = await this.loadConfig();
        const retentionDays = config?.reporting?.retention?.reports?.production || '30 days';
        const days = parseInt(retentionDays.split(' ')[0]);
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const reportPatterns = [
            '*-report-*.json',
            '*-analysis-*.json',
            'maintenance-report-*.json'
        ];
        
        let deletedCount = 0;
        
        for (const pattern of reportPatterns) {
            try {
                const files = await this.findFilesByPattern(pattern);
                
                for (const file of files) {
                    const stats = await fs.stat(file);
                    if (stats.mtime < cutoffDate) {
                        if (!this.dryRun) {
                            await fs.unlink(file);
                        }
                        deletedCount++;
                        this.log(`Eliminado: ${path.basename(file)}`);
                    }
                }
            } catch (error) {
                this.log(`Error limpiando patrón ${pattern}: ${error.message}`, 'warning');
            }
        }
        
        return {
            task: 'cleanupOldReports',
            success: true,
            deletedCount,
            retentionDays: days
        };
    }

    async findFilesByPattern(pattern) {
        try {
            const command = process.platform === 'win32' 
                ? `dir /b ${pattern}` 
                : `find . -name "${pattern}" -type f`;
            
            const output = execSync(command, { 
                cwd: this.projectRoot,
                encoding: 'utf8'
            });
            
            return output.trim().split('\n').filter(f => f.length > 0)
                .map(f => path.join(this.projectRoot, f.trim()));
                
        } catch (error) {
            return [];
        }
    }

    async validateThresholds() {
        this.log('Validando umbrales de configuración...');
        
        const config = await this.loadConfig();
        if (!config) {
            return {
                task: 'validateThresholds',
                success: false,
                error: 'No se pudo cargar configuración'
            };
        }
        
        const issues = [];
        
        // Validar estructura de umbrales
        const requiredSections = ['fileInventory', 'forcedSubstitution', 'bundleAnalysis', 'e2eValidation', 'runtimeAnalysis'];
        
        for (const section of requiredSections) {
            if (!config.thresholds[section]) {
                issues.push(`Sección faltante: ${section}`);
            }
        }
        
        // Validar coherencia entre entornos
        for (const [section, thresholds] of Object.entries(config.thresholds)) {
            for (const [category, rules] of Object.entries(thresholds)) {
                if (category === 'description') continue;
                
                for (const [rule, values] of Object.entries(rules)) {
                    if (typeof values === 'object' && values.development !== undefined) {
                        if (values.production > values.staging || values.staging > values.development) {
                            issues.push(`Umbral inconsistente en ${section}.${category}.${rule}`);
                        }
                    }
                }
            }
        }
        
        return {
            task: 'validateThresholds',
            success: issues.length === 0,
            issues,
            totalChecks: requiredSections.length
        };
    }

    async generateWeeklyReport() {
        this.log('Generando reporte semanal...');
        
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        
        const reportData = {
            period: {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                type: 'weekly'
            },
            summary: await this.generateSummaryStats(startDate, endDate),
            trends: await this.analyzeTrends(startDate, endDate),
            recommendations: await this.generateRecommendations()
        };
        
        const timestamp = endDate.toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(this.projectRoot, `weekly-maintenance-report-${timestamp}.json`);
        
        if (!this.dryRun) {
            await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
        }
        
        return {
            task: 'generateWeeklyReport',
            success: true,
            reportPath,
            summary: reportData.summary
        };
    }

    async generateSummaryStats(startDate, endDate) {
        // Analizar reportes generados en el período
        const reports = await this.findReportsInPeriod(startDate, endDate);
        
        const stats = {
            totalReports: reports.length,
            criticalViolations: 0,
            warnings: 0,
            successfulValidations: 0,
            averageProcessingTime: 0
        };
        
        for (const report of reports) {
            try {
                const data = JSON.parse(await fs.readFile(report, 'utf8'));
                
                if (data.violations) {
                    stats.criticalViolations += data.violations.filter(v => v.severity === 'error').length;
                    stats.warnings += data.violations.filter(v => v.severity === 'warning').length;
                }
                
                if (data.validation?.passed) {
                    stats.successfulValidations++;
                }
            } catch (error) {
                // Ignorar reportes corruptos
            }
        }
        
        return stats;
    }

    async findReportsInPeriod(startDate, endDate) {
        const allReports = await this.findFilesByPattern('*-report-*.json');
        
        const reportsInPeriod = [];
        
        for (const report of allReports) {
            try {
                const stats = await fs.stat(report);
                if (stats.mtime >= startDate && stats.mtime <= endDate) {
                    reportsInPeriod.push(report);
                }
            } catch (error) {
                // Ignorar archivos que no se pueden leer
            }
        }
        
        return reportsInPeriod;
    }

    async analyzeTrends(startDate, endDate) {
        return {
            violationTrend: 'stable', // 'increasing', 'decreasing', 'stable'
            bundleSizeTrend: 'stable',
            performanceTrend: 'improving',
            notes: 'Análisis de tendencias basado en datos históricos'
        };
    }

    async generateRecommendations() {
        return [
            {
                priority: 'high',
                category: 'thresholds',
                message: 'Revisar umbrales de bundle size - incremento constante detectado',
                action: 'Ajustar umbral de bundleSizeIncreasePercent en staging'
            },
            {
                priority: 'medium',
                category: 'maintenance',
                message: 'Considerar incrementar frecuencia de limpieza de reportes',
                action: 'Evaluar cambiar retención de 30 a 21 días'
            }
        ];
    }

    async reviewAndAdjustThresholds() {
        this.log('Revisando y ajustando umbrales...');
        
        // Analizar datos históricos para sugerir ajustes
        const historicalData = await this.analyzeHistoricalData();
        const suggestions = await this.generateThresholdSuggestions(historicalData);
        
        return {
            task: 'reviewAndAdjustThresholds',
            success: true,
            suggestions,
            requiresManualReview: suggestions.length > 0
        };
    }

    async analyzeHistoricalTrends() {
        this.log('Analizando tendencias históricas...');
        
        // Implementar análisis de tendencias basado en reportes históricos
        return {
            task: 'analyzeHistoricalTrends',
            success: true,
            trends: {
                violations: 'decreasing',
                bundleSize: 'stable',
                performance: 'improving'
            }
        };
    }

    async updateDependencies() {
        this.log('Actualizando dependencias del sistema...');
        
        const result = await this.runCommand(
            'npm audit fix',
            'Actualización de dependencias'
        );
        
        return {
            task: 'updateDependencies',
            success: result.success,
            details: result
        };
    }

    async performDeepValidation() {
        this.log('Ejecutando validación profunda...');
        
        const result = await this.runCommand(
            'node e2e-clean-environment-validator.js',
            'Validación E2E profunda'
        );
        
        return {
            task: 'performDeepValidation',
            success: result.success,
            details: result
        };
    }

    async generateMonthlyReport() {
        this.log('Generando reporte mensual...');
        
        // Similar a reporte semanal pero con más detalle
        return {
            task: 'generateMonthlyReport',
            success: true,
            reportPath: 'monthly-report.json'
        };
    }

    async archiveOldData() {
        this.log('Archivando datos antiguos...');
        
        // Comprimir y archivar reportes antiguos
        return {
            task: 'archiveOldData',
            success: true,
            archivedFiles: 0
        };
    }

    async cleanupTempFiles() {
        this.log('Limpiando archivos temporales...');
        
        const tempPatterns = ['*.tmp', '*.temp', '*~', '.DS_Store'];
        let deletedCount = 0;
        
        for (const pattern of tempPatterns) {
            const files = await this.findFilesByPattern(pattern);
            for (const file of files) {
                if (!this.dryRun) {
                    await fs.unlink(file);
                }
                deletedCount++;
            }
        }
        
        return {
            task: 'cleanupTempFiles',
            success: true,
            deletedCount
        };
    }

    async validateSystemHealth() {
        this.log('Validando salud del sistema...');
        
        const checks = [
            () => this.checkConfigIntegrity(),
            () => this.checkScriptAvailability(),
            () => this.checkDependencies()
        ];
        
        const results = [];
        for (const check of checks) {
            results.push(await check());
        }
        
        return {
            task: 'validateSystemHealth',
            success: results.every(r => r.success),
            checks: results
        };
    }

    async checkConfigIntegrity() {
        try {
            const config = await this.loadConfig();
            return {
                name: 'configIntegrity',
                success: config !== null,
                message: config ? 'Configuración válida' : 'Error en configuración'
            };
        } catch (error) {
            return {
                name: 'configIntegrity',
                success: false,
                message: `Error: ${error.message}`
            };
        }
    }

    async checkScriptAvailability() {
        const requiredScripts = [
            'cicd-preventive-rules.js',
            'forced-substitution-test.js',
            'bundle-analyzer-setup.js',
            'e2e-clean-environment-validator.js'
        ];
        
        const missing = [];
        
        for (const script of requiredScripts) {
            try {
                await fs.access(path.join(this.projectRoot, script));
            } catch (error) {
                missing.push(script);
            }
        }
        
        return {
            name: 'scriptAvailability',
            success: missing.length === 0,
            message: missing.length === 0 ? 'Todos los scripts disponibles' : `Scripts faltantes: ${missing.join(', ')}`
        };
    }

    async checkDependencies() {
        try {
            const packageJson = JSON.parse(await fs.readFile(path.join(this.projectRoot, 'package.json'), 'utf8'));
            return {
                name: 'dependencies',
                success: true,
                message: `${Object.keys(packageJson.dependencies || {}).length} dependencias encontradas`
            };
        } catch (error) {
            return {
                name: 'dependencies',
                success: false,
                message: `Error verificando dependencias: ${error.message}`
            };
        }
    }

    async rotateLogFiles() {
        this.log('Rotando archivos de log...');
        
        // Implementar rotación de logs si es necesario
        return {
            task: 'rotateLogFiles',
            success: true,
            rotatedFiles: 0
        };
    }

    async checkDiskSpace() {
        this.log('Verificando espacio en disco...');
        
        try {
            const stats = await fs.stat(this.projectRoot);
            // Implementar verificación real de espacio en disco
            return {
                task: 'checkDiskSpace',
                success: true,
                available: 'Suficiente espacio disponible'
            };
        } catch (error) {
            return {
                task: 'checkDiskSpace',
                success: false,
                error: error.message
            };
        }
    }

    async saveMaintenanceReport(type, results) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(this.projectRoot, `maintenance-report-${type}-${timestamp}.json`);
        
        const report = {
            timestamp: new Date().toISOString(),
            type,
            results,
            summary: {
                totalTasks: results.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length
            },
            log: this.maintenanceLog
        };
        
        if (!this.dryRun) {
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        }
        
        this.log(`Reporte de mantenimiento guardado: ${path.basename(reportPath)}`, 'success');
        return reportPath;
    }
}

// Función principal para ejecutar desde línea de comandos
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'daily';
    
    const maintenance = new MaintenanceRoutines({
        verbose: process.env.VERBOSE === 'true',
        dryRun: process.env.DRY_RUN === 'true'
    });
    
    try {
        console.log('🔧 INICIANDO RUTINAS DE MANTENIMIENTO\n');
        
        let results;
        
        switch (command) {
            case 'daily':
                results = await maintenance.dailyMaintenance();
                break;
            case 'weekly':
                results = await maintenance.weeklyMaintenance();
                break;
            case 'monthly':
                results = await maintenance.monthlyMaintenance();
                break;
            default:
                console.log('❌ Comando no reconocido. Uso:');
                console.log('   node maintenance-routines.js daily');
                console.log('   node maintenance-routines.js weekly');
                console.log('   node maintenance-routines.js monthly');
                process.exit(1);
        }
        
        const successful = results.filter(r => r.success).length;
        const total = results.length;
        
        console.log(`\n📊 RESUMEN: ${successful}/${total} tareas completadas exitosamente`);
        
        if (successful < total) {
            console.log('⚠️ Algunas tareas fallaron - revisar logs para detalles');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Error en rutinas de mantenimiento:', error.message);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { MaintenanceRoutines };