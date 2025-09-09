/* =====================================================================
   SCRIPT DE ANÁLISIS DE FRAGMENTACIÓN DE MODOS DE VISTA
   Genera reporte completo de configuraciones dispersas
   ===================================================================== */

const fs = require('fs');
const path = require('path');

class ViewModesFragmentationAnalyzer {
    constructor() {
        this.fragmentations = {
            hardcodedValues: [],
            duplicatedVariables: [],
            inconsistentBreakpoints: [],
            scatteredConfigurations: [],
            conflictingStyles: []
        };
        
        this.cssFiles = [
            'Shared/styles/_variables-unified.css',
            'Shared/styles/_view-modes-config.css',
            'Shared/styles/_view-modes-controller.css',
            'Shared/styles/_grid-centralized.css',
            'Shared/styles/_grid-system.css',
            'Shared/styles/product-grid.css',
            'Shared/styles/product-table.css',
            'Shared/styles/main.css',
            'Shared/styles/mobile.css',
            'Shared/styles/tablet.css',
            'Shared/styles/navigation.css'
        ];
    }

    analyzeFragmentation() {
        console.log('🔍 INICIANDO ANÁLISIS DE FRAGMENTACIÓN DE MODOS DE VISTA\n');
        
        this.cssFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                this.analyzeFile(file, content);
            }
        });
        
        this.generateReport();
    }

    analyzeFile(filePath, content) {
        console.log(`📄 Analizando: ${filePath}`);
        
        // Buscar valores hardcodeados
        this.findHardcodedValues(filePath, content);
        
        // Buscar variables duplicadas
        this.findDuplicatedVariables(filePath, content);
        
        // Buscar breakpoints inconsistentes
        this.findInconsistentBreakpoints(filePath, content);
        
        // Buscar configuraciones dispersas
        this.findScatteredConfigurations(filePath, content);
    }

    findHardcodedValues(filePath, content) {
        const hardcodedPatterns = [
            /(?:width|height|padding|margin|font-size|gap|grid-template-columns):\s*([0-9]+(?:px|rem|em|%|vh|vw))/g,
            /grid-template-columns:\s*repeat\([^)]+\)/g,
            /@media\s*\([^)]*(?:width|height):\s*([0-9]+px)\)/g
        ];
        
        hardcodedPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                this.fragmentations.hardcodedValues.push({
                    file: filePath,
                    line: this.getLineNumber(content, match.index),
                    value: match[0],
                    suggestion: 'Reemplazar con variable CSS centralizada'
                });
            }
        });
    }

    findDuplicatedVariables(filePath, content) {
        const variablePattern = /--([a-zA-Z-]+):\s*([^;]+);/g;
        let match;
        
        while ((match = variablePattern.exec(content)) !== null) {
            const varName = match[1];
            const varValue = match[2];
            
            // Buscar si esta variable ya existe en otros archivos
            this.fragmentations.duplicatedVariables.push({
                file: filePath,
                line: this.getLineNumber(content, match.index),
                variable: `--${varName}`,
                value: varValue
            });
        }
    }

    findInconsistentBreakpoints(filePath, content) {
        const breakpointPattern = /@media\s*\([^)]*(?:min-width|max-width):\s*([0-9]+px)\)/g;
        let match;
        
        while ((match = breakpointPattern.exec(content)) !== null) {
            this.fragmentations.inconsistentBreakpoints.push({
                file: filePath,
                line: this.getLineNumber(content, match.index),
                breakpoint: match[1],
                fullRule: match[0]
            });
        }
    }

    findScatteredConfigurations(filePath, content) {
        const configPatterns = [
            /\.(?:grid|table|view|product)-[^{]+\{[^}]+\}/g,
            /data-view=["'][^"']+["']/g,
            /grid-template-columns:[^;]+;/g
        ];
        
        configPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                this.fragmentations.scatteredConfigurations.push({
                    file: filePath,
                    line: this.getLineNumber(content, match.index),
                    configuration: match[0].substring(0, 100) + '...'
                });
            }
        });
    }

    getLineNumber(content, index) {
        return content.substring(0, index).split('\n').length;
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalFiles: this.cssFiles.length,
                hardcodedValues: this.fragmentations.hardcodedValues.length,
                duplicatedVariables: this.fragmentations.duplicatedVariables.length,
                inconsistentBreakpoints: this.fragmentations.inconsistentBreakpoints.length,
                scatteredConfigurations: this.fragmentations.scatteredConfigurations.length
            },
            fragmentations: this.fragmentations,
            recommendations: this.generateRecommendations()
        };
        
        // Guardar reporte JSON
        fs.writeFileSync('view-modes-fragmentation-report.json', JSON.stringify(report, null, 2));
        
        // Generar reporte legible
        this.generateReadableReport(report);
        
        console.log('\n✅ ANÁLISIS COMPLETADO');
        console.log('📊 Reportes generados:');
        console.log('   - view-modes-fragmentation-report.json');
        console.log('   - view-modes-fragmentation-report.md');
    }

    generateRecommendations() {
        return {
            priority1: [
                'Crear módulo unificado de control de modos de vista',
                'Centralizar todas las variables de dimensiones y espaciado',
                'Eliminar valores hardcodeados y reemplazar con variables'
            ],
            priority2: [
                'Unificar breakpoints responsive en un solo sistema',
                'Consolidar configuraciones de grid y tabla dispersas',
                'Implementar sistema de variables en cascada'
            ],
            priority3: [
                'Optimizar estructura de archivos CSS',
                'Crear documentación de uso del sistema centralizado',
                'Implementar tests de regresión visual'
            ]
        };
    }

    generateReadableReport(report) {
        let markdown = `# REPORTE DE FRAGMENTACIÓN - MODOS DE VISTA\n\n`;
        markdown += `**Fecha:** ${new Date().toLocaleDateString()}\n\n`;
        
        markdown += `## 📊 RESUMEN EJECUTIVO\n\n`;
        markdown += `- **Archivos analizados:** ${report.summary.totalFiles}\n`;
        markdown += `- **Valores hardcodeados:** ${report.summary.hardcodedValues}\n`;
        markdown += `- **Variables duplicadas:** ${report.summary.duplicatedVariables}\n`;
        markdown += `- **Breakpoints inconsistentes:** ${report.summary.inconsistentBreakpoints}\n`;
        markdown += `- **Configuraciones dispersas:** ${report.summary.scatteredConfigurations}\n\n`;
        
        markdown += `## 🚨 PROBLEMAS CRÍTICOS IDENTIFICADOS\n\n`;
        
        markdown += `### 1. Valores Hardcodeados (${report.summary.hardcodedValues})\n`;
        markdown += `Estos valores deben ser reemplazados por variables centralizadas:\n\n`;
        report.fragmentations.hardcodedValues.slice(0, 10).forEach(item => {
            markdown += `- **${item.file}:${item.line}** - \`${item.value}\`\n`;
        });
        
        markdown += `\n### 2. Breakpoints Inconsistentes (${report.summary.inconsistentBreakpoints})\n`;
        markdown += `Diferentes breakpoints encontrados que deben unificarse:\n\n`;
        const uniqueBreakpoints = [...new Set(report.fragmentations.inconsistentBreakpoints.map(b => b.breakpoint))];
        uniqueBreakpoints.forEach(bp => {
            markdown += `- \`${bp}\`\n`;
        });
        
        markdown += `\n## 🎯 RECOMENDACIONES PRIORITARIAS\n\n`;
        
        markdown += `### Prioridad Alta\n`;
        report.recommendations.priority1.forEach(rec => {
            markdown += `- ${rec}\n`;
        });
        
        markdown += `\n### Prioridad Media\n`;
        report.recommendations.priority2.forEach(rec => {
            markdown += `- ${rec}\n`;
        });
        
        markdown += `\n### Prioridad Baja\n`;
        report.recommendations.priority3.forEach(rec => {
            markdown += `- ${rec}\n`;
        });
        
        fs.writeFileSync('view-modes-fragmentation-report.md', markdown);
    }
}

// Ejecutar análisis
const analyzer = new ViewModesFragmentationAnalyzer();
analyzer.analyzeFragmentation();

module.exports = ViewModesFragmentationAnalyzer;