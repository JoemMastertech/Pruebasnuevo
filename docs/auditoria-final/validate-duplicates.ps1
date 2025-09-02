# Script de Validacion de Duplicados
# Proposito: Verificar archivos duplicados antes de eliminacion
# Generado: 2025-01-01

Write-Host "=== VALIDACION DE ARCHIVOS DUPLICADOS ===" -ForegroundColor Green

# Lista de archivos duplicados identificados
$duplicates = @(
    @{
        Original = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Entities\Order.js"
        Compiled = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Entities\Order.js"
        TypeScript = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Entities\Order.ts"
    },
    @{
        Original = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\DrinkRulesPort.js"
        Compiled = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\DrinkRulesPort.js"
        TypeScript = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\DrinkRulesPort.ts"
    },
    @{
        Original = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\ProductRepositoryPort.js"
        Compiled = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\Ports\ProductRepositoryPort.js"
        TypeScript = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\Ports\ProductRepositoryPort.ts"
    },
    @{
        Original = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\Money.js"
        Compiled = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\Money.js"
        TypeScript = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\Money.ts"
    },
    @{
        Original = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderId.js"
        Compiled = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\OrderId.js"
        TypeScript = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderId.ts"
    },
    @{
        Original = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderItemId.js"
        Compiled = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\OrderItemId.js"
        TypeScript = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\OrderItemId.ts"
    },
    @{
        Original = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductId.js"
        Compiled = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductId.js"
        TypeScript = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductId.ts"
    },
    @{
        Original = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductName.js"
        Compiled = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\ValueObjects\ProductName.js"
        TypeScript = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\ValueObjects\ProductName.ts"
    }
)

# Funcion para comparar archivos
function Compare-Files {
    param(
        [string]$File1,
        [string]$File2
    )
    
    if (-not (Test-Path $File1)) {
        return "File1 no existe"
    }
    
    if (-not (Test-Path $File2)) {
        return "File2 no existe"
    }
    
    $hash1 = Get-FileHash $File1 -Algorithm MD5
    $hash2 = Get-FileHash $File2 -Algorithm MD5
    
    if ($hash1.Hash -eq $hash2.Hash) {
        return "IDENTICOS"
    } else {
        return "DIFERENTES"
    }
}

# Funcion para buscar referencias
function Find-References {
    param(
        [string]$FilePath
    )
    
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
    $projectRoot = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS"
    
    # Buscar referencias en archivos .js, .ts, .html
    $searchPattern = "*$fileName*"
    $references = @()
    
    try {
        $files = Get-ChildItem -Path $projectRoot -Recurse -Include "*.js", "*.ts", "*.html" -ErrorAction SilentlyContinue
        
        foreach ($file in $files) {
            if ($file.FullName -ne $FilePath) {
                $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
                if ($content -and ($content -match $fileName)) {
                    $references += $file.FullName
                }
            }
        }
    }
    catch {
        Write-Host "[WARN] Error buscando referencias: $_" -ForegroundColor Yellow
    }
    
    return $references
}

# Validar cada duplicado
$validationResults = @()

foreach ($duplicate in $duplicates) {
    Write-Host ""
    Write-Host "Analizando: $([System.IO.Path]::GetFileName($duplicate.Original))" -ForegroundColor Cyan
    
    $result = @{
        FileName = [System.IO.Path]::GetFileName($duplicate.Original)
        OriginalExists = Test-Path $duplicate.Original
        CompiledExists = Test-Path $duplicate.Compiled
        TypeScriptExists = Test-Path $duplicate.TypeScript
        OriginalVsCompiled = ""
        OriginalReferences = @()
        CompiledReferences = @()
        SafeToDelete = $false
        Recommendation = ""
    }
    
    # Comparar archivos si ambos existen
    if ($result.OriginalExists -and $result.CompiledExists) {
        $result.OriginalVsCompiled = Compare-Files $duplicate.Original $duplicate.Compiled
        Write-Host "  Original vs Compiled: $($result.OriginalVsCompiled)" -ForegroundColor $(if ($result.OriginalVsCompiled -eq 'IDENTICOS') { 'Green' } else { 'Yellow' })
    }
    
    # Buscar referencias al archivo original
    if ($result.OriginalExists) {
        Write-Host "  Buscando referencias al archivo original..." -ForegroundColor Gray
        $result.OriginalReferences = Find-References $duplicate.Original
        Write-Host "  Referencias encontradas: $($result.OriginalReferences.Count)" -ForegroundColor $(if ($result.OriginalReferences.Count -eq 0) { 'Green' } else { 'Yellow' })
    }
    
    # Determinar si es seguro eliminar
    if ($result.OriginalExists -and $result.CompiledExists -and 
        $result.OriginalVsCompiled -eq "IDENTICOS" -and 
        $result.OriginalReferences.Count -eq 0 -and
        $result.TypeScriptExists) {
        
        $result.SafeToDelete = $true
        $result.Recommendation = "SEGURO ELIMINAR - Archivo original identico al compilado, sin referencias, y existe version TypeScript"
        Write-Host "  [OK] SEGURO PARA ELIMINAR" -ForegroundColor Green
    } else {
        $result.SafeToDelete = $false
        
        $reasons = @()
        if (-not $result.OriginalExists) { $reasons += "Original no existe" }
        if (-not $result.CompiledExists) { $reasons += "Compilado no existe" }
        if (-not $result.TypeScriptExists) { $reasons += "TypeScript no existe" }
        if ($result.OriginalVsCompiled -ne "IDENTICOS") { $reasons += "Archivos diferentes" }
        if ($result.OriginalReferences.Count -gt 0) { $reasons += "Tiene referencias ($($result.OriginalReferences.Count))" }
        
        $result.Recommendation = "NO ELIMINAR - " + ($reasons -join ", ")
        Write-Host "  [WARN] NO ELIMINAR" -ForegroundColor Red
        Write-Host "    Razon: $($result.Recommendation)" -ForegroundColor Red
    }
    
    $validationResults += $result
}

# Resumen final
Write-Host ""
Write-Host "=== RESUMEN DE VALIDACION ===" -ForegroundColor Green

$safeToDelete = $validationResults | Where-Object { $_.SafeToDelete }
$notSafeToDelete = $validationResults | Where-Object { -not $_.SafeToDelete }

Write-Host "Archivos seguros para eliminar: $($safeToDelete.Count)" -ForegroundColor Green
Write-Host "Archivos NO seguros para eliminar: $($notSafeToDelete.Count)" -ForegroundColor Red

if ($safeToDelete.Count -gt 0) {
    Write-Host ""
    Write-Host "ARCHIVOS SEGUROS PARA ELIMINAR:" -ForegroundColor Green
    foreach ($file in $safeToDelete) {
        Write-Host "  - $($file.FileName)" -ForegroundColor Green
    }
}

if ($notSafeToDelete.Count -gt 0) {
    Write-Host ""
    Write-Host "ARCHIVOS QUE REQUIEREN REVISION MANUAL:" -ForegroundColor Red
    foreach ($file in $notSafeToDelete) {
        Write-Host "  - $($file.FileName): $($file.Recommendation)" -ForegroundColor Red
    }
}

# Exportar resultados
$validationResults | ConvertTo-Json -Depth 3 | Out-File -FilePath "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\docs\auditoria-final\duplicate-validation-results.json" -Encoding UTF8

Write-Host ""
Write-Host "Resultados exportados a: duplicate-validation-results.json" -ForegroundColor Cyan
Write-Host "SIGUIENTE PASO: Revisar archivos marcados como NO seguros antes de proceder" -ForegroundColor Yellow