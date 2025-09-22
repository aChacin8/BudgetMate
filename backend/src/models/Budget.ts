import {Table, Model, DataType,  Column, ForeignKey, HasMany, AllowNull } from "sequelize-typescript";

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
}

export default Budget;
