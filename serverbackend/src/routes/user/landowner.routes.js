import { Router } from "express";
import { loginLandOwner, logoutLandOwner, registerLandOwner, changeCurrentPassword } from "../../controllers/user.controller/landowner.controller.js";
import { upload, profileImageUpload, uploadDocumentFile, uploadLandDocumentFile } from "../../middlewares/multer.middleware.js";
import { landowner } from "../../models/users/landowner.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../../controllers/user.controller/landowner.controller.js";
import { getUserDetails } from "../../services/getUserDetails.js";
import { getPaymentDetails } from "../../controllers/payment.controller.js";
import { deleteReview, getReviews, postReviews } from "../../controllers/reviews.controllers.js";
import { getComplaints, postComplaints } from "../../controllers/complaint.controllers.js";
import { getProjects } from "../../controllers/project.controllers.js";
import multer from "multer";
import { ApiError } from "../../utils/ApiResponse.js";
import {uploaduserProfileImage} from "../../services/uploadProfileImage.js"
import { profileUpdateUser } from "../../services/updateProfile.js";
import { getLandRecords, deleteLandDetails, addLandDetails } from "../../controllers/record.controller,js/landRecord.controller.js";
import { getLandownerDocuments, uploadDocument } from "../../controllers/documents.controller.js";
import { getNotifications } from "../../controllers/notifiications.controller.js";
const router = Router()

router.route("/registerlandowner").post(registerLandOwner)
router.route("/loginlandowner").post(loginLandOwner)
router.route("/change-password").patch(verifyJwt(landowner), changeCurrentPassword)
router.route("/logout").post(verifyJwt(landowner), logoutLandOwner)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/landDetails").post(
    verifyJwt(landowner),
    upload.single("landDocuments"),
    )
router.route("/get-user-details").get( verifyJwt(landowner), getUserDetails)
router.route("/get-payment-details").get( verifyJwt(landowner), getPaymentDetails)
router.route("/get-review-details").get( verifyJwt(landowner), getReviews)
router.route("/post-reviews").post(verifyJwt(landowner), postReviews)
router.route("/delete-review/:reviewId").delete( verifyJwt(landowner), deleteReview)
router.route("/get-complaints").get( verifyJwt(landowner), getComplaints)
router.route("/post-complaints").post( verifyJwt(landowner), postComplaints)
router.route("/get-projects").get(verifyJwt(landowner), getProjects("landowner"))
router.route("/profile-image").patch(verifyJwt(landowner), (req, res, next) => {
    profileImageUpload.single("image")(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            return next(new ApiError(error.code === "LIMIT_FILE_SIZE" ? 413 : 400,
                error.code === "LIMIT_FILE_SIZE" ? "Image must be 5 MB or smaller" : error.message));
        }
        next(error);
    });
}, uploaduserProfileImage);
router.route("/update-user-details").patch( verifyJwt(landowner), profileUpdateUser)
router.route("/get-land-records/:landRecordId").get(verifyJwt(landowner), getLandRecords)
router.route("/get-land-details").get(verifyJwt(landowner), getLandRecords)
router.route("/get-documents").get(verifyJwt(landowner), getLandownerDocuments)
router.route("/upload-document").post(verifyJwt(landowner), uploadDocumentFile, uploadDocument)
router.route("/get-notifications").get(verifyJwt(landowner), getNotifications)
router.route("/delete-land-details/:landRecordId").delete(verifyJwt(landowner), deleteLandDetails)
router.route("/add-land-details").post(verifyJwt(landowner), uploadLandDocumentFile, addLandDetails)

export default router
