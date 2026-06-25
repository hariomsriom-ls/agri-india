import { Router } from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { registerPendingWorker, viewRequestStatus } from "../../controllers/user.controller/pendingregistration.controller.js";


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
router.route("/view-status").post(viewRequestStatus)

export default router