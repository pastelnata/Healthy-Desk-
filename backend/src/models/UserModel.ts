import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/sequelize";
import Profile from "./ProfileModel";

interface IUser {
    username: string;
    email: string;
    password: string;
}

class User extends Model implements IUser {
    userid!: number;
    username!: string;
    email!: string;
    password!: string;
    height!: number;
    mot_lvl!: 'low' | 'medium' | 'high';
    avg_standing_hrs!: number;
    times_moved!: number;
    calories_burned!: number;
}

User.init(
    {
        userid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mot_lvl: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            allowNull: false,
        },
        avg_standing_hrs: DataTypes.INTEGER,
        times_moved: DataTypes.INTEGER,
        calories_burned: DataTypes.INTEGER,
    },
    {
        sequelize,
        tableName: 'User',
        timestamps: false,
    }
);

class Manager extends Model implements IUser {
    managerid!: number;
    username!: string;
    email!: string;
    password!: string;
}

Manager.init(
    {
        managerid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'Manager',
        timestamps: false,
    }
);

User.hasMany(Profile, { foreignKey: 'userid' });

export { Manager, User };