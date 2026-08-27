import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import User from "../user/User";
import Product from "../product/Product";

@Table({
    tableName: 'suppliers',
    underscored: true
})
class Supplier extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.STRING(150),
        allowNull: true
    })
    declare contactEmail: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    declare phone: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare address: string;

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

export default Supplier;
