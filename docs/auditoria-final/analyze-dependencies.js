const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Función para leer el inventario de archivos
function readInventory() {
    return new Promise((resolve, reject) => {
        const files = [];
        fs.createReadStream('inventario-archivos.csv')
            .pipe(csv())
            .on('data', (row) => {
                files.push({
                    fullPath: row.FullName,
                    relativePath: path.relative(process.cwd(), row.FullName),
                    size: parseInt(row.Length),
                    lastModified: row.LastWriteTime,
                    extension: path.extname(row.FullName)
                });
            })
            .on('end', () => resolve(files))
            .on('error', reject);
    });
}

// Función para buscar imports/requires en archivos
function findImports(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const imports = [];
        
        // Buscar imports ES6
        const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        
        // Buscar requires CommonJS
        const requireRegex = /require\s*\(['"]([^'"]+)['"]\)/g;
        while ((match = requireRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        
        return imports;
    } catch (error) {
        console.warn(`Error leyendo ${filePath}: ${error.message}`);
        return [];
    }
}

// Función principal de análisis
async function analyzeDependencies() {
    try {
        console.log('Leyendo inventario de archivos...');
        const files = await readInventory();
        
        console.log(`Analizando ${files.length} archivos...`);
        
        const dependencyMap = new Map();
        const referencedFiles = new Set();
        
        // Analizar cada archivo
        for (const file of files) {
            if (file.extension === '.ts' || file.extension === '.js') {
                const imports = findImports(file.fullPath);
                dependencyMap.set(file.relativePath, {
                    file: file,
                    imports: imports,
                    importedBy: []
                });
                
                // Marcar archivos referenciados
                imports.forEach(imp => {
                    // Resolver rutas relativas
                    if (imp.startsWith('./') || imp.startsWith('../')) {
                        const resolvedPath = path.resolve(path.dirname(file.fullPath), imp);
                        const relativePath = path.relative(process.cwd(), resolvedPath);
                        referencedFiles.add(relativePath);
                        referencedFiles.add(relativePath + '.ts');
                        referencedFiles.add(relativePath + '.js');
                    }
                });
            }
        }
        
        // Identificar archivos sin referencias
        const unreferencedFiles = [];
        const sourceFiles = files.filter(f => f.extension === '.ts' || f.extension === '.js');
        
        for (const file of sourceFiles) {
            if (!referencedFiles.has(file.relativePath) && 
                !file.relativePath.includes('test') && 
                !file.relativePath.includes('spec') &&
                !file.relativePath.includes('main.') &&
                !file.relativePath.includes('index.')) {
                unreferencedFiles.push(file);
            }
        }
        
        // Generar reporte
        const report = {
            totalFiles: files.length,
            sourceFiles: sourceFiles.length,
            referencedFiles: referencedFiles.size,
            unreferencedFiles: unreferencedFiles.length,
            filesByExtension: {},
            unreferencedList: unreferencedFiles.map(f => ({
                path: f.relativePath,
                size: f.size,
                lastModified: f.lastModified
            })),
            largestFiles: files.sort((a, b) => b.size - a.size).slice(0, 10).map(f => ({
                path: f.relativePath,
                size: f.size,
                extension: f.extension
            })),
            duplicateNames: findDuplicateNames(files)
        };
        
        // Contar por extensión
        files.forEach(file => {
            report.filesByExtension[file.extension] = (report.filesByExtension[file.extension] || 0) + 1;
        });
        
        // Guardar reporte
        fs.writeFileSync('dependency-analysis.json', JSON.stringify(report, null, 2));
        
        console.log('\n=== REPORTE DE ANÁLISIS DE DEPENDENCIAS ===');
        console.log(`Total de archivos: ${report.totalFiles}`);
        console.log(`Archivos fuente (.ts/.js): ${report.sourceFiles}`);
        console.log(`Archivos sin referencias: ${report.unreferencedFiles}`);
        console.log('\nArchivos por extensión:');
        Object.entries(report.filesByExtension).forEach(([ext, count]) => {
            console.log(`  ${ext}: ${count}`);
        });
        
        if (unreferencedFiles.length > 0) {
            console.log('\n=== ARCHIVOS SIN REFERENCIAS (candidatos a eliminación) ===');
            unreferencedFiles.forEach(file => {
                console.log(`- ${file.relativePath} (${file.size} bytes)`);
            });
        }
        
        console.log('\nReporte completo guardado en: dependency-analysis.json');
        
    } catch (error) {
        console.error('Error en análisis:', error);
    }
}

// Función para encontrar nombres duplicados
function findDuplicateNames(files) {
    const nameMap = new Map();
    files.forEach(file => {
        const name = path.basename(file.relativePath);
        if (!nameMap.has(name)) {
            nameMap.set(name, []);
        }
        nameMap.get(name).push(file.relativePath);
    });
    
    const duplicates = [];
    nameMap.forEach((paths, name) => {
        if (paths.length > 1) {
            duplicates.push({ name, paths });
        }
    });
    
    return duplicates;
}

// Ejecutar análisis
analyzeDependencies();