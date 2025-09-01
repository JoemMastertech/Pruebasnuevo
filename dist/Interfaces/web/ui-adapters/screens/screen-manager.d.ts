export default ScreenManager;
declare namespace ScreenManager {
    /**
     * Utility function to create delay promises
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after delay
     */
    function delay(ms: number): Promise<any>;
    /**
     * Transition between screens with fade effect
     * @param {HTMLElement} fromScreen - Screen to hide
     * @param {HTMLElement} toScreen - Screen to show
     * @param {string} logMessage - Message to log
     */
    function transitionScreen(fromScreen: HTMLElement, toScreen: HTMLElement, logMessage: string): Promise<void>;
    /**
     * Validate that all required screen elements exist
     * @returns {Object} Object containing all screen elements or null if missing
     */
    function validateScreenElements(): Object;
    /**
     * Load initial content with error handling
     */
    function loadInitialContent(): Promise<void>;
    /**
     * Show error fallback when content loading fails
     * @param {Error} error - The error that occurred
     */
    function showErrorFallback(error: Error): void;
    /**
     * Start the welcome sequence with optimized async/await pattern
     */
    function startWelcomeSequence(): Promise<void>;
    /**
     * Skip welcome sequence and go directly to main content
     */
    function skipToMainContent(): void;
}
//# sourceMappingURL=screen-manager.d.ts.map