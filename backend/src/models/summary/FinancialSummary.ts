import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "../user/User";

@Table({ tableName: "month_summaries", underscored: true })

class MonthSummary extends Model {
    @Column({ 
        type: DataType.INTEGER, 
        allowNull: false 
    })
    declare month: number;

    @Column({ 
        type: DataType.INTEGER, 
        allowNull: false 
    })
    declare year: number;

    @Column({ 
        type: DataType.DECIMAL(10, 2), 
        allowNull: false 
    })
    declare totalEarnings: number;

    @Column({ 
        type: DataType.DECIMAL(10, 2), 
        allowNull: false 
    })
    declare totalExpenses: number;

    @Column({ 
        type: DataType.DECIMAL(10, 2), 
        allowNull: false 
    })
    declare remaining: number;

    @ForeignKey(() => User)
    @Column({ 
        field: "user_id", 
        type: DataType.INTEGER, 
        allowNull: false,
        unique: true
    })
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;
}

export default MonthSummary;
