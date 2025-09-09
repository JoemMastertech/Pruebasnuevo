#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración
const STYLES_DIR = 'Shared/styles';
const REPORT_FILE = 'css-specificity-optimization-report.md';

// Patrones para detectar alta especificidad
const HIGH_SPECIFICITY_PATTERNS = {
  ids: /#[a-zA-Z][\w-]*/g,
  importantDeclarations: /!important/g,
  deepNesting: /([^{]*\{[^{}]*){4,}/g,
  complexSelectors: /([.#][\w-]+\s*[>+~]?\s*){3,}/g,
  attributeSelectors: /\[[^\]]+\]/g
};

// Límites de especificidad
const SPECIFICITY_LIMITS = {
  maxIds: 0,           // Evitar IDs
  maxImportant: 2,     // Máximo 2 !important por archivo
  maxNestingDepth: 3,  // Máximo 3 niveles de anidación
  maxComplexity: 3     // Máximo 3 selectores combinados
};

class SpecificityOptimizer {
  constructor() {
    this.results = {
      filesProcessed: [],
      highSpecificitySelectors: [],
      optimizations: [],
      violations: [],
      summary: {
        totalFiles: 0,
        totalViolations: 0,
        optimizationsApplied: 0,
        specificityReduced: 0
      }
    };
  }

  calculateSpecificity(selector) {
    // Calcular especificidad CSS (a, b, c, d)
    let ids = 0;
    let classes = 0;
    let elements = 0;
    let inline = 0;
    
    // Contar IDs
    const idMatches = selector.match(/#[a-zA-Z][\w-]*/g);
    ids = idMatches ? idMatches.length : 0;
    
    // Contar clases, atributos y pseudo-clases
    const classMatches = selector.match(/\.[a-zA-Z][\w-]*|\[[^\]]+\]|:[a-zA-Z][\w-]*/g);
    classes = classMatches ? classMatches.length : 0;
    
    // Contar elementos y pseudo-elementos
    const elementMatches = selector.match(/\b[a-zA-Z][\w-]*(?![\w-]*[.#:])/g);
    elements = elementMatches ? elementMatches.length : 0;
    
    // Verificar !important
    const hasImportant = selector.includes('!important');
    
    return {
      inline: inline,
      ids: ids,
      classes: classes,
      elements: elements,
      total: (ids * 100) + (classes * 10) + elements,
      hasImportant: hasImportant,
      specificity: `${inline},${ids},${classes},${elements}`
    };
  }

  extractSelectors(content) {
    const selectors = [];
    
    // Patrón para extraer selectores CSS
    const selectorPattern = /([^{}]+)\s*\{([^{}]*)\}/g;
    let match;
    
    while ((match = selectorPattern.exec(content)) !== null) {
      const selectorText = match[1].trim();
      const declarations = match[2].trim();
      
      // Dividir selectores múltiples (separados por coma)
      const individualSelectors = selectorText.split(',').map(s => s.trim());
      
      individualSelectors.forEach(selector => {
        if (selector && !selector.startsWith('@') && !selector.startsWith('/*')) {
          const specificity = this.calculateSpecificity(selector);
          
          selectors.push({
            selector: selector,
            declarations: declarations,
            specificity: specificity,
            fullRule: match[0],
            isHighSpecificity: this.isHighSpecificity(specificity)
          });
        }
      });
    }
    
    return selectors;
  }

  isHighSpecificity(specificity) {
    return (
      specificity.ids > SPECIFICITY_LIMITS.maxIds ||
      specificity.total > 30 ||
      specificity.hasImportant
    );
  }

  optimizeSelector(selectorObj, fileName) {
    const { selector, specificity, declarations } = selectorObj;
    let optimizedSelector = selector;
    let optimizations = [];
    
    // 1. Reemplazar IDs con clases
    if (specificity.ids > 0) {
      const idPattern = /#([a-zA-Z][\w-]*)/g;
      optimizedSelector = optimizedSelector.replace(idPattern, (match, idName) => {
        optimizations.push({
          type: 'id_to_class',
          original: match,
          optimized: `.${idName}`,
          description: `Reemplazar ID con clase para reducir especificidad`
        });
        return `.${idName}`;
      });
    }
    
    // 2. Simplificar selectores complejos
    if (specificity.classes > 3) {
      const parts = optimizedSelector.split(/\s+/);
      if (parts.length > 3) {
        const simplified = parts.slice(-2).join(' ');
        optimizations.push({
          type: 'simplify_complex',
          original: optimizedSelector,
          optimized: simplified,
          description: `Simplificar selector complejo manteniendo los últimos 2 elementos`
        });
        optimizedSelector = simplified;
      }
    }
    
    // 3. Remover !important innecesarios
    let optimizedDeclarations = declarations;
    if (specificity.hasImportant) {
      const importantCount = (declarations.match(/!important/g) || []).length;
      if (importantCount > 1) {
        // Mantener solo el primer !important
        let importantFound = false;
        optimizedDeclarations = declarations.replace(/!important/g, (match) => {
          if (!importantFound) {
            importantFound = true;
            return match;
          }
          optimizations.push({
            type: 'remove_important',
            original: match,
            optimized: '',
            description: `Remover !important redundante`
          });
          return '';
        });
      }
    }
    
    // 4. Usar metodología BEM
    if (optimizedSelector.includes('>') || optimizedSelector.includes('+') || optimizedSelector.includes('~')) {
      const bemSuggestion = this.suggestBEMSelector(optimizedSelector);
      if (bemSuggestion) {
        optimizations.push({
          type: 'bem_methodology',
          original: optimizedSelector,
          optimized: bemSuggestion,
          description: `Aplicar metodología BEM para mejor mantenibilidad`
        });
      }
    }
    
    return {
      originalSelector: selector,
      optimizedSelector: optimizedSelector,
      originalDeclarations: declarations,
      optimizedDeclarations: optimizedDeclarations,
      optimizations: optimizations,
      specificityReduction: specificity.total - this.calculateSpecificity(optimizedSelector).total
    };
  }

  suggestBEMSelector(selector) {
    // Sugerir selector BEM basado en el selector actual
    const parts = selector.split(/[\s>+~]+/).filter(p => p.trim());
    if (parts.length >= 2) {
      const block = parts[0].replace(/[.#]/, '');
      const element = parts[parts.length - 1].replace(/[.#]/, '');
      return `.${block}__${element}`;
    }
    return null;
  }

  processFile(filePath) {
    console.log(`🔍 Analizando especificidad: ${path.basename(filePath)}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const selectors = this.extractSelectors(content);
    
    const highSpecificitySelectors = selectors.filter(s => s.isHighSpecificity);
    const violations = this.detectViolations(selectors, path.basename(filePath));
    
    console.log(`  📊 ${selectors.length} selectores analizados`);
    console.log(`  ⚠️ ${highSpecificitySelectors.length} selectores de alta especificidad`);
    console.log(`  🚫 ${violations.length} violaciones detectadas`);
    
    // Aplicar optimizaciones
    let optimizationsApplied = 0;
    let specificityReduced = 0;
    
    highSpecificitySelectors.forEach(selectorObj => {
      const optimization = this.optimizeSelector(selectorObj, path.basename(filePath));
      
      if (optimization.optimizations.length > 0) {
        // Aplicar optimización al contenido
        const originalRule = selectorObj.fullRule;
        const optimizedRule = `${optimization.optimizedSelector} {\n  ${optimization.optimizedDeclarations}\n}`;
        
        content = content.replace(originalRule, optimizedRule);
        
        this.results.optimizations.push({
          file: path.basename(filePath),
          ...optimization
        });
        
        optimizationsApplied += optimization.optimizations.length;
        specificityReduced += optimization.specificityReduction;
      }
    });
    
    // Guardar archivo optimizado
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ ${optimizationsApplied} optimizaciones aplicadas`);
    }
    
    this.results.filesProcessed.push({
      name: path.basename(filePath),
      path: filePath,
      totalSelectors: selectors.length,
      highSpecificityCount: highSpecificitySelectors.length,
      violationsCount: violations.length,
      optimizationsApplied: optimizationsApplied
    });
    
    this.results.highSpecificitySelectors.push(...highSpecificitySelectors.map(s => ({
      file: path.basename(filePath),
      ...s
    })));
    
    this.results.violations.push(...violations);
    
    return {
      optimizationsApplied,
      specificityReduced
    };
  }

  detectViolations(selectors, fileName) {
    const violations = [];
    
    // Contar violaciones por tipo
    const idCount = selectors.filter(s => s.specificity.ids > 0).length;
    const importantCount = selectors.filter(s => s.specificity.hasImportant).length;
    const highComplexityCount = selectors.filter(s => s.specificity.total > 30).length;
    
    if (idCount > SPECIFICITY_LIMITS.maxIds) {
      violations.push({
        file: fileName,
        type: 'excessive_ids',
        count: idCount,
        limit: SPECIFICITY_LIMITS.maxIds,
        description: `Uso excesivo de selectores ID (${idCount} encontrados, máximo recomendado: ${SPECIFICITY_LIMITS.maxIds})`
      });
    }
    
    if (importantCount > SPECIFICITY_LIMITS.maxImportant) {
      violations.push({
        file: fileName,
        type: 'excessive_important',
        count: importantCount,
        limit: SPECIFICITY_LIMITS.maxImportant,
        description: `Uso excesivo de !important (${importantCount} encontrados, máximo recomendado: ${SPECIFICITY_LIMITS.maxImportant})`
      });
    }
    
    if (highComplexityCount > 5) {
      violations.push({
        file: fileName,
        type: 'high_complexity',
        count: highComplexityCount,
        limit: 5,
        description: `Selectores de alta complejidad (${highComplexityCount} encontrados, máximo recomendado: 5)`
      });
    }
    
    return violations;
  }

  processAllFiles() {
    console.log('🚀 INICIANDO OPTIMIZACIÓN DE ESPECIFICIDAD CSS\n');
    
    // Procesar archivos CSS
    const cssFiles = fs.readdirSync(STYLES_DIR)
      .filter(file => file.endsWith('.css'))
      .map(file => path.join(STYLES_DIR, file));
    
    let totalOptimizations = 0;
    let totalSpecificityReduced = 0;
    
    cssFiles.forEach(file => {
      const result = this.processFile(file);
      totalOptimizations += result.optimizationsApplied;
      totalSpecificityReduced += result.specificityReduced;
    });
    
    this.results.summary = {
      totalFiles: cssFiles.length,
      totalViolations: this.results.violations.length,
      optimizationsApplied: totalOptimizations,
      specificityReduced: totalSpecificityReduced
    };
    
    this.generateReport();
    
    console.log('\n✅ OPTIMIZACIÓN COMPLETADA');
    console.log(`📊 ${this.results.highSpecificitySelectors.length} selectores de alta especificidad`);
    console.log(`🔧 ${totalOptimizations} optimizaciones aplicadas`);
    console.log(`📉 ${totalSpecificityReduced} puntos de especificidad reducidos`);
    console.log(`📄 Reporte generado: ${REPORT_FILE}`);
  }

  generateReport() {
    const { summary, violations, optimizations, highSpecificitySelectors, filesProcessed } = this.results;
    const date = new Date().toLocaleDateString('es-ES');
    
    let report = `# REPORTE DE OPTIMIZACIÓN DE ESPECIFICIDAD CSS\n\n`;
    report += `**Fecha:** ${date}\n\n`;
    
    // Resumen
    report += `## 📊 RESUMEN\n\n`;
    report += `- **Archivos procesados:** ${summary.totalFiles}\n`;
    report += `- **Violaciones detectadas:** ${summary.totalViolations}\n`;
    report += `- **Optimizaciones aplicadas:** ${summary.optimizationsApplied}\n`;
    report += `- **Especificidad reducida:** ${summary.specificityReduced} puntos\n\n`;
    
    // Archivos procesados
    report += `## 📁 ARCHIVOS PROCESADOS\n\n`;
    filesProcessed.forEach(file => {
      report += `- **${file.name}**\n`;
      report += `  - Selectores: ${file.totalSelectors}\n`;
      report += `  - Alta especificidad: ${file.highSpecificityCount}\n`;
      report += `  - Violaciones: ${file.violationsCount}\n`;
      report += `  - Optimizaciones: ${file.optimizationsApplied}\n\n`;
    });
    
    // Violaciones
    if (violations.length > 0) {
      report += `## 🚫 VIOLACIONES DETECTADAS\n\n`;
      violations.forEach((violation, index) => {
        report += `### ${violation.file}\n\n`;
        report += `**Tipo:** ${violation.type}\n`;
        report += `**Descripción:** ${violation.description}\n\n`;
      });
    }
    
    // Optimizaciones aplicadas
    if (optimizations.length > 0) {
      report += `## 🔧 OPTIMIZACIONES APLICADAS\n\n`;
      
      const groupedByFile = optimizations.reduce((acc, opt) => {
        if (!acc[opt.file]) acc[opt.file] = [];
        acc[opt.file].push(opt);
        return acc;
      }, {});
      
      Object.entries(groupedByFile).forEach(([fileName, fileOptimizations]) => {
        report += `### ${fileName}\n\n`;
        fileOptimizations.forEach(opt => {
          report += `**Selector original:** \`${opt.originalSelector}\`\n`;
          report += `**Selector optimizado:** \`${opt.optimizedSelector}\`\n`;
          report += `**Reducción de especificidad:** ${opt.specificityReduction} puntos\n\n`;
          
          opt.optimizations.forEach(subOpt => {
            report += `- **${subOpt.type}:** ${subOpt.description}\n`;
          });
          report += `\n`;
        });
      });
    }
    
    // Recomendaciones
    report += `## 🎯 RECOMENDACIONES\n\n`;
    report += `### 1. Evitar Selectores ID\n`;
    report += `Usar clases en lugar de IDs para estilos:\n\n`;
    report += `\`\`\`css\n`;
    report += `/* ❌ Evitar */\n`;
    report += `#header { ... }\n\n`;
    report += `/* ✅ Recomendado */\n`;
    report += `.header { ... }\n`;
    report += `\`\`\`\n\n`;
    
    report += `### 2. Metodología BEM\n`;
    report += `Usar BEM para selectores más específicos y mantenibles:\n\n`;
    report += `\`\`\`css\n`;
    report += `/* ❌ Evitar */\n`;
    report += `.header .nav ul li a { ... }\n\n`;
    report += `/* ✅ Recomendado */\n`;
    report += `.nav__link { ... }\n`;
    report += `\`\`\`\n\n`;
    
    report += `### 3. Limitar !important\n`;
    report += `Usar !important solo cuando sea absolutamente necesario:\n\n`;
    report += `\`\`\`css\n`;
    report += `/* ✅ Uso justificado */\n`;
    report += `.utility-hidden { display: none !important; }\n`;
    report += `\`\`\`\n\n`;
    
    fs.writeFileSync(REPORT_FILE, report);
  }
}

// Ejecutar optimización
if (require.main === module) {
  const optimizer = new SpecificityOptimizer();
  optimizer.processAllFiles();
}

module.exports = SpecificityOptimizer;