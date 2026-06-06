import { Request, Response } from 'express';
import { Op } from 'sequelize';
import FinancialSummary from '../../models/summary/FinancialSummary';
import Earning from '../../models/earning/Earning';
import EarningExpense from '../../models/earning/EarningExpense';
import EarningExtras from '../../models/earning/EarningExtra';
import { db } from '../../config/db';

export class FinancialSummaryController {

    static getSummary = async (req: Request, res: Response) => {
        const { month, year } = req.query;
        const userId = req.user.id;

        try {
            const where: any = { userId };
            if (month) where.month = Number(month);
            if (year) where.year = Number(year);

            const summary = await FinancialSummary.findOne({ where });
            if (!summary) {
                return res.status(404).json({ message: 'No summary found for the given period' });
            }
            res.json(summary);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static computeAndSave = async (req: Request, res: Response) => {
        const { month, year } = req.body;
        const userId = req.user.id;

        if (!month || !year) {
            return res.status(400).json({ message: 'month and year are required' });
        }

        try {
            const earnings = await Earning.findAll({
                where: { userId, periodMonth: month, periodYear: year }
            });

            const earningIds = earnings.map(e => e.id);
            const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.baseAmount), 0);

            const expenses = earningIds.length
                ? await EarningExpense.findAll({ where: { userId, earningId: { [Op.in]: earningIds } } })
                : [];

            const extras = earningIds.length
                ? await EarningExtras.findAll({ where: { userId, earningId: { [Op.in]: earningIds } } })
                : [];

            const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
            const totalExtras = extras.reduce((sum, e) => sum + Number(e.amount), 0);
            const remaining = (totalEarnings + totalExtras) - totalExpenses;

            const [summary] = await FinancialSummary.upsert({
                userId,
                month: Number(month),
                year: Number(year),
                totalEarnings: totalEarnings + totalExtras,
                totalExpenses,
                remaining
            });

            res.status(200).json(summary);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static getSummaryHistory = async (req: Request, res: Response) => {
        const userId = req.user.id;
        try {
            const summaries = await FinancialSummary.findAll({
                where: { userId },
                order: [['year', 'DESC'], ['month', 'DESC']]
            });
            res.json(summaries);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
