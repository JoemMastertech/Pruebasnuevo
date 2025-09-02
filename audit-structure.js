#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script de Auditoría de Estructura Hexagonal
 * Fase 1: Inventario Automático
 * 
 * Identifica archivos/carpetas que están dentro y fuera de la estructura hexagonal oficial
 */

class HexagonalStructureAuditor {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.officialPaths = [
            'Domain',
            'Application', 
            'Infrastructure',
            'Adapters',
            'Shared',
            'Tests',
            'docs',
            'Web',
            'Interfaces',
            '.github',
            'Documentation'
        ];
        
        this.allowedRootFiles = [
            'index.html',
            'package.json',
            'tsconfig.json',
            '.gitignore',
            '.gitattributes',
            '.env.example',
            'README.md',
            'ESTRUCTURA_PROYECTO.md',
            'hexagonal-bootstrap.js'
        ];
        
        this.results = {
            official: [],
            outOfPlace: [],
            duplicates: [],
            summary: {
                totalFiles: 0,
                totalDirectories: 0,
                officialCount: 0,
                outOfPlaceCount: 0,
                duplicateCount: 0
            }
        };
    }

    /**
     * Escanea recursivamente el directorio
     */
    scanDirectory(dirPath, relativePath = '') {
        try {
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const relativeItemPath = path.join(relativePath, item);
                const stats = fs.statSync(fullPath);
                
                const itemInfo = {
                    name: item,
                    fullPath: fullPath,
                    relativePath: relativeItemPath,
                    type: stats.isDirectory() ? 'directory' : 'file',
                    extension: stats.isFile() ? path.extname(item) : null,
                    lastModified: stats.mtime.toISOString(),
                    size: stats.size
                };
                
                // Actualizar contadores
                if (stats.isDirectory()) {
                    this.results.summary.totalDirectories++;
                } else {
                    this.results.summary.totalFiles++;
                }
                
                // Clasificar el item
                this.classifyItem(itemInfo, relativePath);
                
                // Recursión para directorios
                if (stats.isDirectory()) {
                    this.scanDirectory(fullPath, relativeItemPath);
                }
            }
        } catch (error) {
            console.error(`Error escaneando ${dirPath}:`, error.message);
        }
    }

    /**
     * Clasifica un item como oficial o fuera de lugar
     */
    classifyItem(itemInfo, parentPath) {
        const isInRoot = parentPath === '';
        const topLevelDir = itemInfo.relativePath.split(path.sep)[0];
        
        let isOfficial = false;
        
        if (isInRoot) {
            // Archivos/carpetas en la raíz
            if (itemInfo.type === 'directory') {
                isOfficial = this.officialPaths.includes(itemInfo.name);
            } else {
                isOfficial = this.allowedRootFiles.includes(itemInfo.name);
            }
        } else {
            // Archivos/carpetas dentro de directorios oficiales
            isOfficial = this.officialPaths.includes(topLevelDir);
        }
        
        if (isOfficial) {
            this.results.official.push(itemInfo);
            this.results.summary.officialCount++;
        } else {
            this.results.outOfPlace.push(itemInfo);
            this.results.summary.outOfPlaceCount++;
        }
        
        // Detectar duplicados (carpetas con nombres similares en inglés/español)
        this.detectDuplicates(itemInfo);
    }

    /**
     * Detecta carpetas duplicadas (inglés/español)
     */
    detectDuplicates(itemInfo) {
        if (itemInfo.type !== 'directory') return;
        
        const duplicatePairs = [
            ['Domain', 'Dominio'],
            ['Application', 'Aplicacion'],
            ['Infrastructure', 'Infraestructura'],
            ['Components', 'Componentes']
        ];
        
        for (const [english, spanish] of duplicatePairs) {
            if (itemInfo.name === english || itemInfo.name === spanish) {
                const existing = this.results.duplicates.find(dup => 
                    dup.pair.includes(itemInfo.name)
                );
                
                if (!existing) {
                    this.results.duplicates.push({
                        pair: [english, spanish],
                        found: [itemInfo.name],
                        paths: [itemInfo.relativePath],
                        issue: `Duplicación detectada: ${english}/${spanish}`
                    });
                    this.results.summary.duplicateCount++;
                } else {
                    existing.found.push(itemInfo.name);
                    existing.paths.push(itemInfo.relativePath);
                }
            }
        }
    }

    /**
     * Genera el reporte en formato JSON
     */
    generateJSONReport() {
        const report = {
            timestamp: new Date().toISOString(),
            projectPath: this.rootPath,
            summary: this.results.summary,
            officialStructure: this.results.official,
            outOfPlaceItems: this.results.outOfPlace,
            duplicateIssues: this.results.duplicates,
            recommendations: this.generateRecommendations()
        };
        
        return JSON.stringify(report, null, 2);
    }

    /**
     * Genera el reporte en formato Markdown
     */
    generateMarkdownReport() {
        let markdown = `# 📋 Reporte de Auditoría de Estructura Hexagonal\n\n`;
        markdown += `**Fecha:** ${new Date().toLocaleString()}\n`;
        markdown += `**Proyecto:** ${this.rootPath}\n\n`;
        
        // Resumen
        markdown += `## 📊 Resumen\n\n`;
        markdown += `- **Total de archivos:** ${this.results.summary.totalFiles}\n`;
        markdown += `- **Total de directorios:** ${this.results.summary.totalDirectories}\n`;
        markdown += `- **✅ Elementos en estructura oficial:** ${this.results.summary.officialCount}\n`;
        markdown += `- **❌ Elementos fuera de lugar:** ${this.results.summary.outOfPlaceCount}\n`;
        markdown += `- **🔄 Duplicados detectados:** ${this.results.summary.duplicateCount}\n\n`;
        
        // Duplicados críticos
        if (this.results.duplicates.length > 0) {
            markdown += `## 🚨 Duplicados Críticos\n\n`;
            for (const duplicate of this.results.duplicates) {
                markdown += `### ${duplicate.issue}\n`;
                markdown += `**Encontrados:** ${duplicate.found.join(', ')}\n`;
                markdown += `**Rutas:**\n`;
                for (const path of duplicate.paths) {
                    markdown += `- \`${path}\`\n`;
                }
                markdown += `\n`;
            }
        }
        
        // Elementos fuera de lugar
        if (this.results.outOfPlace.length > 0) {
            markdown += `## ❌ Elementos Fuera de Lugar\n\n`;
            markdown += `| Nombre | Tipo | Ruta | Última Modificación |\n`;
            markdown += `|--------|------|------|---------------------|\n`;
            
            for (const item of this.results.outOfPlace) {
                const lastMod = new Date(item.lastModified).toLocaleDateString();
                markdown += `| ${item.name} | ${item.type} | \`${item.relativePath}\` | ${lastMod} |\n`;
            }
            markdown += `\n`;
        }
        
        // Recomendaciones
        markdown += `## 💡 Recomendaciones\n\n`;
        const recommendations = this.generateRecommendations();
        for (const rec of recommendations) {
            markdown += `- ${rec}\n`;
        }
        
        return markdown;
    }

    /**
     * Genera recomendaciones basadas en el análisis
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (this.results.duplicates.length > 0) {
            recommendations.push('🔄 **CRÍTICO:** Resolver duplicación de carpetas (Domain/Dominio, Application/Aplicacion)');
            recommendations.push('📋 Decidir si usar nomenclatura en inglés o español de forma consistente');
        }
        
        if (this.results.outOfPlace.length > 0) {
            recommendations.push('📁 Migrar elementos fuera de lugar a carpetas oficiales de arquitectura hexagonal');
            recommendations.push('🔍 Verificar si elementos fuera de lugar siguen siendo referenciados (Fase 2)');
        }
        
        recommendations.push('🧹 Proceder con Fase 2: Detección de Referencias');
        recommendations.push('📝 Actualizar ESTRUCTURA_PROYECTO.md con la estructura final');
        
        return recommendations;
    }

    /**
     * Ejecuta la auditoría completa
     */
    async audit() {
        console.log('🔍 Iniciando auditoría de estructura hexagonal...');
        console.log(`📂 Escaneando: ${this.rootPath}`);
        
        this.scanDirectory(this.rootPath);
        
        console.log('\n📊 Resultados:');
        console.log(`✅ Elementos oficiales: ${this.results.summary.officialCount}`);
        console.log(`❌ Elementos fuera de lugar: ${this.results.summary.outOfPlaceCount}`);
        console.log(`🔄 Duplicados: ${this.results.summary.duplicateCount}`);
        
        // Guardar reportes
        const jsonReport = this.generateJSONReport();
        const markdownReport = this.generateMarkdownReport();
        
        fs.writeFileSync(path.join(this.rootPath, 'audit-report.json'), jsonReport);
        fs.writeFileSync(path.join(this.rootPath, 'AUDIT_REPORT.md'), markdownReport);
        
        console.log('\n📄 Reportes generados:');
        console.log('- audit-report.json');
        console.log('- AUDIT_REPORT.md');
        
        return this.results;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const auditor = new HexagonalStructureAuditor(projectPath);
    
    auditor.audit().then(results => {
        console.log('\n✅ Auditoría completada');
        
        if (results.duplicates.length > 0) {
            console.log('\n🚨 ATENCIÓN: Se detectaron duplicados críticos');
            console.log('Revisar AUDIT_REPORT.md para detalles');
        }
    }).catch(error => {
        console.error('❌ Error durante la auditoría:', error);
        process.exit(1);
    });
}

module.exports = HexagonalStructureAuditor;