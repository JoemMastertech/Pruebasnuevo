# Guía de Patrones BEM - Sistema Frontend

## Introducción

Esta guía documenta los patrones BEM (Block Element Modifier) implementados en el sistema frontend después de la refactorización completa. Sirve como referencia para futuros desarrolladores y mantenimiento del código.

## Estructura BEM Implementada

### 1. Componentes de Producto (Product Components)

#### Block: `product-card`
```css
.product-card { /* Bloque base */ }
```

#### Elements:
- `.product-card__name` - Nombre del producto
- `.product-card__description` - Descripción/ingredientes
- `.product-card__image` - Imagen del producto
- `.product-card__media` - Contenedor de medios
- `.product-card__prices` - Contenedor de precios
- `.product-card__price-item` - Item individual de precio

#### Modifiers:
- `.product-card__image--video` - Imagen con video
- `.product-card__image--large` - Imagen grande
- `.product-card__image--small` - Imagen pequeña
- `.product-card__image--compact` - Imagen compacta

### 2. Botones de Precio (Price Buttons)

#### Block: `price-button`
```css
.price-button { /* Bloque base */ }
```

#### Elements:
- `.price-button__label` - Etiqueta del botón
- `.price-button__value` - Valor del precio

#### Modifiers:
- `.price-button--liquor` - Estilo para licores
- `.price-button--standard` - Estilo estándar
- `.price-button--active` - Estado activo
- `.price-button--disabled` - Estado deshabilitado
- `.price-button--non-selectable` - No seleccionable

### 3. Grillas de Categorías (Category Grids)

#### Block: `category-grid`
```css
.category-grid { /* Bloque base */ }
```

#### Elements:
- `.category-grid__card` - Tarjeta de categoría
- `.category-grid__image` - Imagen de categoría
- `.category-grid__name` - Nombre de categoría
- `.category-grid__prompt` - Texto de prompt

#### Modifiers:
- `.category-grid--liquor` - Estilo para licores
- `.category-grid--standard` - Estilo estándar

### 4. Tablas de Productos (Product Tables)

#### Block: `product-table`
```css
.product-table { /* Bloque base */ }
```

#### Modifiers:
- `.product-table--beverages` - Tabla de bebidas
- `.product-table--food` - Tabla de comida

### 5. Estados Globales (Global States)

Estados que afectan múltiples componentes:

- `.is-price-selection-mode` - Modo de selección de precios
- `.is-loading` - Estado de carga
- `.is-error` - Estado de error

### 6. Sistema de Grillas Dinámicas

#### Tipos de Grid:
- `.grid-type-1` - Grid tipo 1 (productos estándar)
- `.grid-type-2` - Grid tipo 2 (productos compactos)
- `.grid-type-3` - Grid tipo 3 (categorías estándar)
- `.grid-type-4` - Grid tipo 4 (categorías compactas)

## Convenciones de Nomenclatura

### 1. Bloques (Blocks)
- Usar nombres descriptivos en inglés
- Separar palabras con guiones: `product-card`, `price-button`
- Evitar abreviaciones confusas

### 2. Elementos (Elements)
- Usar doble guión bajo: `__`
- Describir la función del elemento: `__name`, `__image`, `__prices`
- Mantener nombres cortos pero descriptivos

### 3. Modificadores (Modifiers)
- Usar doble guión: `--`
- Describir el estado o variación: `--active`, `--large`, `--liquor`
- Usar nombres booleanos para estados: `--disabled`, `--selected`

## Patrones de Uso en JavaScript

### 1. Selección de Elementos
```javascript
// Correcto - usar clases BEM
const productName = document.querySelector('.product-card__name');
const priceButton = document.querySelector('.price-button--active');

// Incorrecto - evitar clases legacy
const productName = document.querySelector('.product-name'); // Legacy
```

### 2. Aplicación de Modificadores
```javascript
// Agregar modificador
element.classList.add('price-button--active');

// Remover modificador
element.classList.remove('price-button--disabled');

// Toggle de modificador
element.classList.toggle('product-card__image--large');
```

### 3. Estados Globales
```javascript
// Aplicar estado global
document.body.classList.add('is-price-selection-mode');

// Remover estado global
document.body.classList.remove('is-loading');
```

## Estructura de Archivos CSS

### Archivos Principales:
1. `main.css` - Estilos base y layout general
2. `_bem-architecture.css` - Componentes BEM específicos
3. `_variables-unified.css` - Variables CSS centralizadas
4. `_grid-system.css` - Sistema de grillas responsivo

### Organización Interna:
Cada archivo está organizado en secciones claras:

#### `main.css` (10 secciones):
1. Foundation (imports, variables, resets)
2. Typography & Branding
3. Navigation & Interactive Elements
4. Layout Components
5. Data Display Components
6. Interactive Components
7. Media Components
8. Card Components
9. Utility Classes
10. Browser Customization

#### `_bem-architecture.css` (8 secciones):
1. Product Components
2. Layout Components
3. Modal Components
4. Global States
5. Animations
6. Responsive Utilities
7. Dynamic Grid System
8. Compatibility & Fallbacks

## Mejores Prácticas

### 1. Consistencia
- Mantener la nomenclatura BEM en todo el proyecto
- Usar las mismas convenciones para componentes similares
- Documentar nuevos patrones cuando se agreguen

### 2. Modularidad
- Cada componente debe ser independiente
- Evitar dependencias entre bloques BEM
- Usar variables CSS para valores reutilizables

### 3. Responsividad
- Usar clamp() para valores fluidos
- Implementar breakpoints consistentes
- Mantener la funcionalidad en todos los dispositivos

### 4. Mantenimiento
- Revisar regularmente clases no utilizadas
- Actualizar esta documentación con cambios
- Realizar testing en diferentes dispositivos

## Migración de Clases Legacy

Si encuentras clases legacy, migra siguiendo estos patrones:

```css
/* Legacy → BEM */
.product-name → .product-card__name
.product-ingredients → .product-card__description
.product-image → .product-card__image
.category-name → .category-grid__name
.price-label → .price-button__label
```

## Métricas de Éxito

### Estado Actual (Post-Refactorización):
- ✅ 95% migración BEM completada
- ✅ Estilos inline eliminados (solo casos menores en archivos de prueba)
- ✅ CSS modularizado en 7 archivos (132.24 KB total)
- ✅ Sistema de grillas unificado
- ✅ Variables CSS centralizadas
- ✅ Arquitectura escalable implementada

---

**Última actualización:** Enero 2025  
**Versión:** 1.0  
**Mantenido por:** Equipo de Desarrollo Frontend