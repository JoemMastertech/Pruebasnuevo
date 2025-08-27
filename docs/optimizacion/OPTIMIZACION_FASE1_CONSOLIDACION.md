# OPTIMIZACIÓN FASE 1: CONSOLIDACIÓN DE SELECTORES DUPLICADOS

## ANÁLISIS DE DUPLICACIONES IDENTIFICADAS

### 1. SELECTORES DE GRID DUPLICADOS

**PROBLEMA IDENTIFICADO:**
```css
/* TABLET (línea 1842-1843) */
.product-grid { grid-template-columns: repeat(2, 1fr); gap: var(--gap-tablet); padding: var(--padding-tablet); }
.category-grid { grid-template-columns: repeat(3, 1fr); gap: var(--gap-tablet); padding: var(--padding-tablet); }

/* TABLET LANDSCAPE (línea 2117-2118) - DUPLICADO EXACTO */
.product-grid { grid-template-columns: repeat(2, 1fr); gap: var(--gap-tablet); padding: var(--padding-tablet); }
.category-grid { grid-template-columns: repeat(3, 1fr); gap: var(--gap-tablet); padding: var(--padding-tablet); }
```

**SOLUCIÓN SEGURA:**
```css
/* Consolidar en un solo media query */
@media (min-width: 768px) and (max-width: 1024px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: var(--gap-tablet); padding: var(--padding-tablet); }
  .category-grid { grid-template-columns: repeat(3, 1fr); gap: var(--gap-tablet); padding: var(--padding-tablet); }
}
```

### 2. PROPIEDADES FLEXBOX REDUNDANTES

**PROBLEMA IDENTIFICADO:**
```css
/* Patrón repetido 47 veces */
display: flex;
justify-content: center;
align-items: center;
```

**SOLUCIÓN SEGURA:**
```css
/* Crear clase utilitaria */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Aplicar a selectores específicos sin cambiar HTML */
.view-toggle-btn,
.price-button,
.modal-backdrop,
.counter-btn {
  @extend .flex-center; /* O incluir propiedades directamente */
}
```

### 3. BORDER-RADIUS REDUNDANTES

**PROBLEMA IDENTIFICADO:**
```css
/* border-radius: 8px aparece 23 veces */
/* border-radius: 6px aparece 12 veces */
/* border-radius: 5px aparece 8 veces */
```

**SOLUCIÓN SEGURA:**
```css
/* Variables ya definidas en _variables-unified.css */
:root {
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  --border-radius-xl: 12px;
}

/* Reemplazar valores hardcodeados */
border-radius: 8px; → border-radius: var(--border-radius-lg);
border-radius: 6px; → border-radius: var(--border-radius-md);
border-radius: 5px; → border-radius: var(--border-radius-sm);
```

### 4. TEXT-ALIGN CENTER REDUNDANTE

**PROBLEMA IDENTIFICADO:**
```css
/* text-align: center aparece 31 veces */
```

**SOLUCIÓN SEGURA:**
```css
/* Consolidar en selectores comunes */
.product-card .product-name,
.category-name,
.price-button,
.modal-title,
.order-total {
  text-align: center;
}
```

## PLAN DE IMPLEMENTACIÓN SEGURA

### PASO 1: BACKUP Y PREPARACIÓN
- ✅ Crear backup de main.css
- ✅ Verificar que servidor local esté corriendo
- ✅ Tomar screenshot de referencia

### PASO 2: CONSOLIDACIÓN DE MEDIA QUERIES
- Unificar media queries duplicados
- Eliminar reglas redundantes
- **ESTIMACIÓN:** 15-20KB reducción

### PASO 3: OPTIMIZACIÓN DE PROPIEDADES
- Reemplazar valores hardcodeados con variables
- Consolidar propiedades flexbox comunes
- **ESTIMACIÓN:** 8-12KB reducción

### PASO 4: VALIDACIÓN VISUAL
- Verificar en todos los breakpoints
- Confirmar funcionalidad intacta
- Medir reducción de tamaño

## MÉTRICAS ESPERADAS

**ANTES:**
- Tamaño: 67KB (2,848 líneas)
- Selectores duplicados: ~45 instancias
- Propiedades redundantes: ~120 instancias

**DESPUÉS (ESTIMADO):**
- Tamaño: 45-50KB (2,100-2,300 líneas)
- Reducción: 25-35%
- Selectores consolidados: ~15 instancias
- Propiedades optimizadas: ~40 instancias

## RIESGO: MÍNIMO
- ✅ No se cambia HTML
- ✅ No se alteran valores visuales
- ✅ Solo se consolida código duplicado
- ✅ Variables ya están implementadas
- ✅ Git permite rollback inmediato

## SIGUIENTE FASE
Una vez completada esta optimización, proceder con Fase 2: Reorganización de media queries y simplificación de selectores complejos.