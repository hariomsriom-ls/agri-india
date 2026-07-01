import { Router } from "express";
import { loginLandOwner, logoutLandOwner, profileCompleteLandOwner, registerLandOwner, addLandDetails, changeCurrentPassword } from "../../controllers/user.controller/landowner.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { landowner } from "../../models/users/landowner.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../../controllers/user.controller/landowner.controller.js";

const router = Router()

router.route("/registerlandowner").post(registerLandOwner).patch( 
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
router.route("/change-password").patch(verifyJwt(landowner), changeCurrentPassword)
router.route("/logout").post(verifyJwt(landowner), logoutLandOwner)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/landDetails").post(
    verifyJwt,
    upload.single("landDocuments"),
    addLandDetails)


export default router