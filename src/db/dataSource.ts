import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Company } from '../entities/company';
import { Project } from '../entities/project';
import { Asset } from '../entities/asset';
import { Commodity } from '../entities/commodity';
import { Geolocation } from '../entities/geolocation';
import { Production } from '../entities/production';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306'); // Change to MySQL port
const DB_USER = process.env.DB_USER || 'root'; // Change username
const DB_PASSWORD = process.env.DB_PASSWORD || 'password'; // Change password
const DB_NAME = process.env.DB_NAME || 'lagrange';

const AppDataSource = new DataSource({
  type: 'mysql', // Change this to match your database
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  logging: true,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export default AppDataSource;