/**
 * Bundle Analyzer Setup
 * Configura webpack-bundle-analyzer para monitoreo de assets y detección de archivos obsoletos
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class BundleAnalyzerSetup {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.webpackConfigPath = options.webpackConfigPath || 'webpack.config.js';
        this.packageJsonPath = path.join(this.projectRoot, 'package.json');
        this.outputDir = options.outputDir || 'bundle-analysis';
        this.verbose = options.verbose || false;
    }

    log(message, level = 'info') {
        const colors = {
            info: '\x1b[36m',
            success: '\x1b[32m',
            warning: '\x1b[33m',
            error: '\x1b[31m',
            analysis: '\x1b[35m'
        };
        
        const reset = '\x1b[0m';
        const color = colors[level] || colors.info;
        
        console.log(`${color}${message}${reset}`);
    }

    async checkDependencies() {
        const requiredDeps = ['webpack-bundle-analyzer', 'source-map-explorer'];
        
        try {
            const packageData = await fs.readFile(this.packageJsonPath, 'utf8');
            const packageJson = JSON.parse(packageData);
            
            const allDeps = {
                ...packageJson.dependencies || {},
                ...packageJson.devDependencies || {}
            };
            
            const missing = requiredDeps.filter(dep => !allDeps[dep]);
            
            if (missing.length > 0) {
                this.log(`Dependencias faltantes: ${missing.join(', ')}`, 'warning');
                return { missing, installed: requiredDeps.filter(dep => allDeps[dep]) };
            } else {
                this.log('Todas las dependencias están instaladas', 'success');
                return { missing: [], installed: requiredDeps };
            }
            
        } catch (error) {
            this.log(`Error verificando dependencias: ${error.message}`, 'error');
            throw error;
        }
    }

    async installDependencies(missingDeps) {
        this.log(`Instalando dependencias: ${missingDeps.join(', ')}`, 'analysis');
        
        return new Promise((resolve, reject) => {
            const npm = spawn('npm', ['install', '--save-dev', ...missingDeps], {
                cwd: this.projectRoot,
                stdio: this.verbose ? 'inherit' : 'pipe'
            });
            
            npm.on('close', (code) => {
                if (code === 0) {
                    this.log('Dependencias instaladas correctamente', 'success');
                    resolve();
                } else {
                    reject(new Error(`Error instalando dependencias (código: ${code})`));
                }
            });
        });
    }

    async createWebpackConfig() {
        const configPath = path.join(this.projectRoot, this.webpackConfigPath);
        
        try {
            const configExists = await fs.access(configPath).then(() => true).catch(() => false);
            
            if (configExists) {
                return await this.enhanceExistingConfig(configPath);
            } else {
                return await this.createNewConfig(configPath);
            }
        } catch (error) {
            this.log(`Error configurando webpack: ${error.message}`, 'error');
            throw error;
        }
    }

    async enhanceExistingConfig(configPath) {
        try {
            const originalConfig = await fs.readFile(configPath, 'utf8');
            
            // Verificar si ya tiene Bundle Analyzer
            if (originalConfig.includes('BundleAnalyzerPlugin')) {
                this.log('Configuración webpack ya incluye Bundle Analyzer', 'info');
                return configPath;
            }
            
            const enhancedConfig = this.generateEnhancedConfig(originalConfig);
            
            // Crear backup
            await fs.writeFile(`${configPath}.backup`, originalConfig);
            await fs.writeFile(configPath, enhancedConfig);
            
            this.log(`Configuración webpack mejorada: ${this.webpackConfigPath}`, 'success');
            return configPath;
            
        } catch (error) {
            this.log(`Error mejorando configuración: ${error.message}`, 'error');
            throw error;
        }
    }

    async createNewConfig(configPath) {
        const config = `// Configuración webpack con Bundle Analyzer
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZE ? 'server' : 'static',
            openAnalyzer: process.env.ANALYZE === 'true',
            reportFilename: 'bundle-analysis/bundle-report.html',
            generateStatsFile: true,
            statsFilename: 'bundle-analysis/bundle-stats.json',
            logLevel: 'info'
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\\/]node_modules[\\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};
`;
        
        await fs.writeFile(configPath, config);
        this.log(`Nueva configuración webpack creada: ${this.webpackConfigPath}`, 'success');
        
        return configPath;
    }

    generateEnhancedConfig(originalConfig) {
        return `// Configuración webpack mejorada con Bundle Analyzer
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const originalConfig = ${originalConfig.replace('module.exports =', '')};

// Agregar Bundle Analyzer Plugin
if (!originalConfig.plugins) {
    originalConfig.plugins = [];
}

originalConfig.plugins.push(
    new BundleAnalyzerPlugin({
        analyzerMode: process.env.ANALYZE ? 'server' : 'static',
        openAnalyzer: process.env.ANALYZE === 'true',
        reportFilename: 'bundle-analysis/bundle-report.html',
        generateStatsFile: true,
        statsFilename: 'bundle-analysis/bundle-stats.json',
        logLevel: 'info'
    })
);

// Mejorar configuración de optimización
if (!originalConfig.optimization) {
    originalConfig.optimization = {};
}

if (!originalConfig.optimization.splitChunks) {
    originalConfig.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
            vendor: {
                test: /[\\\/]node_modules[\\\/]/,
                name: 'vendors',
                chunks: 'all'
            },
            common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                enforce: true
            }
        }
    };
}

module.exports = originalConfig;
`;
    }

    async createAnalysisScripts() {
        const scriptsDir = path.join(this.projectRoot, 'scripts');
        
        try {
            await fs.mkdir(scriptsDir, { recursive: true });
        } catch {}
        
        const bundleAnalysisScript = `/**
 * Bundle Analysis Script
 * Ejecuta análisis del bundle y genera reportes detallados
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

async function runBundleAnalysis() {
    console.log('🔍 Iniciando análisis de bundle...');
    
    return new Promise((resolve, reject) => {
        const webpack = spawn('npx', ['webpack', '--mode=production'], {
            env: { ...process.env, ANALYZE: 'false' },
            stdio: 'inherit'
        });
        
        webpack.on('close', async (code) => {
            if (code === 0) {
                console.log('✅ Bundle generado correctamente');
                
                // Generar análisis adicional
                await generateDetailedAnalysis();
            } else {
                console.error('❌ Error en el análisis de bundle');
            }
        });
    });
}

async function generateDetailedAnalysis() {
    try {
        const statsPath = path.join(process.cwd(), 'bundle-analysis/bundle-stats.json');
        const statsData = await fs.readFile(statsPath, 'utf8');
        const stats = JSON.parse(statsData);
        
        const analysis = {
            timestamp: new Date().toISOString(),
            summary: {
                totalSize: stats.assets.reduce((sum, asset) => sum + asset.size, 0),
                totalAssets: stats.assets.length,
                chunks: stats.chunks.length,
                modules: stats.modules.length
            },
            assets: stats.assets.map(asset => ({
                name: asset.name,
                size: asset.size,
                chunks: asset.chunks
            })),
            largestAssets: stats.assets
                .sort((a, b) => b.size - a.size)
                .slice(0, 10),
            modulesBySize: stats.modules
                .filter(m => m.size > 0)
                .sort((a, b) => b.size - a.size)
                .slice(0, 20)
                .map(m => ({
                    name: m.name,
                    size: m.size,
                    reasons: m.reasons?.length || 0
                }))
        };
        
        const analysisPath = path.join(process.cwd(), 'bundle-analysis/detailed-analysis.json');
        await fs.writeFile(analysisPath, JSON.stringify(analysis, null, 2));
        
        console.log('📊 Análisis detallado guardado en: bundle-analysis/detailed-analysis.json');
        
    } catch (error) {
        console.error('❌ Error generando análisis detallado:', error.message);
    }
}

if (require.main === module) {
    runBundleAnalysis().catch(console.error);
}

module.exports = { runBundleAnalysis, generateDetailedAnalysis };`;
        
        const scriptPath = path.join(scriptsDir, 'analyze-bundle.js');
        await fs.writeFile(scriptPath, bundleAnalysisScript);
        
        this.log('Script de análisis creado: scripts/analyze-bundle.js', 'success');
        
        return scriptPath;
    }

    async createObsoleteFileDetector() {
        const detectorScript = `/**
 * Detector de Archivos Obsoletos en Bundle
 * Compara el contenido del bundle con una lista de archivos que deberían estar eliminados
 */

const fs = require('fs').promises;
const path = require('path');

class ObsoleteFileDetector {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.bundleStatsPath = options.bundleStatsPath || 'bundle-analysis/bundle-stats.json';
        this.obsoleteFilesPath = options.obsoleteFilesPath || 'unreferenced-files-analysis-latest.json';
    }

    async detectObsoleteInBundle() {
        console.log('🔍 Detectando archivos obsoletos en bundle...');
        
        try {
            // Cargar estadísticas del bundle
            const bundleStats = await this.loadBundleStats();
            
            // Cargar lista de archivos obsoletos
            const obsoleteFiles = await this.loadObsoleteFiles();
            
            // Buscar coincidencias
            const foundObsolete = this.findObsoleteInBundle(bundleStats, obsoleteFiles);
            
            // Generar reporte
            const report = await this.generateObsoleteReport(foundObsolete);
            
            return report;
            
        } catch (error) {
            console.error('❌ Error detectando archivos obsoletos:', error.message);
            throw error;
        }
    }

    async loadBundleStats() {
        const statsPath = path.resolve(this.projectRoot, this.bundleStatsPath);
        const data = await fs.readFile(statsPath, 'utf8');
        return JSON.parse(data);
    }

    async loadObsoleteFiles() {
        const obsoletePath = path.resolve(this.projectRoot, this.obsoleteFilesPath);
        const data = await fs.readFile(obsoletePath, 'utf8');
        const analysis = JSON.parse(data);
        
        return analysis.files.map(file => ({
            path: file.Path,
            name: path.basename(file.Path),
            extension: path.extname(file.Path)
        }));
    }

    findObsoleteInBundle(bundleStats, obsoleteFiles) {
        const foundObsolete = [];
        
        // Buscar en módulos del bundle
        bundleStats.modules.forEach(module => {
            const moduleName = module.name || '';
            
            obsoleteFiles.forEach(obsoleteFile => {
                // Buscar coincidencias por nombre de archivo
                if (moduleName.includes(obsoleteFile.name) || 
                    moduleName.includes(obsoleteFile.path)) {
                    
                    foundObsolete.push({
                        obsoleteFile: obsoleteFile.path,
                        bundleModule: moduleName,
                        moduleSize: module.size || 0,
                        matchType: 'module'
                    });
                }
            });
        });
        
        // Buscar en assets del bundle
        bundleStats.assets.forEach(asset => {
            const assetName = asset.name || '';
            
            obsoleteFiles.forEach(obsoleteFile => {
                if (assetName.includes(obsoleteFile.name)) {
                    foundObsolete.push({
                        obsoleteFile: obsoleteFile.path,
                        bundleAsset: assetName,
                        assetSize: asset.size || 0,
                        matchType: 'asset'
                    });
                }
            });
        });
        
        return foundObsolete;
    }

    async generateObsoleteReport(foundObsolete) {
        const timestamp = new Date().toISOString();
        
        const report = {
            timestamp,
            summary: {
                totalObsoleteFound: foundObsolete.length,
                totalSizeImpact: foundObsolete.reduce((sum, item) => 
                    sum + (item.moduleSize || item.assetSize || 0), 0),
                moduleMatches: foundObsolete.filter(item => item.matchType === 'module').length,
                assetMatches: foundObsolete.filter(item => item.matchType === 'asset').length
            },
            obsoleteFiles: foundObsolete,
            recommendations: []
        };
        
        // Generar recomendaciones
        if (foundObsolete.length > 0) {
            report.recommendations.push({
                type: 'CRITICAL',
                message: \`Se encontraron \${foundObsolete.length} archivos obsoletos en el bundle\`,
                action: 'Revisar y eliminar las referencias a estos archivos del código'
            });
            
            const totalSize = report.summary.totalSizeImpact;
            if (totalSize > 10000) { // > 10KB
                report.recommendations.push({
                    type: 'PERFORMANCE',
                    message: \`Los archivos obsoletos ocupan \${(totalSize/1024).toFixed(2)}KB en el bundle\`,
                    action: 'Eliminar estos archivos puede mejorar significativamente el rendimiento'
                });
            }
        } else {
            report.recommendations.push({
                type: 'SUCCESS',
                message: 'No se encontraron archivos obsoletos en el bundle',
                action: 'El bundle está limpio de archivos no referenciados'
            });
        }
        
        // Guardar reporte
        const reportPath = path.join(this.projectRoot, 'bundle-analysis', 
            \`obsolete-files-report-\${timestamp.replace(/[:.]/g, '-')}.json\`);
        
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        console.log(\`📊 Reporte de archivos obsoletos guardado: \${reportPath}\`);
        
        // Mostrar resumen
        if (foundObsolete.length > 0) {
            console.log(\`🚨 ALERTA: \${foundObsolete.length} archivos obsoletos encontrados en bundle\`);
            foundObsolete.forEach(item => {
                console.log(\`   - \${item.obsoleteFile} -> \${item.bundleModule || item.bundleAsset}\`);
            });
        } else {
            console.log('✅ Bundle limpio: No se encontraron archivos obsoletos');
        }
        
        return report;
    }
}

// Función principal
async function main() {
    const detector = new ObsoleteFileDetector();
    
    try {
        const report = await detector.detectObsoleteInBundle();
        
        // Salir con código de error si se encontraron archivos obsoletos
        if (report.summary.totalObsoleteFound > 0) {
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { ObsoleteFileDetector };`;
        
        const detectorPath = path.join(this.projectRoot, 'scripts', 'detect-obsolete-in-bundle.js');
        await fs.writeFile(detectorPath, detectorScript);
        
        this.log('Detector de archivos obsoletos creado: scripts/detect-obsolete-in-bundle.js', 'success');
        
        return detectorPath;
    }

    async updatePackageJsonScripts() {
        try {
            const packageData = await fs.readFile(this.packageJsonPath, 'utf8');
            const packageJson = JSON.parse(packageData);
            
            if (!packageJson.scripts) {
                packageJson.scripts = {};
            }
            
            // Agregar scripts de análisis
            const newScripts = {
                'analyze:bundle': 'node scripts/analyze-bundle.js',
                'analyze:interactive': 'ANALYZE=true npm run build',
                'detect:obsolete': 'node scripts/detect-obsolete-in-bundle.js',
                'bundle:report': 'npm run analyze:bundle && npm run detect:obsolete'
            };
            
            let scriptsAdded = 0;
            for (const [script, command] of Object.entries(newScripts)) {
                if (!packageJson.scripts[script]) {
                    packageJson.scripts[script] = command;
                    scriptsAdded++;
                }
            }
            
            if (scriptsAdded > 0) {
                await fs.writeFile(this.packageJsonPath, JSON.stringify(packageJson, null, 2));
                this.log(`${scriptsAdded} scripts agregados a package.json`, 'success');
            } else {
                this.log('Scripts ya están configurados en package.json');
            }
            
        } catch (error) {
            this.log(`Error actualizando package.json: ${error.message}`, 'error');
        }
    }

    async setup() {
        this.log('🚀 Configurando Bundle Analyzer...', 'analysis');
        
        try {
            // 1. Verificar e instalar dependencias
            const { missing } = await this.checkDependencies();
            if (missing.length > 0) {
                await this.installDependencies(missing);
            }
            
            // 2. Crear/mejorar configuración webpack
            const configPath = await this.createWebpackConfig();
            
            // 3. Crear directorio de análisis
            const analysisDir = path.join(this.projectRoot, this.outputDir);
            await fs.mkdir(analysisDir, { recursive: true });
            
            // 4. Crear scripts de análisis
            await this.createAnalysisScripts();
            await this.createObsoleteFileDetector();
            
            // 5. Actualizar package.json
            await this.updatePackageJsonScripts();
            
            this.log('✅ Bundle Analyzer configurado correctamente', 'success');
            
            return {
                configPath,
                analysisDir,
                scripts: [
                    'npm run analyze:bundle',
                    'npm run analyze:interactive',
                    'npm run detect:obsolete',
                    'npm run bundle:report'
                ]
            };
            
        } catch (error) {
            this.log(`Error en configuración: ${error.message}`, 'error');
            throw error;
        }
    }
}

// Función principal para ejecutar desde línea de comandos
async function main() {
    const setup = new BundleAnalyzerSetup({
        verbose: process.env.VERBOSE === 'true'
    });
    
    try {
        const result = await setup.setup();
        
        console.log('\n🎉 CONFIGURACIÓN COMPLETADA');
        console.log('\n📋 Scripts disponibles:');
        result.scripts.forEach(script => {
            console.log(`   ${script}`);
        });
        
        console.log('\n💡 Próximos pasos:');
        console.log('   1. Ejecuta "npm run analyze:bundle" para generar el primer reporte');
        console.log('   2. Ejecuta "npm run detect:obsolete" para buscar archivos obsoletos');
        console.log('   3. Revisa los reportes en la carpeta "bundle-analysis"');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { BundleAnalyzerSetup };