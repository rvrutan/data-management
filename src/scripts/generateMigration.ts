import AppDataSource from '../db/dataSource';

async function generateMigration() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('DataSource initialized successfully');
    }

    // Your migration generation logic is handled by the npm script.
    // We just need to ensure the database exists and the DataSource is correctly initialized.
    console.log('Migration generation can now proceed.');
  } catch (error) {
    console.error('Error initializing DataSource:', error);
    process.exit(1);
  } finally{
    if(AppDataSource.isInitialized){
      await AppDataSource.destroy();
      console.log('DataSource destroyed after migration generation check.');
    }
  }
}

generateMigration();