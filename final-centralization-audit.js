#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración del análisis
const STYLES_DIR = 'Shared/styles';
const REPORT_FILE = 'centralization-audit-report.md';

// Patrones a buscar
const PATTERNS = {
  hardcoded: /:\s*(\d+(?:\.\d+)?(?:px|%|rem|em|vh|vw))(?!\s*var)/g,
  important: /!important/g,
  mediaQueries: /@media\s*\([^)]+\)/g,
  variables: /var\(--[^)]+\)/g,
  selectors: /(?:^|\n)\s*([.#][\w-]+(?:[.#][\w-]+)*(?:\s*[>+~]\s*[.#][\w-]+)*)\s*\{/g
};

// Breakpoints estándar esperados
const STANDARD_BREAKPOINTS = [
  '768px',   // tablet
  '1024px',  // desktop
  '1200px',  // large
  '1400px'   // xl
];

class CentralizationAuditor {
  constructor() {
    this.results = {
      files: [],
      hardcodedValues: [],
      mediaQueries: new Set(),
      variables: new Set(),
      highSpecificity: [],
      breakpointConflicts: [],
      summary: {
        totalFiles: 0,
        hardcodedCount: 0,
        variableCount: 0,
        mediaQueryCount: 0,
        conflictCount: 0
      }
    };
  }

  analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    console.log(`📄 Analizando: ${fileName}`);
    
    const fileResult = {
      name: fileName,
      path: filePath,
      hardcoded: [],
      variables: [],
      mediaQueries: [],
      issues: []
    };

    // Buscar valores hardcodeados
    let match;
    while ((match = PATTERNS.hardcoded.exec(content)) !== null) {
      const line = this.getLineNumber(content, match.index);
      fileResult.hardcoded.push({
        value: match[1],
        line: line,
        context: this.getContext(content, match.index)
      });
      this.results.hardcodedValues.push({
        file: fileName,
        value: match[1],
        line: line
      });
    }

    // Buscar variables CSS
    PATTERNS.variables.lastIndex = 0;
    while ((match = PATTERNS.variables.exec(content)) !== null) {
      this.results.variables.add(match[0]);
      fileResult.variables.push(match[0]);
    }

    // Buscar media queries
    PATTERNS.mediaQueries.lastIndex = 0;
    while ((match = PATTERNS.mediaQueries.exec(content)) !== null) {
      const mq = match[0];
      this.results.mediaQueries.add(mq);
      fileResult.mediaQueries.push(mq);
      
      // Verificar breakpoints no estándar
      const breakpoint = this.extractBreakpoint(mq);
      if (breakpoint && !STANDARD_BREAKPOINTS.includes(breakpoint)) {
        this.results.breakpointConflicts.push({
          file: fileName,
          breakpoint: breakpoint,
          mediaQuery: mq
        });
      }
    }

    // Buscar selectores de alta especificidad
    PATTERNS.selectors.lastIndex = 0;
    while ((match = PATTERNS.selectors.exec(content)) !== null) {
      const selector = match[1];
      const specificity = this.calculateSpecificity(selector);
      
      if (specificity > 100) { // Alta especificidad
        this.results.highSpecificity.push({
          file: fileName,
          selector: selector,
          specificity: specificity
        });
      }
    }

    // Buscar !important
    PATTERNS.important.lastIndex = 0;
    while ((match = PATTERNS.important.exec(content)) !== null) {
      const line = this.getLineNumber(content, match.index);
      fileResult.issues.push({
        type: 'important',
        line: line,
        context: this.getContext(content, match.index)
      });
    }

    this.results.files.push(fileResult);
    return fileResult;
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  getContext(content, index, contextLength = 50) {
    const start = Math.max(0, index - contextLength);
    const end = Math.min(content.length, index + contextLength);
    return content.substring(start, end).trim();
  }

  extractBreakpoint(mediaQuery) {
    const match = mediaQuery.match(/(\d+(?:\.\d+)?px)/g);
    return match ? match[0] : null;
  }

  calculateSpecificity(selector) {
    const ids = (selector.match(/#/g) || []).length * 100;
    const classes = (selector.match(/\./g) || []).length * 10;
    const elements = (selector.match(/[a-zA-Z]/g) || []).length;
    return ids + classes + elements;
  }

  scanDirectory() {
    console.log('🔍 INICIANDO AUDITORÍA DE CENTRALIZACIÓN\n');
    
    const files = fs.readdirSync(STYLES_DIR)
      .filter(file => file.endsWith('.css'))
      .map(file => path.join(STYLES_DIR, file));

    files.forEach(file => this.analyzeFile(file));
    
    this.calculateSummary();
    this.generateReport();
    
    console.log('\n✅ AUDITORÍA COMPLETADA');
    console.log(`📊 Reporte generado: ${REPORT_FILE}`);
  }

  calculateSummary() {
    this.results.summary = {
      totalFiles: this.results.files.length,
      hardcodedCount: this.results.hardcodedValues.length,
      variableCount: this.results.variables.size,
      mediaQueryCount: this.results.mediaQueries.size,
      conflictCount: this.results.breakpointConflicts.length,
      highSpecificityCount: this.results.highSpecificity.length
    };
  }

  generateReport() {
    const { summary } = this.results;
    const date = new Date().toLocaleDateString('es-ES');
    
    let report = `# AUDITORÍA FINAL DE CENTRALIZACIÓN CSS\n\n`;
    report += `**Fecha:** ${date}\n\n`;
    
    // Resumen ejecutivo
    report += `## 📊 RESUMEN EJECUTIVO\n\n`;
    report += `- **Archivos analizados:** ${summary.totalFiles}\n`;
    report += `- **Variables CSS encontradas:** ${summary.variableCount}\n`;
    report += `- **Valores hardcodeados:** ${summary.hardcodedCount}\n`;
    report += `- **Media queries únicos:** ${summary.mediaQueryCount}\n`;
    report += `- **Conflictos de breakpoints:** ${summary.conflictCount}\n`;
    report += `- **Selectores alta especificidad:** ${summary.highSpecificityCount}\n\n`;
    
    // Estado de centralización
    const centralizationScore = this.calculateCentralizationScore();
    report += `## 🎯 ESTADO DE CENTRALIZACIÓN\n\n`;
    report += `**Puntuación:** ${centralizationScore.score}/100\n`;
    report += `**Estado:** ${centralizationScore.status}\n\n`;
    
    if (summary.hardcodedCount > 0) {
      report += `## 🚨 VALORES HARDCODEADOS (${summary.hardcodedCount})\n\n`;
      this.results.hardcodedValues.slice(0, 20).forEach(item => {
        report += `- **${item.file}:${item.line}** - \`${item.value}\`\n`;
      });
      if (summary.hardcodedCount > 20) {
        report += `\n... y ${summary.hardcodedCount - 20} más\n`;
      }
      report += `\n`;
    }
    
    if (this.results.breakpointConflicts.length > 0) {
      report += `## ⚠️ CONFLICTOS DE BREAKPOINTS\n\n`;
      this.results.breakpointConflicts.forEach(conflict => {
        report += `- **${conflict.file}** - \`${conflict.breakpoint}\` (no estándar)\n`;
      });
      report += `\n`;
    }
    
    // Variables más utilizadas
    report += `## 📈 VARIABLES CSS DETECTADAS\n\n`;
    report += `Total de variables únicas: ${summary.variableCount}\n\n`;
    
    // Media queries encontrados
    report += `## 📱 MEDIA QUERIES ENCONTRADOS\n\n`;
    Array.from(this.results.mediaQueries).sort().forEach(mq => {
      report += `- \`${mq}\`\n`;
    });
    report += `\n`;
    
    // Recomendaciones
    report += `## 🎯 RECOMENDACIONES\n\n`;
    if (summary.hardcodedCount > 50) {
      report += `### 🔴 Prioridad Alta\n`;
      report += `- Reemplazar ${summary.hardcodedCount} valores hardcodeados con variables\n`;
      report += `- Consolidar breakpoints no estándar\n\n`;
    } else if (summary.hardcodedCount > 0) {
      report += `### 🟡 Prioridad Media\n`;
      report += `- Revisar ${summary.hardcodedCount} valores hardcodeados restantes\n\n`;
    } else {
      report += `### ✅ Sistema Centralizado\n`;
      report += `- No se encontraron valores hardcodeados críticos\n`;
      report += `- El sistema está bien centralizado\n\n`;
    }
    
    fs.writeFileSync(REPORT_FILE, report);
  }

  calculateCentralizationScore() {
    const { summary } = this.results;
    let score = 100;
    
    // Penalizar valores hardcodeados
    score -= Math.min(50, summary.hardcodedCount * 0.5);
    
    // Penalizar conflictos de breakpoints
    score -= summary.conflictCount * 2;
    
    // Penalizar alta especificidad
    score -= Math.min(20, summary.highSpecificityCount * 0.5);
    
    score = Math.max(0, Math.round(score));
    
    let status;
    if (score >= 90) status = '🟢 EXCELENTE';
    else if (score >= 75) status = '🟡 BUENO';
    else if (score >= 50) status = '🟠 REGULAR';
    else status = '🔴 NECESITA MEJORAS';
    
    return { score, status };
  }
}

// Ejecutar auditoría
if (require.main === module) {
  const auditor = new CentralizationAuditor();
  auditor.scanDirectory();
}

module.exports = CentralizationAuditor;