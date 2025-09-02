const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Función para calcular hash de archivo
function calculateFileHash(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
        return null;
    }
}

// Función para analizar duplicados
function findDuplicateFiles() {
    const analysisData = JSON.parse(fs.readFileSync('dependency-analysis.json', 'utf8'));
    const inventoryContent = fs.readFileSync('inventario-archivos.csv', 'utf8');
    const lines = inventoryContent.split('\n').slice(1);
    
    const hashMap = new Map();
    const nameMap = new Map();
    const files = [];
    
    console.log('Analizando duplicados...');
    
    lines.forEach((line, index) => {
        if (line.trim()) {
            const [fullPath, size, lastModified] = line.split(',').map(s => s.replace(/"/g, ''));
            const fileName = path.basename(fullPath);
            const extension = path.extname(fullPath);
            
            // Solo analizar archivos de código
            if (['.js', '.ts', '.css'].includes(extension)) {
                const hash = calculateFileHash(fullPath);
                
                if (hash) {
                    const fileInfo = {
                        fullPath,
                        fileName,
                        size: parseInt(size),
                        lastModified,
                        hash,
                        extension
                    };
                    
                    files.push(fileInfo);
                    
                    // Agrupar por hash (contenido idéntico)
                    if (!hashMap.has(hash)) {
                        hashMap.set(hash, []);
                    }
                    hashMap.get(hash).push(fileInfo);
                    
                    // Agrupar por nombre
                    if (!nameMap.has(fileName)) {
                        nameMap.set(fileName, []);
                    }
                    nameMap.get(fileName).push(fileInfo);
                }
            }
        }
    });
    
    // Encontrar duplicados exactos (mismo contenido)
    const exactDuplicates = [];
    hashMap.forEach((files, hash) => {
        if (files.length > 1) {
            exactDuplicates.push({
                hash,
                files: files.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
            });
        }
    });
    
    // Encontrar duplicados por nombre (posibles duplicados)
    const nameDuplicates = [];
    nameMap.forEach((files, name) => {
        if (files.length > 1) {
            nameDuplicates.push({
                name,
                files: files.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
            });
        }
    });
    
    return { exactDuplicates, nameDuplicates, allFiles: files };
}

// Función para generar lista de limpieza
function generateCleanupList() {
    try {
        const analysisData = JSON.parse(fs.readFileSync('dependency-analysis.json', 'utf8'));
        const { exactDuplicates, nameDuplicates, allFiles } = findDuplicateFiles();
        
        const cleanupCandidates = {
            exactDuplicates: [],
            unreferencedFiles: [],
            compiledFiles: [],
            testFiles: [],
            oldVersions: [],
            largeUnusedFiles: []
        };
        
        // 1. Duplicados exactos - mantener el más reciente
        exactDuplicates.forEach(group => {
            const [keep, ...remove] = group.files;
            cleanupCandidates.exactDuplicates.push({
                reason: 'Contenido idéntico',
                keep: keep.fullPath,
                remove: remove.map(f => ({
                    path: f.fullPath,
                    size: f.size,
                    lastModified: f.lastModified
                }))
            });
        });
        
        // 2. Archivos sin referencias
        analysisData.unreferencedList.forEach(file => {
            // Excluir archivos importantes
            const isImportant = [
                'main.', 'index.', 'config.', 'setup.',
                'bootstrap.', 'init.', 'app.'
            ].some(pattern => file.path.includes(pattern));
            
            if (!isImportant && !file.path.includes('test') && !file.path.includes('spec')) {
                cleanupCandidates.unreferencedFiles.push({
                    path: file.path,
                    size: file.size,
                    lastModified: file.lastModified,
                    reason: 'Sin referencias detectadas'
                });
            }
        });
        
        // 3. Archivos compilados (dist/, compiled/)
        allFiles.forEach(file => {
            if (file.fullPath.includes('\\dist\\') || 
                file.fullPath.includes('\\compiled\\') ||
                file.fullPath.includes('/dist/') || 
                file.fullPath.includes('/compiled/')) {
                cleanupCandidates.compiledFiles.push({
                    path: file.fullPath,
                    size: file.size,
                    reason: 'Archivo compilado - se puede regenerar'
                });
            }
        });
        
        // 4. Archivos de test antiguos
        allFiles.forEach(file => {
            if ((file.fileName.includes('test') || file.fileName.includes('spec')) &&
                file.size < 1000) { // Tests muy pequeños, posiblemente obsoletos
                cleanupCandidates.testFiles.push({
                    path: file.fullPath,
                    size: file.size,
                    reason: 'Test pequeño, posiblemente obsoleto'
                });
            }
        });
        
        // 5. Archivos grandes sin usar
        analysisData.unreferencedList.forEach(file => {
            if (file.size > 10000) { // Archivos > 10KB
                cleanupCandidates.largeUnusedFiles.push({
                    path: file.path,
                    size: file.size,
                    lastModified: file.lastModified,
                    reason: `Archivo grande (${Math.round(file.size/1024)}KB) sin referencias`
                });
            }
        });
        
        // Calcular espacio total recuperable
        let totalSize = 0;
        Object.values(cleanupCandidates).forEach(category => {
            category.forEach(item => {
                if (item.remove) {
                    totalSize += item.remove.reduce((sum, f) => sum + f.size, 0);
                } else {
                    totalSize += item.size || 0;
                }
            });
        });
        
        const cleanupReport = {
            timestamp: new Date().toISOString(),
            summary: {
                totalCandidates: Object.values(cleanupCandidates).reduce((sum, cat) => sum + cat.length, 0),
                estimatedSpaceSaved: `${Math.round(totalSize/1024)}KB`,
                categories: {
                    exactDuplicates: cleanupCandidates.exactDuplicates.length,
                    unreferencedFiles: cleanupCandidates.unreferencedFiles.length,
                    compiledFiles: cleanupCandidates.compiledFiles.length,
                    testFiles: cleanupCandidates.testFiles.length,
                    largeUnusedFiles: cleanupCandidates.largeUnusedFiles.length
                }
            },
            candidates: cleanupCandidates,
            duplicateAnalysis: {
                exactDuplicates: exactDuplicates.length,
                nameDuplicates: nameDuplicates.length
            }
        };
        
        fs.writeFileSync('cleanup-candidates.json', JSON.stringify(cleanupReport, null, 2));
        
        // Generar script de limpieza
        generateCleanupScript(cleanupCandidates);
        
        console.log('\n=== ANÁLISIS DE LIMPIEZA ===');
        console.log(`Total de candidatos: ${cleanupReport.summary.totalCandidates}`);
        console.log(`Espacio estimado a recuperar: ${cleanupReport.summary.estimatedSpaceSaved}`);
        console.log('\nCategorías:');
        Object.entries(cleanupReport.summary.categories).forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count}`);
        });
        
        console.log('\nDuplicados encontrados:');
        console.log(`  Contenido idéntico: ${exactDuplicates.length} grupos`);
        console.log(`  Nombres similares: ${nameDuplicates.length} grupos`);
        
        console.log('\nArchivos generados:');
        console.log('- cleanup-candidates.json: Lista detallada de candidatos');
        console.log('- cleanup-script.ps1: Script para ejecutar limpieza');
        
    } catch (error) {
        console.error('Error en análisis de limpieza:', error);
    }
}

// Función para generar script de limpieza
function generateCleanupScript(candidates) {
    let script = `# Script de limpieza automática\n`;
    script += `# Generado el ${new Date().toISOString()}\n\n`;
    script += `Write-Host "Iniciando limpieza del proyecto..."\n\n`;
    
    // Crear backup
    script += `# Crear backup antes de limpieza\n`;
    script += `$backupDir = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"\n`;
    script += `New-Item -ItemType Directory -Path $backupDir -Force\n\n`;
    
    // Eliminar duplicados exactos
    if (candidates.exactDuplicates.length > 0) {
        script += `# Eliminar duplicados exactos\n`;
        candidates.exactDuplicates.forEach(group => {
            group.remove.forEach(file => {
                script += `if (Test-Path "${file.path}") {\n`;
                script += `    Copy-Item "${file.path}" "$backupDir\\" -Force\n`;
                script += `    Remove-Item "${file.path}" -Force\n`;
                script += `    Write-Host "Eliminado duplicado: ${file.path}"\n`;
                script += `}\n`;
            });
        });
        script += `\n`;
    }
    
    // Eliminar archivos compilados
    if (candidates.compiledFiles.length > 0) {
        script += `# Eliminar archivos compilados\n`;
        candidates.compiledFiles.forEach(file => {
            script += `if (Test-Path "${file.path}") {\n`;
            script += `    Remove-Item "${file.path}" -Force\n`;
            script += `    Write-Host "Eliminado compilado: ${file.path}"\n`;
            script += `}\n`;
        });
        script += `\n`;
    }
    
    script += `Write-Host "Limpieza completada. Backup en: $backupDir"\n`;
    
    fs.writeFileSync('cleanup-script.ps1', script);
}

// Ejecutar análisis
generateCleanupList();