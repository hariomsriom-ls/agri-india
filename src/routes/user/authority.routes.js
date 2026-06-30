import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../../controllers/user.controller/authority.controller.js";
import { acceptWorker, loginorganizationAuthority, logoutorganizationAuthority, registerAuthority, rejectWorker, showPendingWorkerList } from "../../controllers/user.controller/authority.controller.js";

const router = Router()

router.route("/register-authority").post(registerAuthority)
router.route("/login-authority").post(loginorganizationAuthority)
router.route("/logout").post(logoutorganizationAuthority)
router.route("/accept-register-worker").post(acceptWorker)
router.route("/reject-worker").post(rejectWorker)
router.route("/worker-approvallist").post(showPendingWorkerList)
router.route("/refresh-access-token").post(refreshAccessToken)

export default router