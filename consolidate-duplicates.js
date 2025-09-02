#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script de Consolidación de Duplicados
 * Fase 3 & 4: Clasificación y Ejecución Controlada
 * 
 * Consolida carpetas duplicadas de manera segura con validación
 */

class DuplicateConsolidator {
    constructor(rootPath, referenceAnalysisPath) {
        this.rootPath = rootPath;
        this.referenceAnalysisPath = referenceAnalysisPath;
        this.analysisData = null;
        this.backupDir = path.join(rootPath, '__CONSOLIDATION_BACKUP__');
        this.results = {
            consolidations: [],
            errors: [],
            summary: {
                totalConsolidations: 0,
                successfulConsolidations: 0,
                failedConsolidations: 0,
                filesProcessed: 0
            }
        };
    }

    /**
     * Carga el análisis de referencias
     */
    loadReferenceAnalysis() {
        try {
            const analysisContent = fs.readFileSync(this.referenceAnalysisPath, 'utf8');
            this.analysisData = JSON.parse(analysisContent);
            console.log('✅ Análisis de referencias cargado');
        } catch (error) {
            throw new Error(`Error cargando análisis de referencias: ${error.message}`);
        }
    }

    /**
     * Crea respaldo de seguridad
     */
    createBackup() {
        console.log('💾 Creando respaldo de seguridad...');
        
        if (fs.existsSync(this.backupDir)) {
            console.log('⚠️ Eliminando respaldo anterior...');
            fs.rmSync(this.backupDir, { recursive: true, force: true });
        }
        
        fs.mkdirSync(this.backupDir, { recursive: true });
        
        // Respaldar solo las carpetas que se van a consolidar
        for (const plan of this.analysisData.migrationPlan) {
            if (plan.type === 'consolidate_duplicate') {
                const sourcePath = path.join(this.rootPath, plan.source);
                const targetPath = path.join(this.rootPath, plan.target);
                
                if (fs.existsSync(sourcePath)) {
                    const backupSourcePath = path.join(this.backupDir, plan.source);
                    this.copyDirectory(sourcePath, backupSourcePath);
                    console.log(`📁 Respaldado: ${plan.source}`);
                }
                
                if (fs.existsSync(targetPath)) {
                    const backupTargetPath = path.join(this.backupDir, plan.target);
                    this.copyDirectory(targetPath, backupTargetPath);
                    console.log(`📁 Respaldado: ${plan.target}`);
                }
            }
        }
        
        console.log('✅ Respaldo completado');
    }

    /**
     * Copia directorio recursivamente
     */
    copyDirectory(source, destination) {
        if (!fs.existsSync(source)) return;
        
        fs.mkdirSync(destination, { recursive: true });
        
        const items = fs.readdirSync(source);
        for (const item of items) {
            const sourcePath = path.join(source, item);
            const destPath = path.join(destination, item);
            
            const stats = fs.statSync(sourcePath);
            if (stats.isDirectory()) {
                this.copyDirectory(sourcePath, destPath);
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }
        }
    }

    /**
     * Consolida una carpeta duplicada
     */
    consolidateDuplicate(plan) {
        console.log(`\n🔄 Consolidando: ${plan.source} → ${plan.target}`);
        
        const sourcePath = path.join(this.rootPath, plan.source);
        const targetPath = path.join(this.rootPath, plan.target);
        const tempPath = path.join(this.rootPath, `__TEMP_${plan.source}__`);
        
        const consolidation = {
            source: plan.source,
            target: plan.target,
            status: 'pending',
            filesProcessed: 0,
            errors: []
        };
        
        try {
            // Verificar que ambas carpetas existen
            if (!fs.existsSync(sourcePath)) {
                console.log(`⚠️ Carpeta fuente no existe: ${plan.source}`);
                consolidation.status = 'skipped';
                consolidation.errors.push('Carpeta fuente no existe');
                return consolidation;
            }
            
            if (!fs.existsSync(targetPath)) {
                console.log(`⚠️ Carpeta destino no existe: ${plan.target}`);
                console.log(`📁 Renombrando ${plan.source} → ${plan.target}`);
                fs.renameSync(sourcePath, targetPath);
                consolidation.status = 'renamed';
                consolidation.filesProcessed = this.countFiles(targetPath);
                return consolidation;
            }
            
            // Renombrar carpeta fuente temporalmente
            console.log(`📝 Renombrando ${plan.source} → __TEMP_${plan.source}__`);
            fs.renameSync(sourcePath, tempPath);
            
            // Mergear contenido
            console.log(`🔀 Mergeando contenido...`);
            const mergedFiles = this.mergeDirectories(tempPath, targetPath);
            consolidation.filesProcessed = mergedFiles;
            
            // Eliminar carpeta temporal
            console.log(`🗑️ Eliminando carpeta temporal...`);
            fs.rmSync(tempPath, { recursive: true, force: true });
            
            consolidation.status = 'completed';
            console.log(`✅ Consolidación completada: ${mergedFiles} archivos procesados`);
            
        } catch (error) {
            console.error(`❌ Error consolidando ${plan.source}:`, error.message);
            consolidation.status = 'failed';
            consolidation.errors.push(error.message);
            
            // Intentar restaurar desde temporal si existe
            if (fs.existsSync(tempPath)) {
                try {
                    fs.renameSync(tempPath, sourcePath);
                    console.log(`🔄 Restaurado desde temporal: ${plan.source}`);
                } catch (restoreError) {
                    console.error(`❌ Error restaurando: ${restoreError.message}`);
                }
            }
        }
        
        return consolidation;
    }

    /**
     * Mergea directorios recursivamente
     */
    mergeDirectories(sourceDir, targetDir) {
        let filesProcessed = 0;
        
        const items = fs.readdirSync(sourceDir);
        for (const item of items) {
            const sourcePath = path.join(sourceDir, item);
            const targetPath = path.join(targetDir, item);
            
            const stats = fs.statSync(sourcePath);
            
            if (stats.isDirectory()) {
                if (!fs.existsSync(targetPath)) {
                    fs.mkdirSync(targetPath, { recursive: true });
                }
                filesProcessed += this.mergeDirectories(sourcePath, targetPath);
            } else {
                if (fs.existsSync(targetPath)) {
                    // Archivo existe, crear versión con sufijo
                    const ext = path.extname(item);
                    const name = path.basename(item, ext);
                    const newName = `${name}_merged${ext}`;
                    const newTargetPath = path.join(targetDir, newName);
                    
                    console.log(`⚠️ Conflicto: ${item} → ${newName}`);
                    fs.copyFileSync(sourcePath, newTargetPath);
                } else {
                    fs.copyFileSync(sourcePath, targetPath);
                }
                filesProcessed++;
            }
        }
        
        return filesProcessed;
    }

    /**
     * Cuenta archivos en un directorio
     */
    countFiles(dirPath) {
        let count = 0;
        
        try {
            const items = fs.readdirSync(dirPath);
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                const stats = fs.statSync(itemPath);
                
                if (stats.isDirectory()) {
                    count += this.countFiles(itemPath);
                } else {
                    count++;
                }
            }
        } catch (error) {
            console.warn(`⚠️ Error contando archivos en ${dirPath}:`, error.message);
        }
        
        return count;
    }

    /**
     * Valida que el proyecto sigue funcionando
     */
    validateProject() {
        console.log('\n🧪 Validando integridad del proyecto...');
        
        const validations = {
            indexHtml: false,
            packageJson: false,
            tsconfig: false,
            mainDirectories: false
        };
        
        try {
            // Verificar index.html
            const indexPath = path.join(this.rootPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                validations.indexHtml = true;
                console.log('✅ index.html existe');
            } else {
                console.log('❌ index.html no encontrado');
            }
            
            // Verificar package.json
            const packagePath = path.join(this.rootPath, 'Infrastructure', 'Config', 'package.json');
            if (fs.existsSync(packagePath)) {
                validations.packageJson = true;
                console.log('✅ package.json existe');
            } else {
                console.log('❌ package.json no encontrado');
            }
            
            // Verificar tsconfig.json
            const tsconfigPath = path.join(this.rootPath, 'Infrastructure', 'Config', 'tsconfig.json');
            if (fs.existsSync(tsconfigPath)) {
                validations.tsconfig = true;
                console.log('✅ tsconfig.json existe');
            } else {
                console.log('❌ tsconfig.json no encontrado');
            }
            
            // Verificar directorios principales
            const mainDirs = ['Domain', 'Aplicacion', 'Infraestructura', 'Shared', 'Tests'];
            const existingDirs = mainDirs.filter(dir => 
                fs.existsSync(path.join(this.rootPath, dir))
            );
            
            if (existingDirs.length >= 4) {
                validations.mainDirectories = true;
                console.log(`✅ Directorios principales: ${existingDirs.join(', ')}`);
            } else {
                console.log(`❌ Faltan directorios principales: ${existingDirs.join(', ')}`);
            }
            
        } catch (error) {
            console.error('❌ Error durante validación:', error.message);
        }
        
        const allValid = Object.values(validations).every(v => v);
        console.log(allValid ? '✅ Validación exitosa' : '⚠️ Validación con advertencias');
        
        return validations;
    }

    /**
     * Actualiza referencias en archivos
     */
    updateReferences() {
        console.log('\n🔄 Actualizando referencias...');
        
        // Mapeo de cambios realizados
        const referenceMap = {
            'Application/': 'Aplicacion/',
            'Dominio/': 'Domain/',
            'Infrastructure/': 'Infraestructura/',
            'Componentes/': 'Components/'
        };
        
        // Archivos principales que pueden tener referencias
        const filesToUpdate = [
            'index.html',
            'hexagonal-bootstrap.js',
            'ESTRUCTURA_PROYECTO.md'
        ];
        
        for (const fileName of filesToUpdate) {
            const filePath = path.join(this.rootPath, fileName);
            if (fs.existsSync(filePath)) {
                try {
                    let content = fs.readFileSync(filePath, 'utf8');
                    let updated = false;
                    
                    for (const [oldRef, newRef] of Object.entries(referenceMap)) {
                        if (content.includes(oldRef)) {
                            content = content.replace(new RegExp(oldRef, 'g'), newRef);
                            updated = true;
                            console.log(`📝 Actualizado ${fileName}: ${oldRef} → ${newRef}`);
                        }
                    }
                    
                    if (updated) {
                        fs.writeFileSync(filePath, content, 'utf8');
                    }
                } catch (error) {
                    console.error(`❌ Error actualizando ${fileName}:`, error.message);
                }
            }
        }
    }

    /**
     * Genera reporte de consolidación
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results.summary,
            consolidations: this.results.consolidations,
            errors: this.results.errors,
            backupLocation: this.backupDir,
            nextSteps: [
                'Verificar que la aplicación funciona correctamente',
                'Ejecutar tests si están disponibles',
                'Actualizar documentación',
                'Eliminar respaldo si todo funciona bien'
            ]
        };
        
        fs.writeFileSync(
            path.join(this.rootPath, 'consolidation-report.json'),
            JSON.stringify(report, null, 2)
        );
        
        // Reporte Markdown
        let markdown = `# 🔄 Reporte de Consolidación\n\n`;
        markdown += `**Fecha:** ${new Date().toLocaleString()}\n\n`;
        
        markdown += `## 📊 Resumen\n\n`;
        markdown += `- **Consolidaciones totales:** ${this.results.summary.totalConsolidations}\n`;
        markdown += `- **Exitosas:** ${this.results.summary.successfulConsolidations}\n`;
        markdown += `- **Fallidas:** ${this.results.summary.failedConsolidations}\n`;
        markdown += `- **Archivos procesados:** ${this.results.summary.filesProcessed}\n\n`;
        
        markdown += `## 🔄 Consolidaciones Realizadas\n\n`;
        for (const consolidation of this.results.consolidations) {
            const status = consolidation.status === 'completed' ? '✅' : 
                          consolidation.status === 'failed' ? '❌' : '⚠️';
            markdown += `### ${status} ${consolidation.source} → ${consolidation.target}\n`;
            markdown += `**Estado:** ${consolidation.status}\n`;
            markdown += `**Archivos procesados:** ${consolidation.filesProcessed}\n`;
            if (consolidation.errors.length > 0) {
                markdown += `**Errores:** ${consolidation.errors.join(', ')}\n`;
            }
            markdown += `\n`;
        }
        
        if (this.results.errors.length > 0) {
            markdown += `## ❌ Errores\n\n`;
            for (const error of this.results.errors) {
                markdown += `- ${error}\n`;
            }
            markdown += `\n`;
        }
        
        markdown += `## 💾 Respaldo\n\n`;
        markdown += `Los archivos originales están respaldados en: \`${this.backupDir}\`\n\n`;
        
        fs.writeFileSync(
            path.join(this.rootPath, 'CONSOLIDATION_REPORT.md'),
            markdown
        );
        
        return report;
    }

    /**
     * Ejecuta la consolidación completa
     */
    async consolidate() {
        console.log('🔄 Iniciando consolidación de duplicados...');
        
        try {
            this.loadReferenceAnalysis();
            this.createBackup();
            
            // Filtrar solo consolidaciones de duplicados
            const consolidationPlans = this.analysisData.migrationPlan.filter(
                plan => plan.type === 'consolidate_duplicate'
            );
            
            console.log(`\n📋 Ejecutando ${consolidationPlans.length} consolidaciones...`);
            
            for (const plan of consolidationPlans) {
                const result = this.consolidateDuplicate(plan);
                this.results.consolidations.push(result);
                this.results.summary.totalConsolidations++;
                
                if (result.status === 'completed' || result.status === 'renamed') {
                    this.results.summary.successfulConsolidations++;
                    this.results.summary.filesProcessed += result.filesProcessed;
                } else if (result.status === 'failed') {
                    this.results.summary.failedConsolidations++;
                    this.results.errors.push(`Error en ${result.source}: ${result.errors.join(', ')}`);
                }
            }
            
            // Actualizar referencias
            this.updateReferences();
            
            // Validar proyecto
            const validation = this.validateProject();
            
            // Generar reporte
            const report = this.generateReport();
            
            console.log('\n📊 Consolidación completada:');
            console.log(`✅ ${this.results.summary.successfulConsolidations}/${this.results.summary.totalConsolidations} consolidaciones exitosas`);
            console.log(`📁 ${this.results.summary.filesProcessed} archivos procesados`);
            
            if (this.results.summary.failedConsolidations > 0) {
                console.log(`❌ ${this.results.summary.failedConsolidations} consolidaciones fallidas`);
            }
            
            console.log('\n📄 Reportes generados:');
            console.log('- consolidation-report.json');
            console.log('- CONSOLIDATION_REPORT.md');
            
            console.log(`\n💾 Respaldo disponible en: ${this.backupDir}`);
            
            return report;
            
        } catch (error) {
            console.error('❌ Error durante consolidación:', error);
            throw error;
        }
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const referenceAnalysisPath = process.argv[3] || path.join(projectPath, 'reference-analysis.json');
    
    const consolidator = new DuplicateConsolidator(projectPath, referenceAnalysisPath);
    
    consolidator.consolidate().then(report => {
        console.log('\n✅ Proceso de consolidación completado');
        
        if (report.summary.failedConsolidations === 0) {
            console.log('🎉 Todas las consolidaciones fueron exitosas');
            console.log('🧪 Recomendación: Probar la aplicación y eliminar respaldo si todo funciona');
        } else {
            console.log('⚠️ Algunas consolidaciones fallaron, revisar reporte para detalles');
        }
    }).catch(error => {
        console.error('❌ Error durante el proceso:', error);
        process.exit(1);
    });
}

module.exports = DuplicateConsolidator;