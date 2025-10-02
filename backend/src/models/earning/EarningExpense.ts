import { Table, Model,Column, DataType } from "sequelize-typescript";

@Table({
    tableName: 'earning_expenses',
})

class EarningExpense extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare name:string

    @Column({
        type: DataType.DECIMAL(10,2)
    })
    declare amount: number
}

export default EarningExpense;