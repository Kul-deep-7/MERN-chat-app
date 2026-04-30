import { Router } from "express";
import { LoginUser, logoutUser, refreshAccessToken, signUp, updateProfile } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middlerware.js";

const router = Router()

router.route("/signup").post(upload.single("profilePic"),signUp)
router.route("/login").post(LoginUser)
router.route("/refresh").post(refreshAccessToken)


//protected route
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/updateProfile").patch(verifyJWT, updateProfile)


export default router