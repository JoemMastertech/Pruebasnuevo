# Script de Consolidacion de Duplicados - PowerShell
# Fase 3 & 4: Clasificacion y Ejecucion Controlada
# Version optimizada para Windows con OneDrive

param(
    [string]$ProjectPath = $PWD,
    [string]$ReferenceAnalysisPath = "$ProjectPath\reference-analysis.json"
)

# Configuracion
$BackupDir = "$ProjectPath\__CONSOLIDATION_BACKUP__"
$Results = @{
    consolidations = @()
    errors = @()
    summary = @{
        totalConsolidations = 0
        successfulConsolidations = 0
        failedConsolidations = 0
        filesProcessed = 0
    }
}

Write-Host "Iniciando consolidacion de duplicados..." -ForegroundColor Cyan

# Funcion para crear respaldo
function Create-Backup {
    Write-Host "Creando respaldo de seguridad..." -ForegroundColor Yellow
    
    if (Test-Path $BackupDir) {
        Write-Host "Eliminando respaldo anterior..." -ForegroundColor Yellow
        Remove-Item $BackupDir -Recurse -Force
    }
    
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    
    # Respaldar carpetas criticas
    $foldersToBackup = @("Dominio", "Domain", "Infrastructure", "Infraestructura", "Aplicacion", "Components")
    
    foreach ($folder in $foldersToBackup) {
        $sourcePath = "$ProjectPath\$folder"
        if (Test-Path $sourcePath) {
            $backupPath = "$BackupDir\$folder"
            Copy-Item $sourcePath $backupPath -Recurse -Force
            Write-Host "Respaldado: $folder" -ForegroundColor Green
        }
    }
    
    Write-Host "Respaldo completado" -ForegroundColor Green
}

# Funcion para consolidar usando robocopy
function Consolidate-Folders {
    param(
        [string]$SourceFolder,
        [string]$TargetFolder
    )
    
    $sourcePath = "$ProjectPath\$SourceFolder"
    $targetPath = "$ProjectPath\$TargetFolder"
    
    Write-Host "Consolidando: $SourceFolder -> $TargetFolder" -ForegroundColor Cyan
    
    $consolidation = @{
        source = $SourceFolder
        target = $TargetFolder
        status = "pending"
        filesProcessed = 0
        errors = @()
    }
    
    try {
        # Verificar que la carpeta fuente existe
        if (-not (Test-Path $sourcePath)) {
            Write-Host "Carpeta fuente no existe: $SourceFolder" -ForegroundColor Yellow
            $consolidation.status = "skipped"
            $consolidation.errors += "Carpeta fuente no existe"
            return $consolidation
        }
        
        # Si la carpeta destino no existe, simplemente renombrar
        if (-not (Test-Path $targetPath)) {
            Write-Host "Renombrando $SourceFolder -> $TargetFolder" -ForegroundColor Blue
            
            # Intentar con Move-Item primero
            try {
                Move-Item $sourcePath $targetPath -Force
                $consolidation.status = "renamed"
                $consolidation.filesProcessed = (Get-ChildItem $targetPath -Recurse -File).Count
                Write-Host "Renombrado exitoso" -ForegroundColor Green
                return $consolidation
            }
            catch {
                Write-Host "Move-Item fallo, intentando con robocopy..." -ForegroundColor Yellow
            }
        }
        
        # Usar robocopy para mergear contenido
        Write-Host "Mergeando contenido con robocopy..." -ForegroundColor Blue
        
        # Crear directorio destino si no existe
        if (-not (Test-Path $targetPath)) {
            New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
        }
        
        # Usar robocopy para copiar archivos
        $robocopyArgs = @(
            $sourcePath,
            $targetPath,
            "/E",          # Copiar subdirectorios incluyendo vacios
            "/XC",         # Excluir archivos cambiados
            "/XN",         # Excluir archivos mas nuevos
            "/XO",         # Excluir archivos mas viejos
            "/R:3",        # Reintentos
            "/W:1",        # Tiempo de espera
            "/NP",         # No mostrar progreso
            "/NDL",        # No mostrar lista de directorios
            "/NFL"         # No mostrar lista de archivos
        )
        
        $robocopyResult = & robocopy @robocopyArgs
        $robocopyExitCode = $LASTEXITCODE
        
        # Robocopy exit codes: 0-7 son exito, 8+ son errores
        if ($robocopyExitCode -lt 8) {
            Write-Host "Robocopy completado (codigo: $robocopyExitCode)" -ForegroundColor Green
            
            # Contar archivos procesados
            $consolidation.filesProcessed = (Get-ChildItem $targetPath -Recurse -File).Count
            
            # Intentar eliminar carpeta fuente
            try {
                Write-Host "Eliminando carpeta fuente..." -ForegroundColor Blue
                Remove-Item $sourcePath -Recurse -Force
                $consolidation.status = "completed"
                Write-Host "Consolidacion completada" -ForegroundColor Green
            }
            catch {
                Write-Host "No se pudo eliminar carpeta fuente: $($_.Exception.Message)" -ForegroundColor Yellow
                $consolidation.status = "partial"
                $consolidation.errors += "No se pudo eliminar carpeta fuente"
            }
        }
        else {
            throw "Robocopy fallo con codigo: $robocopyExitCode"
        }
        
    }
    catch {
        Write-Host "Error consolidando $SourceFolder : $($_.Exception.Message)" -ForegroundColor Red
        $consolidation.status = "failed"
        $consolidation.errors += $_.Exception.Message
    }
    
    return $consolidation
}

# Funcion para actualizar referencias
function Update-References {
    Write-Host "Actualizando referencias..." -ForegroundColor Cyan
    
    $referenceMap = @{
        "Application/" = "Aplicacion/"
        "Dominio/" = "Domain/"
        "Infrastructure/" = "Infraestructura/"
        "Componentes/" = "Components/"
    }
    
    $filesToUpdate = @("index.html", "hexagonal-bootstrap.js", "ESTRUCTURA_PROYECTO.md")
    
    foreach ($fileName in $filesToUpdate) {
        $filePath = "$ProjectPath\$fileName"
        if (Test-Path $filePath) {
            try {
                $content = Get-Content $filePath -Raw -Encoding UTF8
                $updated = $false
                
                foreach ($oldRef in $referenceMap.Keys) {
                    $newRef = $referenceMap[$oldRef]
                    if ($content -match [regex]::Escape($oldRef)) {
                        $content = $content -replace [regex]::Escape($oldRef), $newRef
                        $updated = $true
                        Write-Host "Actualizado $fileName : $oldRef -> $newRef" -ForegroundColor Blue
                    }
                }
                
                if ($updated) {
                    Set-Content $filePath $content -Encoding UTF8
                }
            }
            catch {
                Write-Host "Error actualizando $fileName : $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
}

# Funcion para validar proyecto
function Test-ProjectIntegrity {
    Write-Host "Validando integridad del proyecto..." -ForegroundColor Cyan
    
    $validations = @{
        indexHtml = $false
        packageJson = $false
        tsconfig = $false
        mainDirectories = $false
    }
    
    # Verificar index.html
    if (Test-Path "$ProjectPath\index.html") {
        $validations.indexHtml = $true
        Write-Host "index.html existe" -ForegroundColor Green
    } else {
        Write-Host "index.html no encontrado" -ForegroundColor Red
    }
    
    # Verificar package.json
    if (Test-Path "$ProjectPath\Infraestructura\Config\package.json") {
        $validations.packageJson = $true
        Write-Host "package.json existe" -ForegroundColor Green
    } else {
        Write-Host "package.json no encontrado" -ForegroundColor Red
    }
    
    # Verificar tsconfig.json
    if (Test-Path "$ProjectPath\Infraestructura\Config\tsconfig.json") {
        $validations.tsconfig = $true
        Write-Host "tsconfig.json existe" -ForegroundColor Green
    } else {
        Write-Host "tsconfig.json no encontrado" -ForegroundColor Red
    }
    
    # Verificar directorios principales
    $mainDirs = @("Domain", "Aplicacion", "Infraestructura", "Shared", "Tests")
    $existingDirs = $mainDirs | Where-Object { Test-Path "$ProjectPath\$_" }
    
    if ($existingDirs.Count -ge 4) {
        $validations.mainDirectories = $true
        Write-Host "Directorios principales: $($existingDirs -join ', ')" -ForegroundColor Green
    } else {
        Write-Host "Faltan directorios principales: $($existingDirs -join ', ')" -ForegroundColor Red
    }
    
    $allValid = $validations.Values -notcontains $false
    if ($allValid) {
        Write-Host "Validacion exitosa" -ForegroundColor Green
    } else {
        Write-Host "Validacion con advertencias" -ForegroundColor Yellow
    }
    
    return $validations
}

# Funcion para generar reporte
function New-ConsolidationReport {
    $report = @{
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        summary = $Results.summary
        consolidations = $Results.consolidations
        errors = $Results.errors
        backupLocation = $BackupDir
        nextSteps = @(
            "Verificar que la aplicacion funciona correctamente",
            "Ejecutar tests si estan disponibles",
            "Actualizar documentacion",
            "Eliminar respaldo si todo funciona bien"
        )
    }
    
    # Guardar JSON
    $report | ConvertTo-Json -Depth 10 | Set-Content "$ProjectPath\consolidation-report-ps.json" -Encoding UTF8
    
    # Generar Markdown
    $markdown = "# Reporte de Consolidacion PowerShell`n`n"
    $markdown += "**Fecha:** $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')`n`n"
    $markdown += "## Resumen`n`n"
    $markdown += "- **Consolidaciones totales:** $($Results.summary.totalConsolidations)`n"
    $markdown += "- **Exitosas:** $($Results.summary.successfulConsolidations)`n"
    $markdown += "- **Fallidas:** $($Results.summary.failedConsolidations)`n"
    $markdown += "- **Archivos procesados:** $($Results.summary.filesProcessed)`n`n"
    $markdown += "## Consolidaciones Realizadas`n`n"
    
    foreach ($consolidation in $Results.consolidations) {
        $status = switch ($consolidation.status) {
            "completed" { "EXITOSA" }
            "partial" { "PARCIAL" }
            "failed" { "FALLIDA" }
            "skipped" { "OMITIDA" }
            default { "DESCONOCIDA" }
        }
        
        $markdown += "### $status $($consolidation.source) -> $($consolidation.target)`n"
        $markdown += "**Estado:** $($consolidation.status)`n"
        $markdown += "**Archivos procesados:** $($consolidation.filesProcessed)`n"
        
        if ($consolidation.errors.Count -gt 0) {
            $markdown += "**Errores:** $($consolidation.errors -join ', ')`n"
        }
        $markdown += "`n"
    }
    
    if ($Results.errors.Count -gt 0) {
        $markdown += "## Errores`n`n"
        foreach ($error in $Results.errors) {
            $markdown += "- $error`n"
        }
    }
    
    $markdown += "`n## Respaldo`n`n"
    $markdown += "Los archivos originales estan respaldados en: $BackupDir`n`n"
    $markdown += "## Proximos Pasos`n`n"
    $markdown += "1. Verificar que la aplicacion funciona correctamente`n"
    $markdown += "2. Ejecutar tests si estan disponibles`n"
    $markdown += "3. Actualizar documentacion`n"
    $markdown += "4. Si todo funciona bien, eliminar el respaldo`n"
    
    Set-Content "$ProjectPath\CONSOLIDATION_REPORT_PS.md" $markdown -Encoding UTF8
    
    return $report
}

# EJECUCION PRINCIPAL
try {
    # Verificar que existe el analisis de referencias
    if (-not (Test-Path $ReferenceAnalysisPath)) {
        throw "No se encontro el archivo de analisis de referencias: $ReferenceAnalysisPath"
    }
    
    # Cargar analisis
    $analysisData = Get-Content $ReferenceAnalysisPath -Raw | ConvertFrom-Json
    Write-Host "Analisis de referencias cargado" -ForegroundColor Green
    
    # Crear respaldo
    Create-Backup
    
    # Definir consolidaciones basadas en el analisis
    $consolidationPlans = @(
        @{ source = "Dominio"; target = "Domain" },
        @{ source = "Infrastructure"; target = "Infraestructura" }
    )
    
    Write-Host "Ejecutando $($consolidationPlans.Count) consolidaciones..." -ForegroundColor Cyan
    
    # Ejecutar consolidaciones
    foreach ($plan in $consolidationPlans) {
        $result = Consolidate-Folders -SourceFolder $plan.source -TargetFolder $plan.target
        $Results.consolidations += $result
        $Results.summary.totalConsolidations++
        
        if ($result.status -in @("completed", "renamed", "partial")) {
            $Results.summary.successfulConsolidations++
            $Results.summary.filesProcessed += $result.filesProcessed
        } elseif ($result.status -eq "failed") {
            $Results.summary.failedConsolidations++
            $Results.errors += "Error en $($result.source): $($result.errors -join ', ')"
        }
    }
    
    # Actualizar referencias
    Update-References
    
    # Validar proyecto
    $validation = Test-ProjectIntegrity
    
    # Generar reporte
    $report = New-ConsolidationReport
    
    # Mostrar resumen final
    Write-Host "Consolidacion completada:" -ForegroundColor Cyan
    Write-Host "$($Results.summary.successfulConsolidations)/$($Results.summary.totalConsolidations) consolidaciones exitosas" -ForegroundColor Green
    Write-Host "$($Results.summary.filesProcessed) archivos procesados" -ForegroundColor Blue
    
    if ($Results.summary.failedConsolidations -gt 0) {
        Write-Host "$($Results.summary.failedConsolidations) consolidaciones fallidas" -ForegroundColor Red
    }
    
    Write-Host "Reportes generados:" -ForegroundColor Cyan
    Write-Host "- consolidation-report-ps.json" -ForegroundColor White
    Write-Host "- CONSOLIDATION_REPORT_PS.md" -ForegroundColor White
    
    Write-Host "Respaldo disponible en: $BackupDir" -ForegroundColor Yellow
    
    if ($Results.summary.failedConsolidations -eq 0) {
        Write-Host "Todas las consolidaciones fueron exitosas" -ForegroundColor Green
        Write-Host "Recomendacion: Probar la aplicacion y eliminar respaldo si todo funciona" -ForegroundColor Cyan
    } else {
        Write-Host "Algunas consolidaciones fallaron, revisar reporte para detalles" -ForegroundColor Yellow
    }
    
}
catch {
    Write-Host "Error durante el proceso: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Proceso de consolidacion PowerShell completado" -ForegroundColor Green