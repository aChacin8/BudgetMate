import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("La variable de entorno DATABASE_URL no está definida");
}

export const db = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    models: [__dirname + '/../models/**/*.js', __dirname + '/../models/**/*.ts'],
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});