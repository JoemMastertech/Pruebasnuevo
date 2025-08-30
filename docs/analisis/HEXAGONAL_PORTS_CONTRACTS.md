# Contratos de Puertos y Adaptadores - Arquitectura Hexagonal

## 📋 Resumen Ejecutivo

**Objetivo**: Definir los contratos de puertos y adaptadores para implementar arquitectura hexagonal en el sistema de órdenes.

**Alcance**: Interfaces TypeScript que definirán las abstracciones entre capas del dominio, aplicación e infraestructura.

**Prioridad**: **ALTA** - Estos contratos son fundamentales para la refactorización arquitectónica.

---

## 🏗️ ARQUITECTURA DE PUERTOS Y ADAPTADORES

### Diagrama de Arquitectura
```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │ OrderComponent  │  │ ProductComponent│                 │
│  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE INTERFACE                        │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │ OrderController │  │ ProductController│                │
│  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE APLICACIÓN                        │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │ CreateOrderUC   │  │ ValidateProductUC│                │
│  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PUERTOS DE DOMINIO                      │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │OrderRepositoryPort│ │ProductRepositoryPort│             │
│  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 CAPA DE INFRAESTRUCTURA                     │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │InMemoryOrderRepo│  │ProductDataAdapter│                │
│  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 PUERTOS DE DOMINIO (Interfaces)

### 1. OrderRepositoryPort

```typescript
// Domain/Ports/OrderRepositoryPort.ts
export interface OrderRepositoryPort {
  /**
   * Obtiene la orden actual en progreso
   * @returns Promise<Order | null> La orden actual o null si no existe
   */
  getCurrentOrder(): Promise<Order | null>;

  /**
   * Crea una nueva orden
   * @param customerId ID del cliente
   * @returns Promise<Order> Nueva orden creada
   */
  createOrder(customerId?: string): Promise<Order>;

  /**
   * Guarda una orden
   * @param order Orden a guardar
   * @returns Promise<Order> Orden guardada
   */
  save(order: Order): Promise<Order>;

  /**
   * Busca una orden por ID
   * @param orderId ID de la orden
   * @returns Promise<Order | null> Orden encontrada o null
   */
  findById(orderId: OrderId): Promise<Order | null>;

  /**
   * Obtiene todas las órdenes
   * @returns Promise<Order[]> Lista de órdenes
   */
  findAll(): Promise<Order[]>;

  /**
   * Elimina una orden
   * @param orderId ID de la orden a eliminar
   * @returns Promise<boolean> True si se eliminó correctamente
   */
  delete(orderId: OrderId): Promise<boolean>;

  /**
   * Finaliza una orden (cambia estado a completada)
   * @param orderId ID de la orden
   * @returns Promise<Order> Orden finalizada
   */
  completeOrder(orderId: OrderId): Promise<Order>;
}
```

### 2. ProductRepositoryPort

```typescript
// Domain/Ports/ProductRepositoryPort.ts
export interface ProductRepositoryPort {
  /**
   * Busca un producto por nombre
   * @param name Nombre del producto
   * @returns Promise<Product | null> Producto encontrado o null
   */
  findByName(name: string): Promise<Product | null>;

  /**
   * Busca productos por categoría
   * @param category Categoría del producto
   * @returns Promise<Product[]> Lista de productos
   */
  findByCategory(category: ProductCategory): Promise<Product[]>;

  /**
   * Obtiene todos los productos
   * @returns Promise<Product[]> Lista de todos los productos
   */
  findAll(): Promise<Product[]>;

  /**
   * Busca productos por texto (nombre o ingredientes)
   * @param query Texto de búsqueda
   * @returns Promise<Product[]> Lista de productos que coinciden
   */
  search(query: string): Promise<Product[]>;

  /**
   * Verifica si un producto existe
   * @param productId ID del producto
   * @returns Promise<boolean> True si existe
   */
  exists(productId: ProductId): Promise<boolean>;

  /**
   * Obtiene las opciones de bebida para un producto
   * @param product Producto
   * @returns Promise<DrinkOption[]> Opciones de bebida disponibles
   */
  getDrinkOptions(product: Product): Promise<DrinkOption[]>;
}
```

### 3. OrderManagementPort

```typescript
// Domain/Ports/OrderManagementPort.ts
export interface OrderManagementPort {
  /**
   * Agrega un producto a la orden actual
   * @param productData Datos del producto
   * @param customizations Personalizaciones
   * @returns Promise<OrderItem> Item agregado a la orden
   */
  addProductToOrder(
    productData: ProductSelectionData,
    customizations: Customization[]
  ): Promise<OrderItem>;

  /**
   * Remueve un item de la orden
   * @param itemId ID del item
   * @returns Promise<boolean> True si se removió correctamente
   */
  removeItemFromOrder(itemId: OrderItemId): Promise<boolean>;

  /**
   * Calcula el total de la orden actual
   * @returns Promise<Money> Total de la orden
   */
  calculateOrderTotal(): Promise<Money>;

  /**
   * Valida si la orden puede ser completada
   * @returns Promise<ValidationResult> Resultado de validación
   */
  validateOrderCompletion(): Promise<ValidationResult>;

  /**
   * Completa la orden actual
   * @returns Promise<Order> Orden completada
   */
  completeCurrentOrder(): Promise<Order>;

  /**
   * Cancela la orden actual
   * @returns Promise<void>
   */
  cancelCurrentOrder(): Promise<void>;
}
```

### 4. DrinkRulesPort

```typescript
// Domain/Ports/DrinkRulesPort.ts
export interface DrinkRulesPort {
  /**
   * Obtiene las opciones de bebida disponibles para un producto
   * @param product Producto
   * @returns DrinkOptions Opciones de bebida
   */
  getAvailableOptions(product: Product): DrinkOptions;

  /**
   * Valida una selección de bebidas
   * @param product Producto
   * @param selectedDrinks Bebidas seleccionadas
   * @returns ValidationResult Resultado de validación
   */
  validateDrinkSelection(
    product: Product,
    selectedDrinks: DrinkSelection[]
  ): ValidationResult;

  /**
   * Obtiene el límite máximo de bebidas para un producto
   * @param product Producto
   * @returns number Límite máximo
   */
  getMaxDrinkLimit(product: Product): number;

  /**
   * Verifica si un producto requiere selección de bebidas
   * @param product Producto
   * @returns boolean True si requiere selección
   */
  requiresDrinkSelection(product: Product): boolean;
}
```

---

## 🔧 ADAPTADORES DE INFRAESTRUCTURA

### 1. InMemoryOrderRepository

```typescript
// Infraestructura/Adapters/InMemoryOrderRepository.ts
export class InMemoryOrderRepository implements OrderRepositoryPort {
  private orders: Map<string, Order> = new Map();
  private currentOrderId: string | null = null;

  async getCurrentOrder(): Promise<Order | null> {
    if (!this.currentOrderId) {
      return null;
    }
    return this.orders.get(this.currentOrderId) || null;
  }

  async createOrder(customerId?: string): Promise<Order> {
    const orderId = OrderId.generate();
    const order = new Order(orderId, customerId);
    
    this.orders.set(orderId.value, order);
    this.currentOrderId = orderId.value;
    
    return order;
  }

  async save(order: Order): Promise<Order> {
    this.orders.set(order.id.value, order);
    return order;
  }

  async findById(orderId: OrderId): Promise<Order | null> {
    return this.orders.get(orderId.value) || null;
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async delete(orderId: OrderId): Promise<boolean> {
    const deleted = this.orders.delete(orderId.value);
    if (this.currentOrderId === orderId.value) {
      this.currentOrderId = null;
    }
    return deleted;
  }

  async completeOrder(orderId: OrderId): Promise<Order> {
    const order = await this.findById(orderId);
    if (!order) {
      throw new OrderNotFoundError(orderId);
    }
    
    order.complete();
    await this.save(order);
    
    if (this.currentOrderId === orderId.value) {
      this.currentOrderId = null;
    }
    
    return order;
  }
}
```

### 2. ProductDataRepositoryAdapter

```typescript
// Infraestructura/Adapters/ProductDataRepositoryAdapter.ts
export class ProductDataRepositoryAdapter implements ProductRepositoryPort {
  constructor(private productDataAdapter: ProductDataAdapter) {}

  async findByName(name: string): Promise<Product | null> {
    const productData = await this.productDataAdapter.getProductByName(name);
    if (!productData) {
      return null;
    }
    return this.mapToProduct(productData);
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    const productsData = await this.productDataAdapter.getProductsByCategory(category.value);
    return productsData.map(data => this.mapToProduct(data));
  }

  async findAll(): Promise<Product[]> {
    const productsData = await this.productDataAdapter.getAllProducts();
    return productsData.map(data => this.mapToProduct(data));
  }

  async search(query: string): Promise<Product[]> {
    const productsData = await this.productDataAdapter.searchProducts(query);
    return productsData.map(data => this.mapToProduct(data));
  }

  async exists(productId: ProductId): Promise<boolean> {
    const product = await this.findByName(productId.value);
    return product !== null;
  }

  async getDrinkOptions(product: Product): Promise<DrinkOption[]> {
    const drinkOptionsData = await this.productDataAdapter.getDrinkOptionsForProduct(product.name.value);
    return drinkOptionsData.map(option => new DrinkOption(option.name, option.type));
  }

  private mapToProduct(productData: any): Product {
    return new Product(
      new ProductId(productData.nombre),
      new ProductName(productData.nombre),
      new ProductCategory(productData.categoria),
      new Money(productData.precio || 0),
      productData.ingredientes || ''
    );
  }
}
```

### 3. DrinkRulesServiceAdapter

```typescript
// Infraestructura/Adapters/DrinkRulesServiceAdapter.ts
export class DrinkRulesServiceAdapter implements DrinkRulesPort {
  private readonly PRODUCT_OPTIONS = {
    RON: ['Mineral', 'Coca', 'Manzana'],
    TEQUILA: ['Mineral', 'Toronja', 'Botella de Agua', 'Coca'],
    BRANDY: ['Mineral', 'Coca', 'Manzana'],
    WHISKY: ['Mineral', 'Manzana', 'Ginger ale', 'Botella de Agua'],
    VODKA: ['Jugo de Piña', 'Jugo de Uva', 'Jugo de Naranja', 'Jugo de Arándano', 'Jugo de Mango', 'Jugo de Durazno', 'Mineral', 'Quina'],
    GINEBRA: ['Jugo de Piña', 'Jugo de Uva', 'Jugo de Naranja', 'Jugo de Arándano', 'Jugo de Mango', 'Jugo de Durazno', 'Mineral', 'Quina'],
    MEZCAL: ['Mineral', 'Toronja'],
    COGNAC: ['Mineral', 'Coca', 'Manzana', 'Botella de Agua'],
    DEFAULT: ['Mineral', 'Agua', 'Coca', 'Manzana']
  };

  getAvailableOptions(product: Product): DrinkOptions {
    if (!this.requiresDrinkSelection(product)) {
      return DrinkOptions.none();
    }

    const productType = this.getProductType(product);
    const options = this.PRODUCT_OPTIONS[productType] || this.PRODUCT_OPTIONS.DEFAULT;
    const maxCount = this.getMaxDrinkLimit(product);

    return new DrinkOptions(options, { maxCount });
  }

  validateDrinkSelection(product: Product, selectedDrinks: DrinkSelection[]): ValidationResult {
    if (!this.requiresDrinkSelection(product)) {
      return ValidationResult.success();
    }

    const maxLimit = this.getMaxDrinkLimit(product);
    const totalSelected = selectedDrinks.reduce((sum, selection) => sum + selection.quantity, 0);

    if (totalSelected > maxLimit) {
      return ValidationResult.failure(`Máximo ${maxLimit} bebidas permitidas`);
    }

    if (totalSelected === 0) {
      return ValidationResult.failure('Debe seleccionar al menos una bebida');
    }

    return ValidationResult.success();
  }

  getMaxDrinkLimit(product: Product): number {
    if (product.isJagermeister() && product.isBottle()) {
      return 1; // Solo 2 Boost
    }
    
    if (product.isLiquor()) {
      return 5; // Máximo 5 acompañamientos
    }
    
    return 0; // No requiere bebidas
  }

  requiresDrinkSelection(product: Product): boolean {
    return product.isLiquor() && !product.isDigestivo() && !product.isEspumoso();
  }

  private getProductType(product: Product): string {
    const name = product.name.value.toUpperCase();
    
    if (name.includes('RON')) return 'RON';
    if (name.includes('TEQUILA')) return 'TEQUILA';
    if (name.includes('BRANDY')) return 'BRANDY';
    if (name.includes('WHISKY') || name.includes('WHISKEY')) return 'WHISKY';
    if (name.includes('VODKA')) return 'VODKA';
    if (name.includes('GINEBRA') || name.includes('GIN')) return 'GINEBRA';
    if (name.includes('MEZCAL')) return 'MEZCAL';
    if (name.includes('COGNAC')) return 'COGNAC';
    
    return 'DEFAULT';
  }
}
```

---

## 🏭 CONTENEDOR DE INYECCIÓN DE DEPENDENCIAS

### HexagonalContainer

```typescript
// Shared/DI/HexagonalContainer.ts
export class HexagonalContainer {
  private static instance: HexagonalContainer;
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  static getInstance(): HexagonalContainer {
    if (!HexagonalContainer.instance) {
      HexagonalContainer.instance = new HexagonalContainer();
    }
    return HexagonalContainer.instance;
  }

  // Registro de servicios
  register<T>(token: string, factory: () => T, singleton: boolean = true): void {
    this.services.set(token, { factory, singleton });
  }

  // Resolución de dependencias
  resolve<T>(token: string): T {
    const service = this.services.get(token);
    if (!service) {
      throw new Error(`Service ${token} not registered`);
    }

    if (service.singleton) {
      if (!this.singletons.has(token)) {
        this.singletons.set(token, service.factory());
      }
      return this.singletons.get(token);
    }

    return service.factory();
  }

  // Configuración de la aplicación
  configure(): void {
    // Adaptadores de infraestructura
    this.register('ProductDataAdapter', () => new ProductDataAdapter());
    this.register('OrderRepositoryPort', () => new InMemoryOrderRepository());
    this.register('ProductRepositoryPort', () => 
      new ProductDataRepositoryAdapter(this.resolve('ProductDataAdapter'))
    );
    this.register('DrinkRulesPort', () => new DrinkRulesServiceAdapter());

    // Casos de uso
    this.register('CreateOrderUseCase', () => 
      new CreateOrderUseCase(
        this.resolve('OrderRepositoryPort'),
        this.resolve('ProductRepositoryPort'),
        this.resolve('DrinkRulesPort')
      )
    );
    this.register('ValidateProductUseCase', () => 
      new ValidateProductUseCase(
        this.resolve('ProductRepositoryPort'),
        this.resolve('DrinkRulesPort')
      )
    );

    // Controladores
    this.register('OrderController', () => 
      new OrderController(
        this.resolve('CreateOrderUseCase'),
        this.resolve('ValidateProductUseCase')
      )
    );
  }
}
```

---

## 📋 TIPOS Y ENTIDADES DE DOMINIO

### Value Objects

```typescript
// Domain/ValueObjects/ProductId.ts
export class ProductId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ProductId cannot be empty');
    }
  }

  equals(other: ProductId): boolean {
    return this.value === other.value;
  }
}

// Domain/ValueObjects/Money.ts
export class Money {
  constructor(public readonly amount: number) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor);
  }

  static zero(): Money {
    return new Money(0);
  }
}

// Domain/ValueObjects/OrderId.ts
export class OrderId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('OrderId cannot be empty');
    }
  }

  static generate(): OrderId {
    return new OrderId(`order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }
}
```

### Entidades

```typescript
// Domain/Entities/Product.ts
export class Product {
  constructor(
    public readonly id: ProductId,
    public readonly name: ProductName,
    public readonly category: ProductCategory,
    public readonly price: Money,
    public readonly ingredients: string = ''
  ) {}

  isLiquor(): boolean {
    return this.category.value === 'licores';
  }

  isJagermeister(): boolean {
    return this.name.value.toUpperCase().includes('JAGERMEISTER');
  }

  isBottle(): boolean {
    // Lógica para determinar si es botella
    return true; // Implementar según reglas de negocio
  }

  isDigestivo(): boolean {
    return this.category.value === 'digestivos';
  }

  isEspumoso(): boolean {
    return this.category.value === 'espumosos';
  }
}

// Domain/Entities/Order.ts
export class Order {
  private items: OrderItem[] = [];
  private _total: Money = Money.zero();
  private _status: OrderStatus = OrderStatus.DRAFT;

  constructor(
    public readonly id: OrderId,
    public readonly customerId?: string
  ) {}

  addItem(item: OrderItem): void {
    this.items.push(item);
    this.calculateTotal();
  }

  removeItem(itemId: OrderItemId): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => !item.id.equals(itemId));
    
    if (this.items.length < initialLength) {
      this.calculateTotal();
      return true;
    }
    return false;
  }

  getItems(): OrderItem[] {
    return [...this.items];
  }

  getTotal(): Money {
    return this._total;
  }

  complete(): void {
    if (this.items.length === 0) {
      throw new Error('Cannot complete empty order');
    }
    this._status = OrderStatus.COMPLETED;
  }

  private calculateTotal(): void {
    this._total = this.items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      Money.zero()
    );
  }
}
```

---

## ✅ CRITERIOS DE VALIDACIÓN

### 1. **Separación de Responsabilidades**
- ✅ Puertos definen contratos sin implementación
- ✅ Adaptadores implementan lógica específica de infraestructura
- ✅ Casos de uso orquestan lógica de aplicación

### 2. **Inversión de Dependencias**
- ✅ Capas superiores dependen de abstracciones (puertos)
- ✅ Adaptadores implementan puertos
- ✅ DI Container maneja inyección de dependencias

### 3. **Testabilidad**
- ✅ Todos los puertos son mockeable
- ✅ Casos de uso testeable en aislamiento
- ✅ Adaptadores testeable independientemente

### 4. **Mantenibilidad**
- ✅ Cambios en infraestructura no afectan dominio
- ✅ Nuevas implementaciones sin modificar contratos
- ✅ Lógica de negocio centralizada en dominio

---

**Conclusión**: Estos contratos establecen las bases para una arquitectura hexagonal sólida que permitirá la refactorización gradual del sistema actual manteniendo la funcionalidad existente.