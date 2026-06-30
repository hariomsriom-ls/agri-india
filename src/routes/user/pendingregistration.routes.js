import { Router } from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { changeWorkingZone, loginpendingWorker, logoutpendingWorker, registerPendingWorker, viewRequestStatus } from "../../controllers/user.controller/pendingregistration.controller.js";
import { refreshAccessToken } from "../../controllers/user.controller/pendingregistration.controller.js";

const router = Router()

router.route("/pending-worker-request").post(
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
    registerPendingWorker)
router.route("/login-pendingworker").post(loginpendingWorker)
router.route("/logout").post(logoutpendingWorker)
router.route("/view-status").post(viewRequestStatus)
router.route("/change-workingzone").patch(changeWorkingZone)
router.route("/refresh-access-token").post(refreshAccessToken)

export default router