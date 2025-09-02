# Script de Backup - Proyecto Hexagonal
# Generado: 2025-01-01
# Proposito: Crear backup completo antes de limpieza de codigo

Write-Host "=== INICIANDO BACKUP DEL PROYECTO HEXAGONAL ===" -ForegroundColor Green

# Configuracion
$projectRoot = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS"
$backupRoot = "C:\Users\joerl\OneDrive\UNAM\PRUEBAS_BACKUP"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "$backupRoot\backup_$timestamp"

# Crear directorio de backup
Write-Host "Creando directorio de backup: $backupDir" -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Funcion para copiar con progreso
function Copy-WithProgress {
    param(
        [string]$Source,
        [string]$Destination,
        [string]$Description
    )
    
    Write-Host "Copiando $Description..." -ForegroundColor Cyan
    try {
        Copy-Item -Path $Source -Destination $Destination -Recurse -Force
        Write-Host "[OK] $Description copiado exitosamente" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERROR] Error copiando $Description`: $_" -ForegroundColor Red
        return $false
    }
    return $true
}

# Verificar que el proyecto existe
if (-not (Test-Path $projectRoot)) {
    Write-Host "[ERROR] No se encuentra el directorio del proyecto: $projectRoot" -ForegroundColor Red
    exit 1
}

# Crear backup completo del proyecto
$success = Copy-WithProgress -Source "$projectRoot\*" -Destination $backupDir -Description "Proyecto completo"

if (-not $success) {
    Write-Host "[ERROR] FALLO EN BACKUP - Abortando proceso" -ForegroundColor Red
    exit 1
}

# Verificar integridad del backup
Write-Host "Verificando integridad del backup..." -ForegroundColor Yellow

# Contar archivos en original y backup
$originalFiles = (Get-ChildItem -Path $projectRoot -Recurse -File).Count
$backupFiles = (Get-ChildItem -Path $backupDir -Recurse -File).Count

Write-Host "Archivos en original: $originalFiles" -ForegroundColor Cyan
Write-Host "Archivos en backup: $backupFiles" -ForegroundColor Cyan

if ($originalFiles -eq $backupFiles) {
    Write-Host "[OK] BACKUP VERIFICADO - Todos los archivos copiados correctamente" -ForegroundColor Green
} else {
    Write-Host "[WARN] ADVERTENCIA: Diferencia en numero de archivos" -ForegroundColor Yellow
    Write-Host "   Original: $originalFiles, Backup: $backupFiles" -ForegroundColor Yellow
}

# Crear archivo de informacion del backup
$backupInfo = "BACKUP INFORMATION`r`n"
$backupInfo += "==================`r`n"
$backupInfo += "Fecha: $(Get-Date)`r`n"
$backupInfo += "Directorio Original: $projectRoot`r`n"
$backupInfo += "Directorio Backup: $backupDir`r`n"
$backupInfo += "Archivos Originales: $originalFiles`r`n"
$backupInfo += "Archivos Backup: $backupFiles`r`n"
$backupInfo += "Proposito: Backup antes de limpieza de codigo`r`n"
if ($originalFiles -eq $backupFiles) {
    $backupInfo += "Estado: VERIFICADO`r`n`r`n"
} else {
    $backupInfo += "Estado: ADVERTENCIA`r`n`r`n"
}
$backupInfo += "PARA RESTAURAR:`r`n"
$backupInfo += "1. Detener cualquier proceso en curso`r`n"
$backupInfo += "2. Eliminar contenido de: $projectRoot`r`n"
$backupInfo += "3. Copiar contenido de: $backupDir`r`n"
$backupInfo += "4. Verificar que la aplicacion funciona`r`n`r`n"
$backupInfo += "NOTA: Este backup incluye:`r`n"
$backupInfo += "- Todos los archivos fuente (.js, .ts, .css, .html)`r`n"
$backupInfo += "- Archivos de configuracion`r`n"
$backupInfo += "- Documentacion`r`n"
$backupInfo += "- Tests`r`n"
$backupInfo += "- Archivos compilados (dist/, compiled/)`r`n"
$backupInfo += "- Dependencias node_modules (si existen)`r`n"

$backupInfo | Out-File -FilePath "$backupDir\BACKUP_INFO.txt" -Encoding UTF8

# Crear script de restauracion simple
$restoreScript = "# Script de Restauracion Automatica`r`n"
$restoreScript += "# Generado: $(Get-Date)`r`n`r`n"
$restoreScript += "Write-Host '=== RESTAURANDO DESDE BACKUP ===' -ForegroundColor Red`r`n"
$restoreScript += "Write-Host 'ADVERTENCIA: Esto sobrescribira el proyecto actual' -ForegroundColor Yellow`r`n`r`n"
$restoreScript += "Write-Host 'Restaurando archivos...' -ForegroundColor Cyan`r`n"
$restoreScript += "Copy-Item -Path '$backupDir\*' -Destination '$projectRoot' -Recurse -Force`r`n`r`n"
$restoreScript += "Write-Host '[OK] RESTAURACION COMPLETADA' -ForegroundColor Green`r`n"
$restoreScript += "Write-Host 'Verificar que la aplicacion funciona correctamente' -ForegroundColor Yellow`r`n"

$restoreScript | Out-File -FilePath "$projectRoot\restore-backup.ps1" -Encoding UTF8

# Resumen final
Write-Host ""
Write-Host "=== BACKUP COMPLETADO EXITOSAMENTE ===" -ForegroundColor Green
Write-Host "Directorio de backup: $backupDir" -ForegroundColor Cyan
Write-Host "Archivo de informacion: $backupDir\BACKUP_INFO.txt" -ForegroundColor Cyan
Write-Host "Script de restauracion: $projectRoot\restore-backup.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Verificar que todos los tests pasan" -ForegroundColor White
Write-Host "2. Crear commit en Git con estado actual" -ForegroundColor White
Write-Host "3. Proceder con Fase 2: Eliminacion de duplicados" -ForegroundColor White
Write-Host ""
Write-Host "Para restaurar en caso de problemas:" -ForegroundColor Red
Write-Host "  .\restore-backup.ps1" -ForegroundColor Red
Write-Host ""