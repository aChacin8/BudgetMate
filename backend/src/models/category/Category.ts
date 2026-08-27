import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import User from "../user/User";
import Product from "../product/Product";

@Table({
    tableName: 'categories',
    underscored: true
})
class Category extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string;

    @ForeignKey(() => User)
    @Column({
        field: 'user_id',
        type: DataType.INTEGER,
        allowNull: false
    })
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;

    @HasMany(() => Product, {
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    })
    declare products: Product[];
}

export default Category;
