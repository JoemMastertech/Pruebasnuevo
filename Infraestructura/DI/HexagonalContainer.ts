import { CreateOrderUseCase } from '../../Aplicacion/UseCases/CreateOrderUseCase.js';
import { ValidateProductUseCase } from '../../Aplicacion/UseCases/ValidateProductUseCase.js';
import { OrderRepositoryPort } from '../../Domain/Ports/OrderRepositoryPort.js';
import { ProductRepositoryPort } from '../../Domain/Ports/ProductRepositoryPort.js';
import { DrinkRulesPort } from '../../Domain/Ports/DrinkRulesPort.js';
import { InMemoryOrderRepository } from '../adapters/InMemoryOrderRepository.js';
import { ProductDataRepositoryAdapter } from '../adapters/ProductDataRepositoryAdapter.js';
import { DrinkRulesServiceAdapter } from '../adapters/DrinkRulesServiceAdapter.js';

/**
 * Contenedor de inyección de dependencias para la arquitectura hexagonal
 * Gestiona la creación e inyección de todas las dependencias del sistema
 */
export class HexagonalContainer {
  private static instance: HexagonalContainer;
  private dependencies: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  private constructor() {
    this.registerDependencies();
  }

  /**
   * Obtiene la instancia singleton del contenedor
   */
  public static getInstance(): HexagonalContainer {
    if (!HexagonalContainer.instance) {
      HexagonalContainer.instance = new HexagonalContainer();
    }
    return HexagonalContainer.instance;
  }

  /**
   * Registra todas las dependencias del sistema
   */
  private registerDependencies(): void {
    // Registrar adaptadores de infraestructura
    this.registerSingleton('OrderRepositoryPort', () => {
      return new InMemoryOrderRepository();
    });

    this.registerSingleton('ProductRepositoryPort', () => {
      // Obtener el ProductDataAdapter existente del sistema
      const productDataAdapter = this.getExistingProductDataAdapter();
      return new ProductDataRepositoryAdapter(productDataAdapter);
    });

    this.registerSingleton('DrinkRulesPort', () => {
      // Obtener el servicio de validación existente si está disponible
      const validationService = this.getExistingValidationService();
      return new DrinkRulesServiceAdapter(validationService);
    });

    // Registrar casos de uso
    this.registerTransient('CreateOrderUseCase', () => {
      return new CreateOrderUseCase(
        this.resolve('OrderRepositoryPort'),
        this.resolve('ProductRepositoryPort'),
        this.resolve('DrinkRulesPort')
      );
    });

    this.registerTransient('ValidateProductUseCase', () => {
      return new ValidateProductUseCase(
        this.resolve('ProductRepositoryPort'),
        this.resolve('DrinkRulesPort')
      );
    });
  }

  /**
   * Registra una dependencia como singleton
   */
  public registerSingleton<T>(key: string, factory: () => T): void {
    this.dependencies.set(key, { factory, isSingleton: true });
  }

  /**
   * Registra una dependencia como transient (nueva instancia cada vez)
   */
  public registerTransient<T>(key: string, factory: () => T): void {
    this.dependencies.set(key, { factory, isSingleton: false });
  }

  /**
   * Resuelve una dependencia por su clave
   */
  public resolve<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    
    if (!dependency) {
      throw new Error(`Dependency '${key}' not found in container`);
    }

    if (dependency.isSingleton) {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, dependency.factory());
      }
      return this.singletons.get(key);
    }

    return dependency.factory();
  }

  /**
   * Verifica si una dependencia está registrada
   */
  public isRegistered(key: string): boolean {
    return this.dependencies.has(key);
  }

  /**
   * Obtiene todas las claves de dependencias registradas
   */
  public getRegisteredKeys(): string[] {
    return Array.from(this.dependencies.keys());
  }

  /**
   * Limpia todas las instancias singleton (útil para testing)
   */
  public clearSingletons(): void {
    this.singletons.clear();
  }

  /**
   * Reemplaza una dependencia existente (útil para testing)
   */
  public replace<T>(key: string, factory: () => T, isSingleton: boolean = true): void {
    this.dependencies.set(key, { factory, isSingleton });
    if (isSingleton && this.singletons.has(key)) {
      this.singletons.delete(key);
    }
  }

  /**
   * Obtiene el ProductDataAdapter existente del sistema
   */
  private getExistingProductDataAdapter(): any {
    try {
      // Intentar obtener el ProductDataAdapter del sistema existente
      if (typeof window !== 'undefined' && (window as any).ProductDataAdapter) {
        return (window as any).ProductDataAdapter;
      }
      
      // Fallback: crear un adaptador mock si no existe
      console.warn('ProductDataAdapter not found, creating mock adapter');
      return this.createMockProductDataAdapter();
    } catch (error) {
      console.error('Error getting ProductDataAdapter:', error);
      return this.createMockProductDataAdapter();
    }
  }

  /**
   * Obtiene el servicio de validación existente del sistema
   */
  private getExistingValidationService(): any {
    try {
      // Intentar obtener el servicio de validación del sistema existente
      if (typeof window !== 'undefined' && (window as any).OrderSystemValidations) {
        return (window as any).OrderSystemValidations;
      }
      
      return null; // El DrinkRulesServiceAdapter puede funcionar sin este servicio
    } catch (error) {
      console.error('Error getting validation service:', error);
      return null;
    }
  }

  /**
   * Crea un adaptador mock para desarrollo/testing
   */
  private createMockProductDataAdapter(): any {
    return {
      getProductByName: async (name: string) => {
        // Mock data para desarrollo
        const mockProducts = [
          { nombre: 'Cerveza', categoria: 'bebidas', precio: 25, ingredientes: 'Malta, lúpulo' },
          { nombre: 'Hamburguesa', categoria: 'comida', precio: 85, ingredientes: 'Carne, pan, lechuga' },
          { nombre: 'Tequila', categoria: 'licores', precio: 45, ingredientes: 'Agave' }
        ];
        
        return mockProducts.find(p => p.nombre.toLowerCase() === name.toLowerCase()) || null;
      },
      
      getProductsByCategory: async (category: string) => {
        const mockProducts = [
          { nombre: 'Cerveza', categoria: 'bebidas', precio: 25, ingredientes: 'Malta, lúpulo' },
          { nombre: 'Hamburguesa', categoria: 'comida', precio: 85, ingredientes: 'Carne, pan, lechuga' },
          { nombre: 'Tequila', categoria: 'licores', precio: 45, ingredientes: 'Agave' }
        ];
        
        return mockProducts.filter(p => p.categoria === category);
      },
      
      getAllProducts: async () => {
        return [
          { nombre: 'Cerveza', categoria: 'bebidas', precio: 25, ingredientes: 'Malta, lúpulo' },
          { nombre: 'Hamburguesa', categoria: 'comida', precio: 85, ingredientes: 'Carne, pan, lechuga' },
          { nombre: 'Tequila', categoria: 'licores', precio: 45, ingredientes: 'Agave' }
        ];
      },
      
      searchProducts: async (query: string) => {
        const mockProducts = [
          { nombre: 'Cerveza', categoria: 'bebidas', precio: 25, ingredientes: 'Malta, lúpulo' },
          { nombre: 'Hamburguesa', categoria: 'comida', precio: 85, ingredientes: 'Carne, pan, lechuga' },
          { nombre: 'Tequila', categoria: 'licores', precio: 45, ingredientes: 'Agave' }
        ];
        
        return mockProducts.filter(p => 
          p.nombre.toLowerCase().includes(query.toLowerCase()) ||
          p.ingredientes.toLowerCase().includes(query.toLowerCase())
        );
      }
    };
  }

  /**
   * Inicializa el contenedor y expone los casos de uso globalmente
   */
  public static initialize(): HexagonalContainer {
    const container = HexagonalContainer.getInstance();
    
    // Exponer casos de uso globalmente para compatibilidad con el sistema existente
    if (typeof window !== 'undefined') {
      (window as any).HexagonalContainer = container;
      (window as any).CreateOrderUseCase = container.resolve('CreateOrderUseCase');
      (window as any).ValidateProductUseCase = container.resolve('ValidateProductUseCase');
    }
    
    return container;
  }

  /**
   * Método de utilidad para obtener casos de uso específicos
   */
  public getCreateOrderUseCase(): CreateOrderUseCase {
    return this.resolve('CreateOrderUseCase');
  }

  public getValidateProductUseCase(): ValidateProductUseCase {
    return this.resolve('ValidateProductUseCase');
  }

  public getOrderRepository(): OrderRepositoryPort {
    return this.resolve('OrderRepositoryPort');
  }

  public getProductRepository(): ProductRepositoryPort {
    return this.resolve('ProductRepositoryPort');
  }

  public getDrinkRulesService(): DrinkRulesPort {
    return this.resolve('DrinkRulesPort');
  }
}

// Inicializar el contenedor automáticamente
if (typeof window !== 'undefined') {
  HexagonalContainer.initialize();
}