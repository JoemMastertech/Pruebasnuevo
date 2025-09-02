# Validación de Estructura Hexagonal

## Scripts Disponibles

### Validación Manual
```bash
# Ejecutar validación completa
node cicd-preventive-rules.js
```

### Pre-commit Hook
```bash
# Probar hook manualmente
node pre-commit-structure-check.js
```

### Configuración
```bash
# Instalar/reinstalar validaciones
node setup-structure-validation.js
```

## Estructura Oficial Permitida

### Carpetas Principales
- `Domain/` - Entidades y lógica de negocio
- `Aplicacion/` - Casos de uso y servicios de aplicación
- `Infraestructura/` - Adaptadores e implementaciones
- `Shared/` - Código compartido
- `Tests/` - Pruebas del proyecto
- `docs/` - Documentación

### Carpetas Adicionales
- `Components/` - Componentes reutilizables
- `Documentation/` - Documentación extendida
- `Interfaces/` - Interfaces web
- `Web/` - Recursos web estáticos

## Patrones Prohibidos

❌ **NO crear estas carpetas** (duplicados consolidados):
- `Dominio/` → Usar `Domain/`
- `Application/` → Usar `Aplicacion/`
- `Infrastructure/` → Usar `Infraestructura/`
- `Componentes/` → Usar `Components/`

## CI/CD Integration

La validación se ejecuta automáticamente en:
- ✅ Pre-commit hooks (local)
- ✅ GitHub Actions (push/PR)
- ✅ Validación manual

## Reportes Generados

- `structure-validation.json` - Reporte detallado en JSON
- `STRUCTURE_VALIDATION.md` - Reporte legible en Markdown
