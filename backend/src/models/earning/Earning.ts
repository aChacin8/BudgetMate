import { Table, Model, Column, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import EarningExpense from "./EarningExpense";
import Budget from "../budget/Budget";
import User from "../user/User";
import ExtraEarnings from "./ExtraEarning";

@Table({
    tableName: 'earnings',
    underscored: true
})

class Earning extends Model {
    @Column({
        type: DataType.DECIMAL(10,2)
    })
    declare baseAmount: number

    @Column({
        type: DataType.DATE
    })
    declare periodStart: Date

    @Column({
        type: DataType.DATE
    })
    declare periodEnd: Date

    @ForeignKey(()=> User)
    declare userId: number

    @BelongsTo(()=> User)
    declare user: User

    @HasMany(()=> Budget, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare budgets: Budget[]
    
    @HasMany(()=> EarningExpense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare earningExpenses: EarningExpense[]

    @HasMany(()=> ExtraEarnings, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare extraEarnings: ExtraEarnings[]
}

export default Earning;