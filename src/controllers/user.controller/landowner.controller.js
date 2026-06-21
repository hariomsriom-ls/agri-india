import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import registrationValidations from "../../validations/registration.validations.js";
import { landowner } from "../../models/users/landowner.js"; 
import { ApiResponse } from "../../utils/ApiResponse.js";

const registerLandOwner = asyncHandler(async(req, res) => {
 
    /*  get user details
    validation - not empty
    check if user is registered already
    check for images if required
    upload them on cloudinary
    create user object
    create entry in db
    remove password and refresh token from response
    check for user creation
    return response*/

     const {fullName, mobileNumber, email, userName, password}= req.body
     console.log("email:", email);

     landownerValidations.fieldNotEmpty(req.body);
     landownerValidations.validateEmailId(req.body.email);
     landownerValidations.validateMobileNumber(req.body.mobileNumber);

     const existedUserName = landowner.findOne({
        $or: [{userName}]
     })
     if(existedUserName){
        throw new ApiError(409, "usernamealready exists")
     }

     const existedUseremail = landowner.findOne({
        $or: [{userName}]
     })
     if(existedUseremail){
        throw new ApiError(409, "email already exists")
     }

     const landowner = await landowner.create({
        fullName, 
        email,
        userName,
        password,
        mobileNumber
     })

     const createdlandowner = await landowner.findById(landowner._id).select(
        "-password -refreshToken"
     )
     if(!createdlandowner){
        throw new ApiError(500, "user not registered try again later")
     }

     return res.status(201).json(
        new ApiResponse(200, createdlandowner, "landowner registered successfully")
     )

    })

export { registerLandOwner }