import { Table, Column, Model, DataType, ForeignKey, BelongsTo  } from "sequelize-typescript";
import Budget from "./Budget";
import User from "../user/User";

@Table ({
    tableName: 'budget_expenses',
    underscored: true
})

class BudgetExpense extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare name:string

    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number
    
    @ForeignKey(()=> Budget)
    @Column({ 
        field: 'budget_id', 
        type: DataType.INTEGER 
    })
    declare budgetId: number

    @BelongsTo(()=> Budget )
    declare budget: Budget

    @ForeignKey(() => User)
    @Column({ 
        field: "user_id", 
        type: DataType.INTEGER 
    })
    userId: number;

    @BelongsTo(()=> User )
    declare user: User
}

export default BudgetExpense