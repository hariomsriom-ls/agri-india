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
const loginWorker = asyncHandler(async(req, res) => {
    const {email, userName, mobileNumber, password} = req.body

    if(!userName && !email && !mobileNumber){
        throw new ApiError(400, "username required in worker login")
    }
    if(!password){
        throw new ApiError(400, "password required in worker login")
    }

    const Worker = await worker.findOne({
        $or: [{userName}, {email}, {mobileNumber}]
    })
    if(!Worker){
        throw new ApiError(404, "worker not registered")
    }

    const isPasswordValid = await Worker.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid worker credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(Worker._id)

    const loggedInWorker = await worker.findById(Worker._id).select(" -password -refreshToken")

    const options ={
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("acessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {worker: loggedInWorker, accessToken, refreshToken}, 
            "worker logged in successfully"
    )
    )
})

const logoutWorker = asyncHandler(async(req, res) => {
    await worker.findByIdAndUpdate(
        req.Worker._id,
        {$set: {refreshToken: undefined}},
        {new: true}
    )
    const options ={
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"))

})

const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const wentorker = await worker.findById(decodedToken?._id)
    
        if(!Worker){
            throw new ApiError(401," Invalid refresh token")
        }
        if(incomingRefreshToken !== Worker?.refreshToken){
            throw new ApiError (401," refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
       const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(worker._id)
    
       return res.status(200).cookie("accessToken",accessToken, options).cookie("newrefreshToken", refreshToken, options)
       .json(
        new ApiResponse(
            200,
            {accessToken, refreshToken: newrefreshToken},
            "Access token refreshed"
        )
       )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
        console.log(error)
    }


})



export {
refreshAccessToken,
logoutWorker,
loginWorker

}