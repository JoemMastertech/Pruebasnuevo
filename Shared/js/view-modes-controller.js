/**
 * CONTROLADOR DINÁMICO DE MODOS DE VISTA
 * Sistema JavaScript para gestión de cambios entre tabla/grid
 * Complementa el sistema CSS centralizado
 */

export class ViewModesController {
    constructor() {
        this.currentMode = 'grid';
        this.containers = new Map();
        this.observers = new Set();
        this.config = {
            defaultMode: 'grid',
            animationDuration: 300,
            persistMode: true,
            storageKey: 'preferred-view-mode',
            responsive: {
                mobile: { maxWidth: 767, preferredMode: 'grid' },
                tablet: { minWidth: 768, maxWidth: 1023, preferredMode: 'grid' },
                desktop: { minWidth: 1024, preferredMode: 'grid' }
            }
        };
        
        this.init();
    }

    /**
     * Inicializar el controlador
     */
    init() {
        this.loadStoredMode();
        this.setupEventListeners();
        this.detectContainers();
        this.applyResponsiveMode();
        
        // Observar cambios en el DOM
        this.setupMutationObserver();
        
        console.log('ViewModesController initialized:', {
            currentMode: this.currentMode,
            containers: this.containers.size
        });
    }

    /**
     * Cargar modo guardado del localStorage
     */
    loadStoredMode() {
        if (this.config.persistMode) {
            const stored = localStorage.getItem(this.config.storageKey);
            if (stored && ['grid', 'table'].includes(stored)) {
                this.currentMode = stored;
            }
        }
    }

    /**
     * Guardar modo actual en localStorage
     */
    saveMode() {
        if (this.config.persistMode) {
            localStorage.setItem(this.config.storageKey, this.currentMode);
        }
    }

    /**
     * Detectar contenedores de vista automáticamente
     */
    detectContainers() {
        const containers = document.querySelectorAll('.view-container, [data-view]');
        containers.forEach(container => this.registerContainer(container));
    }

    /**
     * Registrar un contenedor de vista
     * @param {HTMLElement} container - Elemento contenedor
     * @param {Object} options - Opciones específicas del contenedor
     */
    registerContainer(container, options = {}) {
        if (!container || this.containers.has(container)) return;

        const config = {
            id: container.id || `container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            category: container.dataset.category || 'default',
            allowedModes: ['grid', 'table'],
            ...options
        };

        this.containers.set(container, config);
        
        // Aplicar modo actual
        this.applyModeToContainer(container, this.currentMode);
        
        // Configurar eventos específicos del contenedor
        this.setupContainerEvents(container);
        
        console.log('Container registered:', config.id, config);
    }

    /**
     * Configurar eventos específicos del contenedor
     */
    setupContainerEvents(container) {
        // Botones de cambio de vista dentro del contenedor
        const toggleButtons = container.querySelectorAll('[data-toggle-view]');
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetMode = button.dataset.toggleView;
                if (targetMode) {
                    this.setMode(targetMode);
                }
            });
        });
    }

    /**
     * Configurar event listeners globales
     */
    setupEventListeners() {
        // Botones globales de cambio de vista
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-view-toggle]')) {
                e.preventDefault();
                const mode = e.target.dataset.viewToggle;
                this.setMode(mode);
            }
        });

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'g':
                        e.preventDefault();
                        this.setMode('grid');
                        break;
                    case 't':
                        e.preventDefault();
                        this.setMode('table');
                        break;
                }
            }
        });

        // Responsive breakpoints
        window.addEventListener('resize', () => {
            this.debounce(() => this.applyResponsiveMode(), 250);
        });
    }

    /**
     * Configurar observer para cambios en el DOM
     */
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Buscar nuevos contenedores
                        if (node.matches('.view-container, [data-view]')) {
                            this.registerContainer(node);
                        }
                        
                        // Buscar contenedores dentro de nodos añadidos
                        const containers = node.querySelectorAll('.view-container, [data-view]');
                        containers.forEach(container => this.registerContainer(container));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Cambiar modo de vista
     * @param {string} mode - 'grid' o 'table'
     * @param {Object} options - Opciones adicionales
     */
    setMode(mode, options = {}) {
        if (!['grid', 'table'].includes(mode) || mode === this.currentMode) {
            return false;
        }

        const previousMode = this.currentMode;
        this.currentMode = mode;

        // Aplicar a todos los contenedores
        this.containers.forEach((config, container) => {
            if (config.allowedModes.includes(mode)) {
                this.applyModeToContainer(container, mode, options);
            }
        });

        // Guardar preferencia
        this.saveMode();

        // Notificar observadores
        this.notifyObservers({
            type: 'modeChanged',
            previousMode,
            currentMode: mode,
            timestamp: Date.now()
        });

        console.log('View mode changed:', { from: previousMode, to: mode });
        return true;
    }

    /**
     * Aplicar modo a un contenedor específico
     */
    applyModeToContainer(container, mode, options = {}) {
        const config = this.containers.get(container);
        if (!config || !config.allowedModes.includes(mode)) return;

        // Aplicar atributo data-view
        container.setAttribute('data-view', mode);
        
        // Aplicar clases CSS
        container.classList.remove('view-grid', 'view-table', 'view-transitioning');
        container.classList.add(`view-${mode}`);

        // Configurar transiciones usando clases CSS
        if (options.animate !== false) {
            container.classList.add('view-transitioning');
            // Remover clase de transición después de la animación
            setTimeout(() => {
                container.classList.remove('view-transitioning');
            }, this.config.animationDuration);
        }

        // Configuraciones específicas por categoría
        this.applyCategorySpecificConfig(container, mode, config.category);

        // Trigger custom event
        container.dispatchEvent(new CustomEvent('viewModeChanged', {
            detail: { mode, previousMode: this.currentMode, config }
        }));
    }

    /**
     * Aplicar configuraciones específicas por categoría
     */
    applyCategorySpecificConfig(container, mode, category) {
        // Remover clases de categoría previas
        container.classList.remove('category-liquor-large', 'category-default');
        
        // Aplicar clases específicas por categoría sin sobreescribir CSS
        if (category === 'liquor' && mode === 'grid') {
            const mediaQuery = window.matchMedia('(min-width: 1200px)');
            if (mediaQuery.matches) {
                container.classList.add('category-liquor-large');
            }
        }
        
        // Aplicar clase de categoría general
        if (category && category !== 'default') {
            container.classList.add(`category-${category}`);
        }
    }

    /**
     * Aplicar modo responsive según el breakpoint actual
     */
    applyResponsiveMode() {
        const width = window.innerWidth;
        let responsiveMode = this.config.defaultMode;

        // Determinar modo preferido según breakpoint
        for (const [breakpoint, config] of Object.entries(this.config.responsive)) {
            if (config.minWidth && width >= config.minWidth && 
                (!config.maxWidth || width <= config.maxWidth)) {
                responsiveMode = config.preferredMode;
                break;
            } else if (config.maxWidth && width <= config.maxWidth) {
                responsiveMode = config.preferredMode;
                break;
            }
        }

        // Solo cambiar si es diferente al actual
        if (responsiveMode !== this.currentMode) {
            this.setMode(responsiveMode, { source: 'responsive' });
        }
    }

    /**
     * Alternar entre modos
     */
    toggleMode() {
        const newMode = this.currentMode === 'grid' ? 'table' : 'grid';
        return this.setMode(newMode);
    }

    /**
     * Obtener modo actual
     */
    getCurrentMode() {
        return this.currentMode;
    }

    /**
     * Verificar si un modo está disponible
     */
    isModeAvailable(mode) {
        return ['grid', 'table'].includes(mode);
    }

    /**
     * Agregar observador de cambios
     */
    addObserver(callback) {
        if (typeof callback === 'function') {
            this.observers.add(callback);
        }
    }

    /**
     * Remover observador
     */
    removeObserver(callback) {
        this.observers.delete(callback);
    }

    /**
     * Notificar a todos los observadores
     */
    notifyObservers(event) {
        this.observers.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Error in view mode observer:', error);
            }
        });
    }

    /**
     * Utilidad debounce
     */
    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }

    /**
     * Destruir el controlador
     */
    destroy() {
        this.containers.clear();
        this.observers.clear();
        clearTimeout(this.debounceTimer);
        console.log('ViewModesController destroyed');
    }

    /**
     * Obtener estadísticas del controlador
     */
    getStats() {
        return {
            currentMode: this.currentMode,
            containersCount: this.containers.size,
            observersCount: this.observers.size,
            config: this.config
        };
    }
}

// Crear instancia global
window.ViewModesController = ViewModesController;

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.viewModesController = new ViewModesController();
    });
} else {
    window.viewModesController = new ViewModesController();
}

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ViewModesController;
}

/**
 * DOCUMENTACIÓN DE USO:
 * 
 * 1. INICIALIZACIÓN AUTOMÁTICA:
 *    El controlador se inicializa automáticamente al cargar la página
 * 
 * 2. USO BÁSICO:
 *    window.viewModesController.setMode('table');
 *    window.viewModesController.toggleMode();
 * 
 * 3. REGISTRO MANUAL DE CONTENEDORES:
 *    const container = document.getElementById('products');
 *    window.viewModesController.registerContainer(container, {
 *        category: 'liquor',
 *        allowedModes: ['grid', 'table']
 *    });
 * 
 * 4. OBSERVADORES:
 *    window.viewModesController.addObserver((event) => {
 *        console.log('Mode changed:', event);
 *    });
 * 
 * 5. ATAJOS DE TECLADO:
 *    Ctrl+G: Cambiar a grid
 *    Ctrl+T: Cambiar a tabla
 * 
 * 6. HTML REQUERIDO:
 *    <div class="view-container" data-view="grid">
 *        <div class="grid-view">...</div>
 *        <div class="table-view">...</div>
 *    </div>
 * 
 * 7. BOTONES DE CONTROL:
 *    <button data-view-toggle="grid">Grid</button>
 *    <button data-view-toggle="table">Table</button>
 */