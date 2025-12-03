import { Table, Model,Column, DataType, ForeignKey, BelongsTo} from "sequelize-typescript";
import Earning from "./Earning";
import User from "../user/User";

@Table({
    tableName: 'earning_expenses',
    underscored: true
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

    @ForeignKey(() => User)
    @Column({ 
        field: 'user_id', 
        type: DataType.INTEGER, 
        allowNull: false,
    })
    declare userId: number

    @BelongsTo(() => User)
    declare user: User
}


export default EarningExpense;