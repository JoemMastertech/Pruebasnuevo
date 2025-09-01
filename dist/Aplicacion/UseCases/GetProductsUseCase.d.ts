/**
 * GetProductsUseCase - Caso de uso para obtener productos
 * Fase 4: UI + CSS Final
 */
import { Product } from '../../Domain/Entities/Product';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort';
import { Result } from '../../Shared/core/Result';
export declare class GetProductsUseCase {
    private productRepository;
    constructor(productRepository: ProductRepositoryPort);
    execute(): Promise<Result<Product[]>>;
}
//# sourceMappingURL=GetProductsUseCase.d.ts.map