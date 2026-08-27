import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import User from "../user/User";
import Category from "../category/Category";
import Supplier from "../supplier/Supplier";
import StockMovement from "../movement/StockMovement";

@Table({
    tableName: 'products',
    underscored: true
})
class Product extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    declare sku: string; // Stock Keeping Unit / Barcode

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare stock: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 5
    })
    declare minStock: number; // For low-stock alerts

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true
    })
    declare price: number; // Unit price

    @ForeignKey(() => User)
    @Column({
        field: 'user_id',
        type: DataType.INTEGER,
        allowNull: false
    })
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;

    @ForeignKey(() => Category)
    @Column({
        field: 'category_id',
        type: DataType.INTEGER,
        allowNull: true
    })
    declare categoryId: number;

    @BelongsTo(() => Category)
    declare category: Category;

    @ForeignKey(() => Supplier)
    @Column({
        field: 'supplier_id',
        type: DataType.INTEGER,
        allowNull: true
    })
    declare supplierId: number;

    @BelongsTo(() => Supplier)
    declare supplier: Supplier;

    @HasMany(() => StockMovement, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare movements: StockMovement[];
}

export default Product;
