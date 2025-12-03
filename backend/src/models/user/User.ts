import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import Earning from "../earning/Earning";
import Budget from "../budget/Budget";
import EarningExpense from "../earning/EarningExpense";
import EarningExtras from "../earning/EarningExtra";

@Table({
    tableName: 'users',
    underscored: true
})

class User extends Model {
    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare firstName: string

    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare lastName: string

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true
    })
    declare email: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare nonce: string

    @Column({
        type: DataType.STRING(100),
        unique: true
    })
    declare emailHash: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
        unique: true
    })
    declare phone : string
    
    @Column({
        type: DataType.STRING(6)
    })
    declare token: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isConfirmed: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isPremium: boolean

    @HasMany(() => Earning, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare earnings: Earning[]

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

    @HasMany(() => EarningExtras, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare earningExtras: EarningExtras[]
}

export default User;