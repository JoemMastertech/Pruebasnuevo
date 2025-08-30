# Guía de Migración BEM

## Resumen

Esta guía documenta el proceso de migración gradual del sistema CSS existente hacia una arquitectura BEM (Block Element Modifier) consistente y escalable.

## Arquitectura BEM Implementada

### Estructura de Archivos

```
Shared/styles/
├── _variables-unified.css     # Variables globales del sistema
├── _bem-base.css             # Base BEM y tokens de componentes
├── _bem-architecture.css     # Componentes BEM específicos
└── main.css                  # Archivo principal con imports
```

### Convenciones de Nomenclatura

```css
/* BLOQUE */
.product-card { }

/* ELEMENTO */
.product-card__name { }
.product-card__image { }
.product-card__price { }

/* MODIFICADOR DE BLOQUE */
.product-card--liquor { }
.product-card--compact { }

/* MODIFICADOR DE ELEMENTO */
.product-card__name--highlighted { }
.product-card__price--discounted { }
```

## Tokens de Componentes

### Sistema de Tokens

Cada componente BEM tiene sus propios tokens CSS que referencian las variables globales:

```css
:root {
  /* Tokens específicos del componente */
  --product-card-bg: var(--card-bg-current);
  --product-card-radius: var(--card-radius);
  --product-card-padding: var(--card-padding);
  
  /* Tokens de botones */
  --btn-primary-bg: var(--accent);
  --btn-primary-color: var(--bg);
}
```

## Proceso de Migración

### Fase 1: Componentes Base (ACTUAL)

✅ **Completado:**
- Configuración base BEM
- Tokens de componentes
- Clases de utilidad
- Componentes fundamentales (card, btn, form, text)

### Fase 2: Migración de Componentes Existentes

🔄 **En Proceso:**

#### 2.1 Product Card

**Antes (CSS tradicional):**
```css
.product {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1rem;
}

.product.liquor {
  border: 2px solid gold;
}

.product .name {
  font-size: 1.1rem;
  font-weight: bold;
}
```

**Después (BEM):**
```css
.product-card {
  background: var(--product-card-bg);
  border-radius: var(--product-card-radius);
  padding: var(--product-card-padding);
}

.product-card--liquor {
  border: 2px solid var(--accent-gold);
}

.product-card__name {
  font-size: var(--font-size-lg);
  font-weight: 600;
}
```

**HTML Migration:**
```html
<!-- Antes -->
<div class="product liquor">
  <h3 class="name">Whiskey Premium</h3>
  <p class="price">$45.99</p>
</div>

<!-- Después -->
<div class="product-card product-card--liquor">
  <h3 class="product-card__name">Whiskey Premium</h3>
  <p class="product-card__price">$45.99</p>
</div>
```

#### 2.2 Navigation

**Migración Planificada:**
```css
/* Nuevo componente BEM */
.nav {
  background: var(--nav-bg);
  height: var(--nav-height);
  border-bottom: var(--nav-border);
}

.nav__list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__item {
  margin-right: var(--spacing-md);
}

.nav__link {
  color: var(--nav-text-color);
  text-decoration: none;
  transition: var(--transition);
}

.nav__link:hover {
  color: var(--nav-link-hover);
}

.nav__link--active {
  color: var(--accent);
  font-weight: 600;
}
```

#### 2.3 Tables

**Migración Planificada:**
```css
.table {
  width: 100%;
  background: var(--table-bg);
  border: 1px solid var(--table-border);
  border-radius: var(--card-radius);
  overflow: hidden;
}

.table__header {
  background: var(--table-header-bg);
}

.table__row:hover {
  background: var(--table-row-hover);
}

.table__cell {
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--table-border);
}

.table__cell--numeric {
  text-align: right;
  font-family: 'Courier New', monospace;
}
```

### Fase 3: Componentes Avanzados

📋 **Pendiente:**
- Modal/Dialog components
- Form validation states
- Loading states
- Toast notifications
- Dropdown menus

## Beneficios de la Migración

### 1. Mantenibilidad
- **Nomenclatura consistente:** Fácil identificación de componentes
- **Encapsulación:** Cada componente es independiente
- **Reutilización:** Componentes modulares y reutilizables

### 2. Escalabilidad
- **Tokens de diseño:** Cambios centralizados
- **Modificadores:** Variaciones sin duplicación de código
- **Responsive:** Utilities responsivas integradas

### 3. Performance
- **CSS optimizado:** Menor especificidad
- **Carga selectiva:** Importación modular
- **Cacheable:** Componentes estables

## Estrategia de Migración Gradual

### Principios

1. **No Breaking Changes:** Mantener compatibilidad durante la transición
2. **Migración por Componente:** Un componente a la vez
3. **Testing Continuo:** Verificar cada migración
4. **Documentación:** Actualizar guías y ejemplos

### Proceso por Componente

1. **Análisis:** Identificar el componente actual
2. **Diseño BEM:** Crear la estructura BEM
3. **Tokens:** Definir tokens específicos
4. **Implementación:** Crear las clases BEM
5. **Migración HTML:** Actualizar templates
6. **Testing:** Verificar funcionalidad
7. **Cleanup:** Remover CSS obsoleto

## Herramientas y Utilities

### Clases de Utilidad Disponibles

```css
/* Spacing */
.m-xs, .m-sm, .m-md, .m-lg, .m-xl
.mt-xs, .mb-xs, .p-xs, .pt-xs, etc.

/* Display */
.d-none, .d-block, .d-flex, .d-grid

/* Typography */
.text--center, .text--small, .text--large
.title--h1, .title--h2, .title--h3

/* Responsive */
.tablet:d-flex, .desktop:text-center

/* Animation */
.fade-in, .slide-up, .scale-in
```

### Componentes Base Disponibles

```css
/* Layout */
.container, .grid, .flex

/* Typography */
.text, .title

/* Interactive */
.btn, .form-input, .card

/* Utilities */
.sr-only, .focus-visible
```

## Ejemplos de Uso

### Ejemplo 1: Card con Botón

```html
<div class="card card--compact">
  <div class="card__header">
    <h3 class="title title--h3">Producto Premium</h3>
  </div>
  <div class="card__body">
    <p class="text">Descripción del producto...</p>
  </div>
  <div class="card__footer">
    <button class="btn btn--primary btn--small">
      Agregar al Carrito
    </button>
  </div>
</div>
```

### Ejemplo 2: Formulario

```html
<form class="form">
  <div class="form-group">
    <label class="form-label" for="name">Nombre</label>
    <input class="form-input" type="text" id="name" name="name">
  </div>
  <div class="form-group">
    <button class="btn btn--primary" type="submit">
      Enviar
    </button>
  </div>
</form>
```

### Ejemplo 3: Grid Responsivo

```html
<div class="container">
  <div class="grid grid--auto-fit">
    <div class="card">Item 1</div>
    <div class="card">Item 2</div>
    <div class="card">Item 3</div>
  </div>
</div>
```

## Próximos Pasos

1. **Migrar Product Cards:** Actualizar todos los cards de productos
2. **Migrar Navigation:** Implementar nav BEM
3. **Migrar Tables:** Convertir tablas a BEM
4. **Migrar Forms:** Actualizar formularios
5. **Testing Completo:** Verificar responsive y funcionalidad
6. **Cleanup:** Remover CSS obsoleto
7. **Documentación:** Actualizar guías de estilo

## Recursos

- [BEM Methodology](http://getbem.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Design Tokens](https://designtokens.org/)
- [CSS Architecture](https://philipwalton.com/articles/css-architecture/)

---

**Nota:** Esta migración se realiza de forma gradual para mantener la estabilidad del sistema mientras se mejora la arquitectura CSS.