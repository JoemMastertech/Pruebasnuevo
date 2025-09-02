#!/usr/bin/env pwsh
# Script de build con limpieza automática de artefactos
# Uso: ./build-with-cleanup.ps1 [-Clean] [-Verbose] [-SkipTests]

param(
    [switch]$Clean,
    [switch]$Verbose,
    [switch]$SkipTests
)

# Configuración
$LogFile = 'build-process.log'
$BuildDirs = @('dist', 'compiled', 'build')

function Write-Log {
    param([string]$Message, [string]$Level = 'INFO')
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logEntry = "[$timestamp] [$Level] $Message"
    
    if ($Verbose) {
        Write-Host $logEntry
    }
    
    Add-Content -Path $LogFile -Value $logEntry
}

function Test-Prerequisites {
    Write-Log "Verificando prerequisitos..."
    
    # Verificar Node.js
    try {
        $nodeVersion = node --version
        Write-Log "Node.js encontrado: $nodeVersion"
    } catch {
        Write-Log "❌ Node.js no encontrado" -Level 'ERROR'
        return $false
    }
    
    # Verificar TypeScript
    try {
        $tscVersion = npx tsc --version
        Write-Log "TypeScript encontrado: $tscVersion"
    } catch {
        Write-Log "⚠️ TypeScript no encontrado, instalando..." -Level 'WARN'
        npm install -g typescript
    }
    
    # Verificar package.json
    if (-not (Test-Path 'package.json')) {
        Write-Log "❌ package.json no encontrado" -Level 'ERROR'
        return $false
    }
    
    return $true
}

function Invoke-CleanArtifacts {
    Write-Log "Ejecutando limpieza de artefactos..."
    
    if (Test-Path './clean-build-artifacts.ps1') {
        try {
            & './clean-build-artifacts.ps1' -Force -Verbose:$Verbose
            Write-Log "✅ Limpieza de artefactos completada"
        } catch {
            Write-Log "⚠️ Error en limpieza de artefactos: $($_.Exception.Message)" -Level 'WARN'
        }
    } else {
        # Limpieza manual básica
        Write-Log "Script de limpieza no encontrado, ejecutando limpieza básica..."
        foreach ($dir in $BuildDirs) {
            if (Test-Path $dir) {
                Write-Log "Eliminando $dir/"
                Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

function Install-Dependencies {
    Write-Log "Instalando dependencias..."
    
    try {
        npm install
        Write-Log "✅ Dependencias instaladas"
        return $true
    } catch {
        Write-Log "❌ Error instalando dependencias: $($_.Exception.Message)" -Level 'ERROR'
        return $false
    }
}

function Invoke-Build {
    Write-Log "Iniciando proceso de compilación..."
    
    try {
        # Compilar TypeScript
        Write-Log "Compilando TypeScript..."
        npx tsc
        
        # Verificar si hay script de build en package.json
        $packageJson = Get-Content 'package.json' | ConvertFrom-Json
        if ($packageJson.scripts -and $packageJson.scripts.build) {
            Write-Log "Ejecutando script de build personalizado..."
            npm run build
        }
        
        Write-Log "✅ Compilación completada"
        return $true
    } catch {
        Write-Log "❌ Error en compilación: $($_.Exception.Message)" -Level 'ERROR'
        return $false
    }
}

function Invoke-Tests {
    if ($SkipTests) {
        Write-Log "⏭️ Tests omitidos por parámetro -SkipTests"
        return $true
    }
    
    Write-Log "Ejecutando tests..."
    
    try {
        $packageJson = Get-Content 'package.json' | ConvertFrom-Json
        
        if ($packageJson.scripts -and $packageJson.scripts.test) {
            npm test
            Write-Log "✅ Tests completados"
        } else {
            Write-Log "⚠️ No se encontró script de test en package.json" -Level 'WARN'
        }
        
        return $true
    } catch {
        Write-Log "❌ Tests fallaron: $($_.Exception.Message)" -Level 'ERROR'
        return $false
    }
}

function Invoke-StructureValidation {
    Write-Log "Validando estructura del proyecto..."
    
    if (Test-Path './cicd-preventive-rules.js') {
        try {
            node './cicd-preventive-rules.js'
            Write-Log "✅ Validación de estructura exitosa"
            return $true
        } catch {
            Write-Log "❌ Validación de estructura falló: $($_.Exception.Message)" -Level 'ERROR'
            return $false
        }
    } else {
        Write-Log "⚠️ Script de validación no encontrado" -Level 'WARN'
        return $true
    }
}

function Show-BuildSummary {
    param([bool]$Success, [datetime]$StartTime)
    
    $duration = (Get-Date) - $StartTime
    
    Write-Host "`n🏗️ RESUMEN DEL BUILD" -ForegroundColor Cyan
    Write-Host "=" * 30 -ForegroundColor Cyan
    
    if ($Success) {
        Write-Host "✅ Build completado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Build falló" -ForegroundColor Red
    }
    
    Write-Host "⏱️ Duración: $($duration.ToString('mm\:ss'))" -ForegroundColor Gray
    Write-Host "📋 Log detallado: $LogFile" -ForegroundColor Gray
    
    # Mostrar estructura de salida
    Write-Host "`n📁 Estructura generada:" -ForegroundColor Cyan
    foreach ($dir in $BuildDirs) {
        if (Test-Path $dir) {
            $fileCount = (Get-ChildItem -Path $dir -Recurse -File | Measure-Object).Count
            Write-Host "   $dir/ ($fileCount archivos)" -ForegroundColor White
        }
    }
}

function Main {
    $startTime = Get-Date
    Write-Log "=== INICIO DEL PROCESO DE BUILD ==="
    
    Write-Host "🏗️ Iniciando build con limpieza automática..." -ForegroundColor Cyan
    
    # 1. Verificar prerequisitos
    if (-not (Test-Prerequisites)) {
        Write-Host "❌ Prerequisitos no cumplidos" -ForegroundColor Red
        exit 1
    }
    
    # 2. Limpieza de artefactos (siempre o si se especifica -Clean)
    if ($Clean -or $true) {  # Siempre limpiar por defecto
        Invoke-CleanArtifacts
    }
    
    # 3. Instalar dependencias
    if (-not (Install-Dependencies)) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
    
    # 4. Compilar
    if (-not (Invoke-Build)) {
        Write-Host "❌ Error en compilación" -ForegroundColor Red
        exit 1
    }
    
    # 5. Ejecutar tests
    if (-not (Invoke-Tests)) {
        Write-Host "❌ Tests fallaron" -ForegroundColor Red
        exit 1
    }
    
    # 6. Validar estructura
    if (-not (Invoke-StructureValidation)) {
        Write-Host "❌ Validación de estructura falló" -ForegroundColor Red
        exit 1
    }
    
    Write-Log "=== BUILD COMPLETADO EXITOSAMENTE ==="
    Show-BuildSummary -Success $true -StartTime $startTime
    
    exit 0
}

# Manejo de errores global
trap {
    Write-Log "❌ Error inesperado: $($_.Exception.Message)" -Level 'ERROR'
    Show-BuildSummary -Success $false -StartTime $startTime
    exit 1
}

# Ejecutar script principal
Main