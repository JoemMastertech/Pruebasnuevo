/**
 * GetProductByIdUseCase - Caso de uso para obtener un producto por ID
 * Fase 4: UI + CSS Final
 */
import { Product } from '../../Domain/Entities/Product';
import { ProductId } from '../../Domain/ValueObjects/ProductId';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort';
import { Result } from '../../Shared/core/Result';
export declare class GetProductByIdUseCase {
    private productRepository;
    constructor(productRepository: ProductRepositoryPort);
    execute(productId: ProductId): Promise<Result<Product>>;
}
//# sourceMappingURL=GetProductByIdUseCase.d.ts.map