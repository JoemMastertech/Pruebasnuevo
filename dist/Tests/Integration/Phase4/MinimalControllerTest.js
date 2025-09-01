/**
 * Test mínimo de integración para controladores
 * Sin dependencias del navegador
 */
// Importaciones directas sin dependencias del navegador
import { ProductId } from '../../../Domain/ValueObjects/ProductId';
import { ProductName } from '../../../Domain/ValueObjects/ProductName';
import { ProductCategory } from '../../../Domain/ValueObjects/ProductCategory';
import { Money } from '../../../Domain/ValueObjects/Money';
import { Product } from '../../../Domain/Entities/Product';
class MinimalControllerTest {
    async runTests() {
        console.log('🧪 Starting Minimal Controller Integration Tests\n');
        try {
            await this.testValueObjects();
            await this.testProductEntity();
            console.log('\n✅ All minimal tests completed successfully!');
        }
        catch (error) {
            console.error('\n❌ Test suite failed:', error);
            throw error;
        }
    }
    async testValueObjects() {
        console.log('🔍 Testing Value Objects...');
        try {
            // Test ProductId
            const productId = new ProductId('test-product-1');
            console.log('  ✅ ProductId creation - OK:', productId.value);
            // Test ProductName
            const productName = new ProductName('Producto de Prueba');
            console.log('  ✅ ProductName creation - OK:', productName.value);
            // Test ProductCategory
            const category = new ProductCategory('bebidas');
            console.log('  ✅ ProductCategory creation - OK:', category.value);
            // Test Money
            const price = new Money(10.99);
            console.log('  ✅ Money creation - OK:', price.amount);
        }
        catch (error) {
            console.error('  ❌ Value Objects test failed:', error);
            throw error;
        }
    }
    async testProductEntity() {
        console.log('🔍 Testing Product Entity...');
        try {
            // Test Product creation
            const product = new Product(new ProductId('test-product-1'), new ProductName('Producto de Prueba'), new ProductCategory('bebidas'), new Money(10.99), 'Descripción de prueba');
            console.log('  ✅ Product creation - OK');
            console.log('  ✅ Product ID:', product.getId().value);
            console.log('  ✅ Product Name:', product.getName());
            console.log('  ✅ Product Category:', product.getCategory().value);
            console.log('  ✅ Product Price:', product.getPrice());
            // Test Product methods
            const isBeverage = product.isBeverage();
            console.log('  ✅ Product isBeverage():', isBeverage);
            const isLiquor = product.isLiquor();
            console.log('  ✅ Product isLiquor():', isLiquor);
        }
        catch (error) {
            console.error('  ❌ Product Entity test failed:', error);
            throw error;
        }
    }
}
// Ejecutar tests
const tests = new MinimalControllerTest();
tests.runTests()
    .then(() => {
    console.log('\n🎉 Minimal test suite completed successfully!');
    process.exit(0);
})
    .catch((error) => {
    console.error('\n💥 Minimal test suite failed:', error);
    process.exit(1);
});
//# sourceMappingURL=MinimalControllerTest.js.map