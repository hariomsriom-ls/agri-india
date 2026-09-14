import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { loginWorker, refreshAccessToken, logoutWorker, changeCurrentPassword } from "../../controllers/user.controller/worker.controller.js";
import { getUserDetails } from "../../services/getUserDetails.js";
import { worker } from "../../models/users/workers.js";
import { getPaymentDetails } from "../../controllers/payment.controller.js";
import { deleteReview, getReviews, postReviews } from "../../controllers/reviews.controllers.js";
import { getComplaints, postComplaints } from "../../controllers/complaint.controllers.js";
import { getProjects } from "../../controllers/project.controllers.js";
import {uploaduserProfileImage} from "../../services/uploadProfileImage.js"
import { upload, profileImageUpload } from "../../middlewares/multer.middleware.js";

const router = Router()


router.route("/login-worker").post(loginWorker)
router.route("/logout-worker").post(logoutWorker)
router.route("/change-password").post(changeCurrentPassword)
router.route("/get-user-details").get(verifyJwt(worker), getUserDetails)
router.route("/get-payment-details").get( verifyJwt(worker), getPaymentDetails)
router.route("/get-review-details").get( verifyJwt(worker), getReviews)
router.route("/post-reviews").post( verifyJwt(worker), postReviews)
router.route("/delete-review/:reviewId").delete(verifyJwt(worker), deleteReview)
router.route("/get-complaints").get( verifyJwt(worker), getComplaints)
router.route("/get-projects").get(verifyJwt(worker), getProjects("worker"))
router.route("/post-complaints").get(verifyJwt(worker), postComplaints)
router.route("/profile-image").patch(verifyJwt(worker),profileImageUpload.single("image"),uploaduserProfileImage);

export default router
