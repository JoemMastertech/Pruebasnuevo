/**
 * Result - Clase para manejo de resultados con éxito/error
 * Patrón Result para manejo funcional de errores
 */
export class Result {
    constructor(_isSuccess, _value, _error) {
        this._isSuccess = _isSuccess;
        this._value = _value;
        this._error = _error;
    }
    static ok(value) {
        return new Result(true, value);
    }
    static fail(error) {
        return new Result(false, undefined, error);
    }
    isSuccess() {
        return this._isSuccess;
    }
    isFailure() {
        return !this._isSuccess;
    }
    getValue() {
        if (!this._isSuccess) {
            throw new Error('Cannot get value from failed result');
        }
        return this._value;
    }
    getError() {
        if (this._isSuccess) {
            throw new Error('Cannot get error from successful result');
        }
        return this._error;
    }
}
//# sourceMappingURL=Result.js.map