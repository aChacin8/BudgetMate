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
        type: DataType.DECIMAL(10, 2)
    })
    declare baseAmount: number

    @Column({
        type: DataType.ENUM("monthly", "biweekly"),
        allowNull: false,
    })
    declare periodType: "monthly" | "biweekly";

    @Column({ 
        type: DataType.INTEGER, 
        allowNull: false 
    })
    declare periodMonth: number;

    @Column({ 
        type: DataType.INTEGER, 
        allowNull: false 
    })
    declare periodYear: number;

    @Column({ 
        type: DataType.INTEGER, 
        allowNull: true 
    })
    declare periodNumber: number | null; // 1 o 2 si es quincenal

    @ForeignKey(() => User)
    @Column({ 
        field: 'user_id', 
        type: DataType.INTEGER, 
        allowNull: false,
        unique: true
    })
    declare userId: number

    @BelongsTo(() => User)
    declare user: User

    @HasMany(() => Budget, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare budgets: Budget[]

    @HasMany(() => EarningExpense, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare earningExpenses: EarningExpense[]

    @HasMany(() => ExtraEarnings, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare extraEarnings: ExtraEarnings[]
}

export default Earning;