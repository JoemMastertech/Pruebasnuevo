export default ReservationInterface;
/**
 * Reservation Interface - Interface for reservation system integration
 * Prepared for future integration with reservation management systems
 * Part of Phase 3 - Infrastructure preparation for scalability
 */
declare class ReservationInterface {
    isConnected: boolean;
    provider: any;
    /**
     * Initialize reservation system connection
     * @param {Object} config - Reservation system configuration
     * @returns {Promise<boolean>} Connection status
     */
    connect(config: Object): Promise<boolean>;
    /**
     * Create a new reservation
     * @param {Object} reservationData - Reservation details
     * @returns {Promise<Object>} Created reservation
     */
    createReservation(reservationData: Object): Promise<Object>;
    /**
     * Get reservation by ID
     * @param {string} reservationId - Reservation identifier
     * @returns {Promise<Object>} Reservation details
     */
    getReservation(reservationId: string): Promise<Object>;
    /**
     * Update existing reservation
     * @param {string} reservationId - Reservation identifier
     * @param {Object} updateData - Updated reservation data
     * @returns {Promise<Object>} Updated reservation
     */
    updateReservation(reservationId: string, updateData: Object): Promise<Object>;
    /**
     * Cancel reservation
     * @param {string} reservationId - Reservation identifier
     * @returns {Promise<boolean>} Cancellation status
     */
    cancelReservation(reservationId: string): Promise<boolean>;
    /**
     * Get available time slots
     * @param {Date} date - Target date
     * @param {number} partySize - Number of guests
     * @returns {Promise<Array>} Available time slots
     */
    getAvailableSlots(date: Date, partySize: number): Promise<any[]>;
}
//# sourceMappingURL=ReservationInterface.d.ts.map