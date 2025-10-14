import express from 'express'
import morgan from 'morgan'
import colors from 'colors'

import './types/'
import { db } from './config/db'
import { CryptoEmail } from './utils/cryptoEmail'
import { budgetRouter } from './routes/budgetRoute'
import expenseRouter from './routes/expensesRoute'
import { authRouter } from './routes/authRoute'

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

app.use('/api/budgets', budgetRouter)
app.use('/api/expenses', expenseRouter)
app.use('/api/auth', authRouter)

export default app