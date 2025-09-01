/**
 * GetProductByIdUseCase - Caso de uso para obtener un producto por ID
 * Fase 4: UI + CSS Final
 */
import { Result } from '../../Shared/core/Result';
export class GetProductByIdUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(productId) {
        try {
            const product = await this.productRepository.findById(productId);
            if (!product) {
                return Result.fail(`Producto con ID ${productId.getValue()} no encontrado`);
            }
            return Result.ok(product);
        }
        catch (error) {
            return Result.fail(`Error al obtener producto: ${error}`);
        }
    }
}
//# sourceMappingURL=GetProductByIdUseCase.js.map