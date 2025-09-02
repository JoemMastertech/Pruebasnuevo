#!/usr/bin/env node
/**
 * Pre-commit Hook - Validación de Estructura Hexagonal
 * Previene commits que violen la estructura del proyecto
 */

const { StructureValidator } = require('./cicd-preventive-rules.js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PreCommitValidator {
  constructor() {
    this.validator = new StructureValidator();
  }

  /**
   * Obtiene archivos en staging (git add)
   */
  getStagedFiles() {
    try {
      const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      return output.trim().split('\n').filter(file => file.length > 0);
    } catch (error) {
      console.log('⚠️ No se pudieron obtener archivos en staging:', error.message);
      return [];
    }
  }

  /**
   * Verifica si algún archivo en staging viola la estructura
   */
  checkStagedFiles() {
    const stagedFiles = this.getStagedFiles();
    const violations = [];
    
    console.log(`🔍 Verificando ${stagedFiles.length} archivos en staging...`);
    
    for (const file of stagedFiles) {
      // Verificar si se están creando carpetas prohibidas
      const parts = file.split('/');
      const rootDir = parts[0];
      
      // Verificar patrones prohibidos
      const { forbiddenPatterns } = require('./cicd-preventive-rules.js').OFFICIAL_STRUCTURE;
      
      for (const pattern of forbiddenPatterns) {
        if (pattern.test(rootDir)) {
          violations.push({
            file,
            reason: `Carpeta prohibida: ${rootDir} (patrón duplicado consolidado)`
          });
        }
      }
      
      // Verificar estructura no autorizada
      if (this.isUnauthorizedStructure(file)) {
        violations.push({
          file,
          reason: `Estructura no autorizada en: ${file}`
        });
      }
    }
    
    return violations;
  }

  /**
   * Verifica si un archivo está en una estructura no autorizada
   */
  isUnauthorizedStructure(filePath) {
    const { directories, specialDirectories } = require('./cicd-preventive-rules.js').OFFICIAL_STRUCTURE;
    const allowedDirs = [...directories, ...specialDirectories];
    
    const parts = filePath.split('/');
    const rootDir = parts[0];
    
    // Si es un archivo en la raíz, está permitido
    if (parts.length === 1) {
      return false;
    }
    
    // Verificar si la carpeta raíz está permitida
    return !allowedDirs.includes(rootDir);
  }

  /**
   * Ejecuta la validación completa
   */
  async runValidation() {
    console.log('🚀 Pre-commit: Validando estructura hexagonal...');
    
    // 1. Verificar archivos en staging
    const stagingViolations = this.checkStagedFiles();
    
    if (stagingViolations.length > 0) {
      console.log('\n❌ COMMIT RECHAZADO: Violaciones de estructura detectadas\n');
      
      stagingViolations.forEach(violation => {
        console.log(`  🚫 ${violation.file}`);
        console.log(`     ${violation.reason}\n`);
      });
      
      console.log('💡 Soluciones:');
      console.log('  1. Mueve los archivos a las carpetas correctas');
      console.log('  2. Usa las carpetas oficiales: Domain, Aplicacion, Infraestructura, etc.');
      console.log('  3. Ejecuta: node cicd-preventive-rules.js para ver la estructura completa\n');
      
      return false;
    }
    
    // 2. Ejecutar validación completa del proyecto
    const isValid = await this.validator.validate();
    
    if (!isValid) {
      console.log('\n❌ COMMIT RECHAZADO: La estructura del proyecto tiene errores');
      console.log('\n💡 Ejecuta: node cicd-preventive-rules.js para ver los detalles\n');
      return false;
    }
    
    console.log('\n✅ COMMIT APROBADO: Estructura hexagonal válida\n');
    return true;
  }
}

// Función principal
async function main() {
  const preCommitValidator = new PreCommitValidator();
  const isValid = await preCommitValidator.runValidation();
  
  // Exit code para git hook
  process.exit(isValid ? 0 : 1);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Error en pre-commit hook:', error.message);
    process.exit(1);
  });
}

module.exports = { PreCommitValidator };