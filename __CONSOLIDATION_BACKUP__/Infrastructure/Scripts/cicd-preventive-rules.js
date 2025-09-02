/**
 * Reglas Preventivas de CI/CD
 * Valida el inventario de archivos y detecta archivos no autorizados o rutas antiguas
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class CICDPreventiveRules {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.approvedInventoryFile = options.approvedInventoryFile || 'approved-files-inventory.json';
        this.buildDir = options.buildDir || 'dist';
        this.excludePatterns = options.excludePatterns || [
            /node_modules/,
            /\.git/,
            /coverage/,
            /\.nyc_output/,
            /\.cache/,
            /\.tmp/,
            /\.log$/,
            /\.DS_Store$/
        ];
        this.verbose = options.verbose || false;
        this.violations = [];
        this.warnings = [];
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '🔍',
            success: '✅',
            warning: '⚠️ ',
            error: '❌',
            violation: '🚨'
        }[level] || '🔍';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async loadApprovedInventory() {
        const inventoryPath = path.join(this.projectRoot, this.approvedInventoryFile);
        
        try {
            const data = await fs.readFile(inventoryPath, 'utf8');
            const inventory = JSON.parse(data);
            
            this.log(`Inventario aprobado cargado: ${inventory.files?.length || 0} archivos`);
            return inventory;
            
        } catch (error) {
            this.log(`Error cargando inventario aprobado: ${error.message}`, 'error');
            
            // Crear inventario inicial si no existe
            return await this.createInitialInventory();
        }
    }

    async createInitialInventory() {
        this.log('Creando inventario inicial aprobado...');
        
        const currentFiles = await this.scanCurrentFiles();
        
        const inventory = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            description: 'Inventario inicial de archivos aprobados',
            totalFiles: currentFiles.length,
            files: currentFiles,
            rules: {
                allowNewFiles: false,
                allowFileModification: true,
                allowFileDeletion: true,
                requireApprovalForNewFiles: true
            },
            checksums: {
                enabled: true,
                algorithm: 'sha256'
            }
        };
        
        const inventoryPath = path.join(this.projectRoot, this.approvedInventoryFile);
        await fs.writeFile(inventoryPath, JSON.stringify(inventory, null, 2));
        
        this.log(`Inventario inicial creado con ${currentFiles.length} archivos`, 'success');
        
        return inventory;
    }

    async scanCurrentFiles() {
        const files = [];
        
        async function scanDirectory(dir, basePath = '') {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/');
                
                if (entry.isDirectory()) {
                    await scanDirectory(fullPath, relativePath);
                } else if (entry.isFile()) {
                    const stats = await fs.stat(fullPath);
                    
                    files.push({
                        path: relativePath,
                        name: entry.name,
                        extension: path.extname(entry.name),
                        size: stats.size,
                        modified: stats.mtime.toISOString(),
                        type: this.getFileType(entry.name)
                    });
                }
            }
        }

        await scanDirectory(this.projectRoot);
        
        // Filtrar archivos excluidos
        return files.filter(file => 
            !this.excludePatterns.some(pattern => pattern.test(file.path))
        );
    }

    getFileType(fileName) {
        const ext = path.extname(fileName).toLowerCase();
        
        const typeMap = {
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.css': 'stylesheet',
            '.scss': 'stylesheet',
            '.less': 'stylesheet',
            '.html': 'markup',
            '.json': 'config',
            '.md': 'documentation',
            '.txt': 'text',
            '.png': 'image',
            '.jpg': 'image',
            '.jpeg': 'image',
            '.svg': 'image',
            '.gif': 'image'
        };
        
        return typeMap[ext] || 'other';
    }

    async calculateFileChecksum(filePath) {
        try {
            const fullPath = path.join(this.projectRoot, filePath);
            const data = await fs.readFile(fullPath);
            return crypto.createHash('sha256').update(data).digest('hex');
        } catch (error) {
            return null;
        }
    }

    async validateInventory() {
        this.log('🔍 Iniciando validación de inventario...');
        
        const approvedInventory = await this.loadApprovedInventory();
        const currentFiles = await this.scanCurrentFiles();
        
        // Crear mapas para comparación eficiente
        const approvedMap = new Map(approvedInventory.files.map(f => [f.path, f]));
        const currentMap = new Map(currentFiles.map(f => [f.path, f]));
        
        // Validar archivos
        await this.validateNewFiles(currentMap, approvedMap, approvedInventory.rules);
        await this.validateDeletedFiles(approvedMap, currentMap);
        await this.validateModifiedFiles(currentMap, approvedMap, approvedInventory);
        await this.validateBuildOutput();
        
        return this.generateValidationReport(approvedInventory, currentFiles);
    }

    async validateNewFiles(currentMap, approvedMap, rules) {
        this.log('Validando archivos nuevos...');
        
        const newFiles = [];
        
        for (const [filePath, fileInfo] of currentMap) {
            if (!approvedMap.has(filePath)) {
                newFiles.push(fileInfo);
            }
        }
        
        if (newFiles.length > 0) {
            this.log(`Encontrados ${newFiles.length} archivos nuevos`);
            
            for (const file of newFiles) {
                if (rules.allowNewFiles) {
                    this.warnings.push({
                        type: 'NEW_FILE',
                        severity: 'warning',
                        file: file.path,
                        message: `Archivo nuevo detectado: ${file.path}`,
                        action: 'Revisar si el archivo debe ser agregado al inventario aprobado'
                    });
                } else {
                    this.violations.push({
                        type: 'UNAUTHORIZED_NEW_FILE',
                        severity: 'error',
                        file: file.path,
                        message: `Archivo nuevo no autorizado: ${file.path}`,
                        action: 'Eliminar el archivo o agregarlo al inventario aprobado'
                    });
                }
            }
        }
    }

    async validateDeletedFiles(approvedMap, currentMap) {
        this.log('Validando archivos eliminados...');
        
        const deletedFiles = [];
        
        for (const [filePath, fileInfo] of approvedMap) {
            if (!currentMap.has(filePath)) {
                deletedFiles.push(fileInfo);
            }
        }
        
        if (deletedFiles.length > 0) {
            this.log(`Encontrados ${deletedFiles.length} archivos eliminados`);
            
            for (const file of deletedFiles) {
                // Los archivos eliminados generalmente son aceptables
                this.warnings.push({
                    type: 'DELETED_FILE',
                    severity: 'info',
                    file: file.path,
                    message: `Archivo eliminado: ${file.path}`,
                    action: 'Actualizar inventario aprobado si la eliminación es intencional'
                });
            }
        }
    }

    async validateModifiedFiles(currentMap, approvedMap, inventory) {
        if (!inventory.checksums?.enabled) {
            return;
        }
        
        this.log('Validando archivos modificados...');
        
        const modifiedFiles = [];
        
        for (const [filePath, currentFile] of currentMap) {
            const approvedFile = approvedMap.get(filePath);
            
            if (approvedFile) {
                // Comparar checksums si están disponibles
                if (approvedFile.checksum) {
                    const currentChecksum = await this.calculateFileChecksum(filePath);
                    
                    if (currentChecksum && currentChecksum !== approvedFile.checksum) {
                        modifiedFiles.push({
                            path: filePath,
                            oldChecksum: approvedFile.checksum,
                            newChecksum: currentChecksum
                        });
                    }
                } else {
                    // Comparar por tamaño y fecha de modificación
                    if (currentFile.size !== approvedFile.size) {
                        modifiedFiles.push({
                            path: filePath,
                            reason: 'size_change',
                            oldSize: approvedFile.size,
                            newSize: currentFile.size
                        });
                    }
                }
            }
        }
        
        if (modifiedFiles.length > 0) {
            this.log(`Encontrados ${modifiedFiles.length} archivos modificados`);
            
            for (const file of modifiedFiles) {
                this.warnings.push({
                    type: 'MODIFIED_FILE',
                    severity: 'info',
                    file: file.path,
                    message: `Archivo modificado: ${file.path}`,
                    details: file,
                    action: 'Verificar que los cambios son intencionales'
                });
            }
        }
    }

    async validateBuildOutput() {
        this.log('Validando salida del build...');
        
        const buildPath = path.join(this.projectRoot, this.buildDir);
        
        try {
            await fs.access(buildPath);
            
            const buildFiles = await this.scanBuildDirectory(buildPath);
            
            // Validar que no hay archivos obsoletos en el build
            await this.validateBuildContents(buildFiles);
            
        } catch (error) {
            this.violations.push({
                type: 'BUILD_MISSING',
                severity: 'error',
                message: `Directorio de build no encontrado: ${this.buildDir}`,
                action: 'Ejecutar el proceso de build antes de la validación'
            });
        }
    }

    async scanBuildDirectory(buildPath) {
        const files = [];
        
        async function scanDir(dir, basePath = '') {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/');
                
                if (entry.isDirectory()) {
                    await scanDir(fullPath, relativePath);
                } else {
                    const stats = await fs.stat(fullPath);
                    files.push({
                        path: relativePath,
                        name: entry.name,
                        size: stats.size,
                        fullPath
                    });
                }
            }
        }
        
        await scanDir(buildPath);
        return files;
    }

    async validateBuildContents(buildFiles) {
        // Buscar patrones sospechosos en el build
        const suspiciousPatterns = [
            /\.backup/,
            /\.old/,
            /\.tmp/,
            /test.*\.js$/,
            /spec.*\.js$/,
            /\.test\./,
            /\.spec\./,
            /debug/,
            /console\.log/
        ];
        
        for (const file of buildFiles) {
            // Verificar nombres de archivo sospechosos
            if (suspiciousPatterns.some(pattern => pattern.test(file.path))) {
                this.violations.push({
                    type: 'SUSPICIOUS_BUILD_FILE',
                    severity: 'warning',
                    file: file.path,
                    message: `Archivo sospechoso en build: ${file.path}`,
                    action: 'Verificar si este archivo debería estar en el build final'
                });
            }
            
            // Verificar contenido de archivos JavaScript
            if (file.name.endsWith('.js')) {
                await this.validateJavaScriptBuildFile(file);
            }
        }
    }

    async validateJavaScriptBuildFile(file) {
        try {
            const content = await fs.readFile(file.fullPath, 'utf8');
            
            // Buscar patrones problemáticos en el código
            const problematicPatterns = [
                { pattern: /console\.log\(/g, message: 'console.log encontrado en build' },
                { pattern: /debugger;/g, message: 'debugger statement encontrado en build' },
                { pattern: /\/\*\s*TODO/g, message: 'Comentarios TODO encontrados en build' },
                { pattern: /\/\*\s*FIXME/g, message: 'Comentarios FIXME encontrados en build' }
            ];
            
            for (const { pattern, message } of problematicPatterns) {
                const matches = content.match(pattern);
                if (matches && matches.length > 0) {
                    this.warnings.push({
                        type: 'BUILD_CONTENT_WARNING',
                        severity: 'warning',
                        file: file.path,
                        message: `${message} en ${file.path}`,
                        count: matches.length,
                        action: 'Revisar y limpiar el código antes del build'
                    });
                }
            }
            
        } catch (error) {
            // Error leyendo archivo, continuar
        }
    }

    generateValidationReport(approvedInventory, currentFiles) {
        const timestamp = new Date().toISOString();
        
        const report = {
            timestamp,
            version: '1.0.0',
            projectRoot: this.projectRoot,
            validation: {
                passed: this.violations.length === 0,
                violationCount: this.violations.length,
                warningCount: this.warnings.length
            },
            inventory: {
                approved: {
                    version: approvedInventory.version,
                    timestamp: approvedInventory.timestamp,
                    fileCount: approvedInventory.files.length
                },
                current: {
                    fileCount: currentFiles.length,
                    totalSize: currentFiles.reduce((sum, f) => sum + f.size, 0)
                }
            },
            violations: this.violations,
            warnings: this.warnings,
            summary: {
                newFiles: this.violations.filter(v => v.type === 'UNAUTHORIZED_NEW_FILE').length,
                suspiciousFiles: this.violations.filter(v => v.type === 'SUSPICIOUS_BUILD_FILE').length,
                buildIssues: this.violations.filter(v => v.type === 'BUILD_MISSING').length
            },
            recommendations: this.generateRecommendations()
        };
        
        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.violations.length === 0) {
            recommendations.push({
                type: 'SUCCESS',
                priority: 'info',
                message: 'Validación de inventario exitosa',
                action: 'El proyecto cumple con todas las reglas preventivas'
            });
        } else {
            recommendations.push({
                type: 'VIOLATIONS_FOUND',
                priority: 'high',
                message: `Se encontraron ${this.violations.length} violaciones`,
                action: 'Revisar y corregir las violaciones antes de continuar con el deployment'
            });
        }
        
        if (this.warnings.length > 0) {
            recommendations.push({
                type: 'WARNINGS_FOUND',
                priority: 'medium',
                message: `Se encontraron ${this.warnings.length} advertencias`,
                action: 'Revisar las advertencias y actualizar el inventario si es necesario'
            });
        }
        
        // Recomendaciones específicas
        const newFileViolations = this.violations.filter(v => v.type === 'UNAUTHORIZED_NEW_FILE');
        if (newFileViolations.length > 0) {
            recommendations.push({
                type: 'NEW_FILES_ACTION',
                priority: 'high',
                message: 'Archivos nuevos no autorizados detectados',
                action: 'Eliminar archivos no necesarios o agregarlos al inventario aprobado'
            });
        }
        
        return recommendations;
    }

    async saveReport(report, filename) {
        const reportPath = path.join(this.projectRoot, filename);
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        this.log(`Reporte guardado: ${filename}`, 'success');
        return reportPath;
    }

    async updateApprovedInventory() {
        this.log('Actualizando inventario aprobado...');
        
        const currentFiles = await this.scanCurrentFiles();
        
        // Calcular checksums para archivos importantes
        for (const file of currentFiles) {
            if (file.type === 'javascript' || file.type === 'typescript') {
                file.checksum = await this.calculateFileChecksum(file.path);
            }
        }
        
        const inventory = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            description: 'Inventario actualizado de archivos aprobados',
            totalFiles: currentFiles.length,
            files: currentFiles,
            rules: {
                allowNewFiles: false,
                allowFileModification: true,
                allowFileDeletion: true,
                requireApprovalForNewFiles: true
            },
            checksums: {
                enabled: true,
                algorithm: 'sha256'
            }
        };
        
        const inventoryPath = path.join(this.projectRoot, this.approvedInventoryFile);
        await fs.writeFile(inventoryPath, JSON.stringify(inventory, null, 2));
        
        this.log(`Inventario actualizado con ${currentFiles.length} archivos`, 'success');
        
        return inventory;
    }
}

// Función principal para ejecutar desde línea de comandos
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'validate';
    
    const rules = new CICDPreventiveRules({
        verbose: process.env.VERBOSE === 'true'
    });
    
    try {
        if (command === 'validate') {
            console.log('🔍 INICIANDO VALIDACIÓN DE REGLAS PREVENTIVAS\n');
            
            const report = await rules.validateInventory();
            
            // Guardar reporte
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const reportFile = `cicd-validation-report-${timestamp}.json`;
            await rules.saveReport(report, reportFile);
            
            // Mostrar resumen
            console.log('\n📊 RESUMEN DE VALIDACIÓN:');
            console.log(`Estado: ${report.validation.passed ? '✅ APROBADO' : '❌ RECHAZADO'}`);
            console.log(`Violaciones: ${report.validation.violationCount}`);
            console.log(`Advertencias: ${report.validation.warningCount}`);
            console.log(`Archivos actuales: ${report.inventory.current.fileCount}`);
            
            if (report.violations.length > 0) {
                console.log('\n🚨 VIOLACIONES:');
                report.violations.forEach(violation => {
                    console.log(`   ${violation.severity.toUpperCase()}: ${violation.message}`);
                });
            }
            
            if (report.recommendations.length > 0) {
                console.log('\n💡 RECOMENDACIONES:');
                report.recommendations.forEach(rec => {
                    console.log(`   ${rec.priority.toUpperCase()}: ${rec.message}`);
                });
            }
            
            // Salir con código de error si hay violaciones
            if (!report.validation.passed) {
                process.exit(1);
            }
            
        } else if (command === 'update-inventory') {
            console.log('📋 ACTUALIZANDO INVENTARIO APROBADO\n');
            
            const inventory = await rules.updateApprovedInventory();
            
            console.log('✅ Inventario actualizado correctamente');
            console.log(`Total de archivos: ${inventory.totalFiles}`);
            
        } else {
            console.log('❌ Comando no reconocido. Uso:');
            console.log('   node cicd-preventive-rules.js validate');
            console.log('   node cicd-preventive-rules.js update-inventory');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { CICDPreventiveRules };