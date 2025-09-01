/**
 * ProductController - Controlador de productos siguiendo arquitectura hexagonal
 * Fase 4: UI + CSS Final
 * 
 * Responsabilidades:
 * - Coordinar casos de uso de productos
 * - Manejar filtrado y búsqueda
 * - Delegar presentación al presenter
 */

import { GetProductsUseCase } from '../../../Aplicacion/UseCases/GetProductsUseCase';
import { GetProductByIdUseCase } from '../../../Aplicacion/UseCases/GetProductByIdUseCase';
import { ProductPresenter } from '../presenters/ProductPresenter';
import { ProductId } from '../../../Domain/ValueObjects/ProductId';
import { ProductCategory } from '../../../Domain/ValueObjects/ProductCategory';

export interface ProductFilterCommand {
  category?: string;
  searchTerm?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface ProductControllerResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class ProductController {
  constructor(
    private getProductsUseCase: GetProductsUseCase,
    private getProductByIdUseCase: GetProductByIdUseCase,
    private presenter: ProductPresenter
  ) {}

  /**
   * Obtener todos los productos
   */
  async getAllProducts(): Promise<ProductControllerResult> {
    try {
      console.log('[ProductController] Obteniendo todos los productos');
      
      const result = await this.getProductsUseCase.execute();
      
      if (result.isSuccess()) {
        const products = result.getValue();
        console.log(`[ProductController] ${products.length} productos obtenidos`);
        
        this.presenter.presentProductList(products);
        
        return {
          success: true,
          data: { 
            products: products.map(p => ({
              id: p.getId().getValue(),
              name: p.getName(),
              category: p.getCategory().value,
              price: p.getPrice(),
              description: p.getDescription()
            }))
          }
        };
      } else {
        const error = result.getError();
        console.error('[ProductController] Error obteniendo productos:', error);
        
        this.presenter.presentError(error);
        
        return {
          success: false,
          error: error
        };
      }
    } catch (error) {
      console.error('[ProductController] Excepción obteniendo productos:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.presenter.presentError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Obtener producto por ID
   */
  async getProductById(productId: string): Promise<ProductControllerResult> {
    try {
      console.log('[ProductController] Obteniendo producto por ID:', productId);
      
      const id = new ProductId(productId);
      const result = await this.getProductByIdUseCase.execute(id);
      
      if (result.isSuccess()) {
        const product = result.getValue();
        console.log('[ProductController] Producto obtenido:', product.getName());
        
        this.presenter.presentProductDetail(product);
        
        return {
          success: true,
          data: {
            id: product.getId().getValue(),
            name: product.getName(),
            category: product.getCategory().value,
            price: product.getPrice(),
            description: product.getDescription(),
            drinkOptions: product.getDrinkOptions()
          }
        };
      } else {
        const error = result.getError();
        console.error('[ProductController] Error obteniendo producto:', error);
        
        this.presenter.presentError(error);
        
        return {
          success: false,
          error: error
        };
      }
    } catch (error) {
      console.error('[ProductController] Excepción obteniendo producto:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.presenter.presentError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Filtrar productos por categoría
   */
  async getProductsByCategory(categoryName: string): Promise<ProductControllerResult> {
    try {
      console.log('[ProductController] Filtrando por categoría:', categoryName);
      
      const result = await this.getProductsUseCase.execute();
      
      if (result.isSuccess()) {
        const allProducts = result.getValue();
        const category = new ProductCategory(categoryName);
        
        const filteredProducts = allProducts.filter(product => 
          product.getCategory().value === category.value
        );
        
        console.log(`[ProductController] ${filteredProducts.length} productos en categoría ${categoryName}`);
        
        this.presenter.presentProductList(filteredProducts, { category: categoryName });
        
        return {
          success: true,
          data: {
            category: categoryName,
            products: filteredProducts.map(p => ({
              id: p.getId().getValue(),
              name: p.getName(),
              category: p.getCategory().value,
              price: p.getPrice(),
              description: p.getDescription()
            }))
          }
        };
      } else {
        const error = result.getError();
        console.error('[ProductController] Error filtrando productos:', error);
        
        this.presenter.presentError(error);
        
        return {
          success: false,
          error: error
        };
      }
    } catch (error) {
      console.error('[ProductController] Excepción filtrando productos:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.presenter.presentError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Buscar productos por término
   */
  async searchProducts(searchTerm: string): Promise<ProductControllerResult> {
    try {
      console.log('[ProductController] Buscando productos:', searchTerm);
      
      const result = await this.getProductsUseCase.execute();
      
      if (result.isSuccess()) {
        const allProducts = result.getValue();
        
        const searchResults = allProducts.filter(product => 
          product.getName().toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.getDescription().toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        console.log(`[ProductController] ${searchResults.length} productos encontrados para "${searchTerm}"`);
        
        this.presenter.presentProductList(searchResults, { searchTerm });
        
        return {
          success: true,
          data: {
            searchTerm,
            products: searchResults.map(p => ({
              id: p.getId().getValue(),
              name: p.getName(),
              category: p.getCategory().value,
              price: p.getPrice(),
              description: p.getDescription()
            }))
          }
        };
      } else {
        const error = result.getError();
        console.error('[ProductController] Error buscando productos:', error);
        
        this.presenter.presentError(error);
        
        return {
          success: false,
          error: error
        };
      }
    } catch (error) {
      console.error('[ProductController] Excepción buscando productos:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.presenter.presentError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Aplicar filtros complejos
   */
  async filterProducts(filter: ProductFilterCommand): Promise<ProductControllerResult> {
    try {
      console.log('[ProductController] Aplicando filtros:', filter);
      
      const result = await this.getProductsUseCase.execute();
      
      if (result.isSuccess()) {
        let filteredProducts = result.getValue();
        
        // Filtrar por categoría
        if (filter.category) {
          const category = new ProductCategory(filter.category);
          filteredProducts = filteredProducts.filter(product => 
            product.getCategory().value === category.value
          );
        }
        
        // Filtrar por término de búsqueda
        if (filter.searchTerm) {
          filteredProducts = filteredProducts.filter(product => 
            product.getName().toLowerCase().includes(filter.searchTerm!.toLowerCase()) ||
            product.getDescription().toLowerCase().includes(filter.searchTerm!.toLowerCase())
          );
        }
        
        // Filtrar por rango de precio
        if (filter.priceRange) {
          filteredProducts = filteredProducts.filter(product => {
            const price = product.getPrice();
            return price >= filter.priceRange!.min && price <= filter.priceRange!.max;
          });
        }
        
        console.log(`[ProductController] ${filteredProducts.length} productos después de filtros`);
        
        this.presenter.presentProductList(filteredProducts, filter);
        
        return {
          success: true,
          data: {
            filters: filter,
            products: filteredProducts.map(p => ({
              id: p.getId().getValue(),
              name: p.getName(),
              category: p.getCategory().value,
              price: p.getPrice(),
              description: p.getDescription()
            }))
          }
        };
      } else {
        const error = result.getError();
        console.error('[ProductController] Error aplicando filtros:', error);
        
        this.presenter.presentError(error);
        
        return {
          success: false,
          error: error
        };
      }
    } catch (error) {
      console.error('[ProductController] Excepción aplicando filtros:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.presenter.presentError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Obtener categorías disponibles
   */
  async getAvailableCategories(): Promise<ProductControllerResult> {
    try {
      console.log('[ProductController] Obteniendo categorías disponibles');
      
      const result = await this.getProductsUseCase.execute();
      
      if (result.isSuccess()) {
        const products = result.getValue();
        
        const categories = [...new Set(products.map(p => p.getCategory().value))];
        
        console.log(`[ProductController] ${categories.length} categorías encontradas:`, categories);
        
        this.presenter.presentCategories(categories);
        
        return {
          success: true,
          data: { categories }
        };
      } else {
        const error = result.getError();
        console.error('[ProductController] Error obteniendo categorías:', error);
        
        this.presenter.presentError(error);
        
        return {
          success: false,
          error: error
        };
      }
    } catch (error) {
      console.error('[ProductController] Excepción obteniendo categorías:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.presenter.presentError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}