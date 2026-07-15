import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import registrationValidations from "../../validations/registration.validations.js";
import { createAddress } from "../address.controller.js";
import { pendingWorkerRegistration } from "../../models/users/pendingregistration.js";
import { worker } from "../../models/users/workers.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { organizationauthority } from "../../models/users/authority.js";
import allowedauthorites from "../../models/record/allowedauthoritesrecord.js";


const generateAccessAndRefreshToken = async(organizationAuthorityId) => {
    try {
        const organizationAuthority = await organizationauthority.findById(organizationAuthorityId)
        
        const accessToken = organizationAuthority.generateAccessToken()
        const refreshToken = organizationAuthority.generateRefreshToken()

        organizationAuthority.refreshToken = refreshToken
        organizationAuthority.save({ validateBeforeSave: false})
        return {accessToken, refreshToken}
        
    } catch (error) {
        console.log("REAL TOKEN ERROR:", error);
        throw new ApiError(500, " something went wrong while generating access and refresh token")  
    }
}
const registerAuthority = asyncHandler(async(req,res) => {
    const {email, contactNumber, authorityid} = req.body;
       registrationValidations.fieldNotEmpty(req.body);
       registrationValidations.validateEmailId(req.body.email);
       registrationValidations.validateMobileNumber(req.body.contactNumber);  
       const normalizedEmail = email.tolowerCase()
    const allowedUser = await allowedauthorites.findOne({
    email: normalizedEmail,
    phoneNumber: contactNumber,
    authorityId: authorityid
  });
  if(!allowedUser){
    throw new ApiError(400, "unauthorized authority registeration")
  }
   const existingUser = await organizationauthority.findOne({
    $or: [
        { email: normalizedEmail }, 
        { contactNumber },
        { authorityid }
    ],
  });
  if(existingUser){
    throw new ApiError(401, "authority already registered")
  }
  const {address, workingZone, userName, password, bankaccount, IFSCcode} = req.body;

  const UserAddress = createAddress(address)

    
  const organizationAuthority  = await organizationauthority
    .create({fullName, normalizedEmail, userName, password, contactNumber,
        address: UserAddress._id, workingZone, bankaccount, IFSCcode})  
    
const createdAuthority = await organizationauthority.findById(organizationAuthority._id)
    .select("-password -refreshToken" )
     
    if(!createdAuthority){
        throw new ApiError(500, "authority not registered try again later")
     }

     return res.status(201).json( new ApiResponse(200, createdAuthority, "authority registered successfully") )

 })
 
 const loginorganizationAuthority = asyncHandler(async(req, res) => {
    const {email, userName, contactNumber, authorityid, password} = req.body

    if(!userName && !email && !contactNumber && !authorityid){
        throw new ApiError(400, "username required in authority login")
    }
    if(!password){
        throw new ApiError(400, "password required in authority login")
    }

    constorganizationAuthority = await organizationauthority.findOne({
        $or: [{userName}, {email}, {contactNumber}, {authorityid}]
    })
    if(!organizationAuthority){
        throw new ApiError(404, "authority not registered")
    }

    const isPasswordValid = await organizationAuthority.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid organizationauthority credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(organizationAuthority._id)

    const loggedInorganizationAuthority = await organizationauthority.findById(organizationAuthority._id)
    .select(" -password -refreshToken")

    const options ={
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("acessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {organizationauthority: loggedInorganizationAuthority, accessToken, refreshToken}, 
            "authority logged in successfully"
    )
    )
})

const logoutorganizationAuthority = asyncHandler(async(req, res) => {
    await organizationauthority.findByIdAndUpdate(
        req.organizationAuthority._id,
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
    
        const organizationAuthority = await organizationauthority.findById(decodedToken?._id)
    
        if(!organizationAuthority){
            throw new ApiError(401," Invalid refresh token")
        }
        if(incomingRefreshToken !== organizationAuthority?.refreshToken){
            throw new ApiError (401," refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
       const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(organizationAuthority._id)
    
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
    return res.status(202).json(new ApiResponse(202, pendingWorkerRequests, "pending workers list created successfully"))

})

const acceptWorker = asyncHandler(async(req,res) => {
    const {pendingWorkerId} = req.params;

    const pendingWorker = pendingWorkerRegistration.findById(pendingWorkerId)

    if(!pendingWorker){
        throw new ApiError(400," worker request not found")
    }
    if(pendingWorker.status !== "PENDING"){
        throw new ApiError(401," request already processed")
    }

    const existingWorker = await worker.findOne({
        $and: [{email: pendingWorker.email},{mobileNumber: pendingWorker.mobileNumber},{fullName: pendingWorker.fullName}]
    })
    if(existingWorker){
        throw new ApiError(400, "request processed and worker already registered successfully")
    }
    pendingWorker.status = "APPROVED"
    await pendingWorker.save({validateBeforeSave: false})

    const {workerSalary, workingTime} = req.body;
    
    const Worker = await worker.create({
        fullName: pendingWorker.fullName,
        email: pendingWorker.email,
        mobileNumber: pendingWorker.mobileNumber,
        userName: pendingWorker.userName,
        password: pendingWorker.password,
        address: pendingWorker.address,
        workingZone: pendingWorker.workingZone, 
        bankaccount: pendingWorker.bankaccount,
        IFSCcode: pendingWorker.IFSCcode,
        DOB: pendingWorker.DOB,
        image: pendingWorker.image,
        governmentid: pendingWorker.governmentid,
        workerSalary: workerSalary,
        workingTime: workingTime,
        verifiedAt: new Date(),
        verifiedBy: req.organizationAuthority?._id, 
    })

    await pendingWorker.findByIdAndDelete(pendingWorkerId);
    return res.status(200).json(new ApiResponse(200, {}, " worker accepted and created successfully"))
})

const rejectWorker = asyncHandler(async(req, res) => {
    const { pendingWorkerRegistrationId} = req.params;
    const { reason } = req.body;
    const pendingWorker = await pendingWorkerRegistration.findById(pendingWorkerRegistrationId)

    if(!pendingWorker){
        throw new ApiError(401, "worker registration not found")
    }
    if(pendingWorker.status !== "PENDING"){
        throw new ApiError(400, " request already processed")
    }

    pendingWorker.status = "REJECTED";
    pendingWorker.rejectionreason = reason;
    await pendingWorker.save();
    return res.status(200).json( new ApiResponse(200, {}, "worker rejected successfully"))
})

export {
    registerAuthority,
    loginorganizationAuthority,
    logoutorganizationAuthority,
    acceptWorker,
    rejectWorker,
    showPendingWorkerList,
    refreshAccessToken
}