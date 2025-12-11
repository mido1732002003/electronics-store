import mongoose from 'mongoose';
import { config } from '../../src/config';
import { connectDatabase, disconnectDatabase } from '../../src/config/database';
import { seedAdmin } from './admin.seed';
import { seedCategories } from './category.seed';
import { seedBrands } from './brand.seed';
import { seedProducts } from './product.seed';

const runSeed = async (): Promise<void> => {
    try {
        console.log('🌱 Starting database seeding...');
        console.log(`📦 Connecting to MongoDB: ${config.mongodb.uri.replace(/\/\/.*@/, '//***:***@')}`);

        await connectDatabase();

        // Run seeders in order
        console.log('\n📋 Seeding admin users...');
        await seedAdmin();

        console.log('\n📁 Seeding categories...');
        await seedCategories();

        console.log('\n🏷️  Seeding brands...');
        await seedBrands();

        console.log('\n📦 Seeding products...');
        await seedProducts();

        console.log('\n✅ Database seeding completed successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔑 Admin Login Credentials:');
        console.log('   Email: admin@electronics-store.com');
        console.log('   Password: Admin@123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await disconnectDatabase();
        process.exit(0);
    }
};

runSeed();
