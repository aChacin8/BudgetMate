import {Table, Model, DataType,  Column, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import BudgetExpense from "./BudgetExpense";
import Earning from "../earning/Earning";

@Table({
    tableName: 'budgets',
    underscored: true
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

    @Column({
        type: DataType.TEXT
    })
    declare description: string //"Importante" solo para usuarios premium (en un futuro)

    @HasMany(()=> BudgetExpense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare budgetExpenses: BudgetExpense[]

    @ForeignKey(() => Earning)
    declare earningId: number

    @BelongsTo(()=> Earning)
    declare earning:Earning
}

export default Budget;
