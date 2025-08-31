export default ErrorHandler;
export function logError(message: any, error?: null, context?: {}): void;
export function logWarning(message: any, context?: {}): void;
export function handleValidationError(field: any, value: any, rule: any): void;
export function handleMissingElementError(error: any, context?: string, options?: {}): any;
export function showUserError(message: any, elementId?: null): void;
export function clearUserError(elementId: any): void;
export function handleXSSError(context: any, suspiciousData: any): void;
export class ErrorHandler {
    static handle(error: any, context?: string, options?: {}): any;
    static "__#3@#getUserFriendlyMessage"(error: any): any;
    static handleValidation(error: any, context?: string): any;
    static handleDomain(error: any, context?: string): any;
    static logWarning(message: any, context?: {}): void;
    static handleValidationError(field: any, value: any, rule: any): void;
    static showUserError(message: any, elementId?: null): void;
    static clearUserError(elementId: any): void;
    static handleXSSError(context: any, suspiciousData: any): void;
    static handleAsync(promise: any, context?: string): Promise<any[]>;
}
//# sourceMappingURL=errorHandler.d.ts.map