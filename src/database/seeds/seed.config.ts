import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/typeorm.config';
import { seedUsers } from './user.seed';

export async function runSeeds(dataSource: DataSource) {
  console.log('Starting database seeding...');

  try {
    await seedUsers(dataSource);

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Self-executing function to run seeds when called directly
(async () => {
  // Only run if this file is called directly (not imported)
  if (require.main === module) {
    try {
      // Initialize the data source
      if (!AppDataSource.isInitialized) {
        console.log('Initializing data source...');
        await AppDataSource.initialize();
      }

      await runSeeds(AppDataSource);

      // Close the connection when done
      await AppDataSource.destroy();
      process.exit(0);
    } catch (error) {
      console.error('Failed to seed database:', error);
      process.exit(1);
    }
  }
})();