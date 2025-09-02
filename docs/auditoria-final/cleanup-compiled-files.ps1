# Script de Limpieza de Archivos Compilados
# Proposito: Eliminar archivos compilados seguros (.d.ts, .js en compiled/, dist/)
# Generado: 2025-01-01

Write-Host "=== LIMPIEZA DE ARCHIVOS COMPILADOS ===" -ForegroundColor Green

# Directorios de archivos compilados
$compiledDirs = @(
    "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled",
    "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\dist"
)

# Contadores
$totalFiles = 0
$deletedFiles = 0
$totalSize = 0
$errors = @()

# Funcion para obtener tamaño legible
function Get-ReadableSize {
    param([long]$Size)
    
    if ($Size -gt 1MB) {
        return "{0:N2} MB" -f ($Size / 1MB)
    } elseif ($Size -gt 1KB) {
        return "{0:N2} KB" -f ($Size / 1KB)
    } else {
        return "$Size bytes"
    }
}

# Verificar que existen los directorios
foreach ($dir in $compiledDirs) {
    if (Test-Path $dir) {
        Write-Host "Analizando directorio: $dir" -ForegroundColor Cyan
        
        # Obtener todos los archivos compilados
        $files = Get-ChildItem -Path $dir -Recurse -File -Include "*.js", "*.d.ts", "*.js.map" -ErrorAction SilentlyContinue
        
        Write-Host "  Archivos encontrados: $($files.Count)" -ForegroundColor Gray
        
        foreach ($file in $files) {
            $totalFiles++
            $fileSize = $file.Length
            $totalSize += $fileSize
            
            try {
                # Mostrar archivo que se va a eliminar
                $relativePath = $file.FullName.Replace("C:\Users\joerl\OneDrive\UNAM\PRUEBAS\", "")
                Write-Host "    Eliminando: $relativePath ($(Get-ReadableSize $fileSize))" -ForegroundColor Yellow
                
                # Eliminar archivo
                Remove-Item $file.FullName -Force
                $deletedFiles++
                
            } catch {
                $errors += "Error eliminando $($file.FullName): $_"
                Write-Host "    [ERROR] No se pudo eliminar: $($file.Name)" -ForegroundColor Red
            }
        }
        
        # Eliminar directorios vacios
        try {
            $emptyDirs = Get-ChildItem -Path $dir -Recurse -Directory | Where-Object { (Get-ChildItem $_.FullName -Force | Measure-Object).Count -eq 0 }
            foreach ($emptyDir in $emptyDirs) {
                Write-Host "    Eliminando directorio vacio: $($emptyDir.Name)" -ForegroundColor Gray
                Remove-Item $emptyDir.FullName -Force
            }
        } catch {
            Write-Host "    [WARN] Error limpiando directorios vacios: $_" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "Directorio no encontrado: $dir" -ForegroundColor Yellow
    }
}

# Limpiar archivos .js duplicados en Domain/ que son identicos a compiled/
Write-Host ""
Write-Host "Analizando archivos .js en Domain/ (solo si son identicos a compiled/)" -ForegroundColor Cyan

$domainJsFiles = Get-ChildItem -Path "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain" -Recurse -Filter "*.js" -ErrorAction SilentlyContinue

foreach ($domainFile in $domainJsFiles) {
    # Buscar archivo correspondiente en compiled/
    $relativePath = $domainFile.FullName.Replace("C:\Users\joerl\OneDrive\UNAM\PRUEBAS\Domain\", "")
    $compiledFile = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\compiled\Domain\$relativePath"
    
    if (Test-Path $compiledFile) {
        # Comparar archivos
        $domainHash = Get-FileHash $domainFile.FullName -Algorithm MD5
        $compiledHash = Get-FileHash $compiledFile -Algorithm MD5
        
        if ($domainHash.Hash -eq $compiledHash.Hash) {
            # Verificar que existe archivo .ts correspondiente
            $tsFile = $domainFile.FullName.Replace(".js", ".ts")
            
            if (Test-Path $tsFile) {
                try {
                    $fileSize = $domainFile.Length
                    $totalSize += $fileSize
                    
                    Write-Host "    Eliminando JS duplicado: Domain\$relativePath ($(Get-ReadableSize $fileSize))" -ForegroundColor Yellow
                    Remove-Item $domainFile.FullName -Force
                    $deletedFiles++
                    
                } catch {
                    $errors += "Error eliminando $($domainFile.FullName): $_"
                    Write-Host "    [ERROR] No se pudo eliminar: $($domainFile.Name)" -ForegroundColor Red
                }
            } else {
                Write-Host "    [SKIP] No existe archivo .ts para: $($domainFile.Name)" -ForegroundColor Gray
            }
        } else {
            Write-Host "    [SKIP] Archivos diferentes: $($domainFile.Name)" -ForegroundColor Gray
        }
    }
}

# Resumen final
Write-Host ""
Write-Host "=== RESUMEN DE LIMPIEZA ===" -ForegroundColor Green
Write-Host "Archivos analizados: $totalFiles" -ForegroundColor White
Write-Host "Archivos eliminados: $deletedFiles" -ForegroundColor Green
Write-Host "Espacio recuperado: $(Get-ReadableSize $totalSize)" -ForegroundColor Green

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "ERRORES ENCONTRADOS:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
}

# Crear reporte
$report = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    TotalFilesAnalyzed = $totalFiles
    FilesDeleted = $deletedFiles
    SpaceRecovered = $totalSize
    SpaceRecoveredReadable = Get-ReadableSize $totalSize
    Errors = $errors
    DirectoriesProcessed = $compiledDirs
}

$report | ConvertTo-Json -Depth 3 | Out-File -FilePath "C:\Users\joerl\OneDrive\UNAM\PRUEBAS\docs\auditoria-final\compiled-cleanup-report.json" -Encoding UTF8

Write-Host ""
Write-Host "Reporte guardado en: compiled-cleanup-report.json" -ForegroundColor Cyan
Write-Host "SIGUIENTE PASO: Ejecutar tests para verificar que todo funciona correctamente" -ForegroundColor Yellow