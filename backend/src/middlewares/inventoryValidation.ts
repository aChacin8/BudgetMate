import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import Category from '../models/category/Category';
import Supplier from '../models/supplier/Supplier';
import Product from '../models/product/Product';

// Category Validation
export const validateCategoryInput = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters')
];

export const validateCategoryExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findOne({
            where: { id: categoryId, userId: req.user.id }
        });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        req.category = category;
        next();
    } catch (error) {
        console.error('Error validating category existence:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Supplier Validation
export const validateSupplierInput = [
    body('name')
        .trim()
        .notEmpty().withMessage('Supplier name is required')
        .isLength({ max: 100 }).withMessage('Supplier name cannot exceed 100 characters'),
    body('contactEmail')
        .optional({ checkFalsy: true })
        .isEmail().withMessage('Invalid email format'),
    body('phone')
        .optional({ checkFalsy: true })
        .isLength({ max: 50 }).withMessage('Phone cannot exceed 50 characters'),
    body('address')
        .optional({ checkFalsy: true })
];

export const validateSupplierExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { supplierId } = req.params;
        const supplier = await Supplier.findOne({
            where: { id: supplierId, userId: req.user.id }
        });
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        req.supplier = supplier;
        next();
    } catch (error) {
        console.error('Error validating supplier existence:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Product Validation
export const validateProductInput = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
    body('sku')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 50 }).withMessage('SKU cannot exceed 50 characters'),
    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('minStock')
        .optional()
        .isInt({ min: 0 }).withMessage('Minimum stock must be a non-negative integer'),
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('categoryId')
        .optional({ checkFalsy: true })
        .isInt().withMessage('Category ID must be an integer'),
    body('supplierId')
        .optional({ checkFalsy: true })
        .isInt().withMessage('Supplier ID must be an integer')
];

export const validateProductExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const product = await Product.findOne({
            where: { id: productId, userId: req.user.id }
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        req.product = product;
        next();
    } catch (error) {
        console.error('Error validating product existence:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
