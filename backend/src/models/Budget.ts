import {Table, Model, DataType,  Column, HasMany } from "sequelize-typescript";
import Expense from "./Expense";

@Table({
    tableName: 'budgets',
})

class Budget extends Model {
    @Column({
        type: DataType.STRING(100),
        })
    declare name: string

    @Column({
        type: DataType.DECIMAL(10,2)
    })
    declare amount: number

    @HasMany(()=> Expense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare expenses: Expense[]
}

export default Budget;
