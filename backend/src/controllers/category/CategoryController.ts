import { Request, Response } from 'express';
import Category from '../../models/category/Category';

export class CategoryController {
    static createCategory = async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body;
            const category = await Category.create({
                name,
                description,
                userId: req.user.id
            });
            return res.status(201).json({ message: 'Category created successfully', category });
        } catch (error) {
            console.error('Error creating category:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static getCategories = async (req: Request, res: Response) => {
        try {
            const categories = await Category.findAll({
                where: { userId: req.user.id }
            });
            return res.status(200).json({ categories });
        } catch (error) {
            console.error('Error fetching categories:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static getCategoryById = async (req: Request, res: Response) => {
        try {
            const category = req.category;
            return res.status(200).json({ category });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static updateCategory = async (req: Request, res: Response) => {
        try {
            const category = req.category;
            const { name, description } = req.body;
            
            category.name = name ?? category.name;
            category.description = description !== undefined ? description : category.description;
            
            await category.save();
            return res.status(200).json({ message: 'Category updated successfully', category });
        } catch (error) {
            console.error('Error updating category:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static deleteCategory = async (req: Request, res: Response) => {
        try {
            const category = req.category;
            await category.destroy();
            return res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Error deleting category:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
