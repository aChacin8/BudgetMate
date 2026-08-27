import { Request, Response } from 'express';
import StockMovement from '../../models/movement/StockMovement';
import Product from '../../models/product/Product';

export class MovementController {
    static createMovement = async (req: Request, res: Response) => {
        try {
            const product = req.product;
            const { type, quantity, reason } = req.body;

            if (!type || !['IN', 'OUT', 'ADJUSTMENT'].includes(type)) {
                return res.status(400).json({ message: 'Invalid movement type. Must be IN, OUT, or ADJUSTMENT.' });
            }

            if (quantity === undefined || quantity < 0) {
                return res.status(400).json({ message: 'Quantity must be a non-negative number.' });
            }

            let stockChange = 0;
            let finalStock = product.stock;

            if (type === 'IN') {
                stockChange = quantity;
                finalStock = product.stock + quantity;
            } else if (type === 'OUT') {
                if (product.stock < quantity) {
                    return res.status(400).json({ message: `Insufficient stock. Current stock is ${product.stock}, but requested output is ${quantity}.` });
                }
                stockChange = -quantity;
                finalStock = product.stock - quantity;
            } else if (type === 'ADJUSTMENT') {
                // For adjustments, quantity is treated as the NEW target stock level.
                stockChange = quantity - product.stock;
                finalStock = quantity;
            }

            // Create movement log
            const movement = await StockMovement.create({
                type,
                quantity: Math.abs(stockChange),
                reason: reason || (type === 'ADJUSTMENT' ? 'Ajuste de inventario' : ''),
                productId: product.id,
                userId: req.user.id
            });

            // Update product stock
            product.stock = finalStock;
            await product.save();

            return res.status(201).json({
                message: 'Stock movement registered successfully',
                movement,
                currentStock: finalStock
            });
        } catch (error) {
            console.error('Error creating stock movement:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static getMovements = async (req: Request, res: Response) => {
        try {
            const movements = await StockMovement.findAll({
                where: { userId: req.user.id },
                include: [
                    { model: Product, attributes: ['id', 'name', 'sku'] }
                ],
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json({ movements });
        } catch (error) {
            console.error('Error fetching stock movements:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
