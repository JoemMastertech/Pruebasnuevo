#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración
const STYLES_DIR = 'Shared/styles';
const VARIABLES_FILE = 'Shared/styles/_variables-unified.css';
const REPORT_FILE = 'hardcoded-elimination-report.md';

// Mapeo de valores hardcodeados a variables CSS
const HARDCODED_TO_VARIABLES = {
  // Dimensiones comunes
  '100%': 'var(--size-full)',
  '100vw': 'var(--viewport-width)',
  '100vh': 'var(--viewport-height)',
  '50%': 'var(--size-half)',
  '25%': 'var(--size-quarter)',
  '75%': 'var(--size-three-quarters)',
  
  // Espaciado
  '0px': 'var(--spacing-none)',
  '2px': 'var(--spacing-xs)',
  '4px': 'var(--spacing-sm)',
  '8px': 'var(--spacing-md)',
  '10px': 'var(--spacing-md-plus)',
  '12px': 'var(--spacing-lg)',
  '15px': 'var(--spacing-lg-plus)',
  '16px': 'var(--spacing-xl)',
  '20px': 'var(--spacing-2xl)',
  '24px': 'var(--spacing-3xl)',
  '32px': 'var(--spacing-4xl)',
  '40px': 'var(--spacing-5xl)',
  '48px': 'var(--spacing-6xl)',
  
  // Tipografía
  '0.8rem': 'var(--font-size-xs)',
  '0.875rem': 'var(--font-size-sm)',
  '1rem': 'var(--font-size-base)',
  '1.125rem': 'var(--font-size-lg)',
  '1.25rem': 'var(--font-size-xl)',
  '1.5rem': 'var(--font-size-2xl)',
  '1.875rem': 'var(--font-size-3xl)',
  '2rem': 'var(--font-size-4xl)',
  '2.25rem': 'var(--font-size-5xl)',
  
  // Bordes
  '1px': 'var(--border-width-thin)',
  '2px': 'var(--border-width-base)',
  '3px': 'var(--border-width-thick)',
  '4px': 'var(--border-radius-sm)',
  '6px': 'var(--border-radius-md)',
  '8px': 'var(--border-radius-lg)',
  '12px': 'var(--border-radius-xl)',
  
  // Z-index
  '-1': 'var(--z-behind)',
  '-10': 'var(--z-background)',
  '1': 'var(--z-base)',
  '10': 'var(--z-dropdown)',
  '50': 'var(--z-modal)',
  '100': 'var(--z-tooltip)',
  '999': 'var(--z-maximum)',
  
  // Opacidad
  '0': 'var(--opacity-0)',
  '0.1': 'var(--opacity-10)',
  '0.25': 'var(--opacity-25)',
  '0.5': 'var(--opacity-50)',
  '0.75': 'var(--opacity-75)',
  '0.9': 'var(--opacity-90)',
  '1': 'var(--opacity-100)'
};

// Patrones de valores hardcodeados
const HARDCODED_PATTERNS = {
  // Dimensiones con unidades
  dimensions: /:\s*(\d+(?:\.\d+)?(?:px|%|rem|em|vh|vw))(?!\s*var)/g,
  // Z-index
  zindex: /z-index:\s*(-?\d+)(?!\s*var)/g,
  // Opacidad
  opacity: /opacity:\s*(\d*\.?\d+)(?!\s*var)/g,
  // Line-height
  lineHeight: /line-height:\s*(\d*\.?\d+)(?!\s*var)/g
};

class HardcodedEliminator {
  constructor() {
    this.results = {
      filesProcessed: [],
      replacements: [],
      errors: [],
      summary: {
        totalFiles: 0,
        totalReplacements: 0,
        hardcodedEliminated: 0
      }
    };
    
    this.variablesNeeded = new Set();
  }

  processFile(filePath) {
    console.log(`🔧 Procesando: ${path.basename(filePath)}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let replacementCount = 0;
    
    // Procesar diferentes tipos de valores hardcodeados
    Object.entries(HARDCODED_PATTERNS).forEach(([type, pattern]) => {
      content = content.replace(pattern, (match, value) => {
        const variable = this.findVariableForValue(value, type);
        if (variable) {
          replacementCount++;
          this.results.replacements.push({
            file: path.basename(filePath),
            original: match,
            replacement: match.replace(value, variable),
            type: type
          });
          this.variablesNeeded.add(variable);
          return match.replace(value, variable);
        }
        return match;
      });
    });
    
    // Guardar archivo si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ ${replacementCount} reemplazos realizados`);
    } else {
      console.log(`  ℹ️ No se encontraron valores para reemplazar`);
    }
    
    this.results.filesProcessed.push({
      name: path.basename(filePath),
      path: filePath,
      replacements: replacementCount
    });
    
    return replacementCount;
  }

  findVariableForValue(value, type) {
    // Buscar en el mapeo directo
    if (HARDCODED_TO_VARIABLES[value]) {
      return HARDCODED_TO_VARIABLES[value];
    }
    
    // Lógica específica por tipo
    switch (type) {
      case 'dimensions':
        return this.findDimensionVariable(value);
      case 'zindex':
        return this.findZIndexVariable(value);
      case 'opacity':
        return this.findOpacityVariable(value);
      case 'lineHeight':
        return this.findLineHeightVariable(value);
      default:
        return null;
    }
  }

  findDimensionVariable(value) {
    const numValue = parseFloat(value);
    const unit = value.replace(numValue.toString(), '');
    
    // Mapeo inteligente basado en valores comunes
    if (unit === 'px') {
      if (numValue <= 4) return 'var(--spacing-xs)';
      if (numValue <= 8) return 'var(--spacing-sm)';
      if (numValue <= 12) return 'var(--spacing-md)';
      if (numValue <= 16) return 'var(--spacing-lg)';
      if (numValue <= 24) return 'var(--spacing-xl)';
      if (numValue <= 32) return 'var(--spacing-2xl)';
      if (numValue <= 48) return 'var(--spacing-3xl)';
    }
    
    if (unit === '%') {
      if (numValue === 100) return 'var(--size-full)';
      if (numValue === 50) return 'var(--size-half)';
      if (numValue === 25) return 'var(--size-quarter)';
      if (numValue === 75) return 'var(--size-three-quarters)';
    }
    
    return null;
  }

  findZIndexVariable(value) {
    const numValue = parseInt(value);
    if (numValue < 0) return 'var(--z-behind)';
    if (numValue <= 1) return 'var(--z-base)';
    if (numValue <= 10) return 'var(--z-dropdown)';
    if (numValue <= 50) return 'var(--z-modal)';
    if (numValue <= 100) return 'var(--z-tooltip)';
    return 'var(--z-maximum)';
  }

  findOpacityVariable(value) {
    const numValue = parseFloat(value);
    if (numValue === 0) return 'var(--opacity-0)';
    if (numValue <= 0.1) return 'var(--opacity-10)';
    if (numValue <= 0.25) return 'var(--opacity-25)';
    if (numValue <= 0.5) return 'var(--opacity-50)';
    if (numValue <= 0.75) return 'var(--opacity-75)';
    if (numValue <= 0.9) return 'var(--opacity-90)';
    return 'var(--opacity-100)';
  }

  findLineHeightVariable(value) {
    const numValue = parseFloat(value);
    if (numValue <= 1.2) return 'var(--line-height-tight)';
    if (numValue <= 1.4) return 'var(--line-height-snug)';
    if (numValue <= 1.6) return 'var(--line-height-normal)';
    if (numValue <= 1.8) return 'var(--line-height-relaxed)';
    return 'var(--line-height-loose)';
  }

  updateVariablesFile() {
    console.log('\n📝 Actualizando archivo de variables...');
    
    const variablesPath = path.resolve(VARIABLES_FILE);
    let variablesContent = fs.readFileSync(variablesPath, 'utf8');
    
    // Variables adicionales que podrían necesitarse
    const additionalVariables = `
/* === VARIABLES ADICIONALES PARA ELIMINACIÓN DE HARDCODED === */
:root {
  /* Tamaños */
  --size-full: 100%;
  --size-half: 50%;
  --size-quarter: 25%;
  --size-three-quarters: 75%;
  --viewport-width: 100vw;
  --viewport-height: 100vh;
  
  /* Espaciado extendido */
  --spacing-xs: 2px;
  --spacing-sm: 4px;
  --spacing-md: 8px;
  --spacing-md-plus: 10px;
  --spacing-lg: 12px;
  --spacing-lg-plus: 15px;
  --spacing-xl: 16px;
  --spacing-2xl: 20px;
  --spacing-3xl: 24px;
  --spacing-4xl: 32px;
  --spacing-5xl: 40px;
  --spacing-6xl: 48px;
  
  /* Z-index */
  --z-behind: -1;
  --z-background: -10;
  --z-base: 1;
  --z-dropdown: 10;
  --z-modal: 50;
  --z-tooltip: 100;
  --z-maximum: 999;
  
  /* Opacidad */
  --opacity-0: 0;
  --opacity-10: 0.1;
  --opacity-25: 0.25;
  --opacity-50: 0.5;
  --opacity-75: 0.75;
  --opacity-90: 0.9;
  --opacity-100: 1;
  
  /* Line Height */
  --line-height-tight: 1.2;
  --line-height-snug: 1.4;
  --line-height-normal: 1.6;
  --line-height-relaxed: 1.8;
  --line-height-loose: 2.0;
}
`;
    
    // Agregar variables si no existen
    if (!variablesContent.includes('VARIABLES ADICIONALES PARA ELIMINACIÓN')) {
      variablesContent += additionalVariables;
      fs.writeFileSync(variablesPath, variablesContent);
      console.log('✅ Variables adicionales agregadas');
    }
  }

  processAllFiles() {
    console.log('🚀 INICIANDO ELIMINACIÓN DE VALORES HARDCODEADOS\n');
    
    // Actualizar archivo de variables primero
    this.updateVariablesFile();
    
    // Procesar archivos CSS
    const cssFiles = fs.readdirSync(STYLES_DIR)
      .filter(file => file.endsWith('.css') && !file.startsWith('_variables'))
      .map(file => path.join(STYLES_DIR, file));
    
    let totalReplacements = 0;
    cssFiles.forEach(file => {
      totalReplacements += this.processFile(file);
    });
    
    this.results.summary = {
      totalFiles: cssFiles.length,
      totalReplacements: totalReplacements,
      hardcodedEliminated: this.results.replacements.length
    };
    
    this.generateReport();
    
    console.log('\n✅ ELIMINACIÓN COMPLETADA');
    console.log(`📊 ${totalReplacements} valores hardcodeados reemplazados`);
    console.log(`📄 Reporte generado: ${REPORT_FILE}`);
  }

  generateReport() {
    const { summary, replacements, filesProcessed } = this.results;
    const date = new Date().toLocaleDateString('es-ES');
    
    let report = `# REPORTE DE ELIMINACIÓN DE VALORES HARDCODEADOS\n\n`;
    report += `**Fecha:** ${date}\n\n`;
    
    // Resumen
    report += `## 📊 RESUMEN\n\n`;
    report += `- **Archivos procesados:** ${summary.totalFiles}\n`;
    report += `- **Total de reemplazos:** ${summary.totalReplacements}\n`;
    report += `- **Valores hardcodeados eliminados:** ${summary.hardcodedEliminated}\n\n`;
    
    // Archivos procesados
    report += `## 📁 ARCHIVOS PROCESADOS\n\n`;
    filesProcessed.forEach(file => {
      report += `- **${file.name}** - ${file.replacements} reemplazos\n`;
    });
    report += `\n`;
    
    // Detalles de reemplazos
    if (replacements.length > 0) {
      report += `## 🔄 REEMPLAZOS REALIZADOS\n\n`;
      
      const groupedByFile = replacements.reduce((acc, replacement) => {
        if (!acc[replacement.file]) acc[replacement.file] = [];
        acc[replacement.file].push(replacement);
        return acc;
      }, {});
      
      Object.entries(groupedByFile).forEach(([fileName, fileReplacements]) => {
        report += `### ${fileName}\n\n`;
        fileReplacements.slice(0, 10).forEach(replacement => {
          report += `- \`${replacement.original}\` → \`${replacement.replacement}\`\n`;
        });
        if (fileReplacements.length > 10) {
          report += `\n... y ${fileReplacements.length - 10} más\n`;
        }
        report += `\n`;
      });
    }
    
    // Variables utilizadas
    report += `## 🎯 VARIABLES CSS UTILIZADAS\n\n`;
    Array.from(this.variablesNeeded).sort().forEach(variable => {
      report += `- \`${variable}\`\n`;
    });
    
    fs.writeFileSync(REPORT_FILE, report);
  }
}

// Ejecutar eliminación
if (require.main === module) {
  const eliminator = new HardcodedEliminator();
  eliminator.processAllFiles();
}

module.exports = HardcodedEliminator;