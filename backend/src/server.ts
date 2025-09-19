import express from 'express'
import morgan from 'morgan'
import { db } from './config/db'
import colors from 'colors'

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

const app = express()

connectDB()
app.use(morgan('dev'))
app.use(express.json())

export default app