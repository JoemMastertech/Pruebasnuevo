/**
 * Performance Optimizer - Fase 4
 *
 * Optimizaciones de performance para rendering CSS y event handling
 * Implementa técnicas avanzadas de optimización para UI controllers
 */
export class PerformanceOptimizer {
    constructor(config = {}) {
        this.metrics = [];
        this.observers = new Map();
        this.rafId = null;
        this.isOptimizing = false;
        this.cssCache = new Map();
        this.eventCache = new Map();
        this.config = {
            enableVirtualization: true,
            enableLazyLoading: true,
            enableCSSOptimization: true,
            enableEventDelegation: true,
            enableMemoryOptimization: true,
            debounceDelay: 300,
            throttleDelay: 16, // 60fps
            maxDOMNodes: 1000,
            ...config
        };
        this.initialize();
    }
    /**
     * Inicializar optimizador
     */
    initialize() {
        this.log('Inicializando PerformanceOptimizer');
        if (this.config.enableMemoryOptimization) {
            this.setupMemoryOptimization();
        }
        if (this.config.enableCSSOptimization) {
            this.setupCSSOptimization();
        }
        this.startPerformanceMonitoring();
    }
    /**
     * Optimizar rendering de componentes
     */
    optimizeRendering(element, data) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            if (this.config.enableVirtualization && data.length > 100) {
                this.virtualizeRendering(element, data).then(() => {
                    this.recordMetric('renderTime', performance.now() - startTime);
                    resolve();
                });
            }
            else {
                this.standardRendering(element, data);
                this.recordMetric('renderTime', performance.now() - startTime);
                resolve();
            }
        });
    }
    /**
     * Rendering virtualizado para listas grandes
     */
    async virtualizeRendering(container, data) {
        const itemHeight = 100; // Altura estimada por item
        const containerHeight = container.clientHeight;
        const visibleItems = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
        let scrollTop = 0;
        let startIndex = 0;
        let endIndex = Math.min(visibleItems, data.length);
        // Crear contenedor virtual
        const virtualContainer = document.createElement('div');
        virtualContainer.style.height = `${data.length * itemHeight}px`;
        virtualContainer.style.position = 'relative';
        const visibleContainer = document.createElement('div');
        visibleContainer.style.position = 'absolute';
        visibleContainer.style.top = '0';
        visibleContainer.style.width = '100%';
        virtualContainer.appendChild(visibleContainer);
        container.innerHTML = '';
        container.appendChild(virtualContainer);
        // Función de actualización
        const updateVisibleItems = this.throttle(() => {
            const newScrollTop = container.scrollTop;
            const newStartIndex = Math.floor(newScrollTop / itemHeight);
            const newEndIndex = Math.min(newStartIndex + visibleItems, data.length);
            if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
                startIndex = newStartIndex;
                endIndex = newEndIndex;
                scrollTop = newScrollTop;
                // Actualizar posición del contenedor visible
                visibleContainer.style.transform = `translateY(${startIndex * itemHeight}px)`;
                // Renderizar items visibles
                this.renderVisibleItems(visibleContainer, data.slice(startIndex, endIndex), startIndex);
            }
        }, this.config.throttleDelay);
        // Event listener para scroll
        container.addEventListener('scroll', updateVisibleItems, { passive: true });
        // Renderizado inicial
        this.renderVisibleItems(visibleContainer, data.slice(startIndex, endIndex), startIndex);
    }
    /**
     * Renderizar items visibles
     */
    renderVisibleItems(container, items, startIndex) {
        const fragment = document.createDocumentFragment();
        items.forEach((item, index) => {
            const element = this.createItemElement(item, startIndex + index);
            fragment.appendChild(element);
        });
        container.innerHTML = '';
        container.appendChild(fragment);
    }
    /**
     * Crear elemento de item (debe ser implementado por el componente)
     */
    createItemElement(item, index) {
        const element = document.createElement('div');
        element.className = 'virtual-item';
        element.style.height = '100px';
        element.textContent = `Item ${index}: ${JSON.stringify(item)}`;
        return element;
    }
    /**
     * Rendering estándar optimizado
     */
    standardRendering(container, data) {
        const fragment = document.createDocumentFragment();
        // Usar requestAnimationFrame para rendering no bloqueante
        const renderBatch = (items, batchSize = 50) => {
            return new Promise((resolve) => {
                let index = 0;
                const processBatch = () => {
                    const endIndex = Math.min(index + batchSize, items.length);
                    for (let i = index; i < endIndex; i++) {
                        const element = this.createItemElement(items[i], i);
                        fragment.appendChild(element);
                    }
                    index = endIndex;
                    if (index < items.length) {
                        requestAnimationFrame(processBatch);
                    }
                    else {
                        container.appendChild(fragment);
                        resolve();
                    }
                };
                processBatch();
            });
        };
        renderBatch(data);
    }
    /**
     * Optimizar event handling
     */
    optimizeEventHandling(container) {
        if (!this.config.enableEventDelegation)
            return;
        const startTime = performance.now();
        // Remover event listeners existentes
        this.removeExistingListeners(container);
        // Implementar event delegation
        const delegatedHandler = this.createDelegatedHandler();
        // Eventos principales con delegation
        const events = ['click', 'change', 'input', 'keydown'];
        events.forEach(eventType => {
            const handler = this.throttle((event) => {
                delegatedHandler(event);
            }, this.config.throttleDelay);
            container.addEventListener(eventType, handler, {
                passive: eventType !== 'keydown',
                capture: false
            });
            this.eventCache.set(`${container.id || 'container'}-${eventType}`, handler);
        });
        this.recordMetric('eventHandlingTime', performance.now() - startTime);
    }
    /**
     * Crear handler delegado
     */
    createDelegatedHandler() {
        return (event) => {
            const target = event.target;
            if (!target)
                return;
            // Buscar el elemento con data-action más cercano
            const actionElement = target.closest('[data-action]');
            if (!actionElement)
                return;
            const action = actionElement.getAttribute('data-action');
            if (!action)
                return;
            // Dispatch custom event con información del action
            const customEvent = new CustomEvent('ui-action', {
                detail: {
                    action,
                    element: actionElement,
                    originalEvent: event,
                    data: this.extractElementData(actionElement)
                },
                bubbles: true
            });
            actionElement.dispatchEvent(customEvent);
        };
    }
    /**
     * Extraer datos del elemento
     */
    extractElementData(element) {
        const data = {};
        // Extraer todos los data attributes
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('data-') && attr.name !== 'data-action') {
                const key = attr.name.replace('data-', '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                data[key] = attr.value;
            }
        });
        return data;
    }
    /**
     * Remover event listeners existentes
     */
    removeExistingListeners(container) {
        const containerId = container.id || 'container';
        this.eventCache.forEach((handler, key) => {
            if (key.startsWith(containerId)) {
                const eventType = key.split('-').pop();
                if (eventType) {
                    container.removeEventListener(eventType, handler);
                }
            }
        });
        // Limpiar cache
        Array.from(this.eventCache.keys())
            .filter(key => key.startsWith(containerId))
            .forEach(key => this.eventCache.delete(key));
    }
    /**
     * Optimizar CSS
     */
    optimizeCSS() {
        if (!this.config.enableCSSOptimization)
            return;
        const startTime = performance.now();
        // Remover CSS no utilizado
        this.removeUnusedCSS();
        // Optimizar selectores CSS
        this.optimizeCSSSelectors();
        // Minimizar reflows y repaints
        this.minimizeReflows();
        this.recordMetric('cssOptimizationTime', performance.now() - startTime);
    }
    /**
     * Remover CSS no utilizado
     */
    removeUnusedCSS() {
        const stylesheets = Array.from(document.styleSheets);
        const usedSelectors = new Set();
        // Analizar elementos en el DOM
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const classes = Array.from(element.classList);
            classes.forEach(className => {
                usedSelectors.add(`.${className}`);
            });
            if (element.id) {
                usedSelectors.add(`#${element.id}`);
            }
        });
        // Marcar reglas no utilizadas (en un entorno real, las removeríamos)
        stylesheets.forEach(stylesheet => {
            try {
                const rules = Array.from(stylesheet.cssRules || []);
                rules.forEach(rule => {
                    if (rule instanceof CSSStyleRule) {
                        const selector = rule.selectorText;
                        if (!this.isSelectorUsed(selector, usedSelectors)) {
                            // En producción, removeríamos la regla
                            // stylesheet.deleteRule(rules.indexOf(rule));
                        }
                    }
                });
            }
            catch (error) {
                // Ignorar errores de CORS en stylesheets externos
            }
        });
    }
    /**
     * Verificar si un selector está siendo utilizado
     */
    isSelectorUsed(selector, usedSelectors) {
        // Simplificación - en un entorno real sería más complejo
        return usedSelectors.has(selector) ||
            Array.from(usedSelectors).some(used => selector.includes(used));
    }
    /**
     * Optimizar selectores CSS
     */
    optimizeCSSSelectors() {
        // Implementar optimizaciones de selectores
        // Por ejemplo, preferir clases sobre selectores complejos
        this.log('Optimizando selectores CSS');
    }
    /**
     * Minimizar reflows y repaints
     */
    minimizeReflows() {
        // Agrupar cambios de DOM
        const elementsToUpdate = document.querySelectorAll('[data-needs-update]');
        if (elementsToUpdate.length > 0) {
            // Usar DocumentFragment para cambios batch
            const fragment = document.createDocumentFragment();
            elementsToUpdate.forEach(element => {
                element.removeAttribute('data-needs-update');
                // Aplicar cambios en batch
            });
        }
    }
    /**
     * Configurar optimización de memoria
     */
    setupMemoryOptimization() {
        // Intersection Observer para lazy loading
        if (this.config.enableLazyLoading && 'IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => this.handleLazyLoading(entries), { rootMargin: '50px' });
            this.observers.set('lazy', lazyObserver);
        }
        // Mutation Observer para monitorear cambios DOM
        if ('MutationObserver' in window) {
            const mutationObserver = new MutationObserver((mutations) => this.handleDOMMutations(mutations));
            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false
            });
            this.observers.set('mutation', mutationObserver);
        }
    }
    /**
     * Manejar lazy loading
     */
    handleLazyLoading(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                // Cargar contenido lazy
                if (element.hasAttribute('data-lazy-src')) {
                    const src = element.getAttribute('data-lazy-src');
                    if (src && element instanceof HTMLImageElement) {
                        element.src = src;
                        element.removeAttribute('data-lazy-src');
                    }
                }
                // Dejar de observar
                this.observers.get('lazy')?.unobserve(element);
            }
        });
    }
    /**
     * Manejar mutaciones DOM
     */
    handleDOMMutations(mutations) {
        let nodeCount = 0;
        mutations.forEach(mutation => {
            nodeCount += mutation.addedNodes.length;
        });
        // Advertir si hay demasiados nodos
        const totalNodes = document.querySelectorAll('*').length;
        if (totalNodes > this.config.maxDOMNodes) {
            console.warn(`⚠️ Demasiados nodos DOM: ${totalNodes}. Considerar virtualización.`);
        }
        this.recordMetric('domNodes', totalNodes);
    }
    /**
     * Configurar optimización CSS
     */
    setupCSSOptimization() {
        // Precargar CSS crítico
        this.preloadCriticalCSS();
        // Optimizar CSS custom properties
        this.optimizeCSSCustomProperties();
    }
    /**
     * Precargar CSS crítico
     */
    preloadCriticalCSS() {
        const criticalCSS = [
            '/Interfaces/web/styles/base/_variables.css',
            '/Interfaces/web/styles/base/_bem-base.css'
        ];
        criticalCSS.forEach(href => {
            if (!this.cssCache.has(href)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = href;
                document.head.appendChild(link);
                this.cssCache.set(href, 'preloaded');
            }
        });
    }
    /**
     * Optimizar CSS custom properties
     */
    optimizeCSSCustomProperties() {
        // Agrupar cambios de custom properties
        const root = document.documentElement;
        const propertiesToUpdate = {};
        // En lugar de cambiar propiedades una por una, agruparlas
        Object.entries(propertiesToUpdate).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }
    /**
     * Iniciar monitoreo de performance
     */
    startPerformanceMonitoring() {
        const monitor = () => {
            this.collectMetrics();
            if (this.isOptimizing) {
                this.rafId = requestAnimationFrame(monitor);
            }
        };
        this.isOptimizing = true;
        this.rafId = requestAnimationFrame(monitor);
    }
    /**
     * Recopilar métricas
     */
    collectMetrics() {
        const metrics = {
            renderTime: 0,
            eventHandlingTime: 0,
            memoryUsage: this.getMemoryUsage(),
            domNodes: document.querySelectorAll('*').length,
            cssRules: this.getCSSRulesCount(),
            timestamp: Date.now(),
            cssOptimizationTime: 0
        };
        this.metrics.push(metrics);
        // Mantener solo las últimas 100 métricas
        if (this.metrics.length > 100) {
            this.metrics.shift();
        }
    }
    /**
     * Obtener uso de memoria
     */
    getMemoryUsage() {
        if ('memory' in performance) {
            return performance.memory.usedJSHeapSize;
        }
        return 0;
    }
    /**
     * Obtener cantidad de reglas CSS
     */
    getCSSRulesCount() {
        let count = 0;
        Array.from(document.styleSheets).forEach(stylesheet => {
            try {
                count += stylesheet.cssRules?.length || 0;
            }
            catch (error) {
                // Ignorar errores de CORS
            }
        });
        return count;
    }
    /**
     * Registrar métrica
     */
    recordMetric(type, value) {
        if (this.metrics.length > 0) {
            const lastMetric = this.metrics[this.metrics.length - 1];
            lastMetric[type] = value;
        }
    }
    /**
     * Throttle function
     */
    throttle(func, delay) {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            }
        };
    }
    /**
     * Debounce function
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => func(...args), delay);
        };
    }
    /**
     * Obtener métricas de performance
     */
    getMetrics() {
        return [...this.metrics];
    }
    /**
     * Obtener resumen de performance
     */
    getPerformanceSummary() {
        if (this.metrics.length === 0)
            return null;
        const recent = this.metrics.slice(-10);
        return {
            averageRenderTime: recent.reduce((sum, m) => sum + m.renderTime, 0) / recent.length,
            averageEventHandlingTime: recent.reduce((sum, m) => sum + m.eventHandlingTime, 0) / recent.length,
            currentMemoryUsage: recent[recent.length - 1].memoryUsage,
            currentDOMNodes: recent[recent.length - 1].domNodes,
            currentCSSRules: recent[recent.length - 1].cssRules,
            optimizationsActive: {
                virtualization: this.config.enableVirtualization,
                lazyLoading: this.config.enableLazyLoading,
                cssOptimization: this.config.enableCSSOptimization,
                eventDelegation: this.config.enableEventDelegation,
                memoryOptimization: this.config.enableMemoryOptimization
            }
        };
    }
    /**
     * Destruir optimizador
     */
    destroy() {
        this.log('Destruyendo PerformanceOptimizer');
        this.isOptimizing = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        // Limpiar observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        // Limpiar caches
        this.cssCache.clear();
        this.eventCache.clear();
        // Limpiar métricas
        this.metrics.length = 0;
    }
    /**
     * Logging
     */
    log(message, ...args) {
        console.log(`[PerformanceOptimizer] ${message}`, ...args);
    }
}
export default PerformanceOptimizer;
//# sourceMappingURL=PerformanceOptimizer.js.map