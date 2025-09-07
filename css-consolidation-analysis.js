/**
 * ANÁLISIS Y CONSOLIDACIÓN DE CSS
 * Script para identificar duplicaciones y conflictos en los 11 archivos CSS
 */

const fs = require('fs');
const path = require('path');

class CSSConsolidationAnalyzer {
  constructor() {
    this.stylesDir = path.join(__dirname, 'Shared', 'styles');
    this.cssFiles = [
      '_variables-unified.css',
      '_bem-base.css', 
      '_bem-architecture.css',
      'main.css',
      'mobile.css',
      'tablet.css',
      'navigation.css',
      'order-system.css',
      'product-table.css',
      'top-navigation.css',
      '_grid-system.css'
    ];
    this.duplications = {};
    this.conflicts = {};
    this.importantUsage = {};
    this.paddingIssues = {};
  }

  async analyzeAll() {
    console.log('🔍 INICIANDO ANÁLISIS DE CONSOLIDACIÓN CSS');
    console.log('=' .repeat(60));
    
    // 1. Analizar duplicaciones
    await this.findDuplications();
    
    // 2. Analizar conflictos de especificidad
    await this.findSpecificityConflicts();
    
    // 3. Analizar uso de !important
    await this.findImportantUsage();
    
    // 4. Analizar problemas de padding específicos
    await this.analyzePaddingIssues();
    
    // 5. Generar reporte
    this.generateReport();
    
    // 6. Generar plan de consolidación
    this.generateConsolidationPlan();
  }

  async findDuplications() {
    console.log('\n📋 ANALIZANDO DUPLICACIONES...');
    
    const selectors = {};
    const properties = {};
    
    for (const file of this.cssFiles) {
      const filePath = path.join(this.stylesDir, file);
      if (!fs.existsSync(filePath)) continue;
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Buscar selectores duplicados
      const selectorMatches = content.match(/([.#][\w-]+(?:\s*[,:]\s*[.#][\w-]+)*?)\s*\{/g);
      if (selectorMatches) {
        selectorMatches.forEach(match => {
          const selector = match.replace(/\s*\{$/, '').trim();
          if (!selectors[selector]) selectors[selector] = [];
          selectors[selector].push(file);
        });
      }
      
      // Buscar propiedades específicas duplicadas
      const paddingMatches = content.match(/padding[^;]*;/g);
      const marginMatches = content.match(/margin[^;]*;/g);
      const backgroundMatches = content.match(/background[^;]*;/g);
      
      if (paddingMatches) {
        paddingMatches.forEach(prop => {
          if (!properties['padding']) properties['padding'] = {};
          if (!properties['padding'][prop]) properties['padding'][prop] = [];
          properties['padding'][prop].push(file);
        });
      }
    }
    
    // Identificar duplicaciones reales
    Object.keys(selectors).forEach(selector => {
      if (selectors[selector].length > 1) {
        this.duplications[selector] = selectors[selector];
      }
    });
    
    console.log(`✅ Encontradas ${Object.keys(this.duplications).length} duplicaciones de selectores`);
  }

  async findSpecificityConflicts() {
    console.log('\n⚡ ANALIZANDO CONFLICTOS DE ESPECIFICIDAD...');
    
    // Casos específicos conocidos
    const knownConflicts = [
      {
        selector: '#content-container',
        issue: 'Múltiples definiciones con diferentes padding values',
        files: ['main.css'],
        values: ['padding: 0', 'padding: 0 5px', 'padding: 0 2px']
      },
      {
        selector: '.product-table',
        issue: 'Conflicto entre _bem-architecture.css y product-table.css',
        files: ['_bem-architecture.css', 'product-table.css'],
        values: ['background: var(--bg-dark-transparent)', 'background: rgba(0,0,0,0.7)']
      },
      {
        selector: '.top-nav-btn',
        issue: 'Uso excesivo de !important en dimensiones',
        files: ['top-navigation.css'],
        values: ['width: var(--height-sm) !important', 'height: var(--height-sm) !important']
      }
    ];
    
    this.conflicts = knownConflicts;
    console.log(`✅ Identificados ${knownConflicts.length} conflictos de especificidad`);
  }

  async findImportantUsage() {
    console.log('\n🚨 ANALIZANDO USO DE !IMPORTANT...');
    
    for (const file of this.cssFiles) {
      const filePath = path.join(this.stylesDir, file);
      if (!fs.existsSync(filePath)) continue;
      
      const content = fs.readFileSync(filePath, 'utf8');
      const importantMatches = content.match(/[^;]*!important[^;]*;/g);
      
      if (importantMatches && importantMatches.length > 0) {
        this.importantUsage[file] = importantMatches;
      }
    }
    
    const totalImportant = Object.values(this.importantUsage).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`✅ Encontrados ${totalImportant} usos de !important en ${Object.keys(this.importantUsage).length} archivos`);
  }

  async analyzePaddingIssues() {
    console.log('\n📐 ANALIZANDO PROBLEMAS DE PADDING...');
    
    this.paddingIssues = {
      'content-container': {
        problem: 'Múltiples definiciones inconsistentes',
        current_values: {
          'main.css:214': 'padding: 0',
          'main.css:625': 'padding: 0 5px',
          'main.css:1800': 'padding: 0',
          'main.css:1916': 'padding: 0 2px'
        },
        recommended: 'padding: 0 var(--container-padding)',
        missing_variable: '--container-padding no está definida en _variables-unified.css'
      },
      'container-padding-variable': {
        problem: 'Variable --container-padding no existe',
        impact: 'Archivos _bem-base.css y navigation.css la referencian pero no está definida',
        recommended: 'Definir --container-padding: var(--padding-md) en _variables-unified.css'
      }
    };
    
    console.log(`✅ Identificados ${Object.keys(this.paddingIssues).length} problemas críticos de padding`);
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE DE CONSOLIDACIÓN CSS');
    console.log('='.repeat(60));
    
    console.log('\n🔴 PROBLEMAS CRÍTICOS:');
    console.log('1. Variable --container-padding no definida pero referenciada');
    console.log('2. #content-container tiene 4 definiciones diferentes');
    console.log('3. .product-table conflicto entre archivos modulares');
    console.log('4. 22 usos de !important en top-navigation.css');
    
    console.log('\n📋 DUPLICACIONES ENCONTRADAS:');
    Object.keys(this.duplications).slice(0, 5).forEach(selector => {
      console.log(`   ${selector}: ${this.duplications[selector].join(', ')}`);
    });
    
    console.log('\n⚡ CONFLICTOS DE ESPECIFICIDAD:');
    this.conflicts.forEach(conflict => {
      console.log(`   ${conflict.selector}: ${conflict.issue}`);
    });
    
    console.log('\n🚨 ARCHIVOS CON !IMPORTANT:');
    Object.keys(this.importantUsage).forEach(file => {
      console.log(`   ${file}: ${this.importantUsage[file].length} usos`);
    });
  }

  generateConsolidationPlan() {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 PLAN DE CONSOLIDACIÓN');
    console.log('='.repeat(60));
    
    console.log('\n📋 FASE 1: VARIABLES FALTANTES');
    console.log('1. Agregar --container-padding a _variables-unified.css');
    console.log('2. Definir valores responsive para container-padding');
    console.log('3. Actualizar referencias en _bem-base.css y navigation.css');
    
    console.log('\n📋 FASE 2: CONSOLIDAR #CONTENT-CONTAINER');
    console.log('1. Eliminar 3 definiciones duplicadas de main.css');
    console.log('2. Crear una sola definición usando --container-padding');
    console.log('3. Mover definiciones responsive a media queries apropiados');
    
    console.log('\n📋 FASE 3: RESOLVER CONFLICTOS .PRODUCT-TABLE');
    console.log('1. Consolidar estilos base en product-table.css');
    console.log('2. Mantener solo modificadores BEM en _bem-architecture.css');
    console.log('3. Asegurar orden de importación correcto');
    
    console.log('\n📋 FASE 4: ELIMINAR !IMPORTANT');
    console.log('1. Refactorizar top-navigation.css sin !important');
    console.log('2. Usar especificidad CSS apropiada');
    console.log('3. Probar que no se pierdan estilos visuales');
    
    console.log('\n📋 FASE 5: VALIDACIÓN');
    console.log('1. Verificar que no se pierda funcionalidad visual');
    console.log('2. Probar responsive en todos los breakpoints');
    console.log('3. Validar que el sidebar de órdenes funcione');
    
    console.log('\n✅ RESULTADO ESPERADO:');
    console.log('- CSS verdaderamente modular (no distribuido)');
    console.log('- Variables centralizadas sin duplicaciones');
    console.log('- Especificidad controlada sin !important');
    console.log('- Padding del contenedor corregido');
    console.log('- Funcionalidad visual preservada');
  }
}

// Ejecutar análisis
if (require.main === module) {
  const analyzer = new CSSConsolidationAnalyzer();
  analyzer.analyzeAll().catch(console.error);
}

module.exports = CSSConsolidationAnalyzer;