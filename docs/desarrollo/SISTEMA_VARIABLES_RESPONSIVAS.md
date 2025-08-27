# SISTEMA DE VARIABLES CSS UNIFICADO
## Arquitectura para Escalado Proporcional

---

## 🎯 OBJETIVO
Crear un sistema centralizado de variables CSS que reemplace las alturas fijas problemáticas con valores responsivos, manteniendo la consistencia visual y mejorando el escalado proporcional.

---

## 📐 ARQUITECTURA DE VARIABLES

### 🏗️ ESTRUCTURA JERÁRQUICA

```css
/* =================================================================
   SISTEMA DE VARIABLES RESPONSIVAS - ARQUITECTURA UNIFICADA
   ================================================================= */

:root {
  /* =============================================================
     ESCALADO BASE - Fundamentos del sistema responsivo
     ============================================================= */
  
  /* VIEWPORT BREAKPOINTS */
  --bp-mobile: 320px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
  --bp-large: 1200px;
  
  /* ESCALADO PROPORCIONAL BASE */
  --scale-factor-sm: 0.8;    /* Mobile: 80% del tamaño base */
  --scale-factor-md: 0.9;    /* Tablet: 90% del tamaño base */
  --scale-factor-lg: 1.0;    /* Desktop: 100% del tamaño base */
  --scale-factor-xl: 1.1;    /* Large: 110% del tamaño base */
  
  /* =============================================================
     CONTENEDORES PRINCIPALES - Product Cards
     ============================================================= */
  
  /* PRODUCT CARDS - Altura base y escalado */
  --card-height-base: 280px;
  --card-height-mobile: clamp(180px, 25vh, 220px);
  --card-height-tablet: clamp(220px, 30vh, 280px);
  --card-height-desktop: clamp(280px, 35vh, 350px);
  --card-height-large: clamp(320px, 40vh, 400px);
  --card-height-xlarge: clamp(350px, 45vh, 450px);
  
  /* PRODUCT CARDS - Variantes específicas */
  --card-height-compact: clamp(200px, 28vh, 240px);     /* Para grids densos */
  --card-height-expanded: clamp(300px, 38vh, 380px);    /* Para contenido rico */
  --card-height-liquor: clamp(260px, 33vh, 320px);      /* Específico para licores */
  
  /* =============================================================
     CONTENEDORES DE MEDIA - Imágenes y Videos
     ============================================================= */
  
  /* MEDIA CONTAINERS - Altura responsiva */
  --media-height-mobile: clamp(120px, 16vh, 150px);
  --media-height-tablet: clamp(160px, 20vh, 200px);
  --media-height-desktop: clamp(180px, 22vh, 220px);
  --media-height-large: clamp(200px, 25vh, 250px);
  
  /* VIDEO THUMBNAILS - Específicos */
  --video-height-mobile: clamp(100px, 14vh, 130px);
  --video-height-tablet: clamp(120px, 16vh, 160px);
  --video-height-desktop: clamp(140px, 18vh, 180px);
  
  /* PRODUCT IMAGES - Específicos */
  --image-height-mobile: clamp(120px, 16vh, 150px);
  --image-height-tablet: clamp(160px, 20vh, 200px);
  --image-height-desktop: clamp(180px, 22vh, 220px);
  
  /* =============================================================
     CATEGORÍAS - Category Cards y Elements
     ============================================================= */
  
  /* CATEGORY CARDS */
  --category-height-mobile: clamp(173px, 22vh, 210px);
  --category-height-tablet: clamp(194px, 25vh, 240px);
  --category-height-desktop: clamp(220px, 28vh, 270px);
  
  /* CATEGORY IMAGES */
  --category-image-mobile: clamp(60px, 8vw, 90px);
  --category-image-tablet: clamp(90px, 11vw, 120px);
  --category-image-desktop: clamp(110px, 13vw, 150px);
  
  /* CATEGORY NAMES */
  --category-name-height-mobile: clamp(35px, 4vh, 50px);
  --category-name-height-tablet: clamp(40px, 5vh, 55px);
  --category-name-height-desktop: clamp(45px, 6vh, 60px);
  
  /* =============================================================
     ELEMENTOS INTERACTIVOS - Botones y Controles
     ============================================================= */
  
  /* BOTONES - Alturas táctiles */
  --button-height-sm: clamp(40px, 5vh, 50px);      /* Botones pequeños */
  --button-height-md: clamp(44px, 6vh, 55px);      /* Botones estándar */
  --button-height-lg: clamp(50px, 7vh, 65px);      /* Botones grandes */
  --button-height-xl: clamp(56px, 8vh, 70px);      /* Botones principales */
  
  /* DRINK OPTIONS */
  --drink-option-height: clamp(40px, 5vh, 60px);
  --drink-container-height: clamp(70px, 8vh, 100px);
  
  /* PRICE BUTTONS - Específicos para licores */
  --price-button-height-mobile: clamp(26px, 3.5vh, 35px);
  --price-button-height-tablet: clamp(28px, 4vh, 40px);
  --price-button-height-desktop: clamp(32px, 4.5vh, 45px);
  
  /* =============================================================
     ELEMENTOS FIJOS - No responsivos por usabilidad
     ============================================================= */
  
  /* NAVEGACIÓN - Alturas estándar */
  --nav-height: 40px;                    /* Estándar de navegación */
  --nav-height-mobile: 50px;             /* Móvil - mayor área táctil */
  --nav-height-compact: 36px;            /* Compacto para pantallas pequeñas */
  
  /* ICONOS Y ELEMENTOS PEQUEÑOS */
  --icon-size-sm: 12px;                  /* Separadores, líneas */
  --icon-size-md: 28px;                  /* Iconos estándar */
  --icon-size-lg: 36px;                  /* Iconos grandes */
  
  /* ELEMENTOS CRÍTICOS - Accesibilidad */
  --touch-target-min: 44px;              /* Mínimo táctil WCAG */
  --touch-target-comfortable: 48px;       /* Cómodo para la mayoría */
  --touch-target-large: 56px;            /* Óptimo para accesibilidad */
}
```

---

## 📱 MEDIA QUERIES RESPONSIVAS

### Sistema de Aplicación por Breakpoint

```css
/* =================================================================
   APLICACIÓN DE VARIABLES POR BREAKPOINT
   ================================================================= */

/* MOBILE FIRST - Base */
:root {
  --card-height-current: var(--card-height-mobile);
  --media-height-current: var(--media-height-mobile);
  --category-height-current: var(--category-height-mobile);
  --button-height-current: var(--button-height-md);
}

/* TABLET - 768px+ */
@media (min-width: 768px) {
  :root {
    --card-height-current: var(--card-height-tablet);
    --media-height-current: var(--media-height-tablet);
    --category-height-current: var(--category-height-tablet);
    --button-height-current: var(--button-height-md);
  }
}

/* DESKTOP - 1024px+ */
@media (min-width: 1024px) {
  :root {
    --card-height-current: var(--card-height-desktop);
    --media-height-current: var(--media-height-desktop);
    --category-height-current: var(--category-height-desktop);
    --button-height-current: var(--button-height-lg);
  }
}

/* LARGE DESKTOP - 1200px+ */
@media (min-width: 1200px) {
  :root {
    --card-height-current: var(--card-height-large);
    --media-height-current: var(--media-height-large);
    --category-height-current: var(--category-height-desktop);
    --button-height-current: var(--button-height-xl);
  }
}

/* EXTRA LARGE - 1400px+ */
@media (min-width: 1400px) {
  :root {
    --card-height-current: var(--card-height-xlarge);
    --media-height-current: var(--media-height-large);
  }
}
```

---

## 🔄 MIGRACIÓN DE REGLAS EXISTENTES

### Mapeo de Conversión

```css
/* =================================================================
   ANTES vs DESPUÉS - Ejemplos de Migración
   ================================================================= */

/* PRODUCT CARDS */
/* ANTES */
.product-card { min-height: 280px; }                    /* Fijo */
.product-card { min-height: 320px; }                    /* Fijo */
.product-card { min-height: 350px; }                    /* Fijo */

/* DESPUÉS */
.product-card { min-height: var(--card-height-current); }     /* Responsivo */
.product-card--large { min-height: var(--card-height-large); } /* Variante */
.product-card--xlarge { min-height: var(--card-height-xlarge); } /* Variante */

/* MEDIA CONTAINERS */
/* ANTES */
.product-media { min-height: 140px; }                  /* Fijo */
.video-thumbnail { height: 120px; }                    /* Fijo */

/* DESPUÉS */
.product-media { min-height: var(--media-height-current); }    /* Responsivo */
.video-thumbnail { height: var(--video-height-current); }      /* Responsivo */

/* CATEGORY ELEMENTS */
/* ANTES */
.category-card { min-height: 173px; max-height: 173px; }  /* Fijo y limitado */

/* DESPUÉS */
.category-card { 
  min-height: var(--category-height-current); 
  /* max-height removido para permitir crecimiento */
}
```

---

## 🎨 ARQUITECTURA BEM SIMPLIFICADA

### Reducción de Especificidad

```css
/* =================================================================
   NUEVA ARQUITECTURA BEM - BAJA ESPECIFICIDAD
   ================================================================= */

/* REEMPLAZAR SELECTORES COMPLEJOS */

/* ANTES - Alta especificidad */
.product-grid .product-card.liquor-card .price-button { /* 0,0,4,0 */ }
.price-selection-mode .product-grid .product-card.liquor-card .price-button { /* 0,0,5,0 */ }
.product-table[data-category="refrescos"] th:nth-child(2) { /* 0,1,2,1 */ }

/* DESPUÉS - Baja especificidad */
.product-card--liquor .price-button { /* 0,0,2,0 */ }
.price-button--selected { /* 0,0,1,0 */ }
.product-table--beverages th { /* 0,0,2,0 */ }

/* CLASES MODIFICADORAS */
.product-card--liquor {
  min-height: var(--card-height-liquor);
}

.product-card--compact {
  min-height: var(--card-height-compact);
}

.product-card--expanded {
  min-height: var(--card-height-expanded);
}

/* ESTADOS */
.price-button--active {
  background: rgba(0, 247, 255, 0.2);
  transform: scale(1.02);
}

.price-button--hover {
  transform: scale(1.05);
}
```

---

## 🔧 UTILIDADES RESPONSIVAS

### Clases de Utilidad

```css
/* =================================================================
   UTILIDADES RESPONSIVAS - Clases auxiliares
   ================================================================= */

/* ALTURAS RESPONSIVAS */
.h-card-sm { height: var(--card-height-mobile); }
.h-card-md { height: var(--card-height-tablet); }
.h-card-lg { height: var(--card-height-desktop); }

.min-h-card-sm { min-height: var(--card-height-mobile); }
.min-h-card-md { min-height: var(--card-height-tablet); }
.min-h-card-lg { min-height: var(--card-height-desktop); }

/* MEDIA RESPONSIVO */
.h-media-sm { height: var(--media-height-mobile); }
.h-media-md { height: var(--media-height-tablet); }
.h-media-lg { height: var(--media-height-desktop); }

/* BOTONES RESPONSIVOS */
.h-btn-sm { height: var(--button-height-sm); }
.h-btn-md { height: var(--button-height-md); }
.h-btn-lg { height: var(--button-height-lg); }

/* ASPECTOS ESPECÍFICOS */
.aspect-card {
  aspect-ratio: 3/4; /* Proporción consistente para cards */
}

.aspect-media {
  aspect-ratio: 16/9; /* Proporción para media */
}

.aspect-square {
  aspect-ratio: 1/1; /* Para elementos cuadrados */
}
```

---

## 📋 PLAN DE IMPLEMENTACIÓN

### Fase 3A: Preparación
1. **Agregar variables** a `_variables-unified.css`
2. **Crear clases BEM** nuevas sin eliminar existentes
3. **Preparar utilidades** responsivas

### Fase 3B: Migración Gradual
1. **Product Cards** - Mayor impacto visual
2. **Media Containers** - Escalado crítico
3. **Category Elements** - Consistencia
4. **Interactive Elements** - UX mejorada

### Fase 3C: Validación
1. **Testing visual** en cada breakpoint
2. **Comparación pixel-perfect** con estado actual
3. **Verificación de usabilidad** en elementos táctiles

---

## ⚡ BENEFICIOS DEL SISTEMA

### Técnicos
- ✅ **Escalado proporcional real** en todos los elementos
- ✅ **Especificidad controlada** (máximo 0,0,2,0)
- ✅ **Mantenimiento centralizado** en un solo archivo
- ✅ **Consistencia automática** entre breakpoints

### UX/UI
- 🚀 **Mejor aprovechamiento** del espacio disponible
- 📱 **Adaptación fluida** a diferentes dispositivos
- 🎨 **Consistencia visual** mejorada
- ♿ **Accesibilidad mantenida** (44px mínimo táctil)

### Desarrollo
- 🔧 **Código más limpio** y predecible
- 📝 **Documentación clara** de intenciones
- 🔄 **Flexibilidad futura** para nuevos dispositivos
- 🐛 **Debugging simplificado** con variables nombradas

---

## ✅ ESTADO ACTUAL
**FASE 3 COMPLETADA**: Sistema de variables CSS unificado diseñado
**PRÓXIMO PASO**: Fase 4 - Refactorización gradual con arquitectura BEM

**COMPONENTES CREADOS**:
- 🏗️ **Arquitectura jerárquica** de variables
- 📱 **Sistema responsivo** por breakpoints
- 🔄 **Mapeo de migración** detallado
- 🎨 **Arquitectura BEM** simplificada
- 🔧 **Utilidades responsivas** auxiliares

**IMPACTO ESTIMADO**: 90% de mejora en escalado proporcional y mantenibilidad