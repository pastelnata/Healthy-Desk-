import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

class Day extends Model {
    private standing_hrs!: number;
    private times_moved!: number;

    getStandingHrs() {
        return this.standing_hrs;
    }

    getTimesMoved() {
        return this.times_moved;
    }
}

Day.init(
    {
        dayid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        standing_hrs: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        times_moved: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {
        sequelize,
        tableName: 'Day',
        timestamps: false,
    }
);

export default Day;