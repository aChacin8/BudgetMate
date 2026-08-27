import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "../user/User";
import Product from "../product/Product";

@Table({
    tableName: 'stock_movements',
    underscored: true
})
class StockMovement extends Model {
    @Column({
        type: DataType.ENUM('IN', 'OUT', 'ADJUSTMENT'),
        allowNull: false
    })
    declare type: 'IN' | 'OUT' | 'ADJUSTMENT';

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare quantity: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: true
    })
    declare reason: string;

    @ForeignKey(() => Product)
    @Column({
        field: 'product_id',
        type: DataType.INTEGER,
        allowNull: false
    })
    declare productId: number;

    @BelongsTo(() => Product)
    declare product: Product;

    @ForeignKey(() => User)
    @Column({
        field: 'user_id',
        type: DataType.INTEGER,
        allowNull: false
    })
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;
}

export default StockMovement;
