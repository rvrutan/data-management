import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface GeolocationAttributes {
  geolocation_id: number;
  project_id: number;
  lat: number | null;
  long: number | null;
  nearest_landmark: string | null;
}

export interface GeolocationInstance extends Model<GeolocationAttributes>, GeolocationAttributes {}

const Geolocation = sequelize.define<GeolocationInstance>(
  'Geolocation',
  {
    geolocation_id: {
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
    lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    long: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    nearest_landmark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Geolocation',
    timestamps: false,
  }
);

export default Geolocation; 