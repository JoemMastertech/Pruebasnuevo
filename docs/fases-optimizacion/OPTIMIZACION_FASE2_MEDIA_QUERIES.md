# OPTIMIZACIÓN FASE 2: REORGANIZACIÓN DE MEDIA QUERIES Y SIMPLIFICACIÓN DE SELECTORES

## ANÁLISIS DE MEDIA QUERIES DUPLICADAS

### 1. MEDIA QUERIES IDENTIFICADAS EN MAIN.CSS

#### Breakpoints Duplicados:
- `@media (max-width: 768px)` - Líneas 923, 1222, 1757
- `@media (max-width: 480px)` - Líneas 948, 1236, 1922
- `@media (min-width: 768px) and (max-width: 1024px)` - Líneas 2104, 2334 (portrait/landscape)

#### Oportunidades de Consolidación:
1. **Móviles (max-width: 480px)**: 3 media queries separadas
2. **Tablets (max-width: 768px)**: 3 media queries separadas
3. **Tablets específicas**: Portrait y landscape pueden optimizarse

### 2. SELECTORES COMPLEJOS IDENTIFICADOS

#### Alta Especificidad:
```css
.price-selection-mode .product-grid .product-card.liquor-card .price-button
#drink-options-modal .modal-actions .nav-button
#meat-customization-modal .ingredients-choice .nav-button
```

#### Propuesta de Simplificación:
- Usar clases BEM específicas en lugar de selectores anidados
- Reducir especificidad manteniendo funcionalidad

## PLAN DE IMPLEMENTACIÓN

### PASO 1: CONSOLIDACIÓN DE MEDIA QUERIES
1. Agrupar todas las reglas `max-width: 480px` en una sola media query
2. Agrupar todas las reglas `max-width: 768px` en una sola media query
3. Optimizar media queries de tablets portrait/landscape

### PASO 2: SIMPLIFICACIÓN DE SELECTORES
1. Reemplazar selectores complejos con clases BEM específicas
2. Reducir niveles de anidación
3. Mantener especificidad mínima necesaria

### PASO 3: REORGANIZACIÓN ESTRUCTURAL
1. Agrupar media queries por breakpoint
2. Ordenar de menor a mayor resolución
3. Eliminar duplicaciones

## ESTIMACIÓN DE REDUCCIÓN
- **Media queries consolidadas**: 15-20% reducción en reglas duplicadas
- **Selectores simplificados**: 5-10% reducción en especificidad
- **Total estimado**: 10-15% reducción adicional del archivo CSS

## RIESGO
- **MÍNIMO**: No se alteran estilos visuales, solo se reorganiza código
- **Backup**: Ya existe `main_backup_pre_optimization.css`
- **Validación**: Verificación visual post-implementación

---
*Fecha: $(Get-Date)*
*Estado: PLANIFICADO*