import express from 'express'
import morgan from 'morgan'
import colors from 'colors'
import cors from 'cors'

import './interface'
import { db } from './config/db'
import { CryptoEmail } from './utils/cryptoEmail'
import { authRouter } from './routes/authRoute'
import { globalLimiter } from './config/limiter'
import { SecureData } from './utils/crypto'
import { productRouter } from './routes/productRoute'
import { categoryRouter } from './routes/categoryRoute'
import { supplierRouter } from './routes/supplierRoute'
import { movementRouter } from './routes/movementRoute'

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
            if (!process.env.SECURE_DATA_KEY) {
                throw new Error('SECURE_DATA_KEY is not defined in .env');
            }
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
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())

app.use(globalLimiter)

app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/suppliers', supplierRouter)
app.use('/api/movements', movementRouter)

export default app