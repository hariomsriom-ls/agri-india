import { Router } from "express";
import { loginLandOwner, logoutLandOwner, profileCompleteLandOwner, registerLandOwner, addLandDetails, changeCurrentPassword } from "../../controllers/user.controller/landowner.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { landowner } from "../../models/users/landowner.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../../controllers/user.controller/landowner.controller.js";
import { getUserDetails } from "../../services/getUserDetails.js";
import { getPaymentDetails } from "../../controllers/payment.controller.js";
import { deleteReview, getReviews, postReviews } from "../../controllers/reviews.controllers.js";
import { getComplaints } from "../../controllers/complaint.controllers.js";
const router = Router()

router.route("/registerlandowner").post(registerLandOwner).patch( 
    verifyJwt(landowner),
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
    verifyJwt(landowner),
    upload.single("landDocuments"),
    addLandDetails)
router.route("/get-user-details").get( verifyJwt(landowner), getUserDetails)
router.route("/get-payment-details").get( verifyJwt(landowner), getPaymentDetails)
router.route("/get-review-details").get( verifyJwt(landowner), getReviews)
router.route("/post-Review").post( verifyJwt(landowner), postReviews)
router.route("/post-reviews").post(verifyJwt(landowner), postReviews)
router.route("/delete-review/:reviewId").delete( verifyJwt(landowner), deleteReview)
router.route("/get-complaints").get( verifyJwt(landowner), getComplaints)

export default router
