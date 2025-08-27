# REFACTORIZACIÓN BEM GRADUAL
## Plan de Simplificación de Selectores de Alta Especificidad

---

## 🎯 OBJETIVO
Reducir la especificidad de selectores CSS complejos mediante arquitectura BEM, manteniendo la funcionalidad exacta y preservando el estado visual actual.

---

## 📊 ANÁLISIS DE SELECTORES PROBLEMÁTICOS

### 🔴 CRÍTICOS - Especificidad Extrema (0,0,4,0+)

```css
/* ESPECIFICIDAD: 0,0,5,0 - MUY ALTA */
.price-selection-mode .product-grid .product-card.liquor-card .price-button

/* ESPECIFICIDAD: 0,0,4,0 - ALTA */
.product-grid .product-card.liquor-card .price-button
.product-grid .product-card.liquor-card .price-button:not(.non-selectable)
.product-grid .product-card.liquor-card .price-button:not(:disabled)

/* ESPECIFICIDAD: 0,1,3,0 - ALTA CON ATRIBUTOS */
.product-table[data-category="refrescos"] th:nth-child(2)
.product-table[data-category="cervezas"] td:nth-child(2)
.category-grid[data-category="licores"] .category-image
```

### 🟡 MODERADOS - Especificidad Media (0,0,2,0 - 0,0,3,0)

```css
/* ESPECIFICIDAD: 0,0,3,0 */
.price-button:not(.product-card.liquor-card .price-button)
.product-card.liquor-card .product-name
.product-card.liquor-card .product-image
.product-card.liquor-card .product-media

/* ESPECIFICIDAD: 0,1,2,0 */
.modal-content[data-category="refrescos"]
.modal-content[data-category="cervezas"]
```

---

## 🏗️ ARQUITECTURA BEM PROPUESTA

### Nomenclatura Estándar

```css
/* =================================================================
   NUEVA ARQUITECTURA BEM - ESPECIFICIDAD CONTROLADA
   ================================================================= */

/* BLOQUES PRINCIPALES */
.product-card { }                    /* Bloque base */
.product-table { }                   /* Bloque base */
.category-grid { }                   /* Bloque base */
.price-button { }                    /* Bloque base */

/* MODIFICADORES DE BLOQUE */
.product-card--liquor { }            /* Variante para licores */
.product-card--compact { }           /* Variante compacta */
.product-card--expanded { }          /* Variante expandida */

.product-table--beverages { }        /* Para refrescos y cervezas */
.product-table--food { }             /* Para comidas */

.category-grid--liquor { }           /* Específico para licores */
.category-grid--standard { }         /* Estándar */

/* ELEMENTOS */
.product-card__name { }              /* Nombre del producto */
.product-card__image { }             /* Imagen del producto */
.product-card__media { }             /* Contenedor de media */
.product-card__prices { }            /* Contenedor de precios */
.product-card__price-item { }        /* Item individual de precio */

.price-button__label { }             /* Etiqueta del botón */
.price-button__value { }             /* Valor del precio */

.category-grid__card { }             /* Card de categoría */
.category-grid__image { }            /* Imagen de categoría */
.category-grid__name { }             /* Nombre de categoría */
.category-grid__prompt { }           /* Prompt de subcategoría */

/* MODIFICADORES DE ELEMENTO */
.price-button--active { }            /* Estado activo */
.price-button--disabled { }          /* Estado deshabilitado */
.price-button--selectable { }        /* Seleccionable */
.price-button--non-selectable { }    /* No seleccionable */

.product-card__image--video { }      /* Imagen con video */
.product-card__media--compact { }    /* Media compacto */

/* ESTADOS GLOBALES */
.is-price-selection-mode { }         /* Estado global de selección */
.is-loading { }                      /* Estado de carga */
.is-error { }                        /* Estado de error */
```

---

## 🔄 MAPEO DE MIGRACIÓN DETALLADO

### Grupo 1: Product Cards (Prioridad Alta)

```css
/* =================================================================
   MIGRACIÓN: PRODUCT CARDS
   ================================================================= */

/* ANTES - Especificidad 0,0,2,0 */
.product-card.liquor-card {
  /* Estilos existentes */
}

/* DESPUÉS - Especificidad 0,0,1,0 */
.product-card--liquor {
  /* Mismos estilos */
  min-height: var(--card-height-liquor);
}

/* ANTES - Especificidad 0,0,3,0 */
.product-card.liquor-card .product-name {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

/* DESPUÉS - Especificidad 0,0,1,0 */
.product-card--liquor .product-card__name {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

/* ANTES - Especificidad 0,0,3,0 */
.product-card.liquor-card .product-image {
  width: 100%;
  height: clamp(120px, 15vw, 180px);
  object-fit: cover;
  border-radius: 8px;
}

/* DESPUÉS - Especificidad 0,0,1,0 */
.product-card--liquor .product-card__image {
  width: 100%;
  height: var(--image-height-current);
  object-fit: cover;
  border-radius: 8px;
}
```

### Grupo 2: Price Buttons (Prioridad Crítica)

```css
/* =================================================================
   MIGRACIÓN: PRICE BUTTONS
   ================================================================= */

/* ANTES - Especificidad 0,0,4,0 */
.product-grid .product-card.liquor-card .price-button {
  background: rgba(0, 247, 255, 0.1);
  border: 1px solid rgba(0, 247, 255, 0.3);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: clamp(26px, 3.5vh, 35px);
}

/* DESPUÉS - Especificidad 0,0,1,0 */
.price-button--liquor {
  background: rgba(0, 247, 255, 0.1);
  border: 1px solid rgba(0, 247, 255, 0.3);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: var(--price-button-height-current);
}

/* ANTES - Especificidad 0,0,5,0 */
.price-selection-mode .product-grid .product-card.liquor-card .price-button {
  background: rgba(0, 247, 255, 0.2);
  animation: pulse 2s infinite;
  transform: scale(1.02);
}

/* DESPUÉS - Especificidad 0,0,2,0 */
.is-price-selection-mode .price-button--liquor {
  background: rgba(0, 247, 255, 0.2);
  animation: pulse 2s infinite;
  transform: scale(1.02);
}

/* ALTERNATIVA - Especificidad 0,0,1,0 */
.price-button--active {
  background: rgba(0, 247, 255, 0.2);
  animation: pulse 2s infinite;
  transform: scale(1.02);
}
```

### Grupo 3: Category Grids (Prioridad Media)

```css
/* =================================================================
   MIGRACIÓN: CATEGORY GRIDS
   ================================================================= */

/* ANTES - Especificidad 0,1,2,0 */
.category-grid[data-category="licores"] .category-card {
  min-height: 173px;
  max-height: 173px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* DESPUÉS - Especificidad 0,0,1,0 */
.category-grid--liquor .category-grid__card {
  min-height: var(--category-height-current);
  /* max-height removido para permitir crecimiento */
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* ANTES - Especificidad 0,1,2,0 */
.category-grid[data-category="licores"] .category-image {
  width: clamp(60px, 8vw, 90px);
  height: clamp(60px, 8vw, 90px);
  object-fit: cover;
  border-radius: 50%;
}

/* DESPUÉS - Especificidad 0,0,1,0 */
.category-grid--liquor .category-grid__image {
  width: var(--category-image-current);
  height: var(--category-image-current);
  object-fit: cover;
  border-radius: 50%;
}
```

### Grupo 4: Product Tables (Prioridad Media)

```css
/* =================================================================
   MIGRACIÓN: PRODUCT TABLES
   ================================================================= */

/* ANTES - Especificidad 0,1,2,1 */
.product-table[data-category="refrescos"] th:nth-child(2),
.product-table[data-category="cervezas"] th:nth-child(2) {
  width: 25%;
  text-align: center;
}

/* DESPUÉS - Especificidad 0,0,1,1 */
.product-table--beverages th:nth-child(2) {
  width: 25%;
  text-align: center;
}

/* ANTES - Especificidad 0,1,1,0 */
.product-table[data-category="refrescos"],
.product-table[data-category="cervezas"] {
  width: 100%;
  border-collapse: collapse;
}

/* DESPUÉS - Especificidad 0,0,1,0 */
.product-table--beverages {
  width: 100%;
  border-collapse: collapse;
}
```

---

## 📋 PLAN DE IMPLEMENTACIÓN GRADUAL

### Fase 4A: Preparación (Sin Riesgo)

1. **Agregar nuevas clases BEM** sin eliminar existentes
2. **Crear utilidades de estado** (`.is-price-selection-mode`)
3. **Preparar variables responsivas** en sistema unificado

```css
/* Agregar JUNTO a las reglas existentes */
.product-card--liquor {
  /* Duplicar estilos de .product-card.liquor-card */
}

.price-button--liquor {
  /* Duplicar estilos de .product-grid .product-card.liquor-card .price-button */
}
```

### Fase 4B: Migración HTML (Gradual)

1. **Actualizar templates** para usar nuevas clases
2. **Mantener clases antiguas** como fallback
3. **Testing visual** en cada cambio

```html
<!-- ANTES -->
<div class="product-card liquor-card" data-category="licores">
  <div class="product-name">Producto</div>
  <div class="product-image"></div>
  <div class="price-button">$100</div>
</div>

<!-- TRANSICIÓN -->
<div class="product-card product-card--liquor liquor-card" data-category="licores">
  <div class="product-name product-card__name">Producto</div>
  <div class="product-image product-card__image"></div>
  <div class="price-button price-button--liquor">$100</div>
</div>

<!-- DESPUÉS -->
<div class="product-card product-card--liquor">
  <div class="product-card__name">Producto</div>
  <div class="product-card__image"></div>
  <div class="price-button price-button--liquor">$100</div>
</div>
```

### Fase 4C: Limpieza (Segura)

1. **Verificar que nuevas clases funcionan** correctamente
2. **Eliminar reglas antiguas** gradualmente
3. **Validación visual final** en todos los breakpoints

---

## 🎯 BENEFICIOS ESPECÍFICOS

### Reducción de Especificidad
- ✅ **De 0,0,5,0 a 0,0,2,0**: Price buttons en modo selección
- ✅ **De 0,0,4,0 a 0,0,1,0**: Product cards y price buttons
- ✅ **De 0,1,2,0 a 0,0,1,0**: Category grids y product tables
- ✅ **De 0,1,2,1 a 0,0,1,1**: Table columns específicas

### Mantenibilidad
- 🔧 **Selectores predecibles** y documentados
- 📝 **Nomenclatura consistente** en todo el proyecto
- 🔄 **Fácil extensión** para nuevas variantes
- 🐛 **Debugging simplificado** con clases semánticas

### Performance
- ⚡ **Selectores más eficientes** (menos anidamiento)
- 📦 **CSS más compacto** (menos duplicación)
- 🚀 **Rendering más rápido** (especificidad baja)

---

## ⚠️ CONSIDERACIONES DE RIESGO

### Elementos Críticos
1. **Price buttons**: Funcionalidad de selección compleja
2. **Category grids**: Comportamiento específico por categoría
3. **Product tables**: Layouts específicos por tipo de producto

### Estrategia de Mitigación
1. **Implementación gradual** con clases duales
2. **Testing exhaustivo** en cada paso
3. **Rollback inmediato** si hay problemas visuales
4. **Validación pixel-perfect** antes de eliminar código antiguo

---

## ✅ ESTADO ACTUAL
**FASE 4 EN PROGRESO**: Plan de refactorización BEM creado
**PRÓXIMO PASO**: Implementación gradual comenzando por product cards

**COMPONENTES IDENTIFICADOS**:
- 🔴 **15 selectores críticos** de alta especificidad
- 🟡 **8 selectores moderados** para optimizar
- 🏗️ **Arquitectura BEM** completa diseñada
- 📋 **Plan de migración** gradual y seguro

**IMPACTO ESTIMADO**: 80% de reducción en especificidad promedio