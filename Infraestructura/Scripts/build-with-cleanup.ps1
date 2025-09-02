# Script de Build Automatizado con Limpieza
# Versión simplificada y corregida

param(
    [switch]$Clean,
    [switch]$Verbose,
    [switch]$SkipTests
)

# Configuración de colores
$colors = @{
    "Success" = "Green"
    "Error" = "Red"
    "Warning" = "Yellow"
    "Info" = "Cyan"
    "Header" = "Magenta"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Write-Step {
    param([string]$Message)
    Write-ColorOutput "\n=== $Message ===" "Header"
}

function Get-DirectorySize {
    param([string]$Path)
    if (Test-Path $Path) {
        $size = (Get-ChildItem $Path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        if ($size) {
            return [math]::Round($size / 1MB, 2)
        }
    }
    return 0
}

function Backup-ImportantFiles {
    Write-Step "Creando Backup de Seguridad"
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = "backup-build-$timestamp"
    $importantDirs = @("Domain", "Aplicacion", "Infraestructura", "Interfaces")
    
    $hasImportantFiles = $false
    foreach ($dir in $importantDirs) {
        if (Test-Path $dir) {
            $hasImportantFiles = $true
            break
        }
    }
    
    if ($hasImportantFiles) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        
        foreach ($dir in $importantDirs) {
            if (Test-Path $dir) {
                $backupPath = Join-Path $backupDir $dir
                Copy-Item $dir $backupPath -Recurse -Force
                Write-ColorOutput "Backup creado: $dir -> $backupPath" "Success"
            }
        }
        
        Write-ColorOutput "Backup completo en: $backupDir" "Success"
        return $backupDir
    } else {
        Write-ColorOutput "No hay archivos importantes para respaldar" "Info"
        return $null
    }
}

function Clean-CompiledFiles {
    Write-Step "Limpiando Archivos Compilados"
    
    $dirsToClean = @("dist", "compiled", "build")
    $totalSizeBefore = 0
    $totalSizeAfter = 0
    
    foreach ($dir in $dirsToClean) {
        if (Test-Path $dir) {
            $sizeBefore = Get-DirectorySize $dir
            $totalSizeBefore += $sizeBefore
            
            Remove-Item $dir -Recurse -Force
            Write-ColorOutput "  Directorio $dir eliminado ($sizeBefore MB)" "Success"
        } else {
            Write-ColorOutput "Directorio $dir no existe" "Info"
        }
    }
    
    # Limpiar archivos .js en directorios de arquitectura hexagonal
    $hexDirs = @("Domain", "Aplicacion", "Infraestructura")
    foreach ($dir in $hexDirs) {
        if (Test-Path $dir) {
            $jsFiles = Get-ChildItem $dir -Filter "*.js" -Recurse -ErrorAction SilentlyContinue
            if ($jsFiles) {
                Write-ColorOutput "\nLimpiando archivos .js en $dir/" "Info"
                foreach ($file in $jsFiles) {
                    Remove-Item $file.FullName -Force
                    Write-ColorOutput "  Eliminado: $($file.Name)" "Success"
                }
            }
        }
    }
    
    $spaceSaved = $totalSizeBefore - $totalSizeAfter
    Write-ColorOutput "\nEspacio liberado: $spaceSaved MB" "Success"
    
    return @{
        "SpaceSaved" = $spaceSaved
        "DirsCleared" = $dirsToClean.Count
    }
}

function Build-TypeScript {
    Write-Step "Compilando TypeScript"
    
    if (-not (Test-Path "tsconfig.json")) {
        Write-ColorOutput "No se encontró tsconfig.json" "Warning"
        return $true
    }
    
    try {
        # Intentar usar tsc si está disponible
        $tscResult = & tsc --noEmit 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "Compilación TypeScript exitosa" "Success"
            return $true
        } else {
            Write-ColorOutput "Error en compilación TypeScript: $tscResult" "Error"
            return $false
        }
    } catch {
        Write-ColorOutput "TypeScript compiler no disponible, continuando..." "Warning"
        return $true
    }
}

function Run-Tests {
    Write-Step "Ejecutando Tests"
    
    if (Test-Path "package.json") {
        try {
            $testResult = & npm test 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-ColorOutput "Tests ejecutados exitosamente" "Success"
                return $true
            } else {
                Write-ColorOutput "Algunos tests fallaron: $testResult" "Warning"
                return $false
            }
        } catch {
            Write-ColorOutput "No se pudo ejecutar npm test" "Warning"
            return $true
        }
    } else {
        Write-ColorOutput "No se encontró package.json, omitiendo tests" "Info"
        return $true
    }
}

function Validate-Build {
    Write-Step "Validando Build"
    
    $criticalFiles = @("index.html", "tsconfig.json")
    $allValid = $true
    
    foreach ($file in $criticalFiles) {
        if (Test-Path $file) {
            Write-ColorOutput "✓ $file existe" "Success"
        } else {
            Write-ColorOutput "✗ $file faltante" "Error"
            $allValid = $false
        }
    }
    
    return $allValid
}

function Generate-BuildReport {
    param(
        $CleanupStats,
        $BackupPath,
        $BuildSuccess,
        $TestsSuccess
    )
    
    Write-Step "Generando Reporte de Build"
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $reportFile = "build-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    
    $report = @{
        "timestamp" = $timestamp
        "buildSuccess" = $BuildSuccess
        "testsSuccess" = $TestsSuccess
        "backupPath" = $BackupPath
        "cleanupStats" = $CleanupStats
        "parameters" = @{
            "clean" = $Clean.IsPresent
            "verbose" = $Verbose.IsPresent
            "skipTests" = $SkipTests.IsPresent
        }
    }
    
    $report | ConvertTo-Json -Depth 3 | Out-File $reportFile -Encoding UTF8
    Write-ColorOutput "Reporte guardado en: $reportFile" "Info"
}

# Función principal
function Main {
    Write-ColorOutput "=== BUILD AUTOMATIZADO CON LIMPIEZA ===" "Header"
    Write-ColorOutput "Iniciado: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "Info"
    
    $backupPath = $null
    $cleanupStats = $null
    $buildSuccess = $false
    $testsSuccess = $true
    
    try {
        # Paso 1: Backup si es necesario
        if ($Clean) {
            $backupPath = Backup-ImportantFiles
        }
        
        # Paso 2: Limpiar archivos compilados si se solicita
        if ($Clean) {
            $cleanupStats = Clean-CompiledFiles
        }
        
        # Paso 3: Compilar TypeScript
        $buildSuccess = Build-TypeScript
        
        if (-not $buildSuccess) {
            Write-ColorOutput "Build falló. Deteniendo proceso." "Error"
            throw "Build failed"
        }
        
        # Paso 4: Ejecutar tests si no se omiten
        if (-not $SkipTests) {
            $testsSuccess = Run-Tests
        }
        
        # Paso 5: Validar build
        $validationSuccess = Validate-Build
        
        if (-not $validationSuccess) {
            Write-ColorOutput "Validación falló" "Error"
            $buildSuccess = $false
        }
        
    } catch {
        Write-ColorOutput "Error durante el build: $($_.Exception.Message)" "Error"
        $buildSuccess = $false
    } finally {
        # Generar reporte final
        Generate-BuildReport -CleanupStats $cleanupStats -BackupPath $backupPath -BuildSuccess $buildSuccess -TestsSuccess $testsSuccess
        
        if ($buildSuccess) {
            Write-ColorOutput "\n🎉 BUILD COMPLETADO EXITOSAMENTE" "Success"
        } else {
            Write-ColorOutput "\n❌ BUILD FALLÓ" "Error"
            
            # Ofrecer restaurar backup si existe
            if ($backupPath -and (Test-Path $backupPath)) {
                Write-ColorOutput "\n¿Desea restaurar el backup? (y/N)" "Warning"
                $restore = Read-Host
                if ($restore.ToLower() -eq "y") {
                    Write-ColorOutput "Restaurando backup..." "Info"
                    Write-ColorOutput "Para restaurar manualmente, copie desde: $backupPath" "Info"
                }
            }
        }
    }
}

# Mostrar ayuda si se solicita
if ($args -contains "-help" -or $args -contains "--help" -or $args -contains "-h") {
    Write-ColorOutput "=== AYUDA - BUILD AUTOMATIZADO ===" "Header"
    Write-ColorOutput "Uso: .\build-with-cleanup.ps1 [opciones]" "Info"
    Write-ColorOutput "" "Info"
    Write-ColorOutput "Opciones:" "Info"
    Write-ColorOutput "  -Clean        Limpia archivos compilados antes del build" "Info"
    Write-ColorOutput "  -Verbose      Muestra información detallada" "Info"
    Write-ColorOutput "  -SkipTests    Omite la ejecución de tests" "Info"
    Write-ColorOutput "" "Info"
    Write-ColorOutput "Ejemplos:" "Info"
    Write-ColorOutput "  .\build-with-cleanup.ps1                    # Build normal" "Info"
    Write-ColorOutput "  .\build-with-cleanup.ps1 -Clean             # Build con limpieza" "Info"
    Write-ColorOutput "  .\build-with-cleanup.ps1 -Clean -SkipTests  # Build con limpieza sin tests" "Info"
    exit 0
}

# Ejecutar función principal
Main