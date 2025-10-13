import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Earning from "./Earning";

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

    @ForeignKey(() => Earning)
    declare earningId: number

    @BelongsTo(()=> Earning)
    declare earning:Earning
}

export default ExtraEarnings;