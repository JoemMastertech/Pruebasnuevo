export default BillingInterface;
/**
 * Billing Interface - Interface for billing system integration
 * Prepared for future integration with payment gateways
 * Part of Phase 3 - Infrastructure preparation for scalability
 */
declare class BillingInterface {
    isConnected: boolean;
    provider: any;
    /**
     * Initialize billing connection
     * @param {Object} config - Billing configuration
     * @returns {Promise<boolean>} Connection status
     */
    connect(config: Object): Promise<boolean>;
    /**
     * Process payment
     * @param {Object} paymentData - Payment information
     * @returns {Promise<Object>} Payment result
     */
    processPayment(paymentData: Object): Promise<Object>;
    /**
     * Get payment status
     * @param {string} transactionId - Transaction identifier
     * @returns {Promise<Object>} Payment status
     */
    getPaymentStatus(transactionId: string): Promise<Object>;
    /**
     * Refund payment
     * @param {string} transactionId - Transaction identifier
     * @param {number} amount - Refund amount
     * @returns {Promise<Object>} Refund result
     */
    refundPayment(transactionId: string, amount: number): Promise<Object>;
}
//# sourceMappingURL=BillingInterface.d.ts.map