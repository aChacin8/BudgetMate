import { Table, Model, Column, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";

import User from "../user/User";

@Table({
    tableName: 'earnings',
    underscored: true
})

class Earning extends Model {
    @Column({
        type: DataType.DECIMAL(10, 2)
    })
    declare baseAmount: number

    @Column({
        type: DataType.ENUM("monthly", "biweekly"),
        allowNull: false,
    })
    declare periodType: "monthly" | "biweekly";

    @Column({ 
        type: DataType.INTEGER, 
        allowNull: false 
    })
    declare periodMonth: number; //It represents the month number (1-12)

    @Column({ 
        type: DataType.INTEGER, 
        allowNull: false 
    })
    declare periodYear: number; //It represents the year (e.g., 2025)

    @Column({ 
        type: DataType.INTEGER, 
        allowNull: false,
        defaultValue: 1
    })
    declare periodNumber: number | null; //It represents the number of the period within the month (1 or 2 for biweekly, always 1 for monthly)

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

export default Earning;