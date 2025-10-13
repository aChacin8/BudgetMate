import { Table, Model,Column, DataType, ForeignKey, BelongsTo} from "sequelize-typescript";
import Earning from "./Earning";

@Table({
    tableName: 'earning_expenses',
    underscored: true
})

class EarningExpense extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare expenseName:string

    @Column({
        type: DataType.DECIMAL(10,2)
    })
    declare expenseAmount: number

    @ForeignKey(() => Earning)
    declare earningId: number

    @BelongsTo(()=> Earning)
    declare earning:Earning
}


export default EarningExpense;