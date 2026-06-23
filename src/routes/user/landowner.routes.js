import { Router } from "express";
import { loginLandOwner, logoutLandOwner, registerLandOwner } from "../../controllers/user.controller/landowner.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = Router()

router.route("/registerlandowner").post(registerLandOwner)
router.route("/loginlandowner").post(loginLandOwner)
router.route("/logout").post(verifyJwt, logoutLandOwner)

export default router