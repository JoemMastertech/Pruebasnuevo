/**
 * GetProductByIdUseCase - Caso de uso para obtener un producto por ID
 * Fase 4: UI + CSS Final
 */

import { Product } from '../../Domain/Entities/Product';
import { ProductId } from '../../Domain/ValueObjects/ProductId';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort';
import { Result } from '../../Shared/core/Result';

export class GetProductByIdUseCase {
  constructor(
    private productRepository: ProductRepositoryPort
  ) {}

  async execute(productId: ProductId): Promise<Result<Product>> {
    try {
      const product = await this.productRepository.findById(productId);
      
      if (!product) {
        return Result.fail(`Producto con ID ${productId.getValue()} no encontrado`);
      }
      
      return Result.ok(product);
    } catch (error) {
      return Result.fail(`Error al obtener producto: ${error}`);
    }
  }
}