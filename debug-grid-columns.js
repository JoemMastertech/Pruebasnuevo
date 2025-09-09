/**
 * SCRIPT DE DIAGNÓSTICO - VALORES HARDCODEADOS EN GRID
 * Identifica todas las reglas CSS que están limitando las columnas del grid
 */

const fs = require('fs');
const path = require('path');

class GridColumnAnalyzer {
    constructor() {
        this.issues = [];
        this.cssFiles = [
            'Shared/styles/main.css',
            'Shared/styles/mobile.css',
            'Shared/styles/tablet.css',
            'Shared/styles/_grid-system.css',
            'Shared/styles/_bem-architecture.css',
            'Shared/styles/_view-modes-controller.css'
        ];
    }

    analyzeFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                const lineNumber = index + 1;
                
                // Buscar reglas problemáticas
                if (this.isProblematicRule(line)) {
                    this.issues.push({
                        file: filePath,
                        line: lineNumber,
                        content: line.trim(),
                        issue: this.identifyIssue(line),
                        severity: this.getSeverity(line)
                    });
                }
            });
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error.message);
        }
    }

    isProblematicRule(line) {
        const problematicPatterns = [
            /grid-template-columns:\s*1fr/,  // Una sola columna hardcodeada
            /grid-template-columns:\s*repeat\(1,/,  // repeat(1, ...)
            /--grid-columns:\s*1[^0-9]/,  // Variable con valor 1
            /grid-template-columns:\s*repeat\(2,.*1fr\)/,  // 2 columnas que podrían ser problemáticas
            /@media.*max-width.*480px/,  // Media queries muy restrictivas
            /@media.*max-width.*767px/   // Media queries que podrían afectar desktop
        ];
        
        return problematicPatterns.some(pattern => pattern.test(line));
    }

    identifyIssue(line) {
        if (/grid-template-columns:\s*1fr/.test(line)) {
            return 'CRÍTICO: Fuerza una sola columna';
        }
        if (/grid-template-columns:\s*repeat\(1,/.test(line)) {
            return 'CRÍTICO: Repeat con 1 columna';
        }
        if (/--grid-columns:\s*1[^0-9]/.test(line)) {
            return 'ALTO: Variable de columnas = 1';
        }
        if (/grid-template-columns:\s*repeat\(2,.*1fr\)/.test(line)) {
            return 'MEDIO: Limitado a 2 columnas';
        }
        if (/@media.*max-width.*480px/.test(line)) {
            return 'MEDIO: Media query muy restrictiva (480px)';
        }
        if (/@media.*max-width.*767px/.test(line)) {
            return 'BAJO: Media query mobile (767px)';
        }
        return 'DESCONOCIDO';
    }

    getSeverity(line) {
        if (/grid-template-columns:\s*1fr/.test(line) || /grid-template-columns:\s*repeat\(1,/.test(line)) {
            return 'CRÍTICO';
        }
        if (/--grid-columns:\s*1[^0-9]/.test(line)) {
            return 'ALTO';
        }
        if (/grid-template-columns:\s*repeat\(2,/.test(line)) {
            return 'MEDIO';
        }
        return 'BAJO';
    }

    generateReport() {
        console.log('\n=== DIAGNÓSTICO DE COLUMNAS GRID ===\n');
        
        // Agrupar por severidad
        const bySeverity = this.issues.reduce((acc, issue) => {
            if (!acc[issue.severity]) acc[issue.severity] = [];
            acc[issue.severity].push(issue);
            return acc;
        }, {});

        ['CRÍTICO', 'ALTO', 'MEDIO', 'BAJO'].forEach(severity => {
            if (bySeverity[severity]) {
                console.log(`\n🚨 PROBLEMAS ${severity}:`);
                bySeverity[severity].forEach(issue => {
                    console.log(`  📁 ${issue.file}:${issue.line}`);
                    console.log(`     ${issue.content}`);
                    console.log(`     ➜ ${issue.issue}\n`);
                });
            }
        });

        // Resumen
        console.log('\n=== RESUMEN ===');
        console.log(`Total de problemas encontrados: ${this.issues.length}`);
        Object.keys(bySeverity).forEach(severity => {
            console.log(`${severity}: ${bySeverity[severity].length}`);
        });

        // Recomendaciones
        this.generateRecommendations();
    }

    generateRecommendations() {
        console.log('\n=== RECOMENDACIONES ===');
        
        const criticalIssues = this.issues.filter(i => i.severity === 'CRÍTICO');
        if (criticalIssues.length > 0) {
            console.log('\n🔥 ACCIÓN INMEDIATA REQUERIDA:');
            console.log('1. Revisar media queries que fuerzan 1 columna en desktop');
            console.log('2. Cambiar grid-template-columns: 1fr por repeat(3, 1fr) en desktop');
            console.log('3. Verificar que las media queries no se apliquen a resoluciones > 1024px');
        }

        console.log('\n💡 MEJORAS SUGERIDAS:');
        console.log('1. Usar variables CSS centralizadas para columnas');
        console.log('2. Implementar breakpoints más específicos');
        console.log('3. Separar reglas mobile/tablet/desktop claramente');
        console.log('4. Usar min-width en lugar de max-width para desktop');
    }

    run() {
        console.log('Analizando archivos CSS...');
        
        this.cssFiles.forEach(file => {
            const fullPath = path.join(process.cwd(), file);
            if (fs.existsSync(fullPath)) {
                console.log(`Analizando: ${file}`);
                this.analyzeFile(fullPath);
            } else {
                console.log(`⚠️  Archivo no encontrado: ${file}`);
            }
        });

        this.generateReport();
    }
}

// Ejecutar análisis
const analyzer = new GridColumnAnalyzer();
analyzer.run();