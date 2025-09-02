/**
 * GetProductsUseCase - Caso de uso para obtener productos
 * Fase 4: UI + CSS Final
 */

import { Product } from '../../Domain/Entities/Product';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort';
import { Result } from '../../Shared/core/Result';

export class GetProductsUseCase {
  constructor(
    private productRepository: ProductRepositoryPort
  ) {}

  async execute(): Promise<Result<Product[]>> {
    try {
      const products = await this.productRepository.findAll();
      return Result.ok(products);
    } catch (error) {
      return Result.fail(`Error al obtener productos: ${error}`);
    }
  }
}