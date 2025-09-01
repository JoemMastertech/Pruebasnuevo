/**
 * Result - Clase para manejo de resultados con éxito/error
 * Patrón Result para manejo funcional de errores
 */
export declare class Result<T> {
    private readonly _isSuccess;
    private readonly _value?;
    private readonly _error?;
    private constructor();
    static ok<U>(value: U): Result<U>;
    static fail<U>(error: string): Result<U>;
    isSuccess(): boolean;
    isFailure(): boolean;
    getValue(): T;
    getError(): string;
}
//# sourceMappingURL=Result.d.ts.map