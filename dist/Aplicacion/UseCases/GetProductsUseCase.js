/**
 * GetProductsUseCase - Caso de uso para obtener productos
 * Fase 4: UI + CSS Final
 */
import { Result } from '../../Shared/core/Result';
export class GetProductsUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute() {
        try {
            const products = await this.productRepository.findAll();
            return Result.ok(products);
        }
        catch (error) {
            return Result.fail(`Error al obtener productos: ${error}`);
        }
    }
}
//# sourceMappingURL=GetProductsUseCase.js.map