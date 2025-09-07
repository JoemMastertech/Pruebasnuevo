# Estructura del Proyecto - Arquitectura Hexagonal

Este documento describe la nueva organización del proyecto siguiendo los principios de la arquitectura hexagonal.

## Estructura de Carpetas

### 🏗️ Capas de la Arquitectura Hexagonal

#### `Domain/` - Capa de Dominio
- Entidades de negocio
- Objetos de valor
- Reglas de negocio puras

#### `Aplicacion/` - Capa de Aplicación
- Casos de uso
- Servicios de aplicación
- Orquestación de la lógica de negocio

#### `Interfaces/` - Adaptadores de Entrada
- Controladores web
- Componentes de UI
- Presentadores
- Adaptadores de eventos

#### `Infraestructura/` - Adaptadores de Salida (Legacy)
- Repositorios
- Servicios externos
- Adaptadores de datos

### 🔧 Infraestructura Técnica

#### `Infraestructura/` - Nueva Organización

##### `Infraestructura/Scripts/`
- `bundle-analyzer-setup.js` - Configuración del analizador de bundles
- `cicd-preventive-rules.js` - Reglas preventivas para CI/CD
- `e2e-clean-environment-validator.js` - Validador de entorno E2E
- `forced-substitution-test.js` - Pruebas de sustitución forzada
- `maintenance-routines.js` - Rutinas de mantenimiento
- `runtime-module-logger.js` - Logger de módulos en tiempo de ejecución
- `setup-staging-logger.js` - Configuración de logger para staging
- `team-training-guide.js` - Guía de entrenamiento del equipo
- `build-with-cleanup.ps1` - Script de construcción con limpieza
- `filter-source-files.ps1` - Filtro de archivos fuente
- `review-unreferenced-files.ps1` - Revisión de archivos no referenciados

##### `Infraestructura/Config/`
- `package.json` - Configuración de dependencias
- `tsconfig.json` - Configuración de TypeScript
- `docker-compose.yml` - Configuración de Docker
- `alert-thresholds-config.json` - Configuración de umbrales de alerta

##### `Infraestructura/CI-CD/`
- `Jenkinsfile` - Pipeline de Jenkins
- `.github/workflows/` - Workflows de GitHub Actions

##### `Infraestructura/Testing/`
- Configuraciones de testing específicas de infraestructura

### 📚 Documentación

#### `Documentation/`

##### `Documentation/Guides/`
- `GUIA-IMPLEMENTACION-COMPLETA.md` - Guía completa de implementación
- `README.md` - Documentación principal
- `README-ESTRATEGIA-FALLAS-INVISIBLES.md` - Estrategia de fallas invisibles
- `PHASE*_CLOSURE_CHECKLIST.md` - Listas de verificación por fase
- `RESUMEN_*.md` - Resúmenes de implementación
- `Plan_ejecucion.md` - Plan de ejecución
- `analisis_cobertura.md` - Análisis de cobertura

##### `Documentation/Analysis/`
- Análisis técnicos y reportes detallados

##### `Documentation/Reports/`
- Reportes generados automáticamente

### 🌐 Web

#### `Web/Static/`
- `index.html` - Página principal
- `performance-demo.html` - Demo de rendimiento
- `favicon.ico` - Icono del sitio
- `robots.txt` - Configuración para crawlers
- `sitemap.xml` - Mapa del sitio

#### `Web/Assets/`
- Assets estáticos (imágenes, fuentes, etc.)

### 🧪 Testing

#### `Tests/`
- Pruebas unitarias, de integración y E2E
- Organizadas por tipo y fase

### 🔄 Shared

#### `Shared/`
- Utilidades compartidas
- Configuraciones comunes
- Servicios transversales

## Archivos en la Raíz

- `hexagonal-bootstrap.js` - Bootstrap principal de la aplicación hexagonal
- `.env.example` - Ejemplo de variables de entorno
- `.gitignore` - Configuración de Git
- `.gitattributes` - Atributos de Git
- `ESTRUCTURA_PROYECTO.md` - Este archivo

## Beneficios de esta Organización

1. **Separación Clara de Responsabilidades**: Cada capa tiene un propósito específico
2. **Mantenibilidad**: Fácil localización de archivos por función
3. **Escalabilidad**: Estructura preparada para crecimiento
4. **Testabilidad**: Separación que facilita las pruebas
5. **Arquitectura Hexagonal**: Respeta los principios de puertos y adaptadores

## Migración Completada

✅ **Scripts organizados** en `Infraestructura/Scripts/`
✅ **Configuraciones centralizadas** en `Infraestructura/Config/`
✅ **CI/CD organizado** en `Infraestructura/CI-CD/`
✅ **Documentación estructurada** en `Documentation/`
✅ **Assets web organizados** en `Web/`
✅ **Archivos de backup eliminados**

---

*Última actualización: Enero 2025*
*Estructura basada en Arquitectura Hexagonal y mejores prácticas*