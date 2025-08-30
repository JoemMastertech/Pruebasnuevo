"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDataRepositoryAdapter = void 0;
const Product_js_1 = require("../../Domain/Entities/Product.js");
const ProductId_js_1 = require("../../Domain/ValueObjects/ProductId.js");
const ProductName_js_1 = require("../../Domain/ValueObjects/ProductName.js");
const ProductCategory_js_1 = require("../../Domain/ValueObjects/ProductCategory.js");
const Money_js_1 = require("../../Domain/ValueObjects/Money.js");
/**
 * Adaptador que conecta el ProductDataAdapter existente con el puerto del dominio
 * Convierte datos del sistema legacy al modelo de dominio
 */
class ProductDataRepositoryAdapter {
    constructor(productDataAdapter) {
        this.productDataAdapter = productDataAdapter;
    }
    /**
     * Busca un producto por nombre
     */
    async findByName(name) {
        try {
            // Buscar en todas las categorías
            const categories = [
                'cocteles', 'refrescos', 'licores', 'cervezas',
                'pizzas', 'alitas', 'sopas', 'ensaladas', 'carnes',
                'cafes', 'postres'
            ];
            for (const category of categories) {
                const products = await this.getProductsByCategory(category);
                const found = products.find(p => p.name.value.toLowerCase() === name.toLowerCase());
                if (found) {
                    return found;
                }
            }
            return null;
        }
        catch (error) {
            console.error('Error finding product by name:', error);
            return null;
        }
    }
    /**
     * Busca productos por categoría
     */
    async findByCategory(category) {
        try {
            return await this.getProductsByCategory(category.value);
        }
        catch (error) {
            console.error('Error finding products by category:', error);
            return [];
        }
    }
    /**
     * Obtiene todos los productos
     */
    async findAll() {
        try {
            const allProducts = [];
            const categories = [
                'cocteles', 'refrescos', 'licores', 'cervezas',
                'pizzas', 'alitas', 'sopas', 'ensaladas', 'carnes',
                'cafes', 'postres'
            ];
            for (const category of categories) {
                const products = await this.getProductsByCategory(category);
                allProducts.push(...products);
            }
            return allProducts;
        }
        catch (error) {
            console.error('Error finding all products:', error);
            return [];
        }
    }
    /**
     * Busca productos por texto (nombre o ingredientes)
     */
    async search(query) {
        try {
            const allProducts = await this.findAll();
            const searchTerm = query.toLowerCase();
            return allProducts.filter(product => product.name.value.toLowerCase().includes(searchTerm) ||
                (product.ingredients && product.ingredients.toLowerCase().includes(searchTerm)));
        }
        catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }
    /**
     * Verifica si un producto existe
     */
    async exists(productId) {
        try {
            const allProducts = await this.findAll();
            return allProducts.some(product => product.id.equals(productId));
        }
        catch (error) {
            console.error('Error checking product existence:', error);
            return false;
        }
    }
    /**
     * Obtiene las opciones de bebida para un producto
     */
    async getDrinkOptions(product) {
        // Opciones básicas de bebidas disponibles
        const basicDrinkOptions = [
            { name: 'Coca Cola', type: 'soda' },
            { name: 'Sprite', type: 'soda' },
            { name: 'Agua Mineral', type: 'water' },
            { name: 'Hielos', type: 'mixer' },
            { name: 'Jugo de Naranja', type: 'juice' },
            { name: 'Jugo de Arándano', type: 'juice' }
        ];
        // Si es un licor, filtrar según el tipo
        if (product.isLiquor()) {
            const liquorType = product.getLiquorType();
            switch (liquorType) {
                case 'JAGERMEISTER':
                    return []; // Jägermeister se sirve solo
                case 'RON':
                    return basicDrinkOptions.filter(option => option.type !== 'juice' || !option.name.toLowerCase().includes('naranja'));
                default:
                    return basicDrinkOptions;
            }
        }
        return [];
    }
    /**
     * Busca productos por múltiples categorías
     */
    async findByCategories(categories) {
        try {
            const allProducts = [];
            for (const category of categories) {
                const products = await this.findByCategory(category);
                allProducts.push(...products);
            }
            return allProducts;
        }
        catch (error) {
            console.error('Error finding products by categories:', error);
            return [];
        }
    }
    /**
     * Busca productos que contengan ciertos ingredientes
     */
    async findByIngredients(ingredients) {
        try {
            const allProducts = await this.findAll();
            return allProducts.filter(product => {
                if (!product.ingredients)
                    return false;
                return ingredients.some(ingredient => product.ingredients.toLowerCase().includes(ingredient.toLowerCase()));
            });
        }
        catch (error) {
            console.error('Error finding products by ingredients:', error);
            return [];
        }
    }
    /**
     * Obtiene productos en un rango de precios
     */
    async findByPriceRange(minPrice, maxPrice) {
        try {
            const allProducts = await this.findAll();
            return allProducts.filter(product => {
                const price = product.price.amount;
                return price >= minPrice && price <= maxPrice;
            });
        }
        catch (error) {
            console.error('Error finding products by price range:', error);
            return [];
        }
    }
    /**
     * Método privado para obtener productos por categoría y convertirlos al modelo de dominio
     */
    async getProductsByCategory(category) {
        try {
            let rawProducts = [];
            // Mapear categorías a métodos del ProductDataAdapter
            switch (category.toLowerCase()) {
                case 'cocteles':
                case 'cocteleria':
                    rawProducts = await this.productDataAdapter.getCocteles();
                    break;
                case 'refrescos':
                    rawProducts = await this.productDataAdapter.getRefrescos();
                    break;
                case 'licores':
                    rawProducts = await this.productDataAdapter.getLicores();
                    break;
                case 'cervezas':
                    rawProducts = await this.productDataAdapter.getCervezas();
                    break;
                case 'pizzas':
                    rawProducts = await this.productDataAdapter.getPizzas();
                    break;
                case 'alitas':
                    rawProducts = await this.productDataAdapter.getAlitas();
                    break;
                case 'sopas':
                    rawProducts = await this.productDataAdapter.getSopas();
                    break;
                case 'ensaladas':
                    rawProducts = await this.productDataAdapter.getEnsaladas();
                    break;
                case 'carnes':
                    rawProducts = await this.productDataAdapter.getCarnes();
                    break;
                case 'cafes':
                case 'cafe':
                    rawProducts = await this.productDataAdapter.getCafe();
                    break;
                case 'postres':
                    rawProducts = await this.productDataAdapter.getPostres();
                    break;
                default:
                    return [];
            }
            // Convertir datos raw al modelo de dominio
            return rawProducts.map(rawProduct => this.convertToDomainModel(rawProduct, category));
        }
        catch (error) {
            console.error(`Error getting products for category ${category}:`, error);
            return [];
        }
    }
    /**
     * Convierte un producto raw del sistema legacy al modelo de dominio
     */
    convertToDomainModel(rawProduct, category) {
        // Crear ID del producto
        const id = new ProductId_js_1.ProductId(rawProduct.id || rawProduct.nombre);
        // Crear nombre del producto
        const name = new ProductName_js_1.ProductName(rawProduct.nombre);
        // Crear categoría del producto
        const productCategory = new ProductCategory_js_1.ProductCategory(this.mapToValidCategory(category));
        // Crear precio del producto
        const price = this.extractPrice(rawProduct);
        const productPrice = new Money_js_1.Money(price);
        // Extraer ingredientes si existen
        const ingredients = rawProduct.ingredientes ?
            rawProduct.ingredientes.split(',').map((ing) => ing.trim()).join(', ') :
            '';
        // Crear el producto
        return new Product_js_1.Product(id, name, productCategory, productPrice, ingredients);
    }
    /**
     * Mapea categorías del sistema legacy a categorías válidas del dominio
     */
    mapToValidCategory(category) {
        const categoryMap = {
            'cocteles': 'cocteles',
            'cocteleria': 'cocteles',
            'refrescos': 'refrescos',
            'licores': 'licores',
            'cervezas': 'cervezas',
            'pizzas': 'comida',
            'alitas': 'comida',
            'sopas': 'comida',
            'ensaladas': 'comida',
            'carnes': 'comida',
            'cafes': 'bebidas',
            'cafe': 'bebidas',
            'postres': 'comida'
        };
        return categoryMap[category.toLowerCase()] || 'comida';
    }
    /**
     * Extrae el precio de un producto raw
     */
    extractPrice(rawProduct) {
        // Para licores, usar precioCopa como precio base
        if (rawProduct.precioCopa && rawProduct.precioCopa !== '--') {
            const price = parseFloat(rawProduct.precioCopa.toString().replace('$', ''));
            return isNaN(price) ? 0 : price;
        }
        // Para otros productos, usar precio
        if (rawProduct.precio) {
            const price = parseFloat(rawProduct.precio.toString().replace('$', ''));
            return isNaN(price) ? 0 : price;
        }
        return 0;
    }
}
exports.ProductDataRepositoryAdapter = ProductDataRepositoryAdapter;
