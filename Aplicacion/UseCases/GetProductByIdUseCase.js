"use strict";
/**
 * GetProductByIdUseCase - Caso de uso para obtener un producto por ID
 * Fase 4: UI + CSS Final
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductByIdUseCase = void 0;
const Result_1 = require("../../Shared/core/Result");
class GetProductByIdUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(productId) {
        try {
            const product = await this.productRepository.findById(productId);
            if (!product) {
                return Result_1.Result.fail(`Producto con ID ${productId.getValue()} no encontrado`);
            }
            return Result_1.Result.ok(product);
        }
        catch (error) {
            return Result_1.Result.fail(`Error al obtener producto: ${error}`);
        }
    }
}
exports.GetProductByIdUseCase = GetProductByIdUseCase;
