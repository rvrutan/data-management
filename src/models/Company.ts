import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface CompanyAttributes {
  company_id: number;
  project_id: number;
  company: string;
  company_type: string | null;
  ownership: string | null;
  optioned: string | null;
}

export interface CompanyInstance extends Model<CompanyAttributes>, CompanyAttributes {}

const Company = sequelize.define<CompanyInstance>(
  'Company',
  {
    company_id: {
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
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownership: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    optioned: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Companies',
    timestamps: false,
  }
);

export default Company; 