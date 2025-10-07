import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import Earning from "../earning/Earning";

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
        type: DataType.STRING(100),
        allowNull: false,
        unique: true
    })
    declare email: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isPremium: boolean

    @HasMany(() => Earning, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare earnings: Earning[]
}

export default User;