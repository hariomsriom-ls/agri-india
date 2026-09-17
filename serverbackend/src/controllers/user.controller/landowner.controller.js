import { asyncHandler } from "../../utils/asyncHandler.js";
import registrationValidations from "../../validations/registration.validations.js";
import { landowner } from "../../models/users/landowner.js"; 
import {Address} from "../../models/address/address.js";
import { ApiResponse, ApiError } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { userLogin, findUser } from "../../services/authorization.js";

const tokenCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

export const generateAccessAndRefreshToken = async(landownerId) => {
    try {
        const landOwner = await landowner.findById(landownerId)
        
        const accessToken = landOwner.generateAccessToken()
        const refreshToken = landOwner.generateRefreshToken()

        landOwner.refreshToken = refreshToken
        await landOwner.save({ validateBeforeSave: false})
        return {accessToken, refreshToken}
        
    } catch (error) {
        console.log("REAL TOKEN ERROR:", error);
        throw new ApiError(500, " something went wrong while generating access and refresh token")  
    }
}


const registerLandOwner = asyncHandler(async(req, res) => {
     const {fullName, mobileNumber, email, userName, password}= req.body

     registrationValidations.fieldNotEmpty(req.body);
     registrationValidations.validateEmailId(req.body.email);
     registrationValidations.validateMobileNumber(req.body.mobileNumber);

     const normalizedEmail = email.toLowerCase().trim();
     const cleanedMobile = Number(String(mobileNumber).replace(/\D/g, '').slice(-10));

     const existedUser = await landowner.findOne({ 
         $or: [{userName: String(userName).trim()}, {email: normalizedEmail}, {mobileNumber: cleanedMobile}]  
     });
     if (existedUser) {
        throw new ApiError(409, "User with this username, email, or mobile number already exists");
     }

     const landOwner = await landowner.create({
         fullName: String(fullName).trim(),  
         email: normalizedEmail, 
         userName: String(userName).trim(), 
         password, 
         mobileNumber: cleanedMobile
     });

     const createdlandOwner = await landowner.findById(landOwner._id).select("-password -refreshToken" );
     if (!createdlandOwner) {
        throw new ApiError(500, "user not registered try again later");
     }

     return res.status(201).json( new ApiResponse(201, createdlandOwner, "landowner registered successfully") );
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
    const {role,login, password,keepSignedIn} = req.body;
    const loginData = await userLogin(login,role,password);
    const landOwner = await findUser(loginData, role,password);

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(landOwner._id)

    const loggedInlandOwner = await landowner.findById(landOwner._id).select(" -password -refreshToken")

    const options = tokenCookieOptions();
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json( new ApiResponse(200, {landowner: loggedInlandOwner}, "landowner logged in successfully" ) )
})

const logoutLandOwner = asyncHandler(async(req, res) => {
    await landowner.findByIdAndUpdate(
        req.user?._id,
        {$unset: {refreshToken: 1}},
        {new: true}
    )
    const options = tokenCookieOptions();
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"))

})

const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        if (["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(error.name)) {
            throw new ApiError(401, "Session expired. Please sign in again");
        }
        throw error;
    }
    if (typeof decodedToken?._id !== "string" || !decodedToken._id) {
        throw new ApiError(401, "Invalid refresh token");
    }
    const landOwner = await landowner.findById(decodedToken._id);
    if (!landOwner || incomingRefreshToken !== landOwner.refreshToken) {
        throw new ApiError(401, "Session expired. Please sign in again");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(landOwner._id);
    const options = tokenCookieOptions();
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
});


const changeCurrentPassword = asyncHandler(async(req,res) => {
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword){
        throw new ApiError(401, "both passowrds are required")
    }
    const landOwner = await landowner.findById(req.user?._id)
    if(!landOwner){
        throw new ApiError(401, "landowner not exist")
    }
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
     changeCurrentPassword,
     }
