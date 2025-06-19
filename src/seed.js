// import bcrypt from 'bcryptjs';
// import dotenv from 'dotenv';
// import Admin from './models/admin.model.js';

// dotenv.config();

// const seedAdmin = async() => {
//     try {
//         // Check if any admin exists
//         const existingAdmin = await Admin.findOne();

//         if (!existingAdmin) {
//             // Create default admin
//             const passwordHash = bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD);

//             const admin = await Admin.create({
//                 username: process.env.DEFAULT_ADMIN_USERNAME,
//                 passwordHash,
//                 fullName: process.env.DEFAULT_ADMIN_NAME,
//                 email: process.env.DEFAULT_ADMIN_EMAIL
//             });

//             console.log('Default admin created:', {
//                 username: admin.username,
//                 email: admin.email
//             });
//         } else {
//             console.log('Admin already exists in database');
//         }
//     } catch (error) {
//         console.error('Error seeding admin:', error);
//     } finally {
//         process.exit();
//     }
// };

// seedAdmin();

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Admin from './models/admin.model.js';

const seedAdmin = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const existingAdmin = await Admin.findOne({ username: 'admin' });

        if (!existingAdmin) {
            const passwordHash = bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD);

            await Admin.create({
                username: process.env.DEFAULT_ADMIN_USERNAME,
                passwordHash,
                fullName: process.env.DEFAULT_ADMIN_NAME,
                email: process.env.DEFAULT_ADMIN_EMAIL
            });


        } else {
            console.log('ℹ️ Admin already exists');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        mongoose.disconnect();
    }
};

seedAdmin();