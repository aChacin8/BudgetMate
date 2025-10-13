import { Table, Column, Model, DataType, ForeignKey, BelongsTo  } from "sequelize-typescript";
import Budget from "./Budget";

@Table ({
    tableName: 'budget_expenses',
    underscored: true
})

class BudgetExpense extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare bExpenseName:string

    @Column({
        type: DataType.DECIMAL
    })
    declare bExpenseAmount: number
    
    @ForeignKey(()=> Budget)
    declare budgetId: number

    @BelongsTo(()=> Budget )
    declare budget: Budget
}

export default BudgetExpense