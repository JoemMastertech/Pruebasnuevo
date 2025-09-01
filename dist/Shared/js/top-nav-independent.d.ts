export = IndependentTopNavManager;
/**
 * BARRA SUPERIOR INDEPENDIENTE - SISTEMA SIMPLIFICADO
 * Sistema de navegación superior completamente independiente sin sincronización
 * Versión 2.0 - Sin MutationObserver, sin funciones sync, lógica propia
 */
declare class IndependentTopNavManager {
    isInitialized: boolean;
    state: {
        viewMode: string;
        menuOpen: boolean;
        currentCategory: null;
        isInLiquorSubcategory: boolean;
    };
    elements: {
        topNav: null;
        hamburgerBtn: null;
        backBtn: null;
        viewToggleBtn: null;
        navTitle: null;
        drawerMenu: null;
        drawerOverlay: null;
    };
    init(): void;
    setup(): void;
    syncInitialMenuState(): void;
    findElements(): void;
    loadState(): void;
    saveState(): void;
    setupEventListeners(): void;
    setupContentReadyListener(): void;
    toggleMenu(): void;
    closeMenu(): void;
    toggleViewMode(): void;
    updateUI(): void;
    updateMenuUI(): void;
    updateViewToggleUI(): void;
    showTopNav(): void;
    handleBackClick(): void;
    showBackButton(): void;
    hideBackButton(): void;
    setLiquorSubcategoryState(isInSubcategory: any, subcategoryName?: null): void;
    updateTitle(title: any): void;
    setViewMode(mode: any): void;
    getViewMode(): string;
    refresh(): void;
    forceSync(): void;
}
//# sourceMappingURL=top-nav-independent.d.ts.map