#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración
const STYLES_DIR = 'Shared/styles';
const REPORT_FILE = 'media-queries-consolidation-report.md';
const CONSOLIDATED_FILE = 'Shared/styles/_media-queries-consolidated.css';

// Patrones para extraer media queries
const MEDIA_QUERY_PATTERNS = {
  complete: /@media\s*\([^{]+\)\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g,
  opening: /@media\s*\([^{]+\)\s*\{/g,
  condition: /@media\s*\(([^)]+)\)/g
};

class MediaQueryConsolidator {
  constructor() {
    this.results = {
      filesProcessed: [],
      mediaQueries: new Map(),
      duplicates: [],
      conflicts: [],
      consolidatedQueries: [],
      summary: {
        totalFiles: 0,
        totalQueries: 0,
        duplicatesFound: 0,
        consolidatedCount: 0
      }
    };
  }

  extractMediaQueries(content, fileName) {
    const queries = [];
    let match;
    
    // Extraer media queries completas
    const completePattern = /@media\s*\([^{]+\)\s*\{/g;
    const positions = [];
    
    while ((match = completePattern.exec(content)) !== null) {
      positions.push({
        start: match.index,
        condition: match[0],
        fullMatch: match[0]
      });
    }
    
    // Para cada posición, extraer el contenido completo
    positions.forEach((pos, index) => {
      const startIndex = pos.start;
      let braceCount = 0;
      let endIndex = startIndex;
      let foundStart = false;
      
      // Encontrar el final del media query
      for (let i = startIndex; i < content.length; i++) {
        const char = content[i];
        if (char === '{') {
          braceCount++;
          foundStart = true;
        } else if (char === '}') {
          braceCount--;
          if (foundStart && braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
      
      if (endIndex > startIndex) {
        const fullQuery = content.substring(startIndex, endIndex);
        const condition = this.extractCondition(pos.condition);
        const innerContent = this.extractInnerContent(fullQuery);
        
        queries.push({
          file: fileName,
          condition: condition,
          fullQuery: fullQuery,
          innerContent: innerContent,
          startIndex: startIndex,
          endIndex: endIndex,
          hash: this.generateHash(condition, innerContent)
        });
      }
    });
    
    return queries;
  }

  extractCondition(mediaString) {
    const match = mediaString.match(/@media\s*\(([^)]+)\)/);
    return match ? match[1].trim() : '';
  }

  extractInnerContent(fullQuery) {
    const match = fullQuery.match(/@media\s*\([^{]+\)\s*\{([\s\S]*?)\}$/);
    return match ? match[1].trim() : '';
  }

  generateHash(condition, content) {
    // Normalizar contenido para comparación
    const normalizedCondition = condition.replace(/\s+/g, ' ').toLowerCase();
    const normalizedContent = content.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
    return `${normalizedCondition}|${normalizedContent}`;
  }

  processFile(filePath) {
    console.log(`🔍 Analizando: ${path.basename(filePath)}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const queries = this.extractMediaQueries(content, path.basename(filePath));
    
    console.log(`  📱 ${queries.length} media queries encontradas`);
    
    // Almacenar queries por condición
    queries.forEach(query => {
      const key = query.condition;
      if (!this.results.mediaQueries.has(key)) {
        this.results.mediaQueries.set(key, []);
      }
      this.results.mediaQueries.get(key).push(query);
    });
    
    this.results.filesProcessed.push({
      name: path.basename(filePath),
      path: filePath,
      queriesCount: queries.length,
      queries: queries
    });
    
    return queries.length;
  }

  findDuplicates() {
    console.log('\n🔍 Buscando duplicados...');
    
    const hashMap = new Map();
    const duplicates = [];
    
    // Agrupar por hash
    this.results.mediaQueries.forEach((queries, condition) => {
      queries.forEach(query => {
        if (!hashMap.has(query.hash)) {
          hashMap.set(query.hash, []);
        }
        hashMap.get(query.hash).push(query);
      });
    });
    
    // Encontrar duplicados
    hashMap.forEach((queries, hash) => {
      if (queries.length > 1) {
        duplicates.push({
          hash: hash,
          condition: queries[0].condition,
          files: queries.map(q => q.file),
          count: queries.length,
          queries: queries
        });
      }
    });
    
    this.results.duplicates = duplicates;
    console.log(`  🔄 ${duplicates.length} grupos de duplicados encontrados`);
    
    return duplicates;
  }

  consolidateQueries() {
    console.log('\n🎯 Consolidando media queries...');
    
    const consolidated = new Map();
    
    // Agrupar por condición
    this.results.mediaQueries.forEach((queries, condition) => {
      const uniqueContents = new Map();
      
      queries.forEach(query => {
        const contentKey = query.innerContent;
        if (!uniqueContents.has(contentKey)) {
          uniqueContents.set(contentKey, {
            content: contentKey,
            files: [],
            selectors: this.extractSelectors(contentKey)
          });
        }
        uniqueContents.get(contentKey).files.push(query.file);
      });
      
      // Consolidar contenidos únicos
      const consolidatedContent = Array.from(uniqueContents.values())
        .map(item => {
          const comment = `  /* Consolidado de: ${item.files.join(', ')} */\n`;
          return comment + this.indentContent(item.content);
        })
        .join('\n\n');
      
      consolidated.set(condition, {
        condition: condition,
        content: consolidatedContent,
        originalFiles: [...new Set(queries.map(q => q.file))],
        queryCount: queries.length
      });
    });
    
    this.results.consolidatedQueries = Array.from(consolidated.values());
    console.log(`  ✅ ${consolidated.size} media queries consolidadas`);
    
    return consolidated;
  }

  extractSelectors(content) {
    const selectors = [];
    const selectorPattern = /([^{]+)\s*\{[^}]*\}/g;
    let match;
    
    while ((match = selectorPattern.exec(content)) !== null) {
      selectors.push(match[1].trim());
    }
    
    return selectors;
  }

  indentContent(content) {
    return content.split('\n')
      .map(line => line.trim() ? `  ${line}` : line)
      .join('\n');
  }

  generateConsolidatedFile() {
    console.log('\n📝 Generando archivo consolidado...');
    
    let consolidatedContent = `/* === MEDIA QUERIES CONSOLIDADAS === */\n`;
    consolidatedContent += `/* Generado automáticamente - No editar manualmente */\n`;
    consolidatedContent += `/* Fecha: ${new Date().toLocaleDateString('es-ES')} */\n\n`;
    
    // Ordenar por breakpoint (mobile-first)
    const breakpointOrder = {
      'max-width: 479px': 1,
      'min-width: 480px': 2,
      'max-width: 767px': 3,
      'min-width: 768px': 4,
      'max-width: 1023px': 5,
      'min-width: 1024px': 6,
      'min-width: 1200px': 7,
      'min-width: 1400px': 8
    };
    
    const sortedQueries = this.results.consolidatedQueries.sort((a, b) => {
      const orderA = breakpointOrder[a.condition] || 999;
      const orderB = breakpointOrder[b.condition] || 999;
      return orderA - orderB;
    });
    
    sortedQueries.forEach(query => {
      consolidatedContent += `/* === ${query.condition.toUpperCase()} === */\n`;
      consolidatedContent += `/* Archivos origen: ${query.originalFiles.join(', ')} */\n`;
      consolidatedContent += `@media (${query.condition}) {\n`;
      consolidatedContent += query.content;
      consolidatedContent += `\n}\n\n`;
    });
    
    // Agregar instrucciones de uso
    consolidatedContent += `/* === INSTRUCCIONES DE USO === */\n`;
    consolidatedContent += `/*\n`;
    consolidatedContent += `1. Importar este archivo en main.css:\n`;
    consolidatedContent += `   @import '_media-queries-consolidated.css';\n\n`;
    consolidatedContent += `2. Remover media queries duplicadas de archivos individuales\n\n`;
    consolidatedContent += `3. Usar variables CSS para breakpoints:\n`;
    consolidatedContent += `   @media (min-width: var(--bp-tablet)) { ... }\n`;
    consolidatedContent += `*/\n`;
    
    fs.writeFileSync(CONSOLIDATED_FILE, consolidatedContent);
    console.log(`✅ Archivo consolidado creado: ${CONSOLIDATED_FILE}`);
  }

  processAllFiles() {
    console.log('🚀 INICIANDO CONSOLIDACIÓN DE MEDIA QUERIES\n');
    
    // Procesar archivos CSS
    const cssFiles = fs.readdirSync(STYLES_DIR)
      .filter(file => file.endsWith('.css') && !file.startsWith('_media-queries-consolidated'))
      .map(file => path.join(STYLES_DIR, file));
    
    let totalQueries = 0;
    cssFiles.forEach(file => {
      totalQueries += this.processFile(file);
    });
    
    // Analizar duplicados
    this.findDuplicates();
    
    // Consolidar
    this.consolidateQueries();
    
    // Generar archivo consolidado
    this.generateConsolidatedFile();
    
    this.results.summary = {
      totalFiles: cssFiles.length,
      totalQueries: totalQueries,
      duplicatesFound: this.results.duplicates.length,
      consolidatedCount: this.results.consolidatedQueries.length
    };
    
    this.generateReport();
    
    console.log('\n✅ CONSOLIDACIÓN COMPLETADA');
    console.log(`📊 ${totalQueries} media queries analizadas`);
    console.log(`🔄 ${this.results.duplicates.length} grupos de duplicados`);
    console.log(`🎯 ${this.results.consolidatedQueries.length} queries consolidadas`);
    console.log(`📄 Reporte generado: ${REPORT_FILE}`);
  }

  generateReport() {
    const { summary, duplicates, consolidatedQueries, filesProcessed } = this.results;
    const date = new Date().toLocaleDateString('es-ES');
    
    let report = `# REPORTE DE CONSOLIDACIÓN DE MEDIA QUERIES\n\n`;
    report += `**Fecha:** ${date}\n\n`;
    
    // Resumen
    report += `## 📊 RESUMEN\n\n`;
    report += `- **Archivos analizados:** ${summary.totalFiles}\n`;
    report += `- **Media queries encontradas:** ${summary.totalQueries}\n`;
    report += `- **Grupos de duplicados:** ${summary.duplicatesFound}\n`;
    report += `- **Queries consolidadas:** ${summary.consolidatedCount}\n\n`;
    
    // Archivos procesados
    report += `## 📁 ARCHIVOS ANALIZADOS\n\n`;
    filesProcessed.forEach(file => {
      report += `- **${file.name}** - ${file.queriesCount} media queries\n`;
    });
    report += `\n`;
    
    // Duplicados encontrados
    if (duplicates.length > 0) {
      report += `## 🔄 DUPLICADOS DETECTADOS\n\n`;
      duplicates.forEach((dup, index) => {
        report += `### Duplicado ${index + 1}\n\n`;
        report += `**Condición:** \`${dup.condition}\`\n`;
        report += `**Archivos:** ${dup.files.join(', ')}\n`;
        report += `**Ocurrencias:** ${dup.count}\n\n`;
      });
    }
    
    // Queries consolidadas
    report += `## 🎯 MEDIA QUERIES CONSOLIDADAS\n\n`;
    consolidatedQueries.forEach(query => {
      report += `### ${query.condition}\n\n`;
      report += `**Archivos origen:** ${query.originalFiles.join(', ')}\n`;
      report += `**Queries originales:** ${query.queryCount}\n\n`;
    });
    
    // Recomendaciones
    report += `## 🎯 RECOMENDACIONES\n\n`;
    report += `### 1. Importar Archivo Consolidado\n`;
    report += `Agregar al final de \`main.css\`:\n\n`;
    report += `\`\`\`css\n`;
    report += `@import '_media-queries-consolidated.css';\n`;
    report += `\`\`\`\n\n`;
    
    report += `### 2. Remover Duplicados\n`;
    report += `Eliminar media queries duplicadas de archivos individuales para evitar conflictos.\n\n`;
    
    report += `### 3. Usar Variables CSS\n`;
    report += `Reemplazar valores hardcodeados con variables:\n\n`;
    report += `\`\`\`css\n`;
    report += `/* ✅ Recomendado */\n`;
    report += `@media (min-width: var(--bp-tablet)) { ... }\n\n`;
    report += `/* ❌ Evitar */\n`;
    report += `@media (min-width: 768px) { ... }\n`;
    report += `\`\`\`\n\n`;
    
    report += `### 4. Orden Mobile-First\n`;
    report += `Las media queries están ordenadas siguiendo el enfoque mobile-first para mejor rendimiento.\n\n`;
    
    fs.writeFileSync(REPORT_FILE, report);
  }
}

// Ejecutar consolidación
if (require.main === module) {
  const consolidator = new MediaQueryConsolidator();
  consolidator.processAllFiles();
}

module.exports = MediaQueryConsolidator;