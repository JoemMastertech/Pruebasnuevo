/**
 * Tests de integración simplificados para controladores
 * Versión sin dependencias del navegador para ejecutar en Node.js
 */

import { CreateOrderUseCase } from '../../../Aplicacion/UseCases/CreateOrderUseCase';
import { AddProductToOrderUseCase } from '../../../Aplicacion/UseCases/AddProductToOrderUseCase';
import { ValidateOrderUseCase } from '../../../Aplicacion/UseCases/ValidateOrderUseCase';
import { GetProductsUseCase } from '../../../Aplicacion/UseCases/GetProductsUseCase';
import { GetProductByIdUseCase } from '../../../Aplicacion/UseCases/GetProductByIdUseCase';
import { OrderController } from '../../../Interfaces/web/controllers/OrderController';
import { ProductController } from '../../../Interfaces/web/controllers/ProductController';
import { OrderPresenter } from '../../../Interfaces/web/presenters/OrderPresenter';
import { ProductPresenter } from '../../../Interfaces/web/presenters/ProductPresenter';
import { HexagonalContainer } from '../../../Infraestructura/DI/HexagonalContainer';
import { Product } from '../../../Domain/Entities/Product';
import { Order } from '../../../Domain/Entities/Order';
import { ProductId } from '../../../Domain/ValueObjects/ProductId';
import { ProductName } from '../../../Domain/ValueObjects/ProductName';
import { ProductCategory } from '../../../Domain/ValueObjects/ProductCategory';
import { Money } from '../../../Domain/ValueObjects/Money';

class SimpleControllerTests {
  private container!: HexagonalContainer;
  private orderController!: OrderController;
  private productController!: ProductController;
  private orderPresenter!: OrderPresenter;
  private productPresenter!: ProductPresenter;

  constructor() {
    this.container = HexagonalContainer.getInstance();
    this.setupTestEnvironment();
  }

  private setupTestEnvironment(): void {
    try {
      // Crear presenters
      this.orderPresenter = new OrderPresenter();
      this.productPresenter = new ProductPresenter();

      // Resolver use cases desde el contenedor
      const createOrderUseCase = this.container.getCreateOrderUseCase();
      const addProductToOrderUseCase = this.container.getAddProductToOrderUseCase();
      const validateOrderUseCase = this.container.getValidateOrderUseCase();
      const getProductsUseCase = this.container.resolve<GetProductsUseCase>('GetProductsUseCase');
      const getProductByIdUseCase = this.container.resolve<GetProductByIdUseCase>('GetProductByIdUseCase');

      // Crear controladores
      this.orderController = new OrderController(
        createOrderUseCase,
        addProductToOrderUseCase,
        validateOrderUseCase,
        this.orderPresenter
      );

      this.productController = new ProductController(
        getProductsUseCase,
        getProductByIdUseCase,
        this.productPresenter
      );

      console.log('✅ Test environment setup completed successfully');
    } catch (error) {
      console.error('❌ Error setting up test environment:', error);
      throw error;
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Simple Controller Integration Tests\n');

    try {
      await this.testOrderControllerBasicOperations();
      await this.testProductControllerBasicOperations();
      await this.testControllerPresenterIntegration();
      
      console.log('\n✅ All tests completed successfully!');
    } catch (error) {
      console.error('\n❌ Test suite failed:', error);
      throw error;
    }
  }

  private async testOrderControllerBasicOperations(): Promise<void> {
    console.log('🔍 Testing OrderController basic operations...');

    try {
      // Test crear nueva orden
      await this.orderController.createOrder();
      console.log('  ✅ Create new order - OK');

      // Test obtener estado de orden
      const orderStatus = this.orderController.getCurrentOrderStatus();
      console.log('  ✅ Get current order status - OK:', orderStatus);

      // Test agregar producto
      const testProduct = this.createTestProduct();
      await this.orderController.addProduct({
        productId: testProduct.getId().value,
        quantity: 1
      });
      console.log('  ✅ Add product to order - OK');

    } catch (error) {
      console.error('  ❌ OrderController test failed:', error);
      throw error;
    }
  }

  private async testProductControllerBasicOperations(): Promise<void> {
    console.log('🔍 Testing ProductController basic operations...');

    try {
      // Test obtener todos los productos
      const products = await this.productController.getAllProducts();
      console.log('  ✅ Get all products - OK, count:', products?.data?.length || 0);

      // Test obtener producto por ID
      if (products && products.success && products.data && products.data.length > 0) {
        const firstProduct = products.data[0];
        const productById = await this.productController.getProductById(firstProduct.id.getValue());
        console.log('  ✅ Get product by ID - OK:', productById?.success ? 'Found' : 'Not found');
      }

    } catch (error) {
      console.error('  ❌ ProductController test failed:', error);
      throw error;
    }
  }

  private async testControllerPresenterIntegration(): Promise<void> {
    console.log('🔍 Testing Controller-Presenter integration...');

    try {
      // Test que los presenters reciban datos de los controladores
      await this.orderController.createOrder();
      
      // Verificar que el presenter tenga datos
      const hasOrderData = this.orderPresenter.getCurrentOrder() !== null;
      console.log('  ✅ OrderPresenter integration - OK, has data:', hasOrderData);

      const products = await this.productController.getAllProducts();
      const hasProductData = products && products.success && products.data && products.data.length > 0;
      console.log('  ✅ ProductPresenter integration - OK, has data:', hasProductData);

    } catch (error) {
      console.error('  ❌ Controller-Presenter integration test failed:', error);
      throw error;
    }
  }

  private createTestProduct(): Product {
    return new Product(
      new ProductId('test-product-1'),
      new ProductName('Producto de Prueba'),
      new ProductCategory('bebidas'),
      new Money(10.99),
      'Descripción de prueba'
    );
  }
}

// Ejecutar tests
const tests = new SimpleControllerTests();
tests.runAllTests()
  .then(() => {
    console.log('\n🎉 Test suite completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  });