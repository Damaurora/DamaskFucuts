// deployment script for Render
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    await execAsync('npm run db:push');
    console.log('Migrations complete!');

    console.log('Seeding database...');
    await execAsync('npm run db:seed');
    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error during deployment process:', error);
    process.exit(1);
  }
}

runMigrations();