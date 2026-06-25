import { Router } from "express";
import { loginLandOwner, logoutLandOwner, profileCompleteLandOwner, registerLandOwner, addLandDetails } from "../../controllers/user.controller/landowner.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../../controllers/user.controller/landowner.controller.js";

const router = Router()

router.route("/landowner").post(registerLandOwner).patch( 
    verifyJwt,
    upload.fields([
        {
            name: "image",
            maxCount: 1
        },
        {
            name: "governmentId",
            maxCount: 1
        }
    ]),
    profileCompleteLandOwner)
router.route("/loginlandowner").post(loginLandOwner)
router.route("/logout").post(verifyJwt, logoutLandOwner)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/landDetails").post(addLandDetails)


export default router