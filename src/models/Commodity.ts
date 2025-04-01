import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface CommodityAttributes {
  commodity_id: number;
  project_id: number;
  commodity: string;
  primary_commodity: string | null;
}

export interface CommodityInstance extends Model<CommodityAttributes>, CommodityAttributes {}

const Commodity = sequelize.define<CommodityInstance>(
  'Commodity',
  {
    commodity_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'project_id',
      },
    },
    commodity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    primary_commodity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Commodities',
    timestamps: false,
  }
);

export default Commodity; 