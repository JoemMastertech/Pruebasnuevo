var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Logger_isProduction;
class Logger {
    static info(message, data = {}) {
        if (!__classPrivateFieldGet(this, _a, "f", _Logger_isProduction)) {
            console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
        }
    }
    static error(message, error = {}) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
        // En producción, aquí podrías enviar a un servicio de monitoreo
        if (__classPrivateFieldGet(this, _a, "f", _Logger_isProduction) && error.stack) {
            // TODO: Integrar con servicio de monitoreo si es necesario
        }
    }
    static warn(message, data = {}) {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
    }
    static debug(message, data = {}) {
        if (!__classPrivateFieldGet(this, _a, "f", _Logger_isProduction)) {
            console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data);
        }
    }
}
_a = Logger;
_Logger_isProduction = { value: false }; // Cambiar a true en producción
// Expose Logger globally
window.Logger = Logger;
// Also export for ES6 compatibility
export default Logger;
//# sourceMappingURL=logger.js.map