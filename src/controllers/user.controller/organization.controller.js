import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import registrationValidations from "../../validations/registration.validations.js";
import { pendingWorkerRegistration } from "../../models/users/pendingregistration.js";
import { worker } from "../../models/users/workers.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { organizationAuthority } from "../../models/users/organization.js";

const showPendingWorkerList = asyncHandler(async (req,res) =>{
    const pendingWorkerRequests = await pendingWorkerRegistration.aggregate([
        {
            $match: {
                status: "PENDING",
                workingZone: req.organizationAuthority.workingZone,
            },
        },
        {
            $project: {
                fullName: 1,
                mobileNumber: 1,
                image: 1,
                governmentId: 1,
                age: 1

            },
        },
        {
            $sort: {
                submittedAt: -1
            }
        }
    ])

})




export {

}