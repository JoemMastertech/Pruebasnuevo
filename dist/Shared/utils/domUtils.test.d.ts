export default DomUtilsTests;
/**
 * Test suite for domUtils functionality
 */
declare class DomUtilsTests {
    /**
     * Setup mock DOM environment for testing
     */
    setupMockDOM(): void;
    /**
     * Test auto-enhancement of modals
     */
    testAutoEnhancement(): void;
    /**
     * Test that already enhanced modals are preserved
     */
    testPreserveEnhanced(): void;
    /**
     * Test hideModal functionality
     */
    testHideModal(): void;
    /**
     * Test error handling for non-existent modals
     */
    testNonExistentModal(): void;
    /**
     * Test setSafeInnerHTML functionality
     */
    testSetSafeInnerHTML(): void;
    /**
     * Test modal cache functionality
     */
    testModalCache(): void;
    /**
     * Test cache performance (modals should not be re-enhanced)
     */
    testCachePerformance(): void;
    /**
     * Run all tests
     */
    runAllTests(): void;
}
//# sourceMappingURL=domUtils.test.d.ts.map