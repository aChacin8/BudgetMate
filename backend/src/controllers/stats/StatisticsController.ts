import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Earning from '../../models/earning/Earning';
import EarningExpense from '../../models/earning/EarningExpense';
import EarningExtras from '../../models/earning/EarningExtra';

const MONTH_NAMES = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export class StatisticsController {

    static getMonthlyTrend = async (req: Request, res: Response) => {
        const userId = req.user.id;
        const year = Number(req.query.year) || new Date().getFullYear();

        try {
            const earnings = await Earning.findAll({ where: { userId, periodYear: year } });
            const earningIds = earnings.map(e => e.id);

            const [expenses, extras] = await Promise.all([
                earningIds.length
                    ? EarningExpense.findAll({ where: { earningId: { [Op.in]: earningIds } } })
                    : Promise.resolve([]),
                earningIds.length
                    ? EarningExtras.findAll({ where: { earningId: { [Op.in]: earningIds } } })
                    : Promise.resolve([]),
            ]);

            const monthly = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                label: MONTH_NAMES[i],
                earnings: 0,
                expenses: 0,
                savings: 0,
            }));

            for (const e of earnings) {
                const idx = e.periodMonth - 1;
                monthly[idx].earnings += Number(e.baseAmount);

                for (const ext of extras.filter(x => x.earningId === e.id)) {
                    monthly[idx].earnings += Number(ext.amount);
                }
                for (const exp of expenses.filter(x => x.earningId === e.id)) {
                    monthly[idx].expenses += Number(exp.amount);
                }
            }

            for (const m of monthly) {
                m.savings = m.earnings - m.expenses;
                m.earnings = Math.round(m.earnings * 100) / 100;
                m.expenses = Math.round(m.expenses * 100) / 100;
                m.savings = Math.round(m.savings * 100) / 100;
            }

            res.json(monthly);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static getExpensesBreakdown = async (req: Request, res: Response) => {
        const userId = req.user.id;
        const month = req.query.month ? Number(req.query.month) : undefined;
        const year = Number(req.query.year) || new Date().getFullYear();

        try {
            const where: any = { userId, periodYear: year };
            if (month) where.periodMonth = month;

            const earnings = await Earning.findAll({ where });
            const earningIds = earnings.map(e => e.id);

            const expenses = earningIds.length
                ? await EarningExpense.findAll({ where: { earningId: { [Op.in]: earningIds } } })
                : [];

            const grouped: Record<string, number> = {};
            for (const exp of expenses) {
                grouped[exp.name] = (grouped[exp.name] || 0) + Number(exp.amount);
            }

            const result = Object.entries(grouped)
                .map(([name, amount]) => ({ name, amount: Math.round(amount * 100) / 100 }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 8);

            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    static getOverview = async (req: Request, res: Response) => {
        const userId = req.user.id;

        try {
            const earnings = await Earning.findAll({ where: { userId } });
            const earningIds = earnings.map(e => e.id);

            const [expenses, extras] = await Promise.all([
                earningIds.length
                    ? EarningExpense.findAll({ where: { earningId: { [Op.in]: earningIds } } })
                    : Promise.resolve([]),
                earningIds.length
                    ? EarningExtras.findAll({ where: { earningId: { [Op.in]: earningIds } } })
                    : Promise.resolve([]),
            ]);

            const totalEarnings =
                earnings.reduce((s, e) => s + Number(e.baseAmount), 0) +
                extras.reduce((s, e) => s + Number(e.amount), 0);
            const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
            const totalSavings = totalEarnings - totalExpenses;
            const savingsRate = totalEarnings > 0
                ? Math.round((totalSavings / totalEarnings) * 10000) / 100
                : 0;

            res.json({
                totalEarnings: Math.round(totalEarnings * 100) / 100,
                totalExpenses: Math.round(totalExpenses * 100) / 100,
                totalSavings: Math.round(totalSavings * 100) / 100,
                savingsRate,
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
