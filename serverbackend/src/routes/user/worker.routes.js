import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { loginWorker, refreshAccessToken, logoutWorker, changeCurrentPassword } from "../../controllers/user.controller/worker.controller.js";
import { getUserDetails } from "../../services/getUserDetails.js";
import { worker } from "../../models/users/workers.js";
import { getPaymentDetails } from "../../services/getPaymentDetails.js";
import { deleteReview, getReviews } from "../../services/getUserReviews.js";

const router = Router()

router.route("/login-worker").post(loginWorker)
router.route("/logout-worker").post(logoutWorker)
router.route("/change-password").post(changeCurrentPassword)
router.route("/get-user-details").get(verifyJwt(worker), getUserDetails)
router.route("/get-payment-details").get( verifyJwt(worker), getPaymentDetails)
router.route("/get-review-details").get( verifyJwt(worker), getReviews)
router.route("/delete-review/:reviewId").delete(verifyJwt(worker), deleteReview)

export default router