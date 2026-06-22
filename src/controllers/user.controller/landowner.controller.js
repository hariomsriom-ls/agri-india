import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import registrationValidations from "../../validations/registration.validations.js";
import { landowner } from "../../models/users/landowner.js"; 
import { ApiResponse } from "../../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(landownerId) => {
    try {
        const landOwner = await landowner.findById(landownerId)
        const accessToken = landOwner.generateAccessToken()
        const refreshToken = landOwner.generateRefreshToken()

        landOwner.refreshToken = refreshToken
        landOwner.save({ validateBeforeSave: false})
        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, " something went wrong while generating access and refresh token")  
    }
}
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

const loginLandOwner = asyncHandler(async(req, res) => {
    /* get data from req body
    get login details
    check if user exist or not
    generate acess and refres token
    provide access token and refresh token through cookie
    check refresh token each time session expires
    provide new access token
    at logout destroy access and refresh token*/
    const {email, userName, mobileNumber, password} = req.body

    if(!userName || !email || !mobileNumber){
        throw new ApiError(400, "username and password is required in landowner login")
    }

    const landOwner = await landowner.findOne({
        $or: [{userName}, {email}, {mobileNumber}]
    })
    if(!landOwner){
        throw new ApiError(404, "landowner not registered")
    }

    const isPasswordValid = await landOwner.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid landowner credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(landOwner._id)

    const loggedInlandOwner = await landowner.findById(landOwner._id).select(" -password -refreshToken")

    const options ={
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("acessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {landowner: loggedInlandOwner, accessToken, refrehToken}, 
            "landowner logged in successfully"
    )
    )
})

const logoutLandOwner = asyncHandler(async(req, res) => {
    await landowner.findByIdAndUpdate(
        req.landOwner._id,
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
export {
     registerLandOwner,
     loginLandOwner,
     logoutLandOwner
     }