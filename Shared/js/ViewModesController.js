/* =====================================================================
   CONTROLADOR JAVASCRIPT DE MODOS DE VISTA
   Gestión dinámica y centralizada de tabla/grid
   Complementa el sistema CSS maestro
   ===================================================================== */

class ViewModesController {
    constructor(options = {}) {
        this.container = null;
        this.currentMode = 'grid';
        this.isTransitioning = false;
        this.debugMode = false;
        
        // Configuración por defecto
        this.config = {
            containerSelector: '.view-container',
            toggleButtonSelector: '.view-toggle-btn',
            defaultMode: 'grid',
            enableTransitions: true,
            enableLocalStorage: true,
            enableDebugMode: false,
            transitionDuration: 400,
            ...options
        };
        
        // Callbacks personalizables
        this.callbacks = {
            onModeChange: null,
            onTransitionStart: null,
            onTransitionEnd: null,
            onError: null,
            ...options.callbacks
        };
        
        this.init();
    }
    
    /**
     * Inicialización del controlador
     */
    init() {
        try {
            this.findContainer();
            this.loadSavedMode();
            this.setupEventListeners();
            this.applyInitialMode();
            this.setupDebugMode();
            
            console.log('✅ ViewModesController inicializado correctamente');
        } catch (error) {
            this.handleError('Error en inicialización', error);
        }
    }
    
    /**
     * Buscar y validar el contenedor principal
     */
    findContainer() {
        this.container = document.querySelector(this.config.containerSelector);
        
        if (!this.container) {
            throw new Error(`Contenedor no encontrado: ${this.config.containerSelector}`);
        }
        
        // Agregar clases necesarias
        if (this.config.enableTransitions) {
            this.container.classList.add('view-mode-transition');
        }
        
        if (this.config.enableDebugMode) {
            this.container.classList.add('debug');
            this.debugMode = true;
        }
    }
    
    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Botones de toggle
        const toggleButtons = document.querySelectorAll(this.config.toggleButtonSelector);
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetMode = button.dataset.mode || this.getOppositeMode();
                this.switchMode(targetMode);
            });
        });
        
        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'v') {
                e.preventDefault();
                this.toggleMode();
            }
            
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleDebugMode();
            }
        });
        
        // Responsive breakpoint changes
        window.addEventListener('resize', this.debounce(() => {
            this.handleResponsiveChange();
        }, 250));
        
        // Storage changes (para sincronización entre pestañas)
        if (this.config.enableLocalStorage) {
            window.addEventListener('storage', (e) => {
                if (e.key === 'viewMode') {
                    this.switchMode(e.newValue, false);
                }
            });
        }
    }
    
    /**
     * Cargar modo guardado desde localStorage
     */
    loadSavedMode() {
        if (!this.config.enableLocalStorage) {
            this.currentMode = this.config.defaultMode;
            return;
        }
        
        const savedMode = localStorage.getItem('viewMode');
        this.currentMode = this.isValidMode(savedMode) ? savedMode : this.config.defaultMode;
    }
    
    /**
     * Aplicar modo inicial
     */
    applyInitialMode() {
        this.container.setAttribute('data-view', this.currentMode);
        this.updateToggleButtons();
        this.logDebug(`Modo inicial aplicado: ${this.currentMode}`);
    }
    
    /**
     * Cambiar modo de vista
     */
    async switchMode(newMode, saveToStorage = true) {
        if (!this.isValidMode(newMode) || newMode === this.currentMode || this.isTransitioning) {
            return false;
        }
        
        try {
            this.isTransitioning = true;
            const oldMode = this.currentMode;
            
            // Callback de inicio de transición
            this.executeCallback('onTransitionStart', { oldMode, newMode });
            
            // Agregar estado de carga
            this.container.classList.add('loading');
            
            // Aplicar nuevo modo
            this.container.setAttribute('data-view', newMode);
            this.currentMode = newMode;
            
            // Guardar en localStorage
            if (saveToStorage && this.config.enableLocalStorage) {
                localStorage.setItem('viewMode', newMode);
            }
            
            // Actualizar UI
            this.updateToggleButtons();
            this.updateAriaLabels();
            
            // Esperar transición CSS
            await this.waitForTransition();
            
            // Remover estado de carga
            this.container.classList.remove('loading');
            
            // Callbacks
            this.executeCallback('onModeChange', { oldMode, newMode });
            this.executeCallback('onTransitionEnd', { oldMode, newMode });
            
            this.logDebug(`Modo cambiado: ${oldMode} → ${newMode}`);
            
            return true;
            
        } catch (error) {
            this.handleError('Error al cambiar modo', error);
            return false;
        } finally {
            this.isTransitioning = false;
        }
    }
    
    /**
     * Toggle entre modos
     */
    toggleMode() {
        const newMode = this.getOppositeMode();
        return this.switchMode(newMode);
    }
    
    /**
     * Obtener modo opuesto
     */
    getOppositeMode() {
        return this.currentMode === 'grid' ? 'table' : 'grid';
    }
    
    /**
     * Validar si un modo es válido
     */
    isValidMode(mode) {
        return ['grid', 'table'].includes(mode);
    }
    
    /**
     * Actualizar botones de toggle
     */
    updateToggleButtons() {
        const toggleButtons = document.querySelectorAll(this.config.toggleButtonSelector);
        
        toggleButtons.forEach(button => {
            const buttonMode = button.dataset.mode;
            const isActive = buttonMode === this.currentMode;
            
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive);
            
            // Actualizar texto si no tiene modo específico
            if (!buttonMode) {
                const oppositeMode = this.getOppositeMode();
                const modeText = oppositeMode === 'grid' ? 'Cuadrícula' : 'Tabla';
                button.textContent = `Ver como ${modeText}`;
            }
        });
    }
    
    /**
     * Actualizar etiquetas ARIA para accesibilidad
     */
    updateAriaLabels() {
        const modeText = this.currentMode === 'grid' ? 'cuadrícula' : 'tabla';
        this.container.setAttribute('aria-label', `Vista en ${modeText}`);
    }
    
    /**
     * Manejar cambios responsive
     */
    handleResponsiveChange() {
        const width = window.innerWidth;
        let optimalMode = this.currentMode;
        
        // Auto-switch en móvil si está configurado
        if (width < 768 && this.config.autoSwitchMobile) {
            optimalMode = 'grid';
        }
        
        if (optimalMode !== this.currentMode) {
            this.switchMode(optimalMode);
        }
        
        this.logDebug(`Responsive change: ${width}px - Modo: ${this.currentMode}`);
    }
    
    /**
     * Esperar a que termine la transición CSS
     */
    waitForTransition() {
        return new Promise(resolve => {
            setTimeout(resolve, this.config.transitionDuration);
        });
    }
    
    /**
     * Configurar modo debug
     */
    setupDebugMode() {
        if (this.debugMode) {
            // Agregar información de debug al DOM
            this.addDebugInfo();
            
            // Logs detallados
            console.log('🐛 Modo Debug activado');
            console.log('📊 Configuración:', this.config);
            console.log('📦 Contenedor:', this.container);
        }
    }
    
    /**
     * Toggle modo debug
     */
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        this.container.classList.toggle('debug', this.debugMode);
        
        if (this.debugMode) {
            this.addDebugInfo();
            console.log('🐛 Modo Debug ACTIVADO');
        } else {
            this.removeDebugInfo();
            console.log('🐛 Modo Debug DESACTIVADO');
        }
    }
    
    /**
     * Agregar información de debug
     */
    addDebugInfo() {
        let debugPanel = document.getElementById('view-modes-debug');
        
        if (!debugPanel) {
            debugPanel = document.createElement('div');
            debugPanel.id = 'view-modes-debug';
            debugPanel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 6px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                max-width: 300px;
            `;
            document.body.appendChild(debugPanel);
        }
        
        debugPanel.innerHTML = `
            <strong>🐛 View Modes Debug</strong><br>
            <strong>Modo actual:</strong> ${this.currentMode}<br>
            <strong>Transicionando:</strong> ${this.isTransitioning}<br>
            <strong>Ancho ventana:</strong> ${window.innerWidth}px<br>
            <strong>Breakpoint:</strong> ${this.getCurrentBreakpoint()}<br>
            <strong>Atajos:</strong><br>
            • Ctrl+V: Toggle modo<br>
            • Ctrl+Shift+D: Toggle debug
        `;
    }
    
    /**
     * Remover información de debug
     */
    removeDebugInfo() {
        const debugPanel = document.getElementById('view-modes-debug');
        if (debugPanel) {
            debugPanel.remove();
        }
    }
    
    /**
     * Obtener breakpoint actual
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width < 480) return 'mobile';
        if (width < 768) return 'mobile-large';
        if (width < 1024) return 'tablet';
        if (width < 1200) return 'desktop';
        if (width < 1400) return 'large';
        return 'xlarge';
    }
    
    /**
     * Ejecutar callback si existe
     */
    executeCallback(callbackName, data) {
        const callback = this.callbacks[callbackName];
        if (typeof callback === 'function') {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error en callback ${callbackName}:`, error);
            }
        }
    }
    
    /**
     * Manejar errores
     */
    handleError(message, error) {
        console.error(`❌ ViewModesController - ${message}:`, error);
        this.executeCallback('onError', { message, error });
    }
    
    /**
     * Log de debug
     */
    logDebug(message) {
        if (this.debugMode) {
            console.log(`🐛 ViewModesController: ${message}`);
        }
    }
    
    /**
     * Utilidad debounce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * API pública para obtener estado actual
     */
    getState() {
        return {
            currentMode: this.currentMode,
            isTransitioning: this.isTransitioning,
            debugMode: this.debugMode,
            breakpoint: this.getCurrentBreakpoint(),
            containerElement: this.container
        };
    }
    
    /**
     * API pública para forzar actualización
     */
    forceUpdate() {
        this.updateToggleButtons();
        this.updateAriaLabels();
        this.handleResponsiveChange();
        
        if (this.debugMode) {
            this.addDebugInfo();
        }
    }
    
    /**
     * Destruir instancia y limpiar event listeners
     */
    destroy() {
        // Remover event listeners
        const toggleButtons = document.querySelectorAll(this.config.toggleButtonSelector);
        toggleButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        // Limpiar debug
        this.removeDebugInfo();
        
        // Limpiar referencias
        this.container = null;
        this.callbacks = {};
        
        console.log('🗑️ ViewModesController destruido');
    }
}

/* ===== INICIALIZACIÓN AUTOMÁTICA ===== */

// Auto-inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Buscar configuración en el DOM
        const configElement = document.querySelector('[data-view-modes-config]');
        let config = {};
        
        if (configElement) {
            try {
                config = JSON.parse(configElement.dataset.viewModesConfig);
            } catch (error) {
                console.warn('Error parsing view modes config:', error);
            }
        }
        
        // Crear instancia global
        window.viewModesController = new ViewModesController(config);
    });
}

/* ===== EXPORTACIÓN ===== */

// Exportación por defecto para módulos ES6
export default ViewModesController;

// También disponible como variable global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ViewModesController;
}

// Para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ViewModesController;
}

// Para uso como módulo ES6
if (typeof window !== 'undefined') {
    window.ViewModesController = ViewModesController;
}