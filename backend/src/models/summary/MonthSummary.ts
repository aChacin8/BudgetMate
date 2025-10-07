import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Earning from "../earning/Earning";

@Table({
    tableName: 'monthSumaries',
    underscored:true
})

class MonthSummary extends Model {
    @Column({
        type: DataType.DATE
    })
    declare month: Date

    @Column({
        type: DataType.DECIMAL(10,2)
    })
    declare totalEarnings: number

    @Column({
        type: DataType.DECIMAL(10,2)
    })
    declare totalExpenses: number

    @Column({
        type: DataType.DECIMAL(10,2)
    })
    declare remaining: number

    @ForeignKey(() => Earning)
    declare earningId: number

    @BelongsTo(()=> Earning)
    declare earning:Earning
}

export default MonthSummary;