import {Table, Model, DataType,  Column, HasMany } from "sequelize-typescript";
import BudgetExpense from "./BudgetExpense";

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

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isActive: boolean

    @HasMany(()=> BudgetExpense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare budgetExpenses: BudgetExpense[]
}

export default Budget;
