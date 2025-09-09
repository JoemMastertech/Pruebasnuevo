#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración
const STYLES_DIR = 'Shared/styles';
const REPORT_FILE = 'breakpoints-standardization-report.md';

// Mapeo de breakpoints no estándar a estándar
const BREAKPOINT_MAPPING = {
  // Mobile
  '479px': '480px',  // Mantener como mobile max
  '480px': '480px',  // Mobile estándar
  '481px': '768px',  // Cambiar a tablet
  
  // Tablet
  '767px': '768px',  // Tablet estándar
  '768px': '768px',  // Tablet estándar (mantener)
  '769px': '768px',  // Unificar a tablet estándar
  
  // Desktop
  '1024px': '1024px', // Desktop estándar (mantener)
  '1025px': '1024px', // Unificar a desktop estándar
  
  // Large
  '1200px': '1200px', // Large estándar (mantener)
  '1400px': '1400px'  // XL estándar (mantener)
};

// Breakpoints estándar del sistema
const STANDARD_BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  large: '1200px',
  xl: '1400px'
};

// Patrones para encontrar media queries
const MEDIA_QUERY_PATTERNS = {
  minWidth: /@media\s*\(\s*min-width:\s*(\d+px)\s*\)/g,
  maxWidth: /@media\s*\(\s*max-width:\s*(\d+px)\s*\)/g,
  minMaxWidth: /@media\s*\(\s*min-width:\s*(\d+px)\s*\)\s*and\s*\(\s*max-width:\s*(\d+px)\s*\)/g
};

class BreakpointStandardizer {
  constructor() {
    this.results = {
      filesProcessed: [],
      replacements: [],
      conflicts: [],
      summary: {
        totalFiles: 0,
        totalReplacements: 0,
        conflictsResolved: 0
      }
    };
  }

  processFile(filePath) {
    console.log(`🔧 Procesando: ${path.basename(filePath)}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let replacementCount = 0;
    
    // Procesar diferentes tipos de media queries
    Object.entries(MEDIA_QUERY_PATTERNS).forEach(([type, pattern]) => {
      content = content.replace(pattern, (match, ...breakpoints) => {
        let newMatch = match;
        let hasChanges = false;
        
        breakpoints.forEach((breakpoint, index) => {
          if (breakpoint && BREAKPOINT_MAPPING[breakpoint]) {
            const standardBreakpoint = BREAKPOINT_MAPPING[breakpoint];
            if (breakpoint !== standardBreakpoint) {
              newMatch = newMatch.replace(breakpoint, standardBreakpoint);
              hasChanges = true;
              replacementCount++;
              
              this.results.replacements.push({
                file: path.basename(filePath),
                type: type,
                original: breakpoint,
                standardized: standardBreakpoint,
                context: match
              });
            }
          }
        });
        
        return hasChanges ? newMatch : match;
      });
    });
    
    // Detectar conflictos potenciales
    this.detectConflicts(content, path.basename(filePath));
    
    // Guardar archivo si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ ${replacementCount} breakpoints estandarizados`);
    } else {
      console.log(`  ℹ️ No se encontraron breakpoints para estandarizar`);
    }
    
    this.results.filesProcessed.push({
      name: path.basename(filePath),
      path: filePath,
      replacements: replacementCount
    });
    
    return replacementCount;
  }

  detectConflicts(content, fileName) {
    // Buscar media queries que podrían crear conflictos
    const mediaQueries = [];
    
    Object.entries(MEDIA_QUERY_PATTERNS).forEach(([type, pattern]) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        mediaQueries.push({
          type: type,
          breakpoint: match[1] || match[2],
          full: match[0]
        });
      }
    });
    
    // Detectar overlaps problemáticos
    for (let i = 0; i < mediaQueries.length; i++) {
      for (let j = i + 1; j < mediaQueries.length; j++) {
        const mq1 = mediaQueries[i];
        const mq2 = mediaQueries[j];
        
        if (this.hasConflict(mq1, mq2)) {
          this.results.conflicts.push({
            file: fileName,
            conflict: `${mq1.full} vs ${mq2.full}`,
            recommendation: this.getConflictRecommendation(mq1, mq2)
          });
        }
      }
    }
  }

  hasConflict(mq1, mq2) {
    // Lógica simplificada para detectar conflictos
    const bp1 = parseInt(mq1.breakpoint);
    const bp2 = parseInt(mq2.breakpoint);
    
    // Conflicto si hay overlap en rangos
    if (mq1.type === 'maxWidth' && mq2.type === 'minWidth') {
      return bp1 >= bp2; // max-width mayor que min-width
    }
    
    if (mq1.type === 'minWidth' && mq2.type === 'maxWidth') {
      return bp2 >= bp1; // max-width mayor que min-width
    }
    
    return false;
  }

  getConflictRecommendation(mq1, mq2) {
    return `Revisar rangos de breakpoints para evitar overlaps`;
  }

  updateVariablesWithBreakpoints() {
    console.log('\n📝 Actualizando variables de breakpoints...');
    
    const variablesPath = path.resolve('Shared/styles/_variables-unified.css');
    let variablesContent = fs.readFileSync(variablesPath, 'utf8');
    
    const breakpointVariables = `
/* === BREAKPOINTS ESTANDARIZADOS === */
:root {
  /* Breakpoints del sistema */
  --bp-mobile: ${STANDARD_BREAKPOINTS.mobile};
  --bp-tablet: ${STANDARD_BREAKPOINTS.tablet};
  --bp-desktop: ${STANDARD_BREAKPOINTS.desktop};
  --bp-large: ${STANDARD_BREAKPOINTS.large};
  --bp-xl: ${STANDARD_BREAKPOINTS.xl};
  
  /* Breakpoints para max-width (mobile-first) */
  --bp-mobile-max: calc(${STANDARD_BREAKPOINTS.tablet} - 1px);
  --bp-tablet-max: calc(${STANDARD_BREAKPOINTS.desktop} - 1px);
  --bp-desktop-max: calc(${STANDARD_BREAKPOINTS.large} - 1px);
  --bp-large-max: calc(${STANDARD_BREAKPOINTS.xl} - 1px);
}
`;
    
    // Agregar variables si no existen
    if (!variablesContent.includes('BREAKPOINTS ESTANDARIZADOS')) {
      variablesContent += breakpointVariables;
      fs.writeFileSync(variablesPath, variablesContent);
      console.log('✅ Variables de breakpoints agregadas');
    }
  }

  createBreakpointMixins() {
    console.log('📝 Creando mixins de breakpoints...');
    
    const mixinsContent = `/* === MIXINS DE BREAKPOINTS === */
/* Uso: @media (min-width: var(--bp-tablet)) { ... } */

/* Mobile First Approach */
.mobile-up {
  @media (min-width: var(--bp-mobile)) {
    @content;
  }
}

.tablet-up {
  @media (min-width: var(--bp-tablet)) {
    @content;
  }
}

.desktop-up {
  @media (min-width: var(--bp-desktop)) {
    @content;
  }
}

.large-up {
  @media (min-width: var(--bp-large)) {
    @content;
  }
}

.xl-up {
  @media (min-width: var(--bp-xl)) {
    @content;
  }
}

/* Mobile Only */
.mobile-only {
  @media (max-width: var(--bp-mobile-max)) {
    @content;
  }
}

.tablet-only {
  @media (min-width: var(--bp-tablet)) and (max-width: var(--bp-tablet-max)) {
    @content;
  }
}

.desktop-only {
  @media (min-width: var(--bp-desktop)) and (max-width: var(--bp-desktop-max)) {
    @content;
  }
}
`;
    
    const mixinsPath = 'Shared/styles/_breakpoint-mixins.css';
    fs.writeFileSync(mixinsPath, mixinsContent);
    console.log(`✅ Mixins creados: ${mixinsPath}`);
  }

  processAllFiles() {
    console.log('🚀 INICIANDO ESTANDARIZACIÓN DE BREAKPOINTS\n');
    
    // Actualizar variables primero
    this.updateVariablesWithBreakpoints();
    this.createBreakpointMixins();
    
    // Procesar archivos CSS
    const cssFiles = fs.readdirSync(STYLES_DIR)
      .filter(file => file.endsWith('.css'))
      .map(file => path.join(STYLES_DIR, file));
    
    let totalReplacements = 0;
    cssFiles.forEach(file => {
      totalReplacements += this.processFile(file);
    });
    
    this.results.summary = {
      totalFiles: cssFiles.length,
      totalReplacements: totalReplacements,
      conflictsResolved: this.results.conflicts.length
    };
    
    this.generateReport();
    
    console.log('\n✅ ESTANDARIZACIÓN COMPLETADA');
    console.log(`📊 ${totalReplacements} breakpoints estandarizados`);
    console.log(`⚠️ ${this.results.conflicts.length} conflictos detectados`);
    console.log(`📄 Reporte generado: ${REPORT_FILE}`);
  }

  generateReport() {
    const { summary, replacements, conflicts, filesProcessed } = this.results;
    const date = new Date().toLocaleDateString('es-ES');
    
    let report = `# REPORTE DE ESTANDARIZACIÓN DE BREAKPOINTS\n\n`;
    report += `**Fecha:** ${date}\n\n`;
    
    // Resumen
    report += `## 📊 RESUMEN\n\n`;
    report += `- **Archivos procesados:** ${summary.totalFiles}\n`;
    report += `- **Breakpoints estandarizados:** ${summary.totalReplacements}\n`;
    report += `- **Conflictos detectados:** ${summary.conflictsResolved}\n\n`;
    
    // Breakpoints estándar
    report += `## 🎯 BREAKPOINTS ESTÁNDAR\n\n`;
    Object.entries(STANDARD_BREAKPOINTS).forEach(([name, value]) => {
      report += `- **${name}:** ${value}\n`;
    });
    report += `\n`;
    
    // Archivos procesados
    report += `## 📁 ARCHIVOS PROCESADOS\n\n`;
    filesProcessed.forEach(file => {
      report += `- **${file.name}** - ${file.replacements} breakpoints estandarizados\n`;
    });
    report += `\n`;
    
    // Reemplazos realizados
    if (replacements.length > 0) {
      report += `## 🔄 BREAKPOINTS ESTANDARIZADOS\n\n`;
      
      const groupedByFile = replacements.reduce((acc, replacement) => {
        if (!acc[replacement.file]) acc[replacement.file] = [];
        acc[replacement.file].push(replacement);
        return acc;
      }, {});
      
      Object.entries(groupedByFile).forEach(([fileName, fileReplacements]) => {
        report += `### ${fileName}\n\n`;
        fileReplacements.forEach(replacement => {
          report += `- \`${replacement.original}\` → \`${replacement.standardized}\` (${replacement.type})\n`;
        });
        report += `\n`;
      });
    }
    
    // Conflictos detectados
    if (conflicts.length > 0) {
      report += `## ⚠️ CONFLICTOS DETECTADOS\n\n`;
      conflicts.forEach(conflict => {
        report += `### ${conflict.file}\n\n`;
        report += `**Conflicto:** ${conflict.conflict}\n`;
        report += `**Recomendación:** ${conflict.recommendation}\n\n`;
      });
    }
    
    // Recomendaciones
    report += `## 🎯 RECOMENDACIONES\n\n`;
    report += `### Uso de Variables CSS\n`;
    report += `Utilizar las variables CSS definidas en lugar de valores hardcodeados:\n\n`;
    report += `\`\`\`css\n`;
    report += `/* ✅ Recomendado */\n`;
    report += `@media (min-width: var(--bp-tablet)) { ... }\n\n`;
    report += `/* ❌ Evitar */\n`;
    report += `@media (min-width: 768px) { ... }\n`;
    report += `\`\`\`\n\n`;
    
    report += `### Mobile-First Approach\n`;
    report += `Seguir el enfoque mobile-first para mejor rendimiento:\n\n`;
    report += `\`\`\`css\n`;
    report += `/* Base: Mobile styles */\n`;
    report += `.component { ... }\n\n`;
    report += `/* Tablet y superior */\n`;
    report += `@media (min-width: var(--bp-tablet)) {\n`;
    report += `  .component { ... }\n`;
    report += `}\n`;
    report += `\`\`\`\n\n`;
    
    fs.writeFileSync(REPORT_FILE, report);
  }
}

// Ejecutar estandarización
if (require.main === module) {
  const standardizer = new BreakpointStandardizer();
  standardizer.processAllFiles();
}

module.exports = BreakpointStandardizer;