"use strict";
/**
 * GetProductsUseCase - Caso de uso para obtener productos
 * Fase 4: UI + CSS Final
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductsUseCase = void 0;
const Result_1 = require("../../Shared/core/Result");
class GetProductsUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute() {
        try {
            const products = await this.productRepository.findAll();
            return Result_1.Result.ok(products);
        }
        catch (error) {
            return Result_1.Result.fail(`Error al obtener productos: ${error}`);
        }
    }
}
exports.GetProductsUseCase = GetProductsUseCase;
