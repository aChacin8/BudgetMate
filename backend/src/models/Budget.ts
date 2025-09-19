import {Table, Model, DataType,  Column, ForeignKey, HasMany, AllowNull } from "sequelize-typescript";

@Table({
    tableName: 'budgets',
})

class Budget extends Model {
    @Column({
        type: DataType.STRING(100),
        })
    name: string

    @Column({
        type: DataType.DECIMAL(10,2)
    })
    amount: number
}

export default Budget;
