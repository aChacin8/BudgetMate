import express from 'express'
import morgan from 'morgan'
import colors from 'colors'

import './interface'
import { db } from './config/db'
import { CryptoEmail } from './utils/cryptoEmail'
import { budgetRouter } from './routes/budgetRoute'
import expenseRouter from './routes/expensesRoute'
import { authRouter } from './routes/authRoute'
import { globalLimiter } from './config/limiter'
import { earningRouter } from './routes/earningRoute'
import { SecureData } from './utils/crypto'

const connectDB = async () => {
    try {
        await db.authenticate()
        db.sync() //Crea las tablas en automatico
        
        console.log(colors.bgGreen('Database connected'));  
    } catch (error) {
        const err = new Error('Failed to connect to the database')
        console.log(colors.bgRed(err.message));
    }
}

const app = express();

(
    async () => {
        try {
            await CryptoEmail.init();
            await SecureData.init(process.env.SECURE_DATA_KEY);
            console.log(colors.bgGreen('Crypto system initialized'));
        } catch (error) {
            console.error(colors.bgRed('Failed to initialize crypto system'));
            console.error(error);
        }
    }
)();

connectDB()
app.use(morgan('dev'))
app.use(express.json())

app.use(globalLimiter)

app.use('/api/auth', authRouter)

app.use('/api/users/:userId/earnings', earningRouter)
app.use('/api/users/:userId/earnings/:earningId/expenses', expenseRouter)
// app.use('/api/users/:userId/earnings/:earningId/extras', extrasRouter);
app.use('/api/users/:userId/earnings/:earningId/budgets', budgetRouter)
// app.use('/api/users/:userId/earnings/:earningId/budgets/:budgetId/expenses', budgetExpenseRouter);


export default app