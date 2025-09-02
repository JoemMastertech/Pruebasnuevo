# Script para revisar archivos sin referencias
# Basado en cleanup-candidates.json

param(
    [string]$Action = "analyze",  # analyze, interactive, report
    [string]$Category = "all"      # all, css, js, config, domain
)

# Colores para output
$colors = @{
    Header = "Cyan"
    Warning = "Yellow"
    Error = "Red"
    Success = "Green"
    Info = "White"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Get-UnreferencedFiles {
    $candidatesFile = "cleanup-candidates.json"
    
    if (-not (Test-Path $candidatesFile)) {
        Write-ColorOutput "Error: No se encontró $candidatesFile" "Error"
        return @()
    }
    
    $candidates = Get-Content $candidatesFile | ConvertFrom-Json
    return $candidates.candidates.unreferencedFiles
}

function Categorize-File {
    param([string]$FilePath)
    
    $extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
    $directory = [System.IO.Path]::GetDirectoryName($FilePath)
    
    if ($extension -eq ".css") { return "css" }
    if ($extension -eq ".js") { return "js" }
    if ($directory -like "*config*" -or $directory -like "*Config*") { return "config" }
    if ($directory -like "*Domain*" -or $directory -like "*domain*") { return "domain" }
    if ($directory -like "*test*" -or $directory -like "*Test*") { return "test" }
    if ($directory -like "*util*" -or $directory -like "*Utils*") { return "utils" }
    
    return "other"
}

function Analyze-File {
    param([string]$FilePath)
    
    $fullPath = Join-Path $PWD $FilePath
    $exists = Test-Path $fullPath
    $size = if ($exists) { (Get-Item $fullPath).Length } else { 0 }
    $category = Categorize-File $FilePath
    
    # Buscar referencias indirectas
    $possibleRefs = @()
    if ($exists) {
        $fileName = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
        $searchPattern = $fileName
        
        # Buscar en archivos principales
        $searchFiles = @("index.html", "*.js", "*.ts", "*.css", "*.json")
        foreach ($pattern in $searchFiles) {
            try {
                $refs = Select-String -Path $pattern -Pattern $searchPattern -ErrorAction SilentlyContinue
                if ($refs) {
                    $possibleRefs += $refs | ForEach-Object { "$($_.Filename):$($_.LineNumber)" }
                }
            } catch {
                # Ignorar errores de búsqueda
            }
        }
    }
    
    return @{
        Path = $FilePath
        Exists = $exists
        Size = $size
        Category = $category
        PossibleReferences = $possibleRefs
        SafeToDelete = ($possibleRefs.Count -eq 0 -and $exists)
    }
}

function Show-FileAnalysis {
    param([object]$Analysis)
    
    Write-ColorOutput "\n=== Análisis de: $($Analysis.Path) ===" "Header"
    Write-ColorOutput "Categoría: $($Analysis.Category)" "Info"
    Write-ColorOutput "Existe: $($Analysis.Exists)" "Info"
    
    if ($Analysis.Exists) {
        $sizeKB = [math]::Round($Analysis.Size / 1024, 2)
        Write-ColorOutput "Tamaño: $sizeKB KB" "Info"
    }
    
    if ($Analysis.PossibleReferences.Count -gt 0) {
        Write-ColorOutput "Posibles referencias encontradas:" "Warning"
        foreach ($ref in $Analysis.PossibleReferences) {
            Write-ColorOutput "  - $ref" "Warning"
        }
    } else {
        Write-ColorOutput "No se encontraron referencias" "Success"
    }
    
    $safeStatus = if ($Analysis.SafeToDelete) { "SÍ" } else { "NO" }
    $safeColor = if ($Analysis.SafeToDelete) { "Success" } else { "Warning" }
    Write-ColorOutput "Seguro eliminar: $safeStatus" $safeColor
}

function Interactive-Review {
    param([array]$Files)
    
    $results = @{
        SafeToDelete = @()
        RequiresReview = @()
        KeepFile = @()
    }
    
    foreach ($file in $Files) {
        $analysis = Analyze-File $file.path
        Show-FileAnalysis $analysis
        
        do {
            Write-ColorOutput "\n¿Qué hacer con este archivo?" "Info"
            Write-ColorOutput "[D] Eliminar  [K] Mantener  [S] Saltar  [Q] Salir" "Info"
            $choice = Read-Host "Selección"
            
            switch ($choice.ToUpper()) {
                "D" { 
                    $results.SafeToDelete += $analysis
                    Write-ColorOutput "Marcado para eliminación" "Success"
                    break
                }
                "K" { 
                    $results.KeepFile += $analysis
                    Write-ColorOutput "Marcado para mantener" "Info"
                    break
                }
                "S" { 
                    $results.RequiresReview += $analysis
                    Write-ColorOutput "Marcado para revisión posterior" "Warning"
                    break
                }
                "Q" { 
                    Write-ColorOutput "Saliendo de la revisión interactiva" "Info"
                    return $results
                }
                default {
                    Write-ColorOutput "Opción inválida. Use D, K, S o Q" "Error"
                }
            }
        } while ($choice.ToUpper() -notin @("D", "K", "S", "Q"))
        
        if ($choice.ToUpper() -eq "Q") { break }
    }
    
    return $results
}

function Generate-Report {
    param([array]$Files)
    
    $report = @{
        TotalFiles = $Files.Count
        Categories = @{}
        SafeToDelete = @()
        RequiresReview = @()
        TotalSize = 0
    }
    
    foreach ($file in $Files) {
        $analysis = Analyze-File $file.path
        
        # Contar por categorías
        if (-not $report.Categories.ContainsKey($analysis.Category)) {
            $report.Categories[$analysis.Category] = 0
        }
        $report.Categories[$analysis.Category]++
        
        # Clasificar por seguridad
        if ($analysis.SafeToDelete) {
            $report.SafeToDelete += $analysis
        } else {
            $report.RequiresReview += $analysis
        }
        
        $report.TotalSize += $analysis.Size
    }
    
    # Mostrar reporte
    Write-ColorOutput "\n=== REPORTE DE ARCHIVOS SIN REFERENCIAS ===" "Header"
    Write-ColorOutput "Total de archivos: $($report.TotalFiles)" "Info"
    Write-ColorOutput "Tamaño total: $([math]::Round($report.TotalSize / 1024, 2)) KB" "Info"
    
    Write-ColorOutput "\nPor categorías:" "Info"
    foreach ($category in $report.Categories.Keys) {
        Write-ColorOutput "  $category`: $($report.Categories[$category])" "Info"
    }
    
    Write-ColorOutput "\nSeguridad de eliminación:" "Info"
    Write-ColorOutput "  Seguros para eliminar: $($report.SafeToDelete.Count)" "Success"
    Write-ColorOutput "  Requieren revisión: $($report.RequiresReview.Count)" "Warning"
    
    # Guardar reporte detallado
    $reportFile = "unreferenced-files-analysis-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    $report | ConvertTo-Json -Depth 10 | Out-File $reportFile
    Write-ColorOutput "\nReporte detallado guardado en: $reportFile" "Success"
    
    return $report
}

# Función principal
function Main {
    Write-ColorOutput "=== REVISOR DE ARCHIVOS SIN REFERENCIAS ===" "Header"
    
    $unreferencedFiles = Get-UnreferencedFiles
    if ($unreferencedFiles.Count -eq 0) {
        Write-ColorOutput "No se encontraron archivos sin referencias" "Info"
        return
    }
    
    # Filtrar por categoría si se especifica
    if ($Category -ne "all") {
        $unreferencedFiles = $unreferencedFiles | Where-Object {
            (Categorize-File $_.path) -eq $Category
        }
        Write-ColorOutput "Filtrando por categoría: $Category" "Info"
        Write-ColorOutput "Archivos encontrados: $($unreferencedFiles.Count)" "Info"
    }
    
    switch ($Action.ToLower()) {
        "analyze" {
            Write-ColorOutput "Generando análisis automático..." "Info"
            Generate-Report $unreferencedFiles
        }
        "interactive" {
            Write-ColorOutput "Iniciando revisión interactiva..." "Info"
            $results = Interactive-Review $unreferencedFiles
            
            # Guardar resultados de la revisión interactiva
            $resultsFile = "interactive-review-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
            $results | ConvertTo-Json -Depth 10 | Out-File $resultsFile
            Write-ColorOutput "\nResultados de revisión guardados en: $resultsFile" "Success"
        }
        "report" {
            Write-ColorOutput "Generando reporte completo..." "Info"
            $report = Generate-Report $unreferencedFiles
            
            # Mostrar archivos seguros para eliminar
            if ($report.SafeToDelete.Count -gt 0) {
                Write-ColorOutput "\n=== ARCHIVOS SEGUROS PARA ELIMINAR ===" "Success"
                foreach ($file in $report.SafeToDelete) {
                    Write-ColorOutput "  $($file.Path)" "Success"
                }
            }
        }
        default {
            Write-ColorOutput "Acción no válida. Use: analyze, interactive, report" "Error"
        }
    }
}

# Ejecutar script
Main

Write-ColorOutput "\n=== INSTRUCCIONES DE USO ===" "Header"
Write-ColorOutput "Análisis automático:     .\review-unreferenced-files.ps1 -Action analyze" "Info"
Write-ColorOutput "Revisión interactiva:    .\review-unreferenced-files.ps1 -Action interactive" "Info"
Write-ColorOutput "Reporte completo:        .\review-unreferenced-files.ps1 -Action report" "Info"
Write-ColorOutput "Filtrar por categoría:   .\review-unreferenced-files.ps1 -Action analyze -Category css" "Info"
Write-ColorOutput "Categorías disponibles:  css, js, config, domain, test, utils, other" "Info"