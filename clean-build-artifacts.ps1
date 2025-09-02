#!/usr/bin/env pwsh
# Script de limpieza automática de artefactos de compilación
# Uso: ./clean-build-artifacts.ps1 [-Force] [-Verbose]

param(
    [switch]$Force,
    [switch]$Verbose
)

# Configuración
$BuildDirectories = @('dist', 'compiled', 'build')
$BackupSuffix = '_backup_' + (Get-Date -Format 'yyyyMMdd_HHmmss')
$LogFile = 'build-cleanup.log'

function Write-Log {
    param([string]$Message, [string]$Level = 'INFO')
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logEntry = "[$timestamp] [$Level] $Message"
    
    if ($Verbose) {
        Write-Host $logEntry
    }
    
    Add-Content -Path $LogFile -Value $logEntry
}

function Test-BuildArtifacts {
    Write-Log "Iniciando análisis de artefactos de compilación..."
    
    $foundIssues = @()
    
    foreach ($dir in $BuildDirectories) {
        if (Test-Path $dir) {
            Write-Log "Analizando directorio: $dir"
            
            # Verificar si está vacío o solo contiene carpetas vacías
            $allFiles = Get-ChildItem -Path $dir -Recurse -Force -File -ErrorAction SilentlyContinue
            $isEmpty = $allFiles.Count -eq 0
            
            if ($isEmpty) {
                $foundIssues += @{
                    Directory = $dir
                    Issue = 'EMPTY'
                    Description = 'Directorio vacío o solo con carpetas vacías que debería eliminarse'
                }
                Write-Log "Directorio vacío detectado: $dir (solo carpetas vacías)"
            } else {
                # Buscar archivos fuente en directorios de build
                $sourceFiles = Get-ChildItem -Path $dir -Recurse -Include '*.ts', '*.tsx' -Force
                $suspiciousJs = Get-ChildItem -Path $dir -Recurse -Include '*.js' -Force | Where-Object {
                    $baseName = $_.FullName -replace '\.js$', ''
                    -not (Test-Path "$baseName.d.ts") -and -not (Test-Path "$baseName.js.map")
                }
                
                if ($sourceFiles.Count -gt 0 -or $suspiciousJs.Count -gt 0) {
                    $foundIssues += @{
                        Directory = $dir
                        Issue = 'SOURCE_FILES'
                        Description = "Contiene $($sourceFiles.Count + $suspiciousJs.Count) archivos fuente"
                        Files = ($sourceFiles + $suspiciousJs) | Select-Object -First 5
                    }
                }
            }
        }
    }
    
    return $foundIssues
}

function Remove-BuildArtifacts {
    param([array]$Issues)
    
    Write-Log "Iniciando limpieza de artefactos..."
    
    foreach ($issue in $Issues) {
        $dir = $issue.Directory
        
        if (Test-Path $dir) {
            try {
                if (-not $Force) {
                    # Crear backup antes de eliminar
                    $backupPath = "$dir$BackupSuffix"
                    Write-Log "Creando backup: $backupPath"
                    Copy-Item -Path $dir -Destination $backupPath -Recurse -Force
                }
                
                Write-Log "Eliminando directorio: $dir"
                Remove-Item -Path $dir -Recurse -Force
                
                Write-Log "Directorio $dir eliminado exitosamente" -Level 'SUCCESS'
                
            } catch {
                Write-Log "Error eliminando $dir : $($_.Exception.Message)" -Level 'ERROR'
            }
        }
    }
}

function Show-CleanupReport {
    param([array]$Issues)
    
    Write-Host "`nREPORTE DE LIMPIEZA DE ARTEFACTOS" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
    
    if ($Issues.Count -eq 0) {
        Write-Host "No se encontraron artefactos problemáticos" -ForegroundColor Green
        return
    }
    
    Write-Host "Problemas encontrados: $($Issues.Count)" -ForegroundColor Yellow
    
    foreach ($issue in $Issues) {
        Write-Host "`n$($issue.Directory)/" -ForegroundColor White
        Write-Host "   Problema: $($issue.Issue)" -ForegroundColor Red
        Write-Host "   Descripción: $($issue.Description)" -ForegroundColor Gray
        
        if ($issue.Files) {
            Write-Host "   Archivos afectados:" -ForegroundColor Gray
            foreach ($file in $issue.Files) {
                $relativePath = $file.FullName -replace [regex]::Escape((Get-Location).Path + '\\'), ''
                Write-Host "     $relativePath" -ForegroundColor DarkGray
            }
        }
    }
    
    Write-Host "`nRecomendaciones:" -ForegroundColor Cyan
    Write-Host "   • Ejecutar con -Force para limpiar automáticamente"
    Write-Host "   • Verificar que .gitignore incluya: /dist, /compiled, /build"
    Write-Host "   • Integrar este script en el proceso de build"
}

function Main {
    Write-Log "=== INICIO DE LIMPIEZA DE ARTEFACTOS ==="
    
    # Análisis
    $issues = Test-BuildArtifacts
    
    # Mostrar reporte
    Show-CleanupReport -Issues $issues
    
    # Limpieza automática si se especifica -Force
    if ($Force -and $issues.Count -gt 0) {
        Write-Host "`nEjecutando limpieza automática..." -ForegroundColor Yellow
        Remove-BuildArtifacts -Issues $issues
        
        Write-Host "`nLimpieza completada" -ForegroundColor Green
        Write-Host "Log detallado: $LogFile" -ForegroundColor Gray
    } elseif ($issues.Count -gt 0) {
        Write-Host "`nPara ejecutar la limpieza automática, usa: ./clean-build-artifacts.ps1 -Force" -ForegroundColor Yellow
    }
    
    Write-Log "=== FIN DE LIMPIEZA DE ARTEFACTOS ==="
    
    # Código de salida
    if ($issues.Count -gt 0 -and -not $Force) {
        exit 1  # Hay problemas pero no se limpiaron
    } else {
        exit 0  # Todo limpio o se limpiaron los problemas
    }
}

# Ejecutar script principal
Main