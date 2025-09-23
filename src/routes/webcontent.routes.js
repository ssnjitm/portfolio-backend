// routes/webcontent.routes.js
import express from "express";
import { getWebContent, upsertWebContent } from "../controllers/webcontent.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getWebContent);

// Protected route for upsert
router.post(
  "/",
  
  upload.fields([
    { name: "aboutMeImage", maxCount: 1 },
    { name: "downloadCV", maxCount: 1 },
  ]),
  upsertWebContent
); //verifyJWT,

export default router;