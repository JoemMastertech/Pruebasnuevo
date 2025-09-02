# Gestión de Artefactos de Compilación

## 📋 Resumen

Este documento describe la solución implementada para gestionar correctamente los artefactos de compilación (`compiled/`, `dist/`, `build/`) y prevenir confusiones en el proyecto hexagonal.

## 🚨 Problema Identificado

Las carpetas `compiled/` y `dist/` contenían:
- **compiled/**: Carpetas vacías (Domain, Infraestructura, etc.) - residuos de builds anteriores
- **dist/**: Árbol completo compilado (TypeScript → JavaScript, .d.ts, .map, etc.)

Estos artefactos:
- ❌ No son archivos fuente del repositorio
- ❌ Pueden confundir a desarrolladores
- ❌ Dan sensación de duplicar el proyecto
- ❌ Interfieren con la validación de estructura

## ✅ Solución Implementada

### 1. Validación en CI/CD Mejorada

**Archivo**: `cicd-preventive-rules.js`

**Nuevas validaciones**:
- ✅ Detecta archivos fuente (.ts, .tsx) en directorios de build
- ✅ Identifica archivos .js no compilados en build dirs
- ✅ Alerta sobre carpetas de build vacías
- ✅ Distingue entre archivos compilados y fuente

```javascript
// Ejemplo de validación
if (sourceFiles.length > 0) {
  this.errors.push(`🚫 Artefactos de compilación contienen archivos fuente en ${buildDir}/`);
}
```

### 2. Script de Limpieza Automática

**Archivo**: `clean-build-artifacts.ps1`

**Funcionalidades**:
- 🧹 Detecta carpetas vacías o solo con subdirectorios vacíos
- 🔍 Identifica archivos fuente en directorios de build
- 🛡️ Crea backups antes de eliminar (opcional)
- 📊 Genera reportes detallados
- ⚡ Integración con proceso de build

**Uso**:
```powershell
# Solo análisis
./clean-build-artifacts.ps1 -Verbose

# Limpieza automática
./clean-build-artifacts.ps1 -Force -Verbose
```

### 3. Build con Limpieza Integrada

**Archivo**: `build-with-cleanup.ps1`

**Proceso automatizado**:
1. ✅ Verificar prerequisitos (Node.js, TypeScript)
2. 🧹 Limpiar artefactos automáticamente
3. 📦 Instalar dependencias
4. 🔨 Compilar TypeScript
5. 🧪 Ejecutar tests
6. 🔍 Validar estructura hexagonal

**Uso**:
```powershell
# Build completo con limpieza
./build-with-cleanup.ps1 -Verbose

# Build sin tests
./build-with-cleanup.ps1 -SkipTests
```

### 4. Configuración .gitignore

**Verificado**: Los artefactos están correctamente ignorados

```gitignore
# Archivos compilados y de distribución
dist/
compiled/
build/
*.js.map
*.d.ts.map
```

## 🔧 Integración en Workflow

### Pre-commit Hook

El script `pre-commit-structure-check.js` ya incluye validación de artefactos:

```javascript
// Ejecuta validación completa incluyendo artefactos
const result = execSync('node cicd-preventive-rules.js', { encoding: 'utf8' });
```

### GitHub Actions

El workflow `.github/workflows/structure-validation.yml` ejecuta:

```yaml
- name: Run Structure Validation
  run: node cicd-preventive-rules.js
```

### Build Process

Integración automática en `build-with-cleanup.ps1`:

```powershell
# Limpieza automática antes de cada build
if ($Clean -or $true) {  # Siempre limpiar por defecto
    Invoke-CleanArtifacts
}
```

## 📊 Tipos de Problemas Detectados

| Tipo | Descripción | Acción |
|------|-------------|--------|
| `EMPTY` | Directorio vacío o solo con carpetas vacías | Eliminar |
| `SOURCE_FILES` | Archivos fuente (.ts, .js no compilados) en build | Alertar/Fallar |
| `SUSPICIOUS_JS` | Archivos .js sin .d.ts/.map asociados | Revisar |

## 🚀 Beneficios

### Para Desarrolladores
- ✅ Estructura limpia y clara
- ✅ No más confusión con artefactos
- ✅ Build process automatizado
- ✅ Validación en tiempo real

### Para CI/CD
- ✅ Prevención de regresiones
- ✅ Validación automática en PRs
- ✅ Reportes detallados
- ✅ Integración con GitHub Actions

### Para el Proyecto
- ✅ Estructura hexagonal preservada
- ✅ Artefactos gestionados correctamente
- ✅ Documentación completa
- ✅ Proceso reproducible

## 📝 Comandos Útiles

```powershell
# Análisis rápido de artefactos
./clean-build-artifacts.ps1

# Limpieza forzada
./clean-build-artifacts.ps1 -Force

# Build completo con limpieza
./build-with-cleanup.ps1

# Validación manual de estructura
node cicd-preventive-rules.js

# Setup completo de validación
node setup-structure-validation.js
```

## 🔍 Logs y Reportes

- **build-cleanup.log**: Log detallado de limpieza
- **STRUCTURE_VALIDATION.md**: Reporte de validación
- **structure-validation.json**: Datos de validación en JSON

## ⚠️ Consideraciones

1. **Backups**: Por defecto se crean backups antes de eliminar
2. **Force Mode**: Usar `-Force` solo cuando estés seguro
3. **CI/CD**: Los fallos de validación bloquean el pipeline
4. **Logs**: Revisar logs para diagnóstico detallado

---

**Implementado**: Enero 2025  
**Versión**: 1.0  
**Mantenedor**: Equipo de Arquitectura