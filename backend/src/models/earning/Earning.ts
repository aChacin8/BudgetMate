import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import EarningExpense from "./EarningExpense";
import Budget from "../budget/Budget";

@Table({
    tableName: 'earnings'
})

class Earning extends Model {
    @Column({
        type: DataType.DECIMAL(10,2)
    })
    declare amount: number

    @Column({
        type: DataType.STRING(100)
    })
    declare monthEarning: string

    @Column({
        type: DataType.INTEGER
    })
    declare yearAmount: number

    @HasMany(()=> EarningExpense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare earningExpenses: EarningExpense[]

    @HasMany(()=> Budget, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare budgets: Budget[]
}

export default Earning;