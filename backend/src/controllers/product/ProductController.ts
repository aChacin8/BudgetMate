import { Request, Response } from 'express';
import { Op, col } from 'sequelize';
import Product from '../../models/product/Product';
import Category from '../../models/category/Category';
import Supplier from '../../models/supplier/Supplier';
import StockMovement from '../../models/movement/StockMovement';

export class ProductController {
    static createProduct = async (req: Request, res: Response) => {
        try {
            const { name, sku, description, stock, minStock, price, categoryId, supplierId } = req.body;
            
            const product = await Product.create({
                name,
                sku,
                description,
                stock: stock || 0,
                minStock: minStock !== undefined ? minStock : 5,
                price: price || 0,
                categoryId: categoryId || null,
                supplierId: supplierId || null,
                userId: req.user.id
            });

            // Log stock movement if starting stock is greater than 0
            if (stock && stock > 0) {
                await StockMovement.create({
                    type: 'IN',
                    quantity: stock,
                    reason: 'Inventario inicial',
                    productId: product.id,
                    userId: req.user.id
                });
            }

            return res.status(201).json({ message: 'Product created successfully', product });
        } catch (error: any) {
            console.error('Error creating product:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'A product with this SKU already exists' });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static getProducts = async (req: Request, res: Response) => {
        try {
            const { search, categoryId, supplierId, lowStock } = req.query;
            const whereClause: any = { userId: req.user.id };

            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { sku: { [Op.like]: `%${search}%` } }
                ];
            }

            if (categoryId) {
                whereClause.categoryId = categoryId;
            }

            if (supplierId) {
                whereClause.supplierId = supplierId;
            }

            if (lowStock === 'true') {
                whereClause.stock = {
                    [Op.lte]: col('min_stock')
                };
            }

            const products = await Product.findAll({
                where: whereClause,
                include: [
                    { model: Category, attributes: ['id', 'name'] },
                    { model: Supplier, attributes: ['id', 'name'] }
                ],
                order: [['name', 'ASC']]
            });

            return res.status(200).json({ products });
        } catch (error) {
            console.error('Error fetching products:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static getProductById = async (req: Request, res: Response) => {
        try {
            const product = await Product.findOne({
                where: { id: req.product.id, userId: req.user.id },
                include: [
                    { model: Category },
                    { model: Supplier },
                    { model: StockMovement, limit: 50, order: [['createdAt', 'DESC']] }
                ]
            });
            return res.status(200).json({ product });
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static updateProduct = async (req: Request, res: Response) => {
        try {
            const product = req.product;
            const { name, sku, description, minStock, price, categoryId, supplierId } = req.body;

            product.name = name ?? product.name;
            product.sku = sku !== undefined ? sku : product.sku;
            product.description = description !== undefined ? description : product.description;
            product.minStock = minStock !== undefined ? minStock : product.minStock;
            product.price = price !== undefined ? price : product.price;
            product.categoryId = categoryId !== undefined ? (categoryId || null) : product.categoryId;
            product.supplierId = supplierId !== undefined ? (supplierId || null) : product.supplierId;

            await product.save();
            return res.status(200).json({ message: 'Product updated successfully', product });
        } catch (error: any) {
            console.error('Error updating product:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'A product with this SKU already exists' });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static deleteProduct = async (req: Request, res: Response) => {
        try {
            const product = req.product;
            await product.destroy();
            return res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
