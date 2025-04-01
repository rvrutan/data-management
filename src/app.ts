import 'reflect-metadata';
import express from 'express';
import  AppDataSource  from './db/dataSource';
import projectRoutes from './routes/projects';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/projects', projectRoutes);

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
  });

export default app; 