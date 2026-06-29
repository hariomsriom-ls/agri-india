import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import registrationValidations from "../../validations/registration.validations.js";
import { pendingWorkerRegistration } from "../../models/users/pendingregistration.js";
import { worker } from "../../models/users/workers.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { organizationauthority } from "../../models/users/organization.js";
import allowedauthorites from "../../models/record/allowedauthoritesrecord.js";

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
    
  const organizationAuthority  = await organizationauthority
    .create({fullName, normalizedEmail, userName, password, contactNumber,
        address, workingZone, bankaccount, IFSCcode})  
    
const createdAuthority = await organizationauthority.findById(organizationAuthority._id)
    .select("-password -refreshToken" )
     
    if(!createdAuthority){
        throw new ApiError(500, "authority not registered try again later")
     }

     return res.status(201).json( new ApiResponse(200, createdAuthority, "authority registered successfully") )

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
    acceptWorker,
    rejectWorker,
    showPendingWorkerList
}