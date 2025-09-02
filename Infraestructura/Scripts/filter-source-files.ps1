# Script para filtrar archivos fuente sin referencias
param(
    [string]$JsonFile = "unreferenced-files-analysis-*.json",
    [switch]$Interactive,
    [switch]$Help
)

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Show-Help {
    Write-ColorOutput "=== FILTRADOR DE ARCHIVOS FUENTE SIN REFERENCIAS ===" "Cyan"
    Write-Host ""
    Write-ColorOutput "DESCRIPCION:" "Yellow"
    Write-Host "Filtra archivos sin referencias para mostrar solo archivos fuente reales"
    Write-Host "que requieren revision manual, excluyendo:"
    Write-Host "  - Archivos que no existen (Exists: false)"
    Write-Host "  - Archivos en carpetas compiladas"
    Write-Host "  - Archivos .js en carpetas de arquitectura hexagonal"
    Write-Host ""
    Write-ColorOutput "USO:" "Yellow"
    Write-Host "  .\filter-source-files.ps1                    # Analisis automatico"
    Write-Host "  .\filter-source-files.ps1 -Interactive       # Revision interactiva"
    Write-Host "  .\filter-source-files.ps1 -Help              # Mostrar esta ayuda"
}

function Get-LatestAnalysisFile {
    $files = Get-ChildItem -Path "." -Name "unreferenced-files-analysis-*.json" | Sort-Object -Descending
    if ($files.Count -eq 0) {
        Write-ColorOutput "No se encontraron archivos de analisis" "Red"
        Write-ColorOutput "Ejecuta primero: .\review-unreferenced-files.ps1 -Action report" "Yellow"
        exit 1
    }
    return $files[0]
}

function Test-IsCompiledPath {
    param([string]$Path)
    
    $compiledPatterns = @("compiled", "dist", "build", "out", "target")
    
    foreach ($pattern in $compiledPatterns) {
        if ($Path -like "*\$pattern\*" -or $Path -like "*/$pattern/*") {
            return $true
        }
    }
    
    # Archivos .js en carpetas de arquitectura hexagonal
    if ($Path -like "*.js" -and 
        ($Path -like "*\Domain\*" -or $Path -like "*\Aplicacion\*" -or 
         $Path -like "*\Infraestructura\*" -or $Path -like "*\Interfaces\*")) {
        return $true
    }
    
    return $false
}

function Test-IsSourceFile {
    param([string]$Path)
    
    $sourceExtensions = @(".ts", ".tsx", ".scss", ".css", ".vue", ".jsx")
    $extension = [System.IO.Path]::GetExtension($Path)
    
    return $sourceExtensions -contains $extension
}

function Get-FilteredSourceFiles {
    param([string]$JsonPath)
    
    Write-ColorOutput "Cargando analisis desde: $JsonPath" "Cyan"
    
    try {
        $analysis = Get-Content -Path $JsonPath -Raw | ConvertFrom-Json
    }
    catch {
        Write-ColorOutput "Error al cargar el archivo JSON: $_" "Red"
        exit 1
    }
    
    $allFiles = $analysis.RequiresReview
    Write-ColorOutput "Total de archivos en analisis: $($allFiles.Count)" "White"
    
    # Filtrar archivos que existen
    $existingFiles = $allFiles | Where-Object { $_.Exists -eq $true }
    Write-ColorOutput "Archivos que existen: $($existingFiles.Count)" "Green"
    
    # Filtrar archivos no compilados
    $nonCompiledFiles = $existingFiles | Where-Object { -not (Test-IsCompiledPath $_.Path) }
    Write-ColorOutput "Archivos no compilados: $($nonCompiledFiles.Count)" "Green"
    
    # Filtrar solo archivos fuente
    $sourceFiles = $nonCompiledFiles | Where-Object { Test-IsSourceFile $_.Path }
    Write-ColorOutput "Archivos fuente: $($sourceFiles.Count)" "Green"
    
    return $sourceFiles
}

function Show-FileAnalysis {
    param([object]$File)
    
    Write-ColorOutput "\n=== ARCHIVO: $($File.Path) ===" "Yellow"
    Write-Host "Categoria: $($File.Category)"
    Write-Host "Tamaño: $($File.Size) bytes"
    Write-Host "Referencias encontradas: $($File.PossibleReferences.Count)"
    
    if ($File.PossibleReferences.Count -gt 0) {
        Write-ColorOutput "Referencias:" "Cyan"
        foreach ($ref in $File.PossibleReferences) {
            Write-Host "  - $ref"
        }
    }
}

function Invoke-InteractiveReview {
    param([array]$SourceFiles)
    
    Write-ColorOutput "\nINICIANDO REVISION INTERACTIVA" "Cyan"
    Write-ColorOutput "Archivos a revisar: $($SourceFiles.Count)" "White"
    
    $toDelete = @()
    $toKeep = @()
    
    foreach ($file in $SourceFiles) {
        Show-FileAnalysis $file
        
        Write-Host ""
        Write-ColorOutput "Que hacer con este archivo?" "White"
        Write-Host "[D] Eliminar  [K] Mantener  [S] Saltar  [Q] Salir"
        
        do {
            $choice = Read-Host "Seleccion"
            $choice = $choice.ToUpper()
        } while ($choice -notin @("D", "K", "S", "Q"))
        
        switch ($choice) {
            "D" { 
                $toDelete += $file
                Write-ColorOutput "Marcado para eliminar" "Red"
            }
            "K" { 
                $toKeep += $file
                Write-ColorOutput "Marcado para mantener" "Green"
            }
            "S" { 
                Write-ColorOutput "Saltado" "Yellow"
            }
            "Q" { 
                Write-ColorOutput "\nRevision cancelada por el usuario" "Yellow"
                return @{ ToDelete = $toDelete; ToKeep = $toKeep; Cancelled = $true }
            }
        }
    }
    
    return @{ ToDelete = $toDelete; ToKeep = $toKeep; Cancelled = $false }
}

# Funcion principal
function Main {
    if ($Help) {
        Show-Help
        return
    }
    
    Write-ColorOutput "=== FILTRADOR DE ARCHIVOS FUENTE SIN REFERENCIAS ===" "Cyan"
    
    # Obtener archivo de analisis
    if ($JsonFile -like "*`**") {
        $analysisFile = Get-LatestAnalysisFile
    } else {
        $analysisFile = $JsonFile
        if (-not (Test-Path $analysisFile)) {
            Write-ColorOutput "Archivo no encontrado: $analysisFile" "Red"
            exit 1
        }
    }
    
    # Filtrar archivos fuente
    $sourceFiles = Get-FilteredSourceFiles $analysisFile
    
    if ($sourceFiles.Count -eq 0) {
        Write-ColorOutput "\nExcelente! No hay archivos fuente sin referencias que requieran revision" "Green"
        return
    }
    
    Write-ColorOutput "\nARCHIVOS FUENTE QUE REQUIEREN REVISION MANUAL" "Yellow"
    Write-ColorOutput "Total: $($sourceFiles.Count) archivos" "White"
    
    # Mostrar resumen por categoria
    $categories = $sourceFiles | Group-Object Category
    foreach ($category in $categories) {
        Write-Host "  $($category.Name): $($category.Count) archivos"
    }
    
    if (-not $Interactive) {
        Write-ColorOutput "\nLISTA DE ARCHIVOS:" "Cyan"
        foreach ($file in $sourceFiles) {
            Write-Host "  - $($file.Path) ($($file.Category))"
        }
        
        Write-ColorOutput "\nRECOMENDACION:" "Yellow"
        Write-Host "Ejecuta con -Interactive para revisar cada archivo individualmente"
        Write-Host "Comando: .\filter-source-files.ps1 -Interactive"
        return
    }
    
    # Revision interactiva
    $result = Invoke-InteractiveReview $sourceFiles
    
    if ($result.Cancelled) {
        Write-ColorOutput "\nProceso cancelado. No se eliminaron archivos." "Yellow"
        return
    }
    
    Write-ColorOutput "\nRevision completada" "Green"
    Write-Host "Archivos marcados para eliminar: $($result.ToDelete.Count)"
    Write-Host "Archivos marcados para mantener: $($result.ToKeep.Count)"
    
    if ($result.ToDelete.Count -gt 0) {
        Write-ColorOutput "\nArchivos marcados para eliminar:" "Red"
        foreach ($file in $result.ToDelete) {
            Write-Host "  - $($file.Path)"
        }
        Write-ColorOutput "\nPara eliminar estos archivos, usa el script de limpieza con backup" "Yellow"
    }
}

# Ejecutar funcion principal
Main