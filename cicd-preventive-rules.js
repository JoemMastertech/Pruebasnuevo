#!/usr/bin/env node
/**
 * CI/CD Preventive Rules - Validador de Estructura Hexagonal
 * Fase 5: Blindaje para prevenir regresiones en la estructura del proyecto
 */

const fs = require('fs');
const path = require('path');

// Configuración de estructura oficial permitida
const OFFICIAL_STRUCTURE = {
  // Carpetas principales de arquitectura hexagonal
  directories: [
    'Domain',
    'Aplicacion', // Application en español
    'Infraestructura', // Infrastructure en español
    'Adapters',
    'Shared',
    'Tests',
    'docs',
    // Carpetas adicionales del proyecto
    'Components',
    'Documentation',
    'Interfaces',
    'Web',
    'compiled',
    'dist'
  ],
  
  // Archivos permitidos en la raíz
  rootFiles: [
    '.env.example',
    '.gitattributes',
    '.gitignore',
    'index.html',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'vite.config.ts',
    'README.md',
    'ESTRUCTURA_PROYECTO.md',
    // Scripts de auditoría
    'audit-structure.js',
    'detect-references.js',
    'consolidate-duplicates.js',
    'consolidate-duplicates.ps1',
    'cicd-preventive-rules.js',
    // Reportes generados
    'audit-report.json',
    'AUDIT_REPORT.md',
    'reference-analysis.json',
    'REFERENCE_ANALYSIS.md',
    'consolidation-report.json',
    'CONSOLIDATION_REPORT.md',
    'consolidation-report-ps.json',
    'CONSOLIDATION_REPORT_PS.md'
  ],
  
  // Carpetas especiales permitidas
  specialDirectories: [
    '.git',
    '.github',
    'node_modules',
    '__CONSOLIDATION_BACKUP__'
  ],
  
  // Patrones prohibidos (duplicados en inglés/español)
  forbiddenPatterns: [
    /^Dominio$/i, // Prohibido después de consolidación Domain->Dominio
    /^Application$/i, // Prohibido, ya tenemos Aplicacion
    /^Infrastructure$/i, // Prohibido después de consolidación Infrastructure->Infraestructura
    /^Componentes$/i // Prohibido, ya tenemos Components
  ]
};

class StructureValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.projectRoot = process.cwd();
  }

  /**
   * Ejecuta todas las validaciones
   */
  async validate() {
    console.log('🔍 Iniciando validación de estructura hexagonal...');
    
    try {
      await this.validateRootStructure();
      await this.validateForbiddenPatterns();
      await this.validateHexagonalLayers();
      await this.validateBuildArtifacts();
      await this.generateReport();
      
      return this.getValidationResult();
    } catch (error) {
      this.errors.push(`Error durante validación: ${error.message}`);
      return false;
    }
  }

  /**
   * Valida la estructura en la raíz del proyecto
   */
  async validateRootStructure() {
    const items = fs.readdirSync(this.projectRoot);
    
    for (const item of items) {
      const itemPath = path.join(this.projectRoot, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        if (!this.isAllowedDirectory(item)) {
          this.errors.push(`❌ Carpeta no autorizada en raíz: ${item}`);
        }
      } else {
        if (!this.isAllowedRootFile(item)) {
          this.warnings.push(`⚠️ Archivo no documentado en raíz: ${item}`);
        }
      }
    }
  }

  /**
   * Valida patrones prohibidos (duplicados)
   */
  async validateForbiddenPatterns() {
    const items = fs.readdirSync(this.projectRoot);
    
    for (const item of items) {
      const itemPath = path.join(this.projectRoot, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        for (const pattern of OFFICIAL_STRUCTURE.forbiddenPatterns) {
          if (pattern.test(item)) {
            this.errors.push(`🚫 Patrón prohibido detectado: ${item} (duplicado consolidado)`);
          }
        }
      }
    }
  }

  /**
   * Valida que las capas hexagonales existan
   */
  async validateHexagonalLayers() {
    const requiredLayers = ['Domain', 'Aplicacion', 'Infraestructura'];
    
    for (const layer of requiredLayers) {
      const layerPath = path.join(this.projectRoot, layer);
      if (!fs.existsSync(layerPath)) {
        this.errors.push(`❌ Capa hexagonal faltante: ${layer}`);
      } else {
        console.log(`✅ Capa hexagonal encontrada: ${layer}`);
      }
    }
  }

  /**
   * Valida que no existan artefactos de compilación problemáticos
   */
  async validateBuildArtifacts() {
    const buildDirs = ['dist', 'compiled', 'build'];
    
    for (const buildDir of buildDirs) {
      const buildPath = path.join(this.projectRoot, buildDir);
      
      if (fs.existsSync(buildPath)) {
        // Verificar si contiene archivos fuente (.ts, .js no compilados)
        const sourceFiles = this.findSourceFilesInBuildDir(buildPath);
        
        if (sourceFiles.length > 0) {
          this.errors.push(`🚫 Artefactos de compilación contienen archivos fuente en ${buildDir}/`);
          sourceFiles.slice(0, 3).forEach(file => {
            this.errors.push(`   📄 ${path.relative(this.projectRoot, file)}`);
          });
          if (sourceFiles.length > 3) {
            this.errors.push(`   ... y ${sourceFiles.length - 3} archivos más`);
          }
        }
        
        // Verificar si hay carpetas vacías
        if (this.isBuildDirEmpty(buildPath)) {
          this.warnings.push(`⚠️ Carpeta de build vacía: ${buildDir}/ (debería limpiarse)`);
        }
      }
    }
  }

  /**
   * Encuentra archivos fuente en directorios de build
   */
  findSourceFilesInBuildDir(buildPath) {
    const sourceFiles = [];
    
    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scanDirectory(itemPath);
        } else {
          // Detectar archivos fuente que no deberían estar en build
          const ext = path.extname(item).toLowerCase();
          const isSourceFile = ['.ts', '.tsx'].includes(ext) || 
                           (ext === '.js' && !item.endsWith('.min.js') && !this.isCompiledJs(itemPath));
          
          if (isSourceFile) {
            sourceFiles.push(itemPath);
          }
        }
      }
    };
    
    try {
      scanDirectory(buildPath);
    } catch (error) {
      // Ignorar errores de acceso
    }
    
    return sourceFiles;
  }

  /**
   * Verifica si un archivo .js es compilado (tiene .map o .d.ts asociado)
   */
  isCompiledJs(jsPath) {
    const baseName = jsPath.replace(/\.js$/, '');
    return fs.existsSync(`${baseName}.d.ts`) || fs.existsSync(`${baseName}.js.map`);
  }

  /**
   * Verifica si un directorio de build está vacío o solo contiene carpetas vacías
   */
  isBuildDirEmpty(buildPath) {
    const checkEmpty = (dir) => {
      const items = fs.readdirSync(dir);
      
      if (items.length === 0) return true;
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isFile()) {
          return false; // Hay archivos
        } else if (stats.isDirectory()) {
          if (!checkEmpty(itemPath)) {
            return false; // Subdirectorio no vacío
          }
        }
      }
      
      return true; // Solo carpetas vacías
    };
    
    try {
      return checkEmpty(buildPath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica si una carpeta está permitida
   */
  isAllowedDirectory(dirName) {
    return OFFICIAL_STRUCTURE.directories.includes(dirName) ||
           OFFICIAL_STRUCTURE.specialDirectories.includes(dirName);
  }

  /**
   * Verifica si un archivo está permitido en la raíz
   */
  isAllowedRootFile(fileName) {
    return OFFICIAL_STRUCTURE.rootFiles.includes(fileName) ||
           fileName.startsWith('.') || // Archivos de configuración
           fileName.endsWith('.md') || // Documentación
           fileName.endsWith('.json') || // Configuración/reportes
           fileName.endsWith('.js') || // Scripts
           fileName.endsWith('.ps1'); // Scripts PowerShell
  }

  /**
   * Genera reporte de validación
   */
  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      projectRoot: this.projectRoot,
      validation: {
        passed: this.errors.length === 0,
        errors: this.errors.length,
        warnings: this.warnings.length
      },
      errors: this.errors,
      warnings: this.warnings,
      officialStructure: OFFICIAL_STRUCTURE
    };

    // Guardar reporte JSON
    fs.writeFileSync(
      path.join(this.projectRoot, 'structure-validation.json'),
      JSON.stringify(report, null, 2)
    );

    // Generar reporte Markdown
    const markdown = this.generateMarkdownReport(report);
    fs.writeFileSync(
      path.join(this.projectRoot, 'STRUCTURE_VALIDATION.md'),
      markdown
    );

    console.log('📄 Reportes generados:');
    console.log('  - structure-validation.json');
    console.log('  - STRUCTURE_VALIDATION.md');
  }

  /**
   * Genera reporte en formato Markdown
   */
  generateMarkdownReport(report) {
    let markdown = `# Reporte de Validación de Estructura\n\n`;
    markdown += `**Fecha:** ${new Date(report.timestamp).toLocaleString()}\n\n`;
    
    // Estado general
    const status = report.validation.passed ? '✅ APROBADA' : '❌ RECHAZADA';
    markdown += `## Estado: ${status}\n\n`;
    
    // Resumen
    markdown += `## Resumen\n\n`;
    markdown += `- **Errores:** ${report.validation.errors}\n`;
    markdown += `- **Advertencias:** ${report.validation.warnings}\n\n`;
    
    // Errores
    if (report.errors.length > 0) {
      markdown += `## ❌ Errores Críticos\n\n`;
      report.errors.forEach(error => {
        markdown += `- ${error}\n`;
      });
      markdown += `\n`;
    }
    
    // Advertencias
    if (report.warnings.length > 0) {
      markdown += `## ⚠️ Advertencias\n\n`;
      report.warnings.forEach(warning => {
        markdown += `- ${warning}\n`;
      });
      markdown += `\n`;
    }
    
    // Estructura oficial
    markdown += `## 📋 Estructura Oficial Permitida\n\n`;
    markdown += `### Carpetas Principales\n`;
    report.officialStructure.directories.forEach(dir => {
      markdown += `- ${dir}\n`;
    });
    
    markdown += `\n### Carpetas Especiales\n`;
    report.officialStructure.specialDirectories.forEach(dir => {
      markdown += `- ${dir}\n`;
    });
    
    return markdown;
  }

  /**
   * Retorna el resultado de la validación
   */
  getValidationResult() {
    const passed = this.errors.length === 0;
    
    if (passed) {
      console.log('\n✅ VALIDACIÓN EXITOSA: Estructura hexagonal correcta');
    } else {
      console.log('\n❌ VALIDACIÓN FALLIDA: Se encontraron errores críticos');
      console.log('\n🔧 Errores a corregir:');
      this.errors.forEach(error => console.log(`  ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️ Advertencias:');
      this.warnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    return passed;
  }
}

// Función principal
async function main() {
  const validator = new StructureValidator();
  const isValid = await validator.validate();
  
  // Exit code para CI/CD
  process.exit(isValid ? 0 : 1);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Error fatal:', error.message);
    process.exit(1);
  });
}

module.exports = { StructureValidator, OFFICIAL_STRUCTURE };