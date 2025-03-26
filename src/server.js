const app = require('./app');
const { sequelize, initializeDatabase } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Sync database
    await sequelize.sync();
    console.log('Database synced successfully.');
    
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}); 