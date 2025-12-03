import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Earning from "./Earning";
import User from "../user/User";

@Table({
    tableName: 'extra_earnings',
    underscored: true
})

class ExtraEarnings extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare source:string //De donde proviene el ingreso extra

    @Column({
        type:DataType.DECIMAL(10,2)
    })
    declare amount: number

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
}

export default ExtraEarnings;