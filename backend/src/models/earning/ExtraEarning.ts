import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Earning from "./Earning";

@Table({
    tableName: 'extraEarnings',
})

class ExtraEarnings extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare name:string

    @Column({
        type:DataType.DECIMAL(10,2)
    })
    declare amount: number

    @ForeignKey(() => Earning)
    declare earningId: number

    @BelongsTo(()=> Earning)
    declare earning:Earning
}