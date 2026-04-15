import { Router } from "express";
import { LoginUser, signUp } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/signup").post(upload.single("profilePic"),signUp)
router.route("/login").post(LoginUser)

export default router