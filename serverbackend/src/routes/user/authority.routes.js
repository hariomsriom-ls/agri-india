import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../../controllers/user.controller/authority.controller.js";
import { acceptWorker, loginorganizationAuthority, logoutorganizationAuthority, registerAuthority, rejectWorker, showPendingWorkerList } from "../../controllers/user.controller/authority.controller.js";
import { getUserDetails } from "../../services/getUserDetails.js";
import{ authority } from "../../models/users/authority.js";
import { getPaymentDetails } from "../../controllers/payment.controller.js";
import { getReviews, postReviews, deleteReview } from "../../controllers/reviews.controllers.js";
import { getNotifications } from "../../controllers/notifiications.controller.js";
import { getComplaints } from "../../controllers/complaint.controllers.js";
import { getProjects } from "../../controllers/project.controllers.js";
import {uploaduserProfileImage} from "../../services/uploadProfileImage.js"
import { upload, profileImageUpload } from "../../middlewares/multer.middleware.js";
const router = Router()

router.route("/register-authority").post(registerAuthority)
router.route("/login-authority").post(loginorganizationAuthority)
router.route("/logout").post(logoutorganizationAuthority)
router.route("/accept-register-worker").post(acceptWorker)
router.route("/reject-worker").post(rejectWorker)
router.route("/worker-approvallist").post(showPendingWorkerList)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/get-user-details").get(verifyJwt(authority), getUserDetails)
router.route("/get-payment-details").get(verifyJwt(authority), getPaymentDetails)
router.route("/get-Review-details").get(verifyJwt(authority), getReviews)
router.route("/get-notifications").get(verifyJwt(authority), getNotifications)
router.route("/get-complaints").get(verifyJwt(authority), getComplaints)
router.route("/get-projects").get(verifyJwt(authority), getProjects("authority"))
router.route("/post-Review").post(verifyJwt(authority), postReviews)
router.route("/post-reviews").post(verifyJwt(authority), postReviews)
router.route("/delete-Review/:reviewId").delete(verifyJwt(authority), deleteReview)
router.route("/profile-image").patch(verifyJwt(authority),profileImageUpload.single("image"),uploaduserProfileImage);

export default router
