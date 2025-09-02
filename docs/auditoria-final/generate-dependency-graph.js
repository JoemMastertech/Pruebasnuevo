const fs = require('fs');
const path = require('path');

// Función para generar grafo de dependencias en formato DOT
function generateDependencyGraph() {
    try {
        // Leer el análisis de dependencias
        const analysisData = JSON.parse(fs.readFileSync('dependency-analysis.json', 'utf8'));
        
        let dotContent = `digraph Dependencies {
    rankdir=TB;
    node [shape=box, style=filled];
    
    // Configuración de colores por capa
    // Azul: Controladores
    // Verde: Presenters
    // Amarillo: Componentes UI
    // Gris: Utilidades/infraestructura
    // Rojo: Sin referencias
    
`;
        
        // Categorizar archivos por capa
        const layers = {
            controllers: [],
            presenters: [],
            ui: [],
            infrastructure: [],
            domain: [],
            application: [],
            unreferenced: analysisData.unreferencedList
        };
        
        // Leer inventario para categorizar
        const inventoryContent = fs.readFileSync('inventario-archivos.csv', 'utf8');
        const lines = inventoryContent.split('\n').slice(1); // Skip header
        
        lines.forEach(line => {
            if (line.trim()) {
                const [fullPath] = line.split(',');
                const cleanPath = fullPath.replace(/"/g, '');
                const relativePath = path.relative(process.cwd(), cleanPath);
                const fileName = path.basename(relativePath);
                
                if (relativePath.includes('Controller')) {
                    layers.controllers.push({ path: relativePath, name: fileName });
                } else if (relativePath.includes('Presenter') || relativePath.includes('presenter')) {
                    layers.presenters.push({ path: relativePath, name: fileName });
                } else if (relativePath.includes('UI') || relativePath.includes('ui') || relativePath.includes('components')) {
                    layers.ui.push({ path: relativePath, name: fileName });
                } else if (relativePath.includes('Infraestructura') || relativePath.includes('adapters')) {
                    layers.infrastructure.push({ path: relativePath, name: fileName });
                } else if (relativePath.includes('Domain')) {
                    layers.domain.push({ path: relativePath, name: fileName });
                } else if (relativePath.includes('Aplicacion') || relativePath.includes('UseCases')) {
                    layers.application.push({ path: relativePath, name: fileName });
                }
            }
        });
        
        // Función para limpiar nombres de nodos
        function cleanNodeName(path) {
            return path.replace(/[^a-zA-Z0-9]/g, '_');
        }
        
        // Agregar nodos por capa
        dotContent += '    // Controladores\n';
        layers.controllers.forEach(file => {
            const nodeName = cleanNodeName(file.path);
            dotContent += `    "${nodeName}" [label="${file.name}", fillcolor=lightblue];\n`;
        });
        
        dotContent += '\n    // Presenters\n';
        layers.presenters.forEach(file => {
            const nodeName = cleanNodeName(file.path);
            dotContent += `    "${nodeName}" [label="${file.name}", fillcolor=lightgreen];\n`;
        });
        
        dotContent += '\n    // Componentes UI\n';
        layers.ui.forEach(file => {
            const nodeName = cleanNodeName(file.path);
            dotContent += `    "${nodeName}" [label="${file.name}", fillcolor=lightyellow];\n`;
        });
        
        dotContent += '\n    // Infraestructura\n';
        layers.infrastructure.forEach(file => {
            const nodeName = cleanNodeName(file.path);
            dotContent += `    "${nodeName}" [label="${file.name}", fillcolor=lightgray];\n`;
        });
        
        dotContent += '\n    // Dominio\n';
        layers.domain.forEach(file => {
            const nodeName = cleanNodeName(file.path);
            dotContent += `    "${nodeName}" [label="${file.name}", fillcolor=lightcyan];\n`;
        });
        
        dotContent += '\n    // Aplicación\n';
        layers.application.forEach(file => {
            const nodeName = cleanNodeName(file.path);
            dotContent += `    "${nodeName}" [label="${file.name}", fillcolor=lightpink];\n`;
        });
        
        dotContent += '\n    // Archivos sin referencias\n';
        layers.unreferenced.forEach(file => {
            const nodeName = cleanNodeName(file.path);
            const fileName = path.basename(file.path);
            dotContent += `    "${nodeName}" [label="${fileName}", fillcolor=lightcoral];\n`;
        });
        
        dotContent += '\n    // Dependencias (simplificadas para legibilidad)\n';
        
        // Agregar algunas dependencias clave conocidas
        const keyDependencies = [
            { from: 'UI', to: 'Presenters' },
            { from: 'Presenters', to: 'Application' },
            { from: 'Application', to: 'Domain' },
            { from: 'Infrastructure', to: 'Domain' }
        ];
        
        keyDependencies.forEach(dep => {
            dotContent += `    "${dep.from}" -> "${dep.to}";\n`;
        });
        
        dotContent += '\n    // Leyenda\n';
        dotContent += '    subgraph cluster_legend {\n';
        dotContent += '        label="Leyenda";\n';
        dotContent += '        "Controllers" [fillcolor=lightblue];\n';
        dotContent += '        "Presenters" [fillcolor=lightgreen];\n';
        dotContent += '        "UI Components" [fillcolor=lightyellow];\n';
        dotContent += '        "Infrastructure" [fillcolor=lightgray];\n';
        dotContent += '        "Domain" [fillcolor=lightcyan];\n';
        dotContent += '        "Application" [fillcolor=lightpink];\n';
        dotContent += '        "Unreferenced" [fillcolor=lightcoral];\n';
        dotContent += '    }\n';
        
        dotContent += '}\n';
        
        // Guardar archivo DOT
        fs.writeFileSync('dependency-graph.dot', dotContent);
        
        // Generar estadísticas por capa
        const layerStats = {
            controllers: layers.controllers.length,
            presenters: layers.presenters.length,
            ui: layers.ui.length,
            infrastructure: layers.infrastructure.length,
            domain: layers.domain.length,
            application: layers.application.length,
            unreferenced: layers.unreferenced.length
        };
        
        console.log('\n=== ESTADÍSTICAS POR CAPA ===');
        Object.entries(layerStats).forEach(([layer, count]) => {
            console.log(`${layer}: ${count} archivos`);
        });
        
        console.log('\nArchivo DOT generado: dependency-graph.dot');
        console.log('Para generar imagen: dot -Tpng dependency-graph.dot -o dependency-graph.png');
        
        // Generar reporte de arquitectura
        const architectureReport = {
            timestamp: new Date().toISOString(),
            layerStats,
            totalFiles: analysisData.totalFiles,
            unreferencedFiles: analysisData.unreferencedFiles,
            recommendations: generateRecommendations(layerStats, analysisData)
        };
        
        fs.writeFileSync('architecture-report.json', JSON.stringify(architectureReport, null, 2));
        console.log('Reporte de arquitectura guardado: architecture-report.json');
        
    } catch (error) {
        console.error('Error generando grafo:', error);
    }
}

// Función para generar recomendaciones
function generateRecommendations(layerStats, analysisData) {
    const recommendations = [];
    
    if (analysisData.unreferencedFiles > 20) {
        recommendations.push({
            type: 'cleanup',
            priority: 'high',
            message: `Se encontraron ${analysisData.unreferencedFiles} archivos sin referencias. Considerar eliminación.`
        });
    }
    
    if (layerStats.infrastructure > layerStats.domain * 2) {
        recommendations.push({
            type: 'architecture',
            priority: 'medium',
            message: 'Ratio alto de infraestructura vs dominio. Revisar separación de responsabilidades.'
        });
    }
    
    if (layerStats.controllers === 0) {
        recommendations.push({
            type: 'architecture',
            priority: 'low',
            message: 'No se detectaron controladores explícitos. Verificar patrón de arquitectura.'
        });
    }
    
    return recommendations;
}

// Ejecutar generación
generateDependencyGraph();