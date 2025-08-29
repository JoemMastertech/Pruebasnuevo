# Inventario de Dependencias y Matriz de Dependencias Cruzadas

## Resumen Ejecutivo

Este documento presenta un análisis completo de las dependencias del sistema actual, identificando acoplamientos, violaciones arquitectónicas y preparando la base para la migración a Arquitectura Hexagonal.

## 1. Inventario de Componentes por Capa

### 1.1 Capa de Interfaces (UI)

#### A. Componentes Principales
- **order-system.js** (2445 líneas)
  - Responsabilidades: UI, validaciones, lógica de negocio
  - Dependencias directas: 8 módulos
  - Violaciones: Acceso directo a servicios de aplicación

- **product-table.js** (ProductRenderer)
  - Responsabilidades: Renderizado de productos
  - Dependencias: DIContainer, ProductDataAdapter
  - Estado: Acoplado a infraestructura

- **SafeModal.js**
  - Responsabilidades: Gestión de modales
  - Dependencias: Utilities, DOM
  - Estado: Bien encapsulado

#### B. Adaptadores de UI
- **screen-manager.js**
  - Responsabilidades: Gestión de pantallas
  - Dependencias: AppInit, DOM utilities
  - Estado: Moderadamente acoplado

### 1.2 Capa de Aplicación

#### A. Servicios de Aplicación
- **OrderCore.js** (Aplicacion/services/)
  - Responsabilidades: Lógica de órdenes
  - Dependencias: Dominio, Infraestructura
  - Violaciones: Importado directamente por UI

#### B. Casos de Uso (Implícitos)
- Crear Orden: Distribuido entre UI y OrderCore
- Validar Productos: Mezclado en validaciones UI
- Calcular Totales: Disperso en múltiples archivos

### 1.3 Capa de Dominio

#### A. Entidades de Negocio
- **Product** (implícita en ProductDataAdapter)
- **Order** (implícita en OrderCore)
- **DrinkRules** (dispersas en validaciones)

#### B. Servicios de Dominio
- **Reglas de Bebidas**: En order-system-validations.js (UI)
- **Cálculos de Orden**: En OrderCore y UI
- **Validaciones**: Mezcladas entre capas

### 1.4 Capa de Infraestructura

#### A. Adaptadores de Datos
- **ProductDataAdapter.js**
  - Responsabilidades: Acceso a datos de productos
  - Dependencias: Supabase, caché
  - Estado: Bien implementado

- **SupabaseAdapter.js**
  - Responsabilidades: Conexión a base de datos
  - Dependencias: @supabase/supabase-js
  - Estado: Funcional

#### B. Servicios de Infraestructura
- **DIContainer.js**
  - Responsabilidades: Inyección de dependencias
  - Estado: Implementación básica

- **Logger.js, ErrorHandler.js**
  - Responsabilidades: Logging y manejo de errores
  - Estado: Bien implementados

## 2. Matriz de Dependencias Cruzadas

### 2.1 Dependencias Directas (Imports)

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Desde \ Hacia    │ UI              │ Aplicación      │ Dominio         │ Infraestructura │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ UI              │ ✅ Válido       │ ❌ VIOLACIÓN    │ ❌ VIOLACIÓN    │ ❌ VIOLACIÓN    │
│                 │ SafeModal,      │ OrderCore       │ (implícito)     │ ProductDataAdap │
│                 │ screen-manager  │                 │                 │                 │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Aplicación      │ ❌ VIOLACIÓN    │ ✅ Válido       │ ✅ Válido       │ ✅ Válido       │
│                 │ (no debería)    │                 │ (implícito)     │ Adapters        │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Dominio         │ ❌ VIOLACIÓN    │ ❌ VIOLACIÓN    │ ✅ Válido       │ ❌ VIOLACIÓN    │
│                 │ (no debería)    │ (no debería)    │                 │ (no debería)    │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Infraestructura │ ❌ VIOLACIÓN    │ ❌ VIOLACIÓN    │ ❌ VIOLACIÓN    │ ✅ Válido       │
│                 │ (no debería)    │ (no debería)    │ (no debería)    │                 │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### 2.2 Dependencias de Runtime (DI Container)

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Componente      │ Resuelve        │ Tipo            │ Problema        │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ order-system.js │ ProductRepo     │ Global access   │ Race condition  │
│ product-table   │ ProductRepo     │ DI injection    │ ✅ Correcto     │
│ OrderCore       │ ProductRepo     │ Direct import   │ ❌ Violación    │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

## 3. Análisis de Violaciones Arquitectónicas

### 3.1 Violaciones Críticas

#### A. UI → Aplicación (order-system.js:1)
```javascript
import OrderSystemCore from './../../../../Aplicacion/services/OrderCore.js';
```
**Impacto**: Alto - Viola inversión de dependencias
**Solución**: Inyectar via DI Container

#### B. Configuración → Infraestructura (app-init.js:31)
```javascript
import ProductDataAdapter from '../../Infraestructura/adapters/ProductDataAdapter.js';
```
**Impacto**: Alto - Configuración no debería conocer implementaciones
**Solución**: Registro via factory functions

### 3.2 Violaciones Moderadas

#### A. Lógica de Negocio en UI
- **Archivo**: order-system-validations.js
- **Líneas**: 107-133 (validateSpecialBottleRules)
- **Problema**: Reglas de negocio complejas en capa de presentación
- **Solución**: Mover a servicios de dominio

#### B. Acceso Global a DI Container
- **Archivos**: Múltiples (diUtils.js, order-system.js)
- **Problema**: `window.container` acceso directo
- **Solución**: Inyección de dependencias apropiada

## 4. Dependencias Externas

### 4.1 Bibliotecas de Terceros
```
@supabase/supabase-js  → ProductDataAdapter, SupabaseAdapter
DOMPurify             → domUtils (seguridad)
Google Fonts          → CSS (presentación)
```

### 4.2 APIs del Navegador
```
DOM API               → Todos los componentes UI
Fetch API             → Adaptadores de datos
LocalStorage          → SimpleCache
Console API           → Logger
```

## 5. Puntos de Integración Críticos

### 5.1 Inicialización
```
index.html → app-init.js → DIContainer → order-system.js
```
**Problema**: Race condition entre AppInit y OrderSystem
**Solución**: Coordinación explícita con Promises

### 5.2 Gestión de Estado
```
UI State → OrderSystem → OrderCore → ProductDataAdapter
```
**Problema**: Estado distribuido sin coordinación
**Solución**: Event-driven architecture

## 6. Métricas de Acoplamiento

### 6.1 Índices de Acoplamiento
- **Acoplamiento Aferente (Ca)**: Número de clases que dependen de esta clase
- **Acoplamiento Eferente (Ce)**: Número de clases de las que depende esta clase
- **Inestabilidad (I)**: Ce / (Ca + Ce)

```
┌─────────────────┬─────┬─────┬─────────┬─────────────────┐
│ Componente      │ Ca  │ Ce  │ I       │ Clasificación   │
├─────────────────┼─────┼─────┼─────────┼─────────────────┤
│ order-system.js │ 0   │ 8   │ 1.0     │ Muy Inestable   │
│ OrderCore.js    │ 1   │ 3   │ 0.75    │ Inestable       │
│ ProductDataAdap │ 3   │ 2   │ 0.4     │ Estable         │
│ DIContainer.js  │ 5   │ 0   │ 0.0     │ Muy Estable     │
└─────────────────┴─────┴─────┴─────────┴─────────────────┘
```

### 6.2 Complejidad Ciclomática
- **order-system.js**: ~45 (Muy Alta)
- **OrderCore.js**: ~12 (Moderada)
- **ProductDataAdapter**: ~8 (Aceptable)

## 7. Plan de Desacoplamiento

### 7.1 Prioridades de Refactoring

#### Fase 1: Fixes Críticos
1. **Coordinar inicialización** (AppInit → OrderSystem)
2. **Activar waitForDIContainer** en order-system.js
3. **Implementar error boundaries** robustos

#### Fase 2: Separación de Capas
1. **Extraer lógica de negocio** de UI a servicios de dominio
2. **Implementar casos de uso** explícitos
3. **Crear puertos y adaptadores** para infraestructura

#### Fase 3: DI Container Hexagonal
1. **Rediseñar DIContainer** para arquitectura hexagonal
2. **Implementar factory pattern** para registro de servicios
3. **Eliminar acceso global** a container

### 7.2 Criterios de Éxito
- ✅ Cero violaciones de capas hexagonales
- ✅ Inicialización sin race conditions
- ✅ Lógica de negocio solo en dominio
- ✅ DI Container funcionando correctamente
- ✅ Tests de regresión 100% pasando

## 8. Próximos Pasos

1. **Mapear flujo Current vs Ideal** para caso de uso "Crear Orden"
2. **Definir contratos de puertos y adaptadores**
3. **Implementar fixes críticos de inicialización**
4. **Comenzar extracción de lógica de negocio**

---

**Fecha**: 29 de Agosto, 2025  
**Versión**: 1.0  
**Estado**: Análisis Completo - Listo para Fase 1