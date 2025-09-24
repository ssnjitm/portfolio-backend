import express from "express";
import {
  getAdminProfile,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  updateAdminProfile,
  changePassword,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Public route (only for testing/dev)
router.post("/register", registerAdmin);

// Public login
router.post("/login", loginAdmin);

// Protected routes
router.post("/logout", verifyJWT, logoutAdmin);
router.get("/profile", verifyJWT, getAdminProfile);
router.patch("/profile", verifyJWT, upload.single("profileImage"), updateAdminProfile);
router.patch("/change-password", verifyJWT, changePassword);

export default router;
