import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/admin.model.js';
import { DB_NAME } from './constants.js';

dotenv.config();

const seedAdmin = async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log('📦 Connected to MongoDB for seeding...');

        const existingAdmin = await Admin.findOne({ username: 'admin' });

        if (!existingAdmin) {
            // Use default values if environment variables are not set
            const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
            const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
            const fullName = process.env.DEFAULT_ADMIN_NAME || 'Portfolio Admin';
            const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@portfolio.com';

            const passwordHash = await bcrypt.hash(password, 10);

            const admin = await Admin.create({
                username,
                passwordHash,
                fullName,
                email,
                socialLinks: {}
            });

            console.log('✅ Default admin created successfully:', {
                username: admin.username,
                fullName: admin.fullName,
                email: admin.email
            });
            console.log('🔑 Default login credentials:');
            console.log(`   Username: ${username}`);
            console.log(`   Password: ${password}`);
            console.log('⚠️  Please change the default password after first login!');
        } else {
            console.log('ℹ️ Admin already exists in database');
        }
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('📦 Disconnected from MongoDB');
    }
};

seedAdmin();