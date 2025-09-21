// import express from "express";
// import {
//   createSkill,
//   deleteSkill,
//   getSkills,
//   updateSkill,
// } from "../controllers/skill.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { upload } from "../middlewares/multer.middleware.js";

// const skillRouter = express.Router();

// // Public
// skillRouter.get("/", getSkills);

// // Protected
// skillRouter.post("/",upload.single("icon"), createSkill);
// skillRouter.patch("/:id", verifyJWT, upload.single("icon"), updateSkill);
// skillRouter.delete("/:id", verifyJWT, deleteSkill);

// export default skillRouter;

// server/routes/skill.routes.js
import express from "express";
import { createSkill, deleteSkill, getSkills, updateSkill } from "../controllers/skill.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getSkills);
router.post("/", upload.single("image"), createSkill);
router.patch("/:id", upload.single("image"), updateSkill);
router.delete("/:id", deleteSkill);

export default router;