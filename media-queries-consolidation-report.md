# REPORTE DE CONSOLIDACIÓN DE MEDIA QUERIES

**Fecha:** 8/9/2025

## 📊 RESUMEN

- **Archivos analizados:** 17
- **Media queries encontradas:** 91
- **Grupos de duplicados:** 2
- **Queries consolidadas:** 20

## 📁 ARCHIVOS ANALIZADOS

- **main.css** - 13 media queries
- **mobile.css** - 10 media queries
- **navigation.css** - 4 media queries
- **order-system.css** - 2 media queries
- **product-grid.css** - 2 media queries
- **product-table.css** - 3 media queries
- **tablet.css** - 12 media queries
- **top-navigation.css** - 3 media queries
- **_bem-architecture.css** - 6 media queries
- **_bem-base.css** - 2 media queries
- **_breakpoint-mixins.css** - 9 media queries
- **_grid-centralized.css** - 3 media queries
- **_grid-system.css** - 5 media queries
- **_variables-unified.css** - 3 media queries
- **_view-modes-config.css** - 3 media queries
- **_view-modes-controller.css** - 7 media queries
- **_view-modes-master-controller.css** - 4 media queries

## 🔄 DUPLICADOS DETECTADOS

### Duplicado 1

**Condición:** `min-width: var(--bp-tablet`
**Archivos:** _breakpoint-mixins.css, _breakpoint-mixins.css
**Ocurrencias:** 2

### Duplicado 2

**Condición:** `min-width: var(--bp-desktop`
**Archivos:** _breakpoint-mixins.css, _breakpoint-mixins.css
**Ocurrencias:** 2

## 🎯 MEDIA QUERIES CONSOLIDADAS

### min-width: 480px

**Archivos origen:** mobile.css, _grid-system.css
**Queries originales:** 2

### min-width: 768px

**Archivos origen:** main.css, tablet.css, top-navigation.css, _bem-architecture.css, _bem-base.css, _grid-centralized.css, _grid-system.css, _variables-unified.css, _view-modes-config.css, _view-modes-controller.css, _view-modes-master-controller.css
**Queries originales:** 17

### min-width: 1024px

**Archivos origen:** tablet.css, top-navigation.css, _bem-architecture.css, _bem-base.css, _grid-centralized.css, _grid-system.css, _variables-unified.css, _view-modes-controller.css, _view-modes-master-controller.css
**Queries originales:** 10

### min-width: 1200px

**Archivos origen:** main.css, _grid-centralized.css, _grid-system.css, _variables-unified.css, _view-modes-controller.css, _view-modes-master-controller.css
**Queries originales:** 7

### min-width: 1400px

**Archivos origen:** _grid-system.css, _view-modes-master-controller.css
**Queries originales:** 2

### max-width: 768px

**Archivos origen:** main.css, navigation.css, order-system.css, product-grid.css, product-table.css, top-navigation.css, _bem-architecture.css, _view-modes-controller.css
**Queries originales:** 11

### max-width: 480px

**Archivos origen:** main.css, mobile.css, navigation.css, order-system.css, product-grid.css, product-table.css, _bem-architecture.css, _view-modes-config.css
**Queries originales:** 13

### max-width: 1024px

**Archivos origen:** main.css, navigation.css, product-table.css, tablet.css, _bem-architecture.css
**Queries originales:** 5

### orientation: landscape

**Archivos origen:** mobile.css, tablet.css
**Queries originales:** 2

### prefers-reduced-motion: reduce

**Archivos origen:** mobile.css, navigation.css, tablet.css
**Queries originales:** 3

### prefers-color-scheme: dark

**Archivos origen:** mobile.css, tablet.css
**Queries originales:** 2

### prefers-contrast: high

**Archivos origen:** mobile.css, tablet.css
**Queries originales:** 2

### orientation: portrait

**Archivos origen:** mobile.css, tablet.css
**Queries originales:** 3

### min-width: var(--bp-tablet

**Archivos origen:** tablet.css, _breakpoint-mixins.css
**Queries originales:** 5

### hover: none

**Archivos origen:** tablet.css
**Queries originales:** 1

### min-width: var(--bp-mobile

**Archivos origen:** _breakpoint-mixins.css
**Queries originales:** 1

### min-width: var(--bp-desktop

**Archivos origen:** _breakpoint-mixins.css
**Queries originales:** 2

### min-width: var(--bp-large

**Archivos origen:** _breakpoint-mixins.css
**Queries originales:** 1

### min-width: var(--bp-xl

**Archivos origen:** _breakpoint-mixins.css
**Queries originales:** 1

### max-width: var(--bp-mobile-max

**Archivos origen:** _breakpoint-mixins.css
**Queries originales:** 1

## 🎯 RECOMENDACIONES

### 1. Importar Archivo Consolidado
Agregar al final de `main.css`:

```css
@import '_media-queries-consolidated.css';
```

### 2. Remover Duplicados
Eliminar media queries duplicadas de archivos individuales para evitar conflictos.

### 3. Usar Variables CSS
Reemplazar valores hardcodeados con variables:

```css
/* ✅ Recomendado */
@media (min-width: var(--bp-tablet)) { ... }

/* ❌ Evitar */
@media (min-width: 768px) { ... }
```

### 4. Orden Mobile-First
Las media queries están ordenadas siguiendo el enfoque mobile-first para mejor rendimiento.

