import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { loginWorker, refreshAccessToken, logoutWorker, changeCurrentPassword } from "../../controllers/user.controller/worker.controller.js";
import { getUserDetails } from "../../services/getUserDetails.js";
import { worker } from "../../models/users/workers.js";
const router = Router()

router.route("/login-worker").post(loginWorker)
router.route("/logout-worker").post(logoutWorker)
router.route("/change-password").post(changeCurrentPassword)
router.route("/get-user-details").get(verifyJwt(worker), getUserDetails)

export default router