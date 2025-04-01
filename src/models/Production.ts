import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProductionAttributes {
  production_id: number;
  project_id: number;
  cobalt_kt: number;
  copper_kt: number;
  nickel_kt: number;
  gold_oz: number;
  palladium_oz: number;
  platinum_oz: number;
  silver_oz: number;
}

export interface ProductionInstance extends Model<ProductionAttributes>, ProductionAttributes {}

const Production = sequelize.define<ProductionInstance>(
  'Production',
  {
    production_id: {
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
    cobalt_kt: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    copper_kt: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    nickel_kt: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    gold_oz: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    palladium_oz: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    platinum_oz: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    silver_oz: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'Production',
    timestamps: false,
  }
);

export default Production; 