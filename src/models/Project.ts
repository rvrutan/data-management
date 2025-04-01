import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProjectAttributes {
  project_id: number;
  project_name_title: string;
  asset_type: string | null;
  work_type: string | null;
  development_status: string | null;
  location: string | null;
  mine_technology: string | null;
  processing_technology: string | null;
  country: string | null;
}

export interface ProjectInstance extends Model<ProjectAttributes>, ProjectAttributes {}

const Project = sequelize.define<ProjectInstance>(
  'Project',
  {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_name_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asset_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    work_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    development_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mine_technology: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    processing_technology: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Projects',
    timestamps: false,
  }
);

export default Project; 