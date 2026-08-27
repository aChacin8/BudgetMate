import { Request, Response } from 'express';
import Supplier from '../../models/supplier/Supplier';

export class SupplierController {
    static createSupplier = async (req: Request, res: Response) => {
        try {
            const { name, contactEmail, phone, address } = req.body;
            const supplier = await Supplier.create({
                name,
                contactEmail,
                phone,
                address,
                userId: req.user.id
            });
            return res.status(201).json({ message: 'Supplier created successfully', supplier });
        } catch (error) {
            console.error('Error creating supplier:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static getSuppliers = async (req: Request, res: Response) => {
        try {
            const suppliers = await Supplier.findAll({
                where: { userId: req.user.id }
            });
            return res.status(200).json({ suppliers });
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static getSupplierById = async (req: Request, res: Response) => {
        try {
            const supplier = req.supplier;
            return res.status(200).json({ supplier });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static updateSupplier = async (req: Request, res: Response) => {
        try {
            const supplier = req.supplier;
            const { name, contactEmail, phone, address } = req.body;

            supplier.name = name ?? supplier.name;
            supplier.contactEmail = contactEmail !== undefined ? contactEmail : supplier.contactEmail;
            supplier.phone = phone !== undefined ? phone : supplier.phone;
            supplier.address = address !== undefined ? address : supplier.address;

            await supplier.save();
            return res.status(200).json({ message: 'Supplier updated successfully', supplier });
        } catch (error) {
            console.error('Error updating supplier:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static deleteSupplier = async (req: Request, res: Response) => {
        try {
            const supplier = req.supplier;
            await supplier.destroy();
            return res.status(200).json({ message: 'Supplier deleted successfully' });
        } catch (error) {
            console.error('Error deleting supplier:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
