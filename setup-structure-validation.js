#!/usr/bin/env node
/**
 * Setup Script - Configuración de Validación de Estructura Hexagonal
 * Instala hooks de git y configura validaciones CI/CD
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class StructureValidationSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.gitHooksDir = path.join(this.projectRoot, '.git', 'hooks');
  }

  /**
   * Verifica si estamos en un repositorio git
   */
  isGitRepository() {
    return fs.existsSync(path.join(this.projectRoot, '.git'));
  }

  /**
   * Instala el hook de pre-commit
   */
  installPreCommitHook() {
    if (!this.isGitRepository()) {
      console.log('⚠️ No es un repositorio git, saltando instalación de hooks');
      return false;
    }

    const hookPath = path.join(this.gitHooksDir, 'pre-commit');
    const hookContent = `#!/bin/sh
# Validación de estructura hexagonal
node pre-commit-structure-check.js
`;

    try {
      // Crear directorio de hooks si no existe
      if (!fs.existsSync(this.gitHooksDir)) {
        fs.mkdirSync(this.gitHooksDir, { recursive: true });
      }

      // Escribir hook
      fs.writeFileSync(hookPath, hookContent);
      
      // Hacer ejecutable (en sistemas Unix)
      if (process.platform !== 'win32') {
        fs.chmodSync(hookPath, '755');
      }

      console.log('✅ Hook de pre-commit instalado');
      return true;
    } catch (error) {
      console.log('❌ Error instalando hook de pre-commit:', error.message);
      return false;
    }
  }

  /**
   * Verifica la configuración de GitHub Actions
   */
  verifyGitHubActions() {
    const workflowPath = path.join(this.projectRoot, '.github', 'workflows', 'structure-validation.yml');
    
    if (fs.existsSync(workflowPath)) {
      console.log('✅ GitHub Actions workflow configurado');
      return true;
    } else {
      console.log('⚠️ GitHub Actions workflow no encontrado');
      console.log('   Archivo esperado: .github/workflows/structure-validation.yml');
      return false;
    }
  }

  /**
   * Verifica que todos los scripts necesarios existan
   */
  verifyScripts() {
    const requiredScripts = [
      'cicd-preventive-rules.js',
      'pre-commit-structure-check.js'
    ];

    let allExist = true;

    for (const script of requiredScripts) {
      const scriptPath = path.join(this.projectRoot, script);
      if (fs.existsSync(scriptPath)) {
        console.log(`✅ Script encontrado: ${script}`);
      } else {
        console.log(`❌ Script faltante: ${script}`);
        allExist = false;
      }
    }

    return allExist;
  }

  /**
   * Ejecuta una prueba de validación
   */
  async runValidationTest() {
    console.log('\n🧪 Ejecutando prueba de validación...');
    
    try {
      execSync('node cicd-preventive-rules.js', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
      console.log('✅ Prueba de validación exitosa');
      return true;
    } catch (error) {
      console.log('❌ Prueba de validación falló');
      return false;
    }
  }

  /**
   * Crea documentación de uso
   */
  createDocumentation() {
    const docContent = `# Validación de Estructura Hexagonal

## Scripts Disponibles

### Validación Manual
\`\`\`bash
# Ejecutar validación completa
node cicd-preventive-rules.js
\`\`\`

### Pre-commit Hook
\`\`\`bash
# Probar hook manualmente
node pre-commit-structure-check.js
\`\`\`

### Configuración
\`\`\`bash
# Instalar/reinstalar validaciones
node setup-structure-validation.js
\`\`\`

## Estructura Oficial Permitida

### Carpetas Principales
- \`Domain/\` - Entidades y lógica de negocio
- \`Aplicacion/\` - Casos de uso y servicios de aplicación
- \`Infraestructura/\` - Adaptadores e implementaciones
- \`Shared/\` - Código compartido
- \`Tests/\` - Pruebas del proyecto
- \`docs/\` - Documentación

### Carpetas Adicionales
- \`Components/\` - Componentes reutilizables
- \`Documentation/\` - Documentación extendida
- \`Interfaces/\` - Interfaces web
- \`Web/\` - Recursos web estáticos

## Patrones Prohibidos

❌ **NO crear estas carpetas** (duplicados consolidados):
- \`Dominio/\` → Usar \`Domain/\`
- \`Application/\` → Usar \`Aplicacion/\`
- \`Infrastructure/\` → Usar \`Infraestructura/\`
- \`Componentes/\` → Usar \`Components/\`

## CI/CD Integration

La validación se ejecuta automáticamente en:
- ✅ Pre-commit hooks (local)
- ✅ GitHub Actions (push/PR)
- ✅ Validación manual

## Reportes Generados

- \`structure-validation.json\` - Reporte detallado en JSON
- \`STRUCTURE_VALIDATION.md\` - Reporte legible en Markdown
`;

    const docPath = path.join(this.projectRoot, 'docs', 'STRUCTURE_VALIDATION_GUIDE.md');
    
    try {
      // Crear directorio docs si no existe
      const docsDir = path.dirname(docPath);
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }

      fs.writeFileSync(docPath, docContent);
      console.log('✅ Documentación creada: docs/STRUCTURE_VALIDATION_GUIDE.md');
      return true;
    } catch (error) {
      console.log('⚠️ No se pudo crear documentación:', error.message);
      return false;
    }
  }

  /**
   * Ejecuta la configuración completa
   */
  async setup() {
    console.log('🚀 Configurando validación de estructura hexagonal...\n');

    // 1. Verificar scripts
    console.log('📋 Verificando scripts...');
    const scriptsOk = this.verifyScripts();
    
    // 2. Instalar hooks
    console.log('\n🔗 Configurando hooks de git...');
    const hooksOk = this.installPreCommitHook();
    
    // 3. Verificar GitHub Actions
    console.log('\n⚙️ Verificando GitHub Actions...');
    const actionsOk = this.verifyGitHubActions();
    
    // 4. Crear documentación
    console.log('\n📚 Creando documentación...');
    const docsOk = this.createDocumentation();
    
    // 5. Ejecutar prueba
    const testOk = await this.runValidationTest();
    
    // Resumen
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE CONFIGURACIÓN');
    console.log('='.repeat(50));
    console.log(`Scripts requeridos:     ${scriptsOk ? '✅' : '❌'}`);
    console.log(`Hooks de git:          ${hooksOk ? '✅' : '⚠️'}`);
    console.log(`GitHub Actions:        ${actionsOk ? '✅' : '⚠️'}`);
    console.log(`Documentación:         ${docsOk ? '✅' : '⚠️'}`);
    console.log(`Prueba de validación:  ${testOk ? '✅' : '❌'}`);
    
    const allOk = scriptsOk && testOk;
    
    if (allOk) {
      console.log('\n🎉 ¡Configuración completada exitosamente!');
      console.log('\n💡 Próximos pasos:');
      console.log('  1. Los commits ahora serán validados automáticamente');
      console.log('  2. GitHub Actions validará PRs y pushes');
      console.log('  3. Ejecuta `node cicd-preventive-rules.js` para validar manualmente');
    } else {
      console.log('\n⚠️ Configuración completada con advertencias');
      console.log('\n🔧 Revisa los elementos marcados con ❌ arriba');
    }
    
    return allOk;
  }
}

// Función principal
async function main() {
  const setup = new StructureValidationSetup();
  const success = await setup.setup();
  
  process.exit(success ? 0 : 1);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Error en configuración:', error.message);
    process.exit(1);
  });
}

module.exports = { StructureValidationSetup };