# Script de limpieza automática
# Generado el 2025-09-01T04:39:58.840Z

Write-Host "Iniciando limpieza del proyecto..."

# Crear backup antes de limpieza
$backupDir = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force

# Eliminar duplicados exactos
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Entities\Order.js") {
    Copy-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Entities\Order.js" "$backupDir\" -Force
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Entities\Order.js" -Force
    Write-Host "Eliminado duplicado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Entities\Order.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\DrinkRulesPort.js") {
    Copy-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\DrinkRulesPort.js" "$backupDir\" -Force
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\DrinkRulesPort.js" -Force
    Write-Host "Eliminado duplicado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\DrinkRulesPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\ProductRepositoryPort.js") {
    Copy-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\ProductRepositoryPort.js" "$backupDir\" -Force
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\ProductRepositoryPort.js" -Force
    Write-Host "Eliminado duplicado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\ProductRepositoryPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\OrderRepositoryPort.js") {
    Copy-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\OrderRepositoryPort.js" "$backupDir\" -Force
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\OrderRepositoryPort.js" -Force
    Write-Host "Eliminado duplicado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\OrderRepositoryPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\ProductRepositoryPort.js") {
    Copy-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\ProductRepositoryPort.js" "$backupDir\" -Force
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\ProductRepositoryPort.js" -Force
    Write-Host "Eliminado duplicado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\ProductRepositoryPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\Money.js") {
    Copy-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\Money.js" "$backupDir\" -Force
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\Money.js" -Force
    Write-Host "Eliminado duplicado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\Money.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderId.js") {
    Copy-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderId.js" "$backupDir\" -Force
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderId.js" -Force
    Write-Host "Eliminado duplicado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderId.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderItemId.js") {
    Copy-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderItemId.js" "$backupDir\" -Force
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderItemId.js" -Force
    Write-Host "Eliminado duplicado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderItemId.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductCategory.js") {
    Copy-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductCategory.js" "$backupDir\" -Force
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductCategory.js" -Force
    Write-Host "Eliminado duplicado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductCategory.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductName.js") {
    Copy-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductName.js" "$backupDir\" -Force
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductName.js" -Force
    Write-Host "Eliminado duplicado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductName.js"
}

# Eliminar archivos compilados
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\AddProductToOrderUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\AddProductToOrderUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\AddProductToOrderUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\CreateOrderUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\CreateOrderUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\CreateOrderUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\ValidateOrderUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\ValidateOrderUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\ValidateOrderUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\ValidateProductUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\ValidateProductUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Aplicacion\UseCases\ValidateProductUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Entities\Order.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Entities\Order.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Entities\Order.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Entities\OrderItem.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Entities\OrderItem.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Entities\OrderItem.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Entities\Product.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Entities\Product.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Entities\Product.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\DrinkRulesPort.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\DrinkRulesPort.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\DrinkRulesPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\EventBusPort.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\EventBusPort.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\EventBusPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\OrderRepositoryPort.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\OrderRepositoryPort.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\OrderRepositoryPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\ProductRepositoryPort.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\ProductRepositoryPort.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\ProductRepositoryPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\Money.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\Money.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\Money.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\OrderId.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\OrderId.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\OrderId.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\OrderItemId.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\OrderItemId.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\OrderItemId.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductCategory.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductCategory.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductCategory.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductId.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductId.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductId.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductName.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductName.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductName.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\adapters\DrinkRulesServiceAdapter.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\adapters\DrinkRulesServiceAdapter.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\adapters\DrinkRulesServiceAdapter.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\adapters\InMemoryOrderRepository.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\adapters\InMemoryOrderRepository.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\adapters\InMemoryOrderRepository.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\adapters\ProductDataRepositoryAdapter.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\adapters\ProductDataRepositoryAdapter.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\adapters\ProductDataRepositoryAdapter.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\DI\HexagonalContainer.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\DI\HexagonalContainer.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Infraestructura\DI\HexagonalContainer.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\services\OrderCore.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\services\OrderCore.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\services\OrderCore.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\services\OrderCore.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\services\OrderCore.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\services\OrderCore.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\use-cases\LoadCocktailsUseCase.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\use-cases\LoadCocktailsUseCase.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\use-cases\LoadCocktailsUseCase.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\use-cases\LoadCocktailsUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\use-cases\LoadCocktailsUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\use-cases\LoadCocktailsUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\AddProductToOrderUseCase.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\AddProductToOrderUseCase.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\AddProductToOrderUseCase.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\AddProductToOrderUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\AddProductToOrderUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\AddProductToOrderUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\CreateOrderUseCase.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\CreateOrderUseCase.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\CreateOrderUseCase.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\CreateOrderUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\CreateOrderUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\CreateOrderUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductByIdUseCase.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductByIdUseCase.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductByIdUseCase.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductByIdUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductByIdUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductByIdUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductsUseCase.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductsUseCase.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductsUseCase.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductsUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductsUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\GetProductsUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateOrderUseCase.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateOrderUseCase.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateOrderUseCase.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateOrderUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateOrderUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateOrderUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateProductUseCase.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateProductUseCase.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateProductUseCase.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateProductUseCase.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateProductUseCase.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Aplicacion\UseCases\ValidateProductUseCase.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Order.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Order.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Order.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Order.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Order.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Order.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\OrderItem.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\OrderItem.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\OrderItem.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\OrderItem.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\OrderItem.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\OrderItem.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Product.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Product.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Product.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Product.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Product.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Entities\Product.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\DrinkRulesPort.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\DrinkRulesPort.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\DrinkRulesPort.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\DrinkRulesPort.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\DrinkRulesPort.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\DrinkRulesPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\EventBusPort.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\EventBusPort.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\EventBusPort.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\EventBusPort.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\EventBusPort.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\EventBusPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\OrderRepositoryPort.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\OrderRepositoryPort.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\OrderRepositoryPort.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\OrderRepositoryPort.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\OrderRepositoryPort.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\OrderRepositoryPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\ProductRepositoryPort.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\ProductRepositoryPort.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\ProductRepositoryPort.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\ProductRepositoryPort.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\ProductRepositoryPort.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\Ports\ProductRepositoryPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\Money.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\Money.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\Money.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\Money.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\Money.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\Money.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderId.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderId.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderId.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderId.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderId.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderId.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderItemId.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderItemId.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderItemId.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderItemId.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderItemId.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\OrderItemId.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductCategory.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductCategory.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductCategory.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductCategory.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductCategory.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductCategory.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductDescription.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductDescription.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductDescription.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductDescription.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductDescription.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductDescription.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductId.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductId.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductId.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductId.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductId.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductId.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductName.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductName.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductName.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductName.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductName.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Domain\ValueObjects\ProductName.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\DomainError.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\DomainError.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\DomainError.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\DomainError.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\DomainError.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\DomainError.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\ValidationError.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\ValidationError.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\ValidationError.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\ValidationError.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\ValidationError.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\exceptions\ValidationError.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\ports\CocktailRepositoryPort.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\ports\CocktailRepositoryPort.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\ports\CocktailRepositoryPort.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\ports\CocktailRepositoryPort.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\ports\CocktailRepositoryPort.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Dominio\ports\CocktailRepositoryPort.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\BaseAdapter.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\BaseAdapter.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\BaseAdapter.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\BaseAdapter.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\BaseAdapter.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\BaseAdapter.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\DrinkRulesServiceAdapter.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\DrinkRulesServiceAdapter.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\DrinkRulesServiceAdapter.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\DrinkRulesServiceAdapter.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\DrinkRulesServiceAdapter.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\DrinkRulesServiceAdapter.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\InMemoryOrderRepository.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\InMemoryOrderRepository.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\InMemoryOrderRepository.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\InMemoryOrderRepository.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\InMemoryOrderRepository.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\InMemoryOrderRepository.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapter.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapter.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapter.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapter.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapter.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapter.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapterTS.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapterTS.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapterTS.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapterTS.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapterTS.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataAdapterTS.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataRepositoryAdapter.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataRepositoryAdapter.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataRepositoryAdapter.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataRepositoryAdapter.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataRepositoryAdapter.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\ProductDataRepositoryAdapter.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapter.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapter.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapter.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapter.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapter.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapter.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapterTS.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapterTS.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapterTS.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapterTS.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapterTS.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\adapters\SupabaseAdapterTS.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\data-providers\product-data.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\data-providers\product-data.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\data-providers\product-data.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\data-providers\product-data.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\data-providers\product-data.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\data-providers\product-data.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\DI\HexagonalContainer.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\DI\HexagonalContainer.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\DI\HexagonalContainer.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\DI\HexagonalContainer.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\DI\HexagonalContainer.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\DI\HexagonalContainer.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\AIInterface.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\AIInterface.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\AIInterface.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\AIInterface.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\AIInterface.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\AIInterface.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\BillingInterface.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\BillingInterface.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\BillingInterface.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\BillingInterface.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\BillingInterface.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\BillingInterface.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\ReservationInterface.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\ReservationInterface.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\ReservationInterface.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\ReservationInterface.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\ReservationInterface.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Infraestructura\integrations\ReservationInterface.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\OrderSystemComponent.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\OrderSystemComponent.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\OrderSystemComponent.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\OrderSystemComponent.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\OrderSystemComponent.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\OrderSystemComponent.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\ProductGridComponent.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\ProductGridComponent.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\ProductGridComponent.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\ProductGridComponent.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\ProductGridComponent.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\components\ProductGridComponent.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\OrderController.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\OrderController.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\OrderController.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\OrderController.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\OrderController.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\OrderController.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\ProductController.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\ProductController.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\ProductController.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\ProductController.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\ProductController.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\controllers\ProductController.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\events\EventHandler.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\events\EventHandler.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\events\EventHandler.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\events\EventHandler.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\events\EventHandler.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\events\EventHandler.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\performance\PerformanceOptimizer.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\performance\PerformanceOptimizer.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\performance\PerformanceOptimizer.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\performance\PerformanceOptimizer.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\performance\PerformanceOptimizer.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\performance\PerformanceOptimizer.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\OrderPresenter.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\OrderPresenter.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\OrderPresenter.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\OrderPresenter.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\OrderPresenter.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\OrderPresenter.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\ProductPresenter.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\ProductPresenter.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\ProductPresenter.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\ProductPresenter.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\ProductPresenter.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\presenters\ProductPresenter.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system-validations.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system-validations.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system-validations.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system-validations.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system-validations.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system-validations.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\order-system.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\product-table.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\product-table.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\product-table.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\ProductCarousel.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\ProductCarousel.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\ProductCarousel.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\ProductCarousel.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\ProductCarousel.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\ProductCarousel.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\SafeModal.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\SafeModal.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\SafeModal.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\SafeModal.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\SafeModal.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\components\SafeModal.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\screens\screen-manager.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\screens\screen-manager.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\screens\screen-manager.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\screens\screen-manager.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\screens\screen-manager.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Interfaces\web\ui-adapters\screens\screen-manager.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\base\BaseEntity.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\base\BaseEntity.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\base\BaseEntity.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\base\BaseEntity.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\base\BaseEntity.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\base\BaseEntity.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\app-init.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\app-init.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\app-init.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\constants.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\constants.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\constants.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\constants.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\constants.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\constants.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\EnvironmentManager.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\EnvironmentManager.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\EnvironmentManager.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\EnvironmentManager.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\EnvironmentManager.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\EnvironmentManager.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\storage.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\storage.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\storage.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\storage.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\storage.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\storage.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\syncConfig.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\syncConfig.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\syncConfig.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\syncConfig.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\syncConfig.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\config\syncConfig.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\AppConfig.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\AppConfig.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\AppConfig.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\AppConfig.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\AppConfig.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\AppConfig.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\DIContainer.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\DIContainer.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\DIContainer.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\DIContainer.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\DIContainer.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\DIContainer.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\Result.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\Result.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\Result.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\Result.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\Result.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\core\Result.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\exceptions\InfrastructureError.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\exceptions\InfrastructureError.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\exceptions\InfrastructureError.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\exceptions\InfrastructureError.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\exceptions\InfrastructureError.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\exceptions\InfrastructureError.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\CSSClassManager.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\CSSClassManager.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\CSSClassManager.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\CSSClassManager.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\CSSClassManager.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\CSSClassManager.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\top-nav-independent.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\top-nav-independent.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\top-nav-independent.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\top-nav-independent.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\top-nav-independent.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\js\top-nav-independent.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\performance\MemoizationManager.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\performance\MemoizationManager.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\performance\MemoizationManager.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\performance\MemoizationManager.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\performance\MemoizationManager.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\performance\MemoizationManager.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\services\DataSyncService.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\services\DataSyncService.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\services\DataSyncService.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\services\DataSyncService.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\services\DataSyncService.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\services\DataSyncService.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\e2e-framework.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\e2e-framework.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\e2e-framework.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\e2e-framework.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\e2e-framework.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\e2e-framework.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\LoadCocktailsUseCase.test.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\LoadCocktailsUseCase.test.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\LoadCocktailsUseCase.test.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\LoadCocktailsUseCase.test.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\LoadCocktailsUseCase.test.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\LoadCocktailsUseCase.test.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\OrderSystem.integration.test.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\OrderSystem.integration.test.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\OrderSystem.integration.test.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\OrderSystem.integration.test.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\OrderSystem.integration.test.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\OrderSystem.integration.test.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-global-exposure-test.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-global-exposure-test.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-global-exposure-test.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-global-exposure-test.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-global-exposure-test.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-global-exposure-test.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-integration-tests.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-integration-tests.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-integration-tests.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-integration-tests.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-integration-tests.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\phase3-integration-tests.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\SupabaseAdapter.integration.test.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\SupabaseAdapter.integration.test.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\SupabaseAdapter.integration.test.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\SupabaseAdapter.integration.test.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\SupabaseAdapter.integration.test.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\SupabaseAdapter.integration.test.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\test-framework.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\test-framework.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\test-framework.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\test-framework.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\test-framework.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\test-framework.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\utils.test.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\utils.test.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\utils.test.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\utils.test.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\utils.test.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\testing\utils.test.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\calculationUtils.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\calculationUtils.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\calculationUtils.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\calculationUtils.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\calculationUtils.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\calculationUtils.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\diUtils.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\diUtils.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\diUtils.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\diUtils.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\diUtils.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\diUtils.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.test.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.test.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.test.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.test.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.test.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\domUtils.test.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\errorHandler.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\errorHandler.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\errorHandler.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\errorHandler.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\errorHandler.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\errorHandler.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\formatters.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\formatters.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\formatters.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\formatters.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\formatters.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\formatters.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\logger.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\logger.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\logger.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\logger.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\logger.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\logger.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\sanitizer.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\sanitizer.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\sanitizer.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\sanitizer.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\sanitizer.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\sanitizer.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\simpleCache.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\simpleCache.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\simpleCache.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\simpleCache.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\simpleCache.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\simpleCache.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\syncMonitor.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\syncMonitor.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\syncMonitor.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\syncMonitor.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\syncMonitor.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\syncMonitor.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\validator.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\validator.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\validator.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\validator.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\validator.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Shared\utils\validator.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\ControllerIntegrationTests.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\ControllerIntegrationTests.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\ControllerIntegrationTests.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\ControllerIntegrationTests.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\ControllerIntegrationTests.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\ControllerIntegrationTests.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\MinimalControllerTest.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\MinimalControllerTest.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\MinimalControllerTest.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\MinimalControllerTest.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\MinimalControllerTest.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\MinimalControllerTest.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\SimpleControllerTests.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\SimpleControllerTests.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\SimpleControllerTests.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\SimpleControllerTests.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\SimpleControllerTests.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\SimpleControllerTests.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\UIIntegrationTests.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\UIIntegrationTests.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\UIIntegrationTests.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\UIIntegrationTests.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\UIIntegrationTests.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Integration\Phase4\UIIntegrationTests.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Performance\PerformanceOptimizationTest.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Performance\PerformanceOptimizationTest.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Performance\PerformanceOptimizationTest.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Performance\PerformanceOptimizationTest.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Performance\PerformanceOptimizationTest.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\Tests\Performance\PerformanceOptimizationTest.js"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\hexagonal-bootstrap.d.ts") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\hexagonal-bootstrap.d.ts" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\hexagonal-bootstrap.d.ts"
}
if (Test-Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\hexagonal-bootstrap.js") {
    Remove-Item "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\hexagonal-bootstrap.js" -Force
    Write-Host "Eliminado compilado: C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist\hexagonal-bootstrap.js"
}

Write-Host "Limpieza completada. Backup en: $backupDir"
