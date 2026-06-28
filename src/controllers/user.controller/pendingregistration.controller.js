import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import registrationValidations from "../../validations/registration.validations.js";
import { pendingWorkerRegistration } from "../../models/users/pendingregistration.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { address } from "../../models/address.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { upload } from "../../middlewares/multer.middleware.js";

const generateAccessAndRefreshToken = async(pendingWorkerRegistrationId) => {
    try {
        const pendingWorker = await pendingWorkerRegistration.findById(pendingWorkerRegistrationId)
        
        const accessToken = pendingWorker.generateAccessToken()
        const refreshToken = pendingWorker.generateRefreshToken()

        pendingWorker.refreshToken = refreshToken
        pendingWorker.save({ validateBeforeSave: false})
        return {accessToken, refreshToken}
        
    } catch (error) {
        console.log("REAL TOKEN ERROR:", error);
        throw new ApiError(500, " something went wrong while generating access and refresh token")  
    }
}

const registerPendingWorker = asyncHandler(async(req, res) => {

    const {fullName, mobileNumber, email, userName, password,
         address,workingZone, bankaccount, IFSCcode, age, submittedAt}= req.body
    
    registrationValidations.fieldNotEmpty(req.body);
    registrationValidations.validateEmailId(req.body.email);
    registrationValidations.validateMobileNumber(req.body.mobileNumber);

    const imageLocalPath = req.files?.image[0]?.path;
    const governmentIdLocalPath = req.files?.governmentId[0]?.path;

    if(!imageLocalPath || !governmentIdLocalPath){
        throw new ApiError(400, "image and government id are required")
    }

    const image = await uploadOnCloudinary(imageLocalPath)
    const governmentId = await uploadOnCloudinary(governmentIdLocalPath)

    if(!image || !governmentId){
        throw new ApiError(405, "unable to upload on cloudinary please retry")
    }

    const existedRequest = await landowner.findOne({ $or: [{userName},{email},{mobileNumber}]  })
     if(existedRequest){
         throw new ApiError(409, "request already registered")
         }

    const pendingRequest = await pendingWorkerRegistration.create({fullName, mobileNumber, email, userName, password,
         address, bankaccount, IFSCcode, age, submittedAt,
        image: image.url,
        governmentId: governmentId.url
    })

    const createdpendingRequest = await pendingWorkerRegistration.findById(pendingRequest._id)
    .select("-password -refreshToken" )

    if(!createdpendingRequest){
         throw new ApiError(500, "user not registered try again later")
     }
    
    return res.status(201).json( new ApiResponse(200, createdpendingRequest, 
        " registered successfully and sent for verification") )
   
 })

const viewRequestStatus = asyncHandler(async(req,res) => {
     const {email, userName, mobileNumber, password} = req.body

    if(!userName && !email && !mobileNumber){
        throw new ApiError(400, "username required to view status")
    }
    if(!password){
        throw new ApiError(400, "password required to view status")
    }

    const pendingRequest = await pendingWorkerRegistration.findOne({
            $or: [{userName}, {email}, {mobileNumber}]
        })
    if(!pendingRequest){
        throw new ApiError(404, "request not registered")
    }
    const isPasswordValid = await pendingRequest.isPasswordCorrect(password)
    
    if(!isPasswordValid){
       throw new ApiError(401, "Invalid landowner credentials")
    }

    const pendingRequest = await pendingWorkerRegistration.findById(req.pendingRequest?._id)
    const Status = pendingRequest.status

    return res.status(200).json(200, Status);

})

export{
    registerPendingWorker,
    viewRequestStatus
}