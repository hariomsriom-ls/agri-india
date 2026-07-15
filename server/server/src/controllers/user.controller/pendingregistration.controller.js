import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import registrationValidations from "../../validations/registration.validations.js";
import { pendingWorkerRegistration } from "../../models/users/pendingregistration.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import  {Address}  from "../../models/address.js";
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
         address,workingZone, bankaccount, IFSCcode, DOB, submittedAt}= req.body
    
    registrationValidations.fieldNotEmpty(req.body);
    registrationValidations.validateEmailId(req.body.email);
    registrationValidations.validateMobileNumber(req.body.mobileNumber);

    const imageLocalPath = req.files?.image[0]?.path;
    const governmentidLocalPath = req.files?.governmentid[0]?.path;

    if(!imageLocalPath || !governmentidLocalPath){
        throw new ApiError(400, "image and government id are required")
    }

    const image = await uploadOnCloudinary(imageLocalPath)
    const governmentid = await uploadOnCloudinary(governmentidLocalPath)

    if(!image || !governmentid){
        throw new ApiError(405, "unable to upload on cloudinary please retry")
    }

    const existedRequest = await landowner.findOne({ $or: [{userName},{email},{mobileNumber}]  })
     if(existedRequest){
         throw new ApiError(409, "request already registered")
         }

    const pendingRequest = await pendingWorkerRegistration.create({fullName, mobileNumber, email, userName, password,
         address, bankaccount, IFSCcode, DOB, submittedAt,
        image: image.url,
        governmentid: governmentid.url
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

    const pendingRequest = await pendingWorkerRegistration.findById(pendingWorker._id)
    if(!pendingRequest){
        throw new ApiError(404, "request not registered")
    }
    const Status = pendingRequest.status

    return res.status(200).json(200, Status);

})

const loginpendingWorker = asyncHandler(async(req, res) => {

    const {email, userName, mobileNumber, password} = req.body

    if(!userName && !email && !mobileNumber){
        throw new ApiError(400, "username required in pending worker login")
    }
    if(!password){
        throw new ApiError(400, "password required in pending worker login")
    }

    const pendingWorker = await pendingworker.findOne({
        $or: [{userName}, {email}, {mobileNumber}]
    })
    if(!pendingWorker){
        throw new ApiError(404, "pendingWorker not registered")
    }

    const isPasswordValid = await pendingworker.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid pending worker credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(pendingWorker._id)

    const loggedInpendingWorker = await pendingworker.findById(pendingWorker._id).select(" -password -refreshToken")

    const options ={
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("acessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {pendingWorker: loggedInpendingWorker, accessToken, refreshToken}, 
            "pendingWorker logged in successfully"
    )
    )
})

const logoutpendingWorker = asyncHandler(async(req, res) => {
    await pendingWorkerRegistration.findByIdAndUpdate(
        req.pendingWorker._id,
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
    
        const pendingWorker = await pendingWorkerRegistration.findById(decodedToken?._id)
    
        if(!pendingWorker){
            throw new ApiError(401," Invalid refresh token")
        }
        if(incomingRefreshToken !== pendingWorker?.refreshToken){
            throw new ApiError (401," refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
       const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(pendingWorker._id)
    
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

const changeWorkingZone = asyncHandler(async(req,res) => {
    const {newWorkingZone} = req.body
    await pendingWorkerRegistration.findByIdAndUpdate(
        req.pendingWorker._id,
        {$set: {workingZone: newWorkingZone}},
        {new: true})
    return res.status(200).json(
        new ApiResponse(200, {}, "working zone changed successfully")
    )

})

const changeFields = asyncHandler(async(req,res) =>{
     const {newfullName, newMobileNumber, newUserName, newBankAccount, newIfscCode} = req.body;
     const pendingWorker = await pendingWorkerRegistration.findById(req.pendingWorker?._id)
     if(newfullName === pendingWorker.fullName){
        throw new ApiError(400, "new full name is same as previous one")
     }
     if(newfullName){
    pendingWorker.fullName = newfullName
    await pendingWorker.save({validateBeforeSave: false})        
     }
     if(newMobileNumber === pendingWorker.mobileNumber){  
         throw new ApiError(400, "mobile number already recorded")
     }
     if(newMobileNumber){
    pendingWorker.mobileNumber = newMobileNumber
    await pendingWorker.save({validateBeforeSave: false})        
     }  
     if(newUserName === pendingWorker.userName){  
     throw new ApiError(400, "please give different username")
     }   
     if(newUserName){
    pendingWorker.userName = newUserName
    await pendingWorker.save({validateBeforeSave: false})        
     }
     if(newBankAccount === pendingWorker.bankaccount){  
         throw new ApiError(400, "bank account already recorded")
     }
     if(newBankAccount){
    pendingWorker.bankaccount = newBankAccount
    await pendingWorker.save({validateBeforeSave: false})        
     }
      if(newIfscCode){
    pendingWorker.IFSCcode = newIfscCode
    await pendingWorker.save({validateBeforeSave: false})        
     } 
    
     return res.status(200).json(200, {}, " field updated successfully")

})

export{
    registerPendingWorker,
    viewRequestStatus,
    loginpendingWorker,
    logoutpendingWorker,
    changeWorkingZone,
    refreshAccessToken,
    changeFields}