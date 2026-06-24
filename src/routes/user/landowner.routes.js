import { Router } from "express";
import { loginLandOwner, logoutLandOwner, registerLandOwner } from "../../controllers/user.controller/landowner.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../../controllers/user.controller/landowner.controller.js";

const router = Router()

router.route("/registerlandowner").post(registerLandOwner)
router.route("/loginlandowner").post(loginLandOwner)
router.route("/logout").post(verifyJwt, logoutLandOwner)
router.route("/refresh-access-token").post(refreshAccessToken)

export default router