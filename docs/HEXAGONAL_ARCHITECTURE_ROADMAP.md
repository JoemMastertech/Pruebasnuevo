# Roadmap: Implementación de Arquitectura Hexagonal Estricta

## Resumen Ejecutivo

Este roadmap define la estrategia para migrar el sistema actual a una **Arquitectura Hexagonal estricta**, resolviendo los acoplamientos identificados en el análisis arquitectónico y estableciendo una base sólida para el crecimiento futuro.

## Fase 0: Preparación y Estabilización

### 0.1 Backup y Punto de Restauración
- [ ] **Crear backup completo** del estado actual funcional
- [ ] **Documentar comportamiento actual** con tests de regresión
- [ ] **Validar funcionalidad** del botón "Crear orden" sin errores
- [ ] **Crear branch de respaldo** en control de versiones

### 0.2 Fixes Críticos Inmediatos
- [ ] **Coordinar inicialización DI Container**
  - Implementar orden explícito: AppInit → OrderSystem
  - Usar Promises para garantizar secuencia
- [ ] **Activar waitForDIContainer**
  - Descomentar función de espera
  - Implementar timeout y error handling
- [ ] **Error boundaries robustos**
  - Manejo centralizado de errores de inicialización
  - Fallbacks para componentes críticos

**Duración**: 1-2 días
**Criterio de Éxito**: Sistema funciona sin errores de "DI Container not initialized"

## Fase 1: Definición de Capas Hexagonales

### 1.1 Estructura de Directorios
```
src/
├── Domain/                    # Núcleo de negocio
│   ├── Entities/
│   ├── ValueObjects/
│   ├── Services/
│   └── Repositories/          # Interfaces
├── Application/               # Casos de uso
│   ├── UseCases/
│   ├── Services/
│   └── Ports/                 # Interfaces para adaptadores
├── Infrastructure/            # Adaptadores secundarios
│   ├── Persistence/
│   ├── ExternalServices/
│   └── Configuration/
└── Interfaces/                # Adaptadores primarios
    ├── Web/
    ├── CLI/
    └── API/
```

### 1.2 Definición de Puertos (Interfaces)

#### A. Puertos Primarios (Driving)
```typescript
// Application/Ports/OrderManagementPort.ts
interface OrderManagementPort {
  createOrder(): Promise<OrderResult>;
  addProductToOrder(productId: string, options: ProductOptions): Promise<void>;
  validateOrderRules(order: Order): ValidationResult;
  completeOrder(order: Order): Promise<OrderCompletionResult>;
}
```

#### B. Puertos Secundarios (Driven)
```typescript
// Application/Ports/ProductRepositoryPort.ts
interface ProductRepositoryPort {
  findById(id: string): Promise<Product>;
  findByCategory(category: string): Promise<Product[]>;
  findAll(): Promise<Product[]>;
}

// Application/Ports/OrderPersistencePort.ts
interface OrderPersistencePort {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order>;
  findActiveOrders(): Promise<Order[]>;
}
```

### 1.3 Entidades de Dominio

#### A. Product Entity
```typescript
// Domain/Entities/Product.ts
class Product {
  constructor(
    private id: ProductId,
    private name: ProductName,
    private category: ProductCategory,
    private prices: ProductPrices,
    private drinkOptions: DrinkOptions
  ) {}

  // Métodos de negocio puros
  canHaveDrinkOptions(): boolean;
  validatePriceSelection(priceType: PriceType): boolean;
  getAvailableDrinkOptions(): DrinkOption[];
}
```

#### B. Order Entity
```typescript
// Domain/Entities/Order.ts
class Order {
  constructor(
    private id: OrderId,
    private items: OrderItem[],
    private status: OrderStatus
  ) {}

  addItem(product: Product, options: ProductOptions): void;
  removeItem(itemId: string): void;
  calculateTotal(): Money;
  validateBusinessRules(): ValidationResult;
  complete(): void;
}
```

**Duración**: 3-4 días
**Criterio de Éxito**: Interfaces y entidades definidas, estructura de directorios creada

## Fase 2: Migración del Dominio

### 2.1 Extracción de Lógica de Negocio

#### A. Migrar Validaciones de OrderSystem
- [ ] **Extraer reglas de bebidas especiales**
  - De `order-system-validations.js` → `Domain/Services/DrinkRulesService.ts`
  - Implementar como servicios de dominio puros
- [ ] **Migrar constantes de negocio**
  - De `CONSTANTS` → `Domain/ValueObjects/BusinessRules.ts`
  - Convertir en value objects inmutables
- [ ] **Extraer cálculos de negocio**
  - De métodos UI → `Domain/Services/OrderCalculationService.ts`

#### B. Servicios de Dominio
```typescript
// Domain/Services/DrinkRulesService.ts
class DrinkRulesService {
  validateSpecialBottleRules(
    product: Product,
    currentSelection: DrinkSelection
  ): ValidationResult {
    // Lógica pura extraída de order-system-validations.js
  }

  canAddDrink(
    product: Product,
    drinkType: DrinkType,
    currentCount: number
  ): boolean {
    // Reglas de negocio centralizadas
  }
}
```

### 2.2 Value Objects
```typescript
// Domain/ValueObjects/ProductId.ts
class ProductId {
  constructor(private value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ProductId cannot be empty');
    }
  }
  
  getValue(): string { return this.value; }
  equals(other: ProductId): boolean { return this.value === other.value; }
}

// Domain/ValueObjects/Money.ts
class Money {
  constructor(
    private amount: number,
    private currency: Currency = Currency.MXN
  ) {
    if (amount < 0) throw new Error('Money amount cannot be negative');
  }
  
  add(other: Money): Money;
  multiply(factor: number): Money;
  format(): string;
}
```

**Duración**: 5-6 días
**Criterio de Éxito**: Lógica de negocio extraída y funcionando en capa de dominio

## Fase 3: Casos de Uso (Application Layer)

### 3.1 Casos de Uso Principales

#### A. CreateOrderUseCase
```typescript
// Application/UseCases/CreateOrderUseCase.ts
class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderPersistencePort,
    private productRepository: ProductRepositoryPort,
    private drinkRulesService: DrinkRulesService
  ) {}

  async execute(): Promise<CreateOrderResult> {
    const order = new Order(OrderId.generate());
    await this.orderRepository.save(order);
    return CreateOrderResult.success(order.getId());
  }
}
```

#### B. AddProductToOrderUseCase
```typescript
// Application/UseCases/AddProductToOrderUseCase.ts
class AddProductToOrderUseCase {
  async execute(command: AddProductCommand): Promise<AddProductResult> {
    const order = await this.orderRepository.findById(command.orderId);
    const product = await this.productRepository.findById(command.productId);
    
    const validation = this.drinkRulesService.validateSelection(
      product, 
      command.options, 
      order.getCurrentItems()
    );
    
    if (!validation.isValid()) {
      return AddProductResult.failure(validation.getErrors());
    }
    
    order.addItem(product, command.options);
    await this.orderRepository.save(order);
    
    return AddProductResult.success();
  }
}
```

### 3.2 Application Services
```typescript
// Application/Services/OrderApplicationService.ts
class OrderApplicationService {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private addProductUseCase: AddProductToOrderUseCase,
    private completeOrderUseCase: CompleteOrderUseCase
  ) {}

  async createOrder(): Promise<OrderResult> {
    return await this.createOrderUseCase.execute();
  }

  async addProduct(command: AddProductCommand): Promise<AddProductResult> {
    return await this.addProductUseCase.execute(command);
  }
}
```

**Duración**: 4-5 días
**Criterio de Éxito**: Casos de uso implementados y testeados

## Fase 4: Adaptadores de Infraestructura

### 4.1 Adaptadores de Persistencia
```typescript
// Infrastructure/Persistence/InMemoryOrderRepository.ts
class InMemoryOrderRepository implements OrderPersistencePort {
  private orders: Map<string, Order> = new Map();

  async save(order: Order): Promise<void> {
    this.orders.set(order.getId().getValue(), order);
  }

  async findById(id: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new OrderNotFoundError(id);
    return order;
  }
}

// Infrastructure/Persistence/LocalStorageOrderRepository.ts
class LocalStorageOrderRepository implements OrderPersistencePort {
  async save(order: Order): Promise<void> {
    const serialized = OrderSerializer.toJSON(order);
    localStorage.setItem(`order_${order.getId().getValue()}`, serialized);
  }
}
```

### 4.2 Adaptador de Productos
```typescript
// Infrastructure/Persistence/ProductDataRepository.ts
class ProductDataRepository implements ProductRepositoryPort {
  constructor(private dataAdapter: ProductDataAdapter) {}

  async findById(id: string): Promise<Product> {
    const data = await this.dataAdapter.getProductById(id);
    return ProductMapper.toDomain(data);
  }

  async findByCategory(category: string): Promise<Product[]> {
    const data = await this.dataAdapter.getProductsByCategory(category);
    return data.map(ProductMapper.toDomain);
  }
}
```

**Duración**: 3-4 días
**Criterio de Éxito**: Adaptadores implementados y funcionando

## Fase 5: Adaptadores de UI (Interfaces)

### 5.1 Controladores Web
```typescript
// Interfaces/Web/Controllers/OrderController.ts
class OrderController {
  constructor(
    private orderService: OrderApplicationService,
    private presenter: OrderPresenter
  ) {}

  async createOrder(): Promise<void> {
    try {
      const result = await this.orderService.createOrder();
      this.presenter.presentOrderCreated(result);
    } catch (error) {
      this.presenter.presentError(error);
    }
  }

  async addProduct(productId: string, options: any): Promise<void> {
    const command = new AddProductCommand(productId, options);
    const result = await this.orderService.addProduct(command);
    
    if (result.isSuccess()) {
      this.presenter.presentProductAdded(result);
    } else {
      this.presenter.presentValidationErrors(result.getErrors());
    }
  }
}
```

### 5.2 Presenters
```typescript
// Interfaces/Web/Presenters/OrderPresenter.ts
class OrderPresenter {
  presentOrderCreated(result: OrderResult): void {
    const viewModel = {
      orderId: result.getOrderId(),
      status: 'created',
      message: 'Orden creada exitosamente'
    };
    this.updateUI(viewModel);
  }

  presentValidationErrors(errors: ValidationError[]): void {
    const viewModel = {
      errors: errors.map(e => e.getMessage()),
      type: 'validation'
    };
    this.showErrorModal(viewModel);
  }
}
```

### 5.3 Refactoring de Componentes UI
```typescript
// Interfaces/Web/Components/OrderSystemComponent.ts
class OrderSystemComponent {
  constructor(
    private orderController: OrderController,
    private eventBus: EventBus
  ) {}

  initialize(): void {
    this.setupEventListeners();
    this.eventBus.subscribe('order.created', this.onOrderCreated.bind(this));
  }

  private async handleCreateOrderClick(): Promise<void> {
    await this.orderController.createOrder();
  }

  private async handleProductClick(productId: string, options: any): Promise<void> {
    await this.orderController.addProduct(productId, options);
  }
}
```

**Duración**: 6-7 días
**Criterio de Éxito**: UI refactorizada usando controladores y presenters

## Fase 6: Dependency Injection Container

### 6.1 Container Hexagonal
```typescript
// Infrastructure/DI/HexagonalContainer.ts
class HexagonalContainer {
  private services: Map<string, any> = new Map();
  private factories: Map<string, () => any> = new Map();

  // Registro de servicios de dominio
  registerDomainServices(): void {
    this.singleton('DrinkRulesService', () => new DrinkRulesService());
    this.singleton('OrderCalculationService', () => new OrderCalculationService());
  }

  // Registro de casos de uso
  registerUseCases(): void {
    this.singleton('CreateOrderUseCase', () => new CreateOrderUseCase(
      this.resolve('OrderRepository'),
      this.resolve('ProductRepository'),
      this.resolve('DrinkRulesService')
    ));
  }

  // Registro de adaptadores
  registerAdapters(): void {
    this.singleton('OrderRepository', () => new InMemoryOrderRepository());
    this.singleton('ProductRepository', () => new ProductDataRepository(
      this.resolve('ProductDataAdapter')
    ));
  }

  // Registro de controladores
  registerControllers(): void {
    this.singleton('OrderController', () => new OrderController(
      this.resolve('OrderApplicationService'),
      this.resolve('OrderPresenter')
    ));
  }
}
```

### 6.2 Configuración de Inicialización
```typescript
// Infrastructure/Configuration/ApplicationBootstrap.ts
class ApplicationBootstrap {
  private container: HexagonalContainer;

  async initialize(): Promise<void> {
    this.container = new HexagonalContainer();
    
    // Orden específico de registro
    this.container.registerDomainServices();
    this.container.registerUseCases();
    this.container.registerAdapters();
    this.container.registerControllers();
    
    // Inicializar componentes UI
    await this.initializeUIComponents();
  }

  private async initializeUIComponents(): Promise<void> {
    const orderController = this.container.resolve('OrderController');
    const orderComponent = new OrderSystemComponent(orderController);
    orderComponent.initialize();
  }
}
```

**Duración**: 3-4 días
**Criterio de Éxito**: DI Container hexagonal funcionando, inicialización ordenada

## Fase 7: Testing y Validación

### 7.1 Tests Unitarios por Capa

#### A. Tests de Dominio
```typescript
// Domain/Tests/DrinkRulesService.test.ts
describe('DrinkRulesService', () => {
  let service: DrinkRulesService;

  beforeEach(() => {
    service = new DrinkRulesService();
  });

  describe('validateSpecialBottleRules', () => {
    it('should allow 2 juices without sodas', () => {
      const product = createSpecialBottleProduct();
      const selection = createDrinkSelection({ juices: 1, sodas: 0 });
      
      const result = service.validateSpecialBottleRules(product, selection);
      
      expect(result.canAddJuice()).toBe(true);
    });
  });
});
```

#### B. Tests de Casos de Uso
```typescript
// Application/Tests/CreateOrderUseCase.test.ts
describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let mockOrderRepository: jest.Mocked<OrderPersistencePort>;

  beforeEach(() => {
    mockOrderRepository = createMockOrderRepository();
    useCase = new CreateOrderUseCase(mockOrderRepository);
  });

  it('should create order successfully', async () => {
    const result = await useCase.execute();
    
    expect(result.isSuccess()).toBe(true);
    expect(mockOrderRepository.save).toHaveBeenCalledTimes(1);
  });
});
```

### 7.2 Tests de Integración
```typescript
// Tests/Integration/OrderFlow.test.ts
describe('Order Flow Integration', () => {
  let container: HexagonalContainer;
  let orderController: OrderController;

  beforeEach(async () => {
    container = new HexagonalContainer();
    await container.initialize();
    orderController = container.resolve('OrderController');
  });

  it('should complete full order flow', async () => {
    // Crear orden
    await orderController.createOrder();
    
    // Agregar producto
    await orderController.addProduct('product-1', { drinkOptions: ['Coca'] });
    
    // Completar orden
    await orderController.completeOrder();
    
    // Verificar estado final
    const orders = await container.resolve('OrderRepository').findActiveOrders();
    expect(orders).toHaveLength(0); // Orden completada
  });
});
```

**Duración**: 4-5 días
**Criterio de Éxito**: 90%+ cobertura de tests, todos los tests pasando

## Fase 8: Migración y Deployment

### 8.1 Migración Gradual
- [ ] **Feature Flag**: Implementar toggle entre sistema viejo y nuevo
- [ ] **Migración por Componentes**: Migrar un componente a la vez
- [ ] **Rollback Plan**: Procedimiento para volver al sistema anterior
- [ ] **Monitoring**: Métricas para comparar rendimiento

### 8.2 Validación Final
- [ ] **Tests de Regresión**: Verificar que toda funcionalidad previa funciona
- [ ] **Performance Tests**: Asegurar que no hay degradación
- [ ] **User Acceptance**: Validar con usuarios finales
- [ ] **Documentation**: Actualizar documentación técnica

**Duración**: 3-4 días
**Criterio de Éxito**: Sistema migrado completamente, funcionando sin errores

## Cronograma Total

| Fase | Duración | Dependencias | Entregables |
|------|----------|--------------|-------------|
| 0. Preparación | 1-2 días | - | Backup, fixes críticos |
| 1. Definición | 3-4 días | Fase 0 | Interfaces, estructura |
| 2. Dominio | 5-6 días | Fase 1 | Entidades, servicios |
| 3. Aplicación | 4-5 días | Fase 2 | Casos de uso |
| 4. Infraestructura | 3-4 días | Fase 3 | Adaptadores |
| 5. UI | 6-7 días | Fase 4 | Controladores, presenters |
| 6. DI Container | 3-4 días | Fase 5 | Container hexagonal |
| 7. Testing | 4-5 días | Fase 6 | Suite de tests completa |
| 8. Migración | 3-4 días | Fase 7 | Sistema en producción |

**Total: 32-41 días (6-8 semanas)**

## Beneficios Esperados

### Inmediatos
- ✅ **Eliminación de race conditions** en inicialización
- ✅ **Separación clara de responsabilidades**
- ✅ **Testabilidad mejorada** significativamente
- ✅ **Mantenibilidad** incrementada

### A Mediano Plazo
- 🚀 **Escalabilidad** para nuevas funcionalidades
- 🔧 **Flexibilidad** para cambios de requerimientos
- 🛡️ **Robustez** ante errores y fallos
- 📈 **Performance** optimizada

### A Largo Plazo
- 🏗️ **Arquitectura sostenible** para crecimiento
- 👥 **Onboarding** más fácil para nuevos desarrolladores
- 🔄 **Evolución** tecnológica sin refactoring masivo
- 💰 **Reducción de costos** de mantenimiento

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Regresión funcional | Media | Alto | Tests exhaustivos, feature flags |
| Sobrecarga de complejidad | Baja | Medio | Documentación clara, training |
| Retrasos en cronograma | Media | Medio | Buffer de tiempo, priorización |
| Resistencia al cambio | Baja | Bajo | Comunicación, beneficios claros |

---

**Próximo Paso**: Ejecutar Fase 0 - Preparación y Estabilización

**Responsable**: Equipo de Desarrollo
**Revisión**: Semanal
**Criterio de Éxito Global**: Sistema con Arquitectura Hexagonal funcionando sin los acoplamientos identificados en el análisis