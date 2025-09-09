/* =====================================================================
   SCRIPT DE MIGRACIÓN AL SISTEMA UNIFICADO
   Actualiza automáticamente archivos para usar el controlador maestro
   ===================================================================== */

const fs = require('fs');
const path = require('path');

class UnifiedSystemMigrator {
    constructor() {
        this.migratedFiles = [];
        this.errors = [];
        this.backupDir = './backup-before-migration';
        
        this.replacements = {
            // CSS Imports
            cssImports: [
                {
                    old: /@import ['"]_variables-unified\.css['"];?/g,
                    new: '/* MIGRATED: Variables now in _view-modes-master-controller.css */'
                },
                {
                    old: /@import ['"]_view-modes-controller\.css['"];?/g,
                    new: '/* MIGRATED: Controller now in _view-modes-master-controller.css */'
                },
                {
                    old: /@import ['"]_view-modes-config\.css['"];?/g,
                    new: '/* MIGRATED: Config now in _view-modes-master-controller.css */'
                },
                {
                    old: /@import ['"]_grid-system\.css['"];?/g,
                    new: '/* MIGRATED: Grid system now in _view-modes-master-controller.css */'
                },
                {
                    old: /@import ['"]_grid-centralized\.css['"];?/g,
                    new: '/* MIGRATED: Grid centralized now in _view-modes-master-controller.css */'
                }
            ],
            
            // JavaScript Imports
            jsImports: [
                {
                    old: /src=["'].*\/view-modes-controller\.js["']/g,
                    new: 'src="./Shared/js/ViewModesController.js"'
                },
                {
                    old: /import.*from.*['"].*view-modes-controller\.js['"];?/g,
                    new: 'import ViewModesController from "./Shared/js/ViewModesController.js";'
                }
            ],
            
            // HTML Classes and Attributes
            htmlClasses: [
                {
                    old: /class=["']([^"']*?)products-container([^"']*?)["']/g,
                    new: 'class="$1view-container$2" data-view="grid"'
                },
                {
                    old: /class=["']([^"']*?)product-grid([^"']*?)["']/g,
                    new: 'class="$1view-container$2" data-view="grid"'
                },
                {
                    old: /class=["']([^"']*?)product-table([^"']*?)["']/g,
                    new: 'class="$1view-container$2" data-view="table"'
                }
            ],
            
            // CSS Variables
            cssVariables: [
                {
                    old: /--grid-columns-mobile:\s*[^;]+;/g,
                    new: '/* MIGRATED: Use --grid-columns-mobile from master controller */'
                },
                {
                    old: /--container-width:\s*[^;]+;/g,
                    new: '/* MIGRATED: Use --container-width-* from master controller */'
                },
                {
                    old: /--breakpoint-[^:]+:\s*[^;]+;/g,
                    new: '/* MIGRATED: Use unified breakpoints from master controller */'
                }
            ],
            
            // JavaScript API calls
            jsApiCalls: [
                {
                    old: /viewModesController\./g,
                    new: 'window.window.viewModesController.'
                },
                {
                    old: /new ViewModeController\(/g,
                    new: 'new ViewModesController('
                },
                {
                    old: /\.switchViewMode\(/g,
                    new: '.switchMode('
                }
            ]
        };
    }
    
    /**
     * Ejecutar migración completa
     */
    async migrate() {
        console.log('🚀 INICIANDO MIGRACIÓN AL SISTEMA UNIFICADO\n');
        
        try {
            // Crear backup
            await this.createBackup();
            
            // Migrar archivos
            await this.migrateFiles();
            
            // Generar reporte
            this.generateReport();
            
            console.log('\n✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
            
        } catch (error) {
            console.error('❌ Error durante la migración:', error);
            this.errors.push({ file: 'GENERAL', error: error.message });
        }
    }
    
    /**
     * Crear backup de archivos originales
     */
    async createBackup() {
        console.log('📦 Creando backup...');
        
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
        
        const filesToBackup = [
            'Shared/styles/main.css',
            'index.html',
            'Shared/styles/_variables-unified.css',
            'Shared/styles/_view-modes-controller.css',
            'Shared/styles/_view-modes-config.css',
            'Shared/js/view-modes-controller.js'
        ];
        
        filesToBackup.forEach(file => {
            if (fs.existsSync(file)) {
                const backupPath = path.join(this.backupDir, file);
                const backupDir = path.dirname(backupPath);
                
                if (!fs.existsSync(backupDir)) {
                    fs.mkdirSync(backupDir, { recursive: true });
                }
                
                fs.copyFileSync(file, backupPath);
                console.log(`   ✓ ${file} → ${backupPath}`);
            }
        });
    }
    
    /**
     * Migrar todos los archivos
     */
    async migrateFiles() {
        console.log('\n🔄 Migrando archivos...');
        
        // Migrar archivos CSS
        await this.migrateCSSFiles();
        
        // Migrar archivos HTML
        await this.migrateHTMLFiles();
        
        // Migrar archivos JavaScript
        await this.migrateJSFiles();
        
        // Actualizar componentes específicos
        await this.updateSpecificComponents();
    }
    
    /**
     * Migrar archivos CSS
     */
    async migrateCSSFiles() {
        const cssFiles = this.findFiles('.', /\.css$/);
        
        cssFiles.forEach(file => {
            try {
                let content = fs.readFileSync(file, 'utf8');
                let modified = false;
                
                // Aplicar reemplazos de imports CSS
                this.replacements.cssImports.forEach(replacement => {
                    if (replacement.old.test(content)) {
                        content = content.replace(replacement.old, replacement.new);
                        modified = true;
                    }
                });
                
                // Aplicar reemplazos de variables CSS
                this.replacements.cssVariables.forEach(replacement => {
                    if (replacement.old.test(content)) {
                        content = content.replace(replacement.old, replacement.new);
                        modified = true;
                    }
                });
                
                if (modified) {
                    fs.writeFileSync(file, content);
                    this.migratedFiles.push({ file, type: 'CSS', changes: 'Imports y variables actualizadas' });
                    console.log(`   ✓ CSS: ${file}`);
                }
                
            } catch (error) {
                this.errors.push({ file, error: error.message });
                console.error(`   ❌ Error en ${file}:`, error.message);
            }
        });
    }
    
    /**
     * Migrar archivos HTML
     */
    async migrateHTMLFiles() {
        const htmlFiles = this.findFiles('.', /\.html$/);
        
        htmlFiles.forEach(file => {
            try {
                let content = fs.readFileSync(file, 'utf8');
                let modified = false;
                
                // Aplicar reemplazos de imports JS
                this.replacements.jsImports.forEach(replacement => {
                    if (replacement.old.test(content)) {
                        content = content.replace(replacement.old, replacement.new);
                        modified = true;
                    }
                });
                
                // Aplicar reemplazos de clases HTML
                this.replacements.htmlClasses.forEach(replacement => {
                    if (replacement.old.test(content)) {
                        content = content.replace(replacement.old, replacement.new);
                        modified = true;
                    }
                });
                
                if (modified) {
                    fs.writeFileSync(file, content);
                    this.migratedFiles.push({ file, type: 'HTML', changes: 'Scripts y clases actualizadas' });
                    console.log(`   ✓ HTML: ${file}`);
                }
                
            } catch (error) {
                this.errors.push({ file, error: error.message });
                console.error(`   ❌ Error en ${file}:`, error.message);
            }
        });
    }
    
    /**
     * Migrar archivos JavaScript
     */
    async migrateJSFiles() {
        const jsFiles = this.findFiles('.', /\.(js|ts)$/);
        
        jsFiles.forEach(file => {
            // Saltar el nuevo controlador maestro
            if (file.includes('ViewModesController.js')) return;
            
            try {
                let content = fs.readFileSync(file, 'utf8');
                let modified = false;
                
                // Aplicar reemplazos de imports JS
                this.replacements.jsImports.forEach(replacement => {
                    if (replacement.old.test(content)) {
                        content = content.replace(replacement.old, replacement.new);
                        modified = true;
                    }
                });
                
                // Aplicar reemplazos de API calls
                this.replacements.jsApiCalls.forEach(replacement => {
                    if (replacement.old.test(content)) {
                        content = content.replace(replacement.old, replacement.new);
                        modified = true;
                    }
                });
                
                if (modified) {
                    fs.writeFileSync(file, content);
                    this.migratedFiles.push({ file, type: 'JS', changes: 'Imports y API calls actualizadas' });
                    console.log(`   ✓ JS: ${file}`);
                }
                
            } catch (error) {
                this.errors.push({ file, error: error.message });
                console.error(`   ❌ Error en ${file}:`, error.message);
            }
        });
    }
    
    /**
     * Actualizar componentes específicos
     */
    async updateSpecificComponents() {
        console.log('\n🔧 Actualizando componentes específicos...');
        
        // Actualizar ProductGridComponent si existe
        const productGridFiles = this.findFiles('.', /ProductGridComponent\.(js|ts)$/);
        productGridFiles.forEach(file => {
            this.updateProductGridComponent(file);
        });
        
        // Actualizar archivos de configuración
        this.updateConfigFiles();
    }
    
    /**
     * Actualizar ProductGridComponent
     */
    updateProductGridComponent(file) {
        try {
            let content = fs.readFileSync(file, 'utf8');
            
            // Reemplazar referencias al sistema antiguo
            const updates = [
                {
                    old: /this\.viewMode\s*=/g,
                    new: 'window.window.viewModesController.currentMode ='
                },
                {
                    old: /this\.switchView\(/g,
                    new: 'window.window.viewModesController.switchMode('
                },
                {
                    old: /\.grid-container/g,
                    new: '.view-container[data-view="grid"]'
                },
                {
                    old: /\.table-container/g,
                    new: '.view-container[data-view="table"]'
                }
            ];
            
            let modified = false;
            updates.forEach(update => {
                if (update.old.test(content)) {
                    content = content.replace(update.old, update.new);
                    modified = true;
                }
            });
            
            if (modified) {
                fs.writeFileSync(file, content);
                this.migratedFiles.push({ file, type: 'Component', changes: 'ProductGridComponent actualizado' });
                console.log(`   ✓ Component: ${file}`);
            }
            
        } catch (error) {
            this.errors.push({ file, error: error.message });
            console.error(`   ❌ Error actualizando ${file}:`, error.message);
        }
    }
    
    /**
     * Actualizar archivos de configuración
     */
    updateConfigFiles() {
        // Crear archivo de configuración para el nuevo sistema
        const configContent = `/* =====================================================================
   CONFIGURACIÓN DEL SISTEMA UNIFICADO
   Variables de configuración para ViewModesController
   ===================================================================== */

// Configuración global para ViewModesController
window.VIEW_MODES_CONFIG = {
    containerSelector: '.view-container',
    toggleButtonSelector: '.view-toggle-btn',
    defaultMode: 'grid',
    enableTransitions: true,
    enableLocalStorage: true,
    enableDebugMode: false,
    transitionDuration: 400,
    autoSwitchMobile: true,
    
    callbacks: {
        onModeChange: (data) => {
            console.log('🔄 Modo cambiado:', data);
            // Aquí puedes agregar lógica personalizada
        },
        onTransitionStart: (data) => {
            console.log('⏳ Iniciando transición:', data);
        },
        onTransitionEnd: (data) => {
            console.log('✅ Transición completada:', data);
        },
        onError: (data) => {
            console.error('❌ Error en ViewModes:', data);
        }
    }
};
`;
        
        fs.writeFileSync('Shared/config/view-modes-config.js', configContent);
        console.log('   ✓ Config: Shared/config/view-modes-config.js');
    }
    
    /**
     * Buscar archivos por patrón
     */
    findFiles(dir, pattern) {
        const files = [];
        
        const scanDir = (currentDir) => {
            const items = fs.readdirSync(currentDir);
            
            items.forEach(item => {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    scanDir(fullPath);
                } else if (stat.isFile() && pattern.test(item)) {
                    files.push(fullPath);
                }
            });
        };
        
        scanDir(dir);
        return files;
    }
    
    /**
     * Generar reporte de migración
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalFiles: this.migratedFiles.length,
                errors: this.errors.length,
                success: this.errors.length === 0
            },
            migratedFiles: this.migratedFiles,
            errors: this.errors,
            nextSteps: [
                'Probar la aplicación en diferentes breakpoints',
                'Verificar que todos los modos de vista funcionen correctamente',
                'Revisar la consola del navegador para errores',
                'Validar que las transiciones sean suaves',
                'Confirmar que se guarden las preferencias del usuario'
            ]
        };
        
        // Guardar reporte JSON
        fs.writeFileSync('migration-report.json', JSON.stringify(report, null, 2));
        
        // Generar reporte legible
        let markdown = `# REPORTE DE MIGRACIÓN AL SISTEMA UNIFICADO\n\n`;
        markdown += `**Fecha:** ${new Date().toLocaleDateString()}\n\n`;
        
        markdown += `## 📊 RESUMEN\n\n`;
        markdown += `- **Archivos migrados:** ${report.summary.totalFiles}\n`;
        markdown += `- **Errores:** ${report.summary.errors}\n`;
        markdown += `- **Estado:** ${report.summary.success ? '✅ EXITOSO' : '❌ CON ERRORES'}\n\n`;
        
        if (this.migratedFiles.length > 0) {
            markdown += `## 📁 ARCHIVOS MIGRADOS\n\n`;
            this.migratedFiles.forEach(item => {
                markdown += `- **${item.file}** (${item.type}) - ${item.changes}\n`;
            });
            markdown += `\n`;
        }
        
        if (this.errors.length > 0) {
            markdown += `## ❌ ERRORES\n\n`;
            this.errors.forEach(error => {
                markdown += `- **${error.file}:** ${error.error}\n`;
            });
            markdown += `\n`;
        }
        
        markdown += `## 🚀 PRÓXIMOS PASOS\n\n`;
        report.nextSteps.forEach(step => {
            markdown += `- ${step}\n`;
        });
        
        fs.writeFileSync('migration-report.md', markdown);
        
        console.log('\n📊 REPORTE DE MIGRACIÓN:');
        console.log(`   - Archivos migrados: ${report.summary.totalFiles}`);
        console.log(`   - Errores: ${report.summary.errors}`);
        console.log(`   - Reportes generados: migration-report.json, migration-report.md`);
    }
}

// Ejecutar migración
const migrator = new UnifiedSystemMigrator();
migrator.migrate();

module.exports = UnifiedSystemMigrator;