import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/admin.model.js";

dotenv.config(); 

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    // check if any admin exists
    let admin = await Admin.findOne({ email });
    if (!admin) {
      const passwordHash = await bcrypt.hash(password, 10);
      admin = await Admin.create({
        email,
        passwordHash,
      });
      console.log("✅ Admin seeded:", email, "password:", password);
    } else {
      console.log("⚠️ Admin already exists:", admin.email);
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();