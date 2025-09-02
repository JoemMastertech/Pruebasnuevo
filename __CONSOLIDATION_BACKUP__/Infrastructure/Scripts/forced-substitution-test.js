/**
 * Tests de Sustitución Forzada
 * Renombra temporalmente archivos para detectar dependencias ocultas
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class ForcedSubstitutionTester {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.testCommand = options.testCommand || 'npm test';
        this.buildCommand = options.buildCommand || 'npm run build';
        this.backupSuffix = '.backup-substitution';
        this.renamedFiles = new Map(); // archivo original -> archivo renombrado
        this.testResults = [];
        this.verbose = options.verbose || false;
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '📋',
            success: '✅',
            warning: '⚠️ ',
            error: '❌',
            test: '🧪'
        }[level] || '📋';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
        
        if (this.verbose || level === 'error' || level === 'warning') {
            // Guardar en log detallado
            this.testResults.push({
                timestamp,
                level,
                message
            });
        }
    }

    async loadTargetFiles(analysisFile) {
        try {
            const analysisPath = path.resolve(this.projectRoot, analysisFile);
            const data = await fs.readFile(analysisPath, 'utf8');
            const analysis = JSON.parse(data);
            
            // Filtrar solo archivos que existen y son archivos fuente
            const targetFiles = analysis.files
                .filter(file => file.Exists && this.isSourceFile(file.Path))
                .map(file => file.Path);
            
            this.log(`Cargados ${targetFiles.length} archivos objetivo desde ${analysisFile}`);
            return targetFiles;
        } catch (error) {
            this.log(`Error cargando archivo de análisis: ${error.message}`, 'error');
            return [];
        }
    }

    isSourceFile(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const sourceExtensions = ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.less'];
        
        // Excluir archivos compilados y de configuración
        const excludePatterns = [
            /node_modules/,
            /dist\//,
            /build\//,
            /compiled\//,
            /\.d\.ts$/,
            /\.min\./,
            /\.bundle\./,
            /webpack/,
            /babel/,
            /eslint/,
            /jest/
        ];
        
        return sourceExtensions.includes(ext) && 
               !excludePatterns.some(pattern => pattern.test(filePath));
    }

    async renameFile(originalPath) {
        const fullPath = path.resolve(this.projectRoot, originalPath);
        const renamedPath = fullPath + this.backupSuffix;
        
        try {
            // Verificar que el archivo existe
            await fs.access(fullPath);
            
            // Renombrar archivo
            await fs.rename(fullPath, renamedPath);
            
            this.renamedFiles.set(originalPath, renamedPath);
            this.log(`Archivo renombrado: ${originalPath} -> ${path.basename(renamedPath)}`);
            
            return true;
        } catch (error) {
            this.log(`Error renombrando ${originalPath}: ${error.message}`, 'error');
            return false;
        }
    }

    async restoreFile(originalPath) {
        const renamedPath = this.renamedFiles.get(originalPath);
        
        if (!renamedPath) {
            this.log(`No se encontró backup para ${originalPath}`, 'warning');
            return false;
        }
        
        try {
            const fullPath = path.resolve(this.projectRoot, originalPath);
            await fs.rename(renamedPath, fullPath);
            
            this.renamedFiles.delete(originalPath);
            this.log(`Archivo restaurado: ${originalPath}`);
            
            return true;
        } catch (error) {
            this.log(`Error restaurando ${originalPath}: ${error.message}`, 'error');
            return false;
        }
    }

    async restoreAllFiles() {
        this.log('Restaurando todos los archivos renombrados...');
        
        const restorePromises = Array.from(this.renamedFiles.keys())
            .map(originalPath => this.restoreFile(originalPath));
        
        const results = await Promise.allSettled(restorePromises);
        const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
        
        this.log(`Restaurados ${successful}/${results.length} archivos`, 
                 successful === results.length ? 'success' : 'warning');
    }

    async runCommand(command, description) {
        this.log(`Ejecutando: ${description}`, 'test');
        
        return new Promise((resolve) => {
            const startTime = Date.now();
            const [cmd, ...args] = command.split(' ');
            
            const process = spawn(cmd, args, {
                cwd: this.projectRoot,
                stdio: this.verbose ? 'inherit' : 'pipe',
                shell: true
            });
            
            let stdout = '';
            let stderr = '';
            
            if (!this.verbose) {
                process.stdout?.on('data', (data) => {
                    stdout += data.toString();
                });
                
                process.stderr?.on('data', (data) => {
                    stderr += data.toString();
                });
            }
            
            process.on('close', (code) => {
                const duration = Date.now() - startTime;
                const success = code === 0;
                
                this.log(`${description} ${success ? 'exitoso' : 'falló'} (${duration}ms)`, 
                         success ? 'success' : 'error');
                
                resolve({
                    success,
                    code,
                    duration,
                    stdout: stdout.trim(),
                    stderr: stderr.trim()
                });
            });
            
            process.on('error', (error) => {
                this.log(`Error ejecutando ${description}: ${error.message}`, 'error');
                resolve({
                    success: false,
                    code: -1,
                    duration: Date.now() - startTime,
                    stdout: '',
                    stderr: error.message
                });
            });
        });
    }

    async testSingleFile(filePath) {
        this.log(`\n🧪 Probando archivo: ${filePath}`, 'test');
        
        const testResult = {
            file: filePath,
            renamed: false,
            buildSuccess: null,
            testSuccess: null,
            errors: [],
            warnings: [],
            hasDependencies: false
        };
        
        try {
            // 1. Renombrar archivo
            const renamed = await this.renameFile(filePath);
            if (!renamed) {
                testResult.errors.push('No se pudo renombrar el archivo');
                return testResult;
            }
            testResult.renamed = true;
            
            // 2. Intentar build
            this.log('Ejecutando build sin el archivo...');
            const buildResult = await this.runCommand(this.buildCommand, 'Build');
            testResult.buildSuccess = buildResult.success;
            
            if (!buildResult.success) {
                testResult.errors.push(`Build falló: ${buildResult.stderr}`);
                testResult.hasDependencies = true;
            }
            
            // 3. Intentar tests (solo si build fue exitoso)
            if (buildResult.success) {
                this.log('Ejecutando tests sin el archivo...');
                const testCommandResult = await this.runCommand(this.testCommand, 'Tests');
                testResult.testSuccess = testCommandResult.success;
                
                if (!testCommandResult.success) {
                    testResult.errors.push(`Tests fallaron: ${testCommandResult.stderr}`);
                    testResult.hasDependencies = true;
                }
            } else {
                testResult.warnings.push('Tests omitidos debido a fallo en build');
            }
            
            // 4. Restaurar archivo
            await this.restoreFile(filePath);
            
        } catch (error) {
            testResult.errors.push(`Error inesperado: ${error.message}`);
            // Intentar restaurar en caso de error
            await this.restoreFile(filePath);
        }
        
        // Determinar resultado
        if (testResult.hasDependencies) {
            this.log(`❌ DEPENDENCIAS DETECTADAS en ${filePath}`, 'error');
        } else {
            this.log(`✅ Sin dependencias detectadas en ${filePath}`, 'success');
        }
        
        return testResult;
    }

    async testBatch(filePaths, batchSize = 5) {
        this.log(`\n🧪 Iniciando test por lotes de ${filePaths.length} archivos (lotes de ${batchSize})`, 'test');
        
        const results = [];
        const batches = [];
        
        // Dividir en lotes
        for (let i = 0; i < filePaths.length; i += batchSize) {
            batches.push(filePaths.slice(i, i + batchSize));
        }
        
        this.log(`Procesando ${batches.length} lotes...`);
        
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            this.log(`\n📦 Procesando lote ${i + 1}/${batches.length} (${batch.length} archivos)`);
            
            try {
                // Renombrar todos los archivos del lote
                const renameResults = await Promise.all(
                    batch.map(file => this.renameFile(file))
                );
                
                const renamedFiles = batch.filter((_, index) => renameResults[index]);
                
                if (renamedFiles.length === 0) {
                    this.log('No se pudo renombrar ningún archivo del lote', 'warning');
                    continue;
                }
                
                this.log(`Renombrados ${renamedFiles.length}/${batch.length} archivos del lote`);
                
                // Ejecutar build y tests
                const buildResult = await this.runCommand(this.buildCommand, `Build lote ${i + 1}`);
                const testResult = buildResult.success ? 
                    await this.runCommand(this.testCommand, `Tests lote ${i + 1}`) : 
                    { success: false, stderr: 'Omitido por fallo en build' };
                
                // Crear resultado del lote
                const batchResult = {
                    batchNumber: i + 1,
                    files: renamedFiles,
                    buildSuccess: buildResult.success,
                    testSuccess: testResult.success,
                    hasDependencies: !buildResult.success || !testResult.success,
                    errors: [],
                    buildOutput: buildResult.stderr,
                    testOutput: testResult.stderr
                };
                
                if (batchResult.hasDependencies) {
                    batchResult.errors.push('Uno o más archivos del lote tienen dependencias');
                    this.log(`❌ DEPENDENCIAS DETECTADAS en lote ${i + 1}`, 'error');
                } else {
                    this.log(`✅ Sin dependencias en lote ${i + 1}`, 'success');
                }
                
                results.push(batchResult);
                
                // Restaurar archivos del lote
                await Promise.all(renamedFiles.map(file => this.restoreFile(file)));
                
            } catch (error) {
                this.log(`Error procesando lote ${i + 1}: ${error.message}`, 'error');
                // Restaurar todos los archivos en caso de error
                await this.restoreAllFiles();
            }
        }
        
        return results;
    }

    async generateReport(results, outputFile) {
        const timestamp = new Date().toISOString();
        
        const report = {
            timestamp,
            projectRoot: this.projectRoot,
            testCommand: this.testCommand,
            buildCommand: this.buildCommand,
            summary: {
                totalFiles: 0,
                filesWithDependencies: 0,
                filesWithoutDependencies: 0,
                batchesProcessed: 0,
                batchesWithDependencies: 0
            },
            results,
            logs: this.testResults,
            recommendations: []
        };
        
        // Calcular estadísticas
        if (Array.isArray(results) && results.length > 0) {
            if (results[0].file) {
                // Resultados individuales
                report.summary.totalFiles = results.length;
                report.summary.filesWithDependencies = results.filter(r => r.hasDependencies).length;
                report.summary.filesWithoutDependencies = results.filter(r => !r.hasDependencies).length;
            } else {
                // Resultados por lotes
                report.summary.batchesProcessed = results.length;
                report.summary.batchesWithDependencies = results.filter(r => r.hasDependencies).length;
                report.summary.totalFiles = results.reduce((sum, r) => sum + r.files.length, 0);
            }
        }
        
        // Generar recomendaciones
        if (report.summary.filesWithDependencies > 0 || report.summary.batchesWithDependencies > 0) {
            report.recommendations.push({
                type: 'DEPENDENCIES_FOUND',
                priority: 'HIGH',
                message: 'Se encontraron archivos con dependencias ocultas',
                action: 'Revisar los archivos marcados antes de eliminarlos del proyecto'
            });
        }
        
        if (report.summary.filesWithoutDependencies > 0) {
            report.recommendations.push({
                type: 'SAFE_TO_REMOVE',
                priority: 'LOW',
                message: `${report.summary.filesWithoutDependencies} archivos parecen seguros para eliminar`,
                action: 'Estos archivos pueden ser candidatos para limpieza'
            });
        }
        
        // Guardar reporte
        const reportPath = path.resolve(this.projectRoot, outputFile);
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        this.log(`📊 Reporte guardado: ${outputFile}`, 'success');
        return report;
    }

    async cleanup() {
        this.log('🧹 Limpiando archivos temporales...');
        await this.restoreAllFiles();
        
        if (this.renamedFiles.size > 0) {
            this.log(`⚠️  Quedan ${this.renamedFiles.size} archivos sin restaurar`, 'warning');
        }
    }
}

// Función principal para ejecutar desde línea de comandos
async function main() {
    const args = process.argv.slice(2);
    const analysisFile = args[0] || 'unreferenced-files-analysis-latest.json';
    const mode = args[1] || 'batch'; // 'individual' o 'batch'
    const batchSize = parseInt(args[2]) || 5;
    
    const tester = new ForcedSubstitutionTester({
        verbose: process.env.VERBOSE === 'true'
    });
    
    try {
        console.log('🧪 INICIANDO TESTS DE SUSTITUCIÓN FORZADA\n');
        
        // Cargar archivos objetivo
        const targetFiles = await tester.loadTargetFiles(analysisFile);
        
        if (targetFiles.length === 0) {
            console.log('❌ No se encontraron archivos para probar');
            return;
        }
        
        console.log(`📋 Se probarán ${targetFiles.length} archivos en modo ${mode}\n`);
        
        let results;
        
        if (mode === 'individual') {
            // Probar archivos individualmente
            results = [];
            for (const file of targetFiles) {
                const result = await tester.testSingleFile(file);
                results.push(result);
            }
        } else {
            // Probar en lotes
            results = await tester.testBatch(targetFiles, batchSize);
        }
        
        // Generar reporte
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportFile = `forced-substitution-report-${timestamp}.json`;
        const report = await tester.generateReport(results, reportFile);
        
        // Mostrar resumen
        console.log('\n📊 RESUMEN DE RESULTADOS:');
        console.log(`Total de archivos probados: ${report.summary.totalFiles}`);
        
        if (mode === 'individual') {
            console.log(`Archivos con dependencias: ${report.summary.filesWithDependencies}`);
            console.log(`Archivos sin dependencias: ${report.summary.filesWithoutDependencies}`);
        } else {
            console.log(`Lotes procesados: ${report.summary.batchesProcessed}`);
            console.log(`Lotes con dependencias: ${report.summary.batchesWithDependencies}`);
        }
        
        if (report.recommendations.length > 0) {
            console.log('\n💡 RECOMENDACIONES:');
            report.recommendations.forEach(rec => {
                console.log(`${rec.priority}: ${rec.message}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error en el test:', error.message);
    } finally {
        await tester.cleanup();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { ForcedSubstitutionTester };