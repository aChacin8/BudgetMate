import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    tableName: 'earnings'
})

class Earnings extends Model {
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
}

export default Earnings;