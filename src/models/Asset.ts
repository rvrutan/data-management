import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface AssetAttributes {
  asset_id: number;
  project_id: number;
  asset: string;
  asset_type: string | null;
  status: string | null;
}

export interface AssetInstance extends Model<AssetAttributes>, AssetAttributes {}

const Asset = sequelize.define<AssetInstance>(
  'Asset',
  {
    asset_id: {
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
    asset: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asset_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Assets',
    timestamps: false,
  }
);

export default Asset; 