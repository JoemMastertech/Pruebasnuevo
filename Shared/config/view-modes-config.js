/* =====================================================================
   CONFIGURACIÓN DEL SISTEMA UNIFICADO
   Variables de configuración para ViewModesController
   ===================================================================== */

// Configuración global para ViewModesController
window.VIEW_MODES_CONFIG = {
    containerSelector: '.view-container',
    toggleButtonSelector: '.view-toggle-btn',
    defaultMode: 'grid',
    enableTransitions: true,
    enableLocalStorage: true,
    enableDebugMode: false,
    transitionDuration: 400,
    autoSwitchMobile: true,
    
    callbacks: {
        onModeChange: (data) => {
            console.log('🔄 Modo cambiado:', data);
            // Aquí puedes agregar lógica personalizada
        },
        onTransitionStart: (data) => {
            console.log('⏳ Iniciando transición:', data);
        },
        onTransitionEnd: (data) => {
            console.log('✅ Transición completada:', data);
        },
        onError: (data) => {
            console.error('❌ Error en ViewModes:', data);
        }
    }
};
