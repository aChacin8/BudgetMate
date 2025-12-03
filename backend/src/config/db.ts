import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT} = process.env;

export const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    models: [__dirname + '/../models/**/*'], 
    host: DB_HOST,
    dialect: DB_DIALECT as any,
    logging: false
})

