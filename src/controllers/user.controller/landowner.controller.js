import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import registrationValidations from "../../validations/registration.validations.js";
import { landowner } from "../../models/users/landowner.js"; 
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { upload } from "../../middlewares/multer.middleware.js";

const generateAccessAndRefreshToken = async(landownerId) => {
    try {
        const landOwner = await landowner.findById(landownerId)
        
        const accessToken = landOwner.generateAccessToken()
        const refreshToken = landOwner.generateRefreshToken()

        landOwner.refreshToken = refreshToken
        landOwner.save({ validateBeforeSave: false})
        return {accessToken, refreshToken}
        
    } catch (error) {
        console.log("REAL TOKEN ERROR:", error);
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

    if(!userName && !email && !mobileNumber){
        throw new ApiError(400, "username required in landowner login")
    }
    if(!password){
        throw new ApiError(400, "password required in landowner login")
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
            {landowner: loggedInlandOwner, accessToken, refreshToken}, 
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

const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const landOwner = await landowner.findById(decodedToken?._id)
    
        if(!landOwner){
            throw new ApiError(401," Invalid refresh token")
        }
        if(incomingRefreshToken !== landOwner?.refreshToken){
            throw new ApiError (401," refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
       const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(landOwner._id)
    
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

const profileCompleteLandOwner = asyncHandler(async(req, res) => {
    const {address, bankaccount, IFSCcode, city, state } = req.body
    if(
        [address, bankaccount, IFSCcode, city, state].some((fields) => field?.trim() === "")
    ){
        throw new ApiError(400, "all fields required")
    }
    const imageLocalPath = req.files?.image[0]?.path;
    const governmentIdLocalPath = req.files?.governmentId[0]?.path;

    const image = await uploadOnCloudinary(imageLocalPath)
    const governmentId = await uploadOnCloudinary(governmentIdLocalPath)

    const landOwnerId = req.landOwner?._id
    const updateProfilelandOwner = await landowner.findByIdAndUpdate(landOwnerId,
        {
            $set: {
                address, bankaccount, IFSCcode, city, state,
                 image: image?.url || "",
                 governmentId: governmentId.url || ""
            },
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -refreshToken");


    if(!updateProfilelandOwner){
        throw new ApiError(404,"landowner not found" )
    }

    return res.status(200).json(
        new ApiResponse(200, updateProfilelandOwner, "details added successfully")
    )

})

const changeCurrentPassword = asyncHandler(async(req,res) => {
    const {oldPassword, newPassword} = req.body
    const landOwner = await landowner.findById(req.landOwner?._id)
    const isPasswordCorrect = await landOwner.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }
    landOwner.password = newPassword
    await landOwner.save({validateBeforeSave: false})

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))
})
export {
     registerLandOwner,
     loginLandOwner,
     logoutLandOwner,
     refreshAccessToken,
     profileCompleteLandOwner,
     changeCurrentPassword,
     }