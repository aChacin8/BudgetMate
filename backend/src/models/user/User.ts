import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import Product from "../product/Product";
import Category from "../category/Category";
import Supplier from "../supplier/Supplier";
import StockMovement from "../movement/StockMovement";

@Table({
    tableName: 'users',
    underscored: true
})

class User extends Model {
    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare firstName: string

    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare lastName: string

    @Column({
        type: DataType.STRING(150),
        allowNull: false,
        unique: true
    })
    declare email: string

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare nonce: string

    @Column({
        type: DataType.STRING(150),
        unique: true
    })
    declare emailHash: string

    @Column({
        type: DataType.STRING(150),
        allowNull: false
    })
    declare password: string

    @Column({
        type: DataType.TEXT,
        allowNull: true,
        unique: true
    })
    declare phone : string
    
    @Column({
        type: DataType.STRING(6)
    })
    declare token: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isConfirmed: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isPremium: boolean

    @HasMany(() => Product, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare products: Product[]

    @HasMany(() => Category, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare categories: Category[]

    @HasMany(() => Supplier, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare suppliers: Supplier[]

    @HasMany(() => StockMovement, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare stockMovements: StockMovement[]
}

export default User;