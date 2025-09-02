/**
 * Validador E2E para Entorno Limpio
 * Ejecuta pruebas de caja negra en un entorno que solo contiene archivos limpios
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class E2ECleanEnvironmentValidator {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.cleanEnvironmentPath = options.cleanEnvironmentPath || path.join(this.projectRoot, 'clean-env-test');
        this.testCommand = options.testCommand || 'npm run test:e2e';
        this.buildCommand = options.buildCommand || 'npm run build';
        this.serverCommand = options.serverCommand || 'npm start';
        this.serverPort = options.serverPort || 3000;
        this.verbose = options.verbose || false;
        this.testResults = [];
        this.serverProcess = null;
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '🧪',
            success: '✅',
            warning: '⚠️ ',
            error: '❌',
            test: '🔍',
            server: '🌐'
        }[level] || '🧪';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
        
        this.testResults.push({
            timestamp,
            level,
            message
        });
    }

    async createCleanEnvironment() {
        this.log('Creando entorno limpio para pruebas E2E...');
        
        try {
            // Crear directorio del entorno limpio
            await fs.mkdir(this.cleanEnvironmentPath, { recursive: true });
            
            // Copiar archivos esenciales
            await this.copyEssentialFiles();
            
            // Copiar solo archivos referenciados
            await this.copyReferencedFiles();
            
            // Configurar entorno de pruebas
            await this.setupTestEnvironment();
            
            this.log('Entorno limpio creado correctamente', 'success');
            
        } catch (error) {
            this.log(`Error creando entorno limpio: ${error.message}`, 'error');
            throw error;
        }
    }

    async copyEssentialFiles() {
        this.log('Copiando archivos esenciales...');
        
        const essentialFiles = [
            'package.json',
            'package-lock.json',
            'yarn.lock',
            '.env',
            '.env.example',
            'tsconfig.json',
            'babel.config.js',
            'webpack.config.js',
            'jest.config.js',
            'cypress.config.js',
            'playwright.config.js'
        ];
        
        for (const file of essentialFiles) {
            const sourcePath = path.join(this.projectRoot, file);
            const destPath = path.join(this.cleanEnvironmentPath, file);
            
            try {
                await fs.access(sourcePath);
                await fs.copyFile(sourcePath, destPath);
                this.log(`Copiado: ${file}`);
            } catch {
                // Archivo no existe, continuar
            }
        }
    }

    async copyReferencedFiles() {
        this.log('Identificando y copiando archivos referenciados...');
        
        try {
            // Cargar análisis de archivos referenciados
            const referencedFiles = await this.getReferencedFiles();
            
            this.log(`Copiando ${referencedFiles.length} archivos referenciados...`);
            
            for (const file of referencedFiles) {
                await this.copyFileWithStructure(file);
            }
            
            this.log(`${referencedFiles.length} archivos copiados al entorno limpio`, 'success');
            
        } catch (error) {
            this.log(`Error copiando archivos referenciados: ${error.message}`, 'error');
            throw error;
        }
    }

    async getReferencedFiles() {
        // Obtener archivos que NO están en la lista de no referenciados
        const allFiles = await this.scanProjectFiles();
        const unreferencedFiles = await this.getUnreferencedFiles();
        
        const unreferencedPaths = new Set(unreferencedFiles.map(f => f.Path || f.path));
        
        return allFiles.filter(file => !unreferencedPaths.has(file));
    }

    async scanProjectFiles() {
        const files = [];
        const excludePatterns = [
            /node_modules/,
            /\.git/,
            /dist/,
            /build/,
            /coverage/,
            /\.nyc_output/,
            /clean-env-test/,
            /\.log$/,
            /\.tmp$/
        ];

        async function scanDirectory(dir, basePath = '') {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.join(basePath, entry.name);
                
                if (excludePatterns.some(pattern => pattern.test(relativePath))) {
                    continue;
                }
                
                if (entry.isDirectory()) {
                    await scanDirectory(fullPath, relativePath);
                } else if (entry.isFile()) {
                    files.push(relativePath);
                }
            }
        }

        await scanDirectory(this.projectRoot);
        return files;
    }

    async getUnreferencedFiles() {
        try {
            // Buscar el archivo de análisis más reciente
            const analysisFiles = await fs.readdir(this.projectRoot);
            const latestAnalysis = analysisFiles
                .filter(f => f.startsWith('unreferenced-files-analysis-'))
                .sort()
                .pop();
            
            if (!latestAnalysis) {
                this.log('No se encontró archivo de análisis, asumiendo todos los archivos como referenciados', 'warning');
                return [];
            }
            
            const analysisPath = path.join(this.projectRoot, latestAnalysis);
            const data = await fs.readFile(analysisPath, 'utf8');
            const analysis = JSON.parse(data);
            
            return analysis.files || [];
            
        } catch (error) {
            this.log(`Error cargando archivos no referenciados: ${error.message}`, 'warning');
            return [];
        }
    }

    async copyFileWithStructure(relativePath) {
        const sourcePath = path.join(this.projectRoot, relativePath);
        const destPath = path.join(this.cleanEnvironmentPath, relativePath);
        
        try {
            // Crear directorio padre si no existe
            const destDir = path.dirname(destPath);
            await fs.mkdir(destDir, { recursive: true });
            
            // Copiar archivo
            await fs.copyFile(sourcePath, destPath);
            
        } catch (error) {
            this.log(`Error copiando ${relativePath}: ${error.message}`, 'warning');
        }
    }

    async setupTestEnvironment() {
        this.log('Configurando entorno de pruebas...');
        
        // Instalar dependencias en el entorno limpio
        await this.installDependencies();
        
        // Crear configuración específica para pruebas
        await this.createTestConfig();
        
        // Crear scripts de prueba E2E
        await this.createE2ETests();
    }

    async installDependencies() {
        this.log('Instalando dependencias en entorno limpio...');
        
        return new Promise((resolve, reject) => {
            const npm = spawn('npm', ['install'], {
                cwd: this.cleanEnvironmentPath,
                stdio: this.verbose ? 'inherit' : 'pipe'
            });
            
            npm.on('close', (code) => {
                if (code === 0) {
                    this.log('Dependencias instaladas correctamente', 'success');
                    resolve();
                } else {
                    reject(new Error(`npm install falló con código ${code}`));
                }
            });
            
            npm.on('error', reject);
        });
    }

    async createTestConfig() {
        // Crear configuración específica para el entorno limpio
        const testConfig = {
            testEnvironment: 'clean',
            baseUrl: `http://localhost:${this.serverPort}`,
            timeout: 30000,
            retries: 2,
            screenshots: true,
            videos: false
        };
        
        const configPath = path.join(this.cleanEnvironmentPath, 'clean-env-test.config.json');
        await fs.writeFile(configPath, JSON.stringify(testConfig, null, 2));
        
        this.log('Configuración de pruebas creada');
    }

    async createE2ETests() {
        const testsDir = path.join(this.cleanEnvironmentPath, 'e2e-tests');
        await fs.mkdir(testsDir, { recursive: true });
        
        // Test básico de carga de la aplicación
        const basicTest = `/**
 * Test E2E Básico - Entorno Limpio
 * Verifica que la aplicación carga correctamente sin archivos obsoletos
 */

const { test, expect } = require('@playwright/test');

test.describe('Aplicación en Entorno Limpio', () => {
    test('debe cargar la página principal sin errores', async ({ page }) => {
        // Capturar errores de consola
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        
        // Capturar errores de red
        const networkErrors = [];
        page.on('response', response => {
            if (response.status() >= 400) {
                networkErrors.push({
                    url: response.url(),
                    status: response.status()
                });
            }
        });
        
        // Navegar a la página principal
        await page.goto('/');
        
        // Verificar que la página carga
        await expect(page).toHaveTitle(/.*/);
        
        // Verificar que no hay errores críticos
        expect(consoleErrors.filter(error => 
            !error.includes('Warning') && 
            !error.includes('DevTools')
        )).toHaveLength(0);
        
        // Verificar que no hay errores 404 de archivos faltantes
        const missing404s = networkErrors.filter(error => error.status === 404);
        expect(missing404s).toHaveLength(0);
        
        console.log('✅ Página principal cargada sin errores');
    });
    
    test('debe navegar por las rutas principales', async ({ page }) => {
        const routes = ['/', '/products', '/about', '/contact'];
        
        for (const route of routes) {
            try {
                await page.goto(route);
                
                // Esperar a que la página cargue
                await page.waitForLoadState('networkidle');
                
                // Verificar que no hay errores 404
                const response = await page.goto(route);
                expect(response.status()).toBeLessThan(400);
                
                console.log(\`✅ Ruta \${route} accesible\`);
                
            } catch (error) {
                console.log(\`❌ Error en ruta \${route}: \${error.message}\`);
                throw error;
            }
        }
    });
    
    test('debe cargar todos los recursos estáticos', async ({ page }) => {
        const resourceErrors = [];
        
        page.on('response', response => {
            const url = response.url();
            const status = response.status();
            
            // Verificar recursos estáticos
            if ((url.includes('.js') || url.includes('.css') || url.includes('.png') || 
                 url.includes('.jpg') || url.includes('.svg')) && status >= 400) {
                resourceErrors.push({ url, status });
            }
        });
        
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Verificar que todos los recursos se cargaron correctamente
        expect(resourceErrors).toHaveLength(0);
        
        console.log('✅ Todos los recursos estáticos cargados correctamente');
    });
    
    test('debe funcionar la funcionalidad principal', async ({ page }) => {
        await page.goto('/');
        
        // Buscar elementos principales de la aplicación
        const mainElements = [
            'header',
            'nav',
            'main',
            'footer'
        ];
        
        for (const element of mainElements) {
            const locator = page.locator(element);
            await expect(locator).toBeVisible();
        }
        
        // Verificar que los enlaces principales funcionan
        const links = await page.locator('a[href]').all();
        
        for (let i = 0; i < Math.min(links.length, 5); i++) {
            const link = links[i];
            const href = await link.getAttribute('href');
            
            if (href && href.startsWith('/')) {
                await link.click();
                await page.waitForLoadState('networkidle');
                
                // Verificar que la navegación fue exitosa
                const currentUrl = page.url();
                expect(currentUrl).toContain(href);
                
                console.log(\`✅ Enlace \${href} funciona correctamente\`);
                
                // Volver a la página principal
                await page.goto('/');
            }
        }
    });
});
`;
        
        const testPath = path.join(testsDir, 'basic-functionality.spec.js');
        await fs.writeFile(testPath, basicTest);
        
        // Crear configuración de Playwright
        const playwrightConfig = `const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './e2e-tests',
    timeout: 30000,
    retries: 2,
    use: {
        baseURL: 'http://localhost:${this.serverPort}',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    projects: [
        {
            name: 'chromium',
            use: { ...require('@playwright/test').devices['Desktop Chrome'] }
        }
    ],
    webServer: {
        command: '${this.serverCommand}',
        port: ${this.serverPort},
        timeout: 120000,
        reuseExistingServer: !process.env.CI
    }
});
`;
        
        const configPath = path.join(this.cleanEnvironmentPath, 'playwright.config.js');
        await fs.writeFile(configPath, playwrightConfig);
        
        this.log('Tests E2E creados');
    }

    async buildApplication() {
        this.log('Construyendo aplicación en entorno limpio...', 'test');
        
        return new Promise((resolve, reject) => {
            const build = spawn('npm', ['run', 'build'], {
                cwd: this.cleanEnvironmentPath,
                stdio: this.verbose ? 'inherit' : 'pipe'
            });
            
            let output = '';
            
            if (!this.verbose) {
                build.stdout?.on('data', (data) => {
                    output += data.toString();
                });
                
                build.stderr?.on('data', (data) => {
                    output += data.toString();
                });
            }
            
            build.on('close', (code) => {
                if (code === 0) {
                    this.log('Aplicación construida correctamente', 'success');
                    resolve({ success: true, output });
                } else {
                    this.log('Error construyendo aplicación', 'error');
                    resolve({ success: false, output });
                }
            });
            
            build.on('error', (error) => {
                reject(error);
            });
        });
    }

    async startServer() {
        this.log('Iniciando servidor de pruebas...', 'server');
        
        return new Promise((resolve, reject) => {
            this.serverProcess = spawn('npm', ['start'], {
                cwd: this.cleanEnvironmentPath,
                stdio: this.verbose ? 'inherit' : 'pipe'
            });
            
            let serverReady = false;
            
            this.serverProcess.stdout?.on('data', (data) => {
                const output = data.toString();
                if (output.includes(`localhost:${this.serverPort}`) || 
                    output.includes('Server running') ||
                    output.includes('ready')) {
                    if (!serverReady) {
                        serverReady = true;
                        this.log(`Servidor iniciado en puerto ${this.serverPort}`, 'success');
                        resolve();
                    }
                }
            });
            
            this.serverProcess.on('error', reject);
            
            // Timeout de 60 segundos para iniciar el servidor
            setTimeout(() => {
                if (!serverReady) {
                    reject(new Error('Timeout iniciando servidor'));
                }
            }, 60000);
        });
    }

    async runE2ETests() {
        this.log('Ejecutando pruebas E2E...', 'test');
        
        return new Promise((resolve) => {
            const test = spawn('npx', ['playwright', 'test'], {
                cwd: this.cleanEnvironmentPath,
                stdio: this.verbose ? 'inherit' : 'pipe'
            });
            
            let output = '';
            
            if (!this.verbose) {
                test.stdout?.on('data', (data) => {
                    output += data.toString();
                });
                
                test.stderr?.on('data', (data) => {
                    output += data.toString();
                });
            }
            
            test.on('close', (code) => {
                if (code === 0) {
                    this.log('Pruebas E2E completadas exitosamente', 'success');
                } else {
                    this.log('Algunas pruebas E2E fallaron', 'warning');
                }
                
                resolve({
                    success: code === 0,
                    exitCode: code,
                    output
                });
            });
        });
    }

    async stopServer() {
        if (this.serverProcess) {
            this.log('Deteniendo servidor de pruebas...', 'server');
            this.serverProcess.kill();
            this.serverProcess = null;
        }
    }

    async cleanup() {
        this.log('Limpiando entorno de pruebas...');
        
        await this.stopServer();
        
        try {
            // Eliminar entorno limpio
            await fs.rm(this.cleanEnvironmentPath, { recursive: true, force: true });
            this.log('Entorno limpio eliminado', 'success');
        } catch (error) {
            this.log(`Error limpiando entorno: ${error.message}`, 'warning');
        }
    }

    async generateReport(results) {
        const timestamp = new Date().toISOString();
        
        const report = {
            timestamp,
            environment: 'clean',
            projectRoot: this.projectRoot,
            cleanEnvironmentPath: this.cleanEnvironmentPath,
            results,
            logs: this.testResults,
            summary: {
                buildSuccess: results.build?.success || false,
                testsSuccess: results.tests?.success || false,
                overallSuccess: (results.build?.success && results.tests?.success) || false
            },
            recommendations: []
        };
        
        // Generar recomendaciones
        if (report.summary.overallSuccess) {
            report.recommendations.push({
                type: 'SUCCESS',
                message: 'La aplicación funciona correctamente en entorno limpio',
                action: 'Los archivos actuales son suficientes para el funcionamiento'
            });
        } else {
            if (!results.build?.success) {
                report.recommendations.push({
                    type: 'CRITICAL',
                    message: 'La aplicación no se puede construir en entorno limpio',
                    action: 'Revisar dependencias faltantes o archivos necesarios'
                });
            }
            
            if (!results.tests?.success) {
                report.recommendations.push({
                    type: 'WARNING',
                    message: 'Algunas funcionalidades fallan en entorno limpio',
                    action: 'Revisar los logs de pruebas para identificar problemas'
                });
            }
        }
        
        // Guardar reporte
        const reportPath = path.join(this.projectRoot, 
            `e2e-clean-environment-report-${timestamp.replace(/[:.]/g, '-')}.json`);
        
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        this.log(`Reporte guardado: ${path.basename(reportPath)}`, 'success');
        
        return report;
    }

    async validate() {
        this.log('🚀 Iniciando validación E2E en entorno limpio...', 'test');
        
        const results = {};
        
        try {
            // 1. Crear entorno limpio
            await this.createCleanEnvironment();
            
            // 2. Construir aplicación
            results.build = await this.buildApplication();
            
            if (results.build.success) {
                // 3. Iniciar servidor
                await this.startServer();
                
                // 4. Ejecutar pruebas E2E
                results.tests = await this.runE2ETests();
            } else {
                this.log('Omitiendo pruebas E2E debido a fallo en build', 'warning');
                results.tests = { success: false, output: 'Build failed' };
            }
            
            // 5. Generar reporte
            const report = await this.generateReport(results);
            
            return report;
            
        } catch (error) {
            this.log(`Error en validación: ${error.message}`, 'error');
            throw error;
        } finally {
            await this.cleanup();
        }
    }
}

// Función principal para ejecutar desde línea de comandos
async function main() {
    const validator = new E2ECleanEnvironmentValidator({
        verbose: process.env.VERBOSE === 'true'
    });
    
    try {
        const report = await validator.validate();
        
        console.log('\n📊 RESULTADOS DE VALIDACIÓN E2E:');
        console.log(`Build exitoso: ${report.summary.buildSuccess ? '✅' : '❌'}`);
        console.log(`Tests exitosos: ${report.summary.testsSuccess ? '✅' : '❌'}`);
        console.log(`Validación general: ${report.summary.overallSuccess ? '✅' : '❌'}`);
        
        if (report.recommendations.length > 0) {
            console.log('\n💡 RECOMENDACIONES:');
            report.recommendations.forEach(rec => {
                console.log(`${rec.type}: ${rec.message}`);
            });
        }
        
        // Salir con código de error si la validación falló
        if (!report.summary.overallSuccess) {
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Error en validación:', error.message);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { E2ECleanEnvironmentValidator };