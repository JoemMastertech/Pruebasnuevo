#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script de Detección de Referencias
 * Fase 2: Determinar qué archivos duplicados siguen siendo referenciados
 * 
 * Analiza el uso de carpetas duplicadas y archivos fuera de lugar
 */

class ReferenceDetector {
    constructor(rootPath, auditReportPath) {
        this.rootPath = rootPath;
        this.auditReportPath = auditReportPath;
        this.auditData = null;
        this.results = {
            duplicateAnalysis: [],
            orphanedFiles: [],
            activeReferences: [],
            migrationPlan: [],
            summary: {
                totalDuplicates: 0,
                activeDuplicates: 0,
                orphanedDuplicates: 0,
                filesToMigrate: 0,
                filesToDelete: 0
            }
        };
    }

    /**
     * Carga el reporte de auditoría
     */
    loadAuditReport() {
        try {
            const reportContent = fs.readFileSync(this.auditReportPath, 'utf8');
            this.auditData = JSON.parse(reportContent);
            console.log('✅ Reporte de auditoría cargado');
        } catch (error) {
            throw new Error(`Error cargando reporte de auditoría: ${error.message}`);
        }
    }

    /**
     * Busca referencias usando ripgrep o findstr
     */
    searchReferences(searchTerm, excludePaths = []) {
        try {
            // Intentar con ripgrep primero (más rápido)
            let command;
            let results = [];
            
            try {
                // Construir exclusiones para ripgrep
                const excludeArgs = excludePaths.map(p => `--glob '!${p}'`).join(' ');
                command = `rg "${searchTerm}" ${excludeArgs} --type-not binary --no-heading --line-number --with-filename`;
                const output = execSync(command, { cwd: this.rootPath, encoding: 'utf8' });
                results = output.trim().split('\n').filter(line => line.length > 0);
            } catch (rgError) {
                // Fallback a findstr en Windows
                try {
                    command = `findstr /s /n /i "${searchTerm}" *.js *.ts *.json *.md *.html *.css`;
                    const output = execSync(command, { cwd: this.rootPath, encoding: 'utf8' });
                    results = output.trim().split('\n').filter(line => line.length > 0);
                } catch (findstrError) {
                    console.warn(`⚠️ No se pudo buscar referencias para: ${searchTerm}`);
                    return [];
                }
            }
            
            return results.map(line => {
                const parts = line.split(':');
                if (parts.length >= 3) {
                    return {
                        file: parts[0],
                        line: parseInt(parts[1]) || 0,
                        content: parts.slice(2).join(':').trim(),
                        searchTerm: searchTerm
                    };
                }
                return null;
            }).filter(Boolean);
            
        } catch (error) {
            console.warn(`⚠️ Error buscando referencias para ${searchTerm}: ${error.message}`);
            return [];
        }
    }

    /**
     * Analiza duplicados críticos
     */
    analyzeDuplicates() {
        console.log('🔍 Analizando duplicados críticos...');
        
        for (const duplicate of this.auditData.duplicateIssues) {
            console.log(`\n📁 Analizando: ${duplicate.issue}`);
            
            const analysis = {
                pair: duplicate.pair,
                found: duplicate.found,
                paths: duplicate.paths,
                references: {},
                recommendation: '',
                priority: 'high'
            };
            
            // Buscar referencias para cada carpeta encontrada
            for (const folderName of duplicate.found) {
                console.log(`  🔎 Buscando referencias a: ${folderName}`);
                
                // Buscar diferentes patrones de referencia
                const searchPatterns = [
                    folderName,
                    `./${folderName}`,
                    `/${folderName}/`,
                    `"${folderName}"`,
                    `'${folderName}'`,
                    `import.*${folderName}`,
                    `from.*${folderName}`
                ];
                
                const allReferences = [];
                for (const pattern of searchPatterns) {
                    const refs = this.searchReferences(pattern, ['.git', 'node_modules', 'dist', 'compiled']);
                    allReferences.push(...refs);
                }
                
                // Eliminar duplicados
                const uniqueRefs = allReferences.filter((ref, index, self) => 
                    index === self.findIndex(r => r.file === ref.file && r.line === ref.line)
                );
                
                analysis.references[folderName] = uniqueRefs;
                console.log(`    ✅ ${uniqueRefs.length} referencias encontradas`);
            }
            
            // Determinar recomendación
            analysis.recommendation = this.generateDuplicateRecommendation(analysis);
            this.results.duplicateAnalysis.push(analysis);
            this.results.summary.totalDuplicates++;
            
            if (Object.values(analysis.references).some(refs => refs.length > 0)) {
                this.results.summary.activeDuplicates++;
            } else {
                this.results.summary.orphanedDuplicates++;
            }
        }
    }

    /**
     * Genera recomendación para duplicados
     */
    generateDuplicateRecommendation(analysis) {
        const [english, spanish] = analysis.pair;
        const englishRefs = analysis.references[english] || [];
        const spanishRefs = analysis.references[spanish] || [];
        
        if (englishRefs.length > spanishRefs.length) {
            return {
                action: 'consolidate',
                target: english,
                source: spanish,
                reason: `${english} tiene más referencias (${englishRefs.length} vs ${spanishRefs.length})`,
                steps: [
                    `Migrar contenido de ${spanish}/ a ${english}/`,
                    `Actualizar referencias que apunten a ${spanish}/`,
                    `Eliminar carpeta ${spanish}/`
                ]
            };
        } else if (spanishRefs.length > englishRefs.length) {
            return {
                action: 'consolidate',
                target: spanish,
                source: english,
                reason: `${spanish} tiene más referencias (${spanishRefs.length} vs ${englishRefs.length})`,
                steps: [
                    `Migrar contenido de ${english}/ a ${spanish}/`,
                    `Actualizar referencias que apunten a ${english}/`,
                    `Eliminar carpeta ${english}/`
                ]
            };
        } else if (englishRefs.length === 0 && spanishRefs.length === 0) {
            return {
                action: 'choose_standard',
                target: english, // Preferir inglés por convención
                source: spanish,
                reason: 'Ninguna carpeta tiene referencias activas, elegir estándar en inglés',
                steps: [
                    `Consolidar todo en ${english}/`,
                    `Eliminar carpeta ${spanish}/`,
                    'Actualizar documentación con estándar elegido'
                ]
            };
        } else {
            return {
                action: 'manual_review',
                target: null,
                source: null,
                reason: `Ambas carpetas tienen referencias similares (${englishRefs.length} vs ${spanishRefs.length})`,
                steps: [
                    'Revisar manualmente el contenido de ambas carpetas',
                    'Decidir cuál mantener basado en completitud del código',
                    'Consolidar en la carpeta elegida'
                ]
            };
        }
    }

    /**
     * Analiza archivos huérfanos
     */
    analyzeOrphanedFiles() {
        console.log('\n🗑️ Analizando archivos potencialmente huérfanos...');
        
        // Filtrar elementos fuera de lugar que no sean de Git
        const candidatesForDeletion = this.auditData.outOfPlaceItems.filter(item => 
            !item.relativePath.startsWith('.git') &&
            !item.relativePath.startsWith('node_modules') &&
            !item.relativePath.startsWith('dist') &&
            !item.relativePath.startsWith('compiled') &&
            item.type === 'file'
        );
        
        console.log(`📊 Analizando ${candidatesForDeletion.length} archivos candidatos...`);
        
        for (const file of candidatesForDeletion.slice(0, 20)) { // Limitar para evitar sobrecarga
            const fileName = path.basename(file.name, path.extname(file.name));
            const references = this.searchReferences(fileName, ['.git', 'node_modules']);
            
            if (references.length === 0) {
                this.results.orphanedFiles.push({
                    ...file,
                    references: [],
                    recommendation: 'delete',
                    reason: 'No se encontraron referencias'
                });
            } else {
                this.results.activeReferences.push({
                    ...file,
                    references: references,
                    recommendation: 'review',
                    reason: `${references.length} referencias encontradas`
                });
            }
        }
    }

    /**
     * Genera plan de migración
     */
    generateMigrationPlan() {
        console.log('\n📋 Generando plan de migración...');
        
        // Plan para duplicados
        for (const analysis of this.results.duplicateAnalysis) {
            if (analysis.recommendation.action === 'consolidate') {
                this.results.migrationPlan.push({
                    type: 'consolidate_duplicate',
                    priority: 'critical',
                    source: analysis.recommendation.source,
                    target: analysis.recommendation.target,
                    steps: analysis.recommendation.steps,
                    estimatedFiles: analysis.paths.length
                });
                this.results.summary.filesToMigrate += analysis.paths.length;
            }
        }
        
        // Plan para archivos huérfanos
        for (const orphan of this.results.orphanedFiles) {
            this.results.migrationPlan.push({
                type: 'delete_orphan',
                priority: 'low',
                target: orphan.relativePath,
                reason: orphan.reason,
                steps: [`Eliminar archivo: ${orphan.relativePath}`]
            });
            this.results.summary.filesToDelete++;
        }
    }

    /**
     * Genera reporte de referencias
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results.summary,
            duplicateAnalysis: this.results.duplicateAnalysis,
            orphanedFiles: this.results.orphanedFiles,
            migrationPlan: this.results.migrationPlan,
            nextSteps: [
                'Revisar plan de migración generado',
                'Ejecutar consolidación de duplicados críticos',
                'Validar que no se rompa funcionalidad',
                'Proceder con Fase 3: Clasificación'
            ]
        };
        
        // Guardar reporte JSON
        fs.writeFileSync(
            path.join(this.rootPath, 'reference-analysis.json'),
            JSON.stringify(report, null, 2)
        );
        
        // Generar reporte Markdown
        let markdown = `# 🔍 Análisis de Referencias - Fase 2\n\n`;
        markdown += `**Fecha:** ${new Date().toLocaleString()}\n\n`;
        
        // Resumen
        markdown += `## 📊 Resumen\n\n`;
        markdown += `- **Duplicados analizados:** ${this.results.summary.totalDuplicates}\n`;
        markdown += `- **Duplicados activos:** ${this.results.summary.activeDuplicates}\n`;
        markdown += `- **Duplicados huérfanos:** ${this.results.summary.orphanedDuplicates}\n`;
        markdown += `- **Archivos a migrar:** ${this.results.summary.filesToMigrate}\n`;
        markdown += `- **Archivos a eliminar:** ${this.results.summary.filesToDelete}\n\n`;
        
        // Análisis de duplicados
        markdown += `## 🔄 Análisis de Duplicados\n\n`;
        for (const analysis of this.results.duplicateAnalysis) {
            markdown += `### ${analysis.pair.join('/')}\n`;
            markdown += `**Acción recomendada:** ${analysis.recommendation.action}\n`;
            markdown += `**Razón:** ${analysis.recommendation.reason}\n\n`;
            
            if (analysis.recommendation.steps) {
                markdown += `**Pasos:**\n`;
                for (const step of analysis.recommendation.steps) {
                    markdown += `1. ${step}\n`;
                }
                markdown += `\n`;
            }
        }
        
        // Plan de migración
        markdown += `## 📋 Plan de Migración\n\n`;
        for (const plan of this.results.migrationPlan) {
            markdown += `### ${plan.type} (${plan.priority})\n`;
            if (plan.source && plan.target) {
                markdown += `**De:** ${plan.source} → **A:** ${plan.target}\n`;
            } else if (plan.target) {
                markdown += `**Objetivo:** ${plan.target}\n`;
            }
            if (plan.reason) {
                markdown += `**Razón:** ${plan.reason}\n`;
            }
            markdown += `\n`;
        }
        
        fs.writeFileSync(
            path.join(this.rootPath, 'REFERENCE_ANALYSIS.md'),
            markdown
        );
        
        return report;
    }

    /**
     * Ejecuta el análisis completo
     */
    async analyze() {
        console.log('🔍 Iniciando análisis de referencias...');
        
        this.loadAuditReport();
        this.analyzeDuplicates();
        this.analyzeOrphanedFiles();
        this.generateMigrationPlan();
        
        const report = this.generateReport();
        
        console.log('\n📊 Análisis completado:');
        console.log(`✅ ${this.results.summary.totalDuplicates} duplicados analizados`);
        console.log(`🔄 ${this.results.summary.activeDuplicates} duplicados con referencias activas`);
        console.log(`📁 ${this.results.summary.filesToMigrate} archivos para migrar`);
        console.log(`🗑️ ${this.results.summary.filesToDelete} archivos para eliminar`);
        
        console.log('\n📄 Reportes generados:');
        console.log('- reference-analysis.json');
        console.log('- REFERENCE_ANALYSIS.md');
        
        return report;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const auditReportPath = process.argv[3] || path.join(projectPath, 'audit-report.json');
    
    const detector = new ReferenceDetector(projectPath, auditReportPath);
    
    detector.analyze().then(report => {
        console.log('\n✅ Análisis de referencias completado');
        
        if (report.summary.activeDuplicates > 0) {
            console.log('\n🚨 ATENCIÓN: Se encontraron duplicados con referencias activas');
            console.log('Revisar REFERENCE_ANALYSIS.md para plan de consolidación');
        }
    }).catch(error => {
        console.error('❌ Error durante el análisis:', error);
        process.exit(1);
    });
}

module.exports = ReferenceDetector;