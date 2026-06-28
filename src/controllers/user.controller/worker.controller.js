import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import registrationValidations from "../../validations/registration.validations.js";
import { pendingWorkerRegistration } from "../../models/users/pendingregistration.js";
import { worker } from "../../models/users/workers.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { upload } from "../../middlewares/multer.middleware.js";

const generateAccessAndRefreshToken = async(workerId) => {
    try {
        const Worker = await worker.findById(workerId)
        
        const accessToken = Worker.generateAccessToken()
        const refreshToken = Worker.generateRefreshToken()

        Worker.refreshToken = refreshToken
        Worker.save({ validateBeforeSave: false})
        return {accessToken, refreshToken}
        
    } catch (error) {
        console.log("REAL TOKEN ERROR:", error);
        throw new ApiError(500, " something went wrong while generating access and refresh token")  
    }
}

const registerWorkers = asyncHandler(async(req, res) => {

     const {fullName, mobileNumber, email, userName, password}= req.body

     registrationValidations.fieldNotEmpty(req.body);
     registrationValidations.validateEmailId(req.body.email);
     registrationValidations.validateMobileNumber(req.body.mobileNumber);

     const existedUser = await landowner.findOne({ $or: [{userName},{email}]  })
     if(existedUser){
        throw new ApiError(409, "user already exists")
     }

     const landOwner = await landowner.create({fullName,  email, userName, password, mobileNumber})

     const createdlandOwner = await landowner.findById(landOwner._id).select("-password -refreshToken" )
     if(!createdlandOwner){
        throw new ApiError(500, "user not registered try again later")
     }

     return res.status(201).json( new ApiResponse(200, createdlandOwner, "landowner registered successfully") )

    })



export {

}