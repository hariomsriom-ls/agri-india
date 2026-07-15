import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { landowner } from "../models/users/landowner.js"

export const verifyJwt = (UserType) => asyncHandler(async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
       // console.log("Cookies:", req.cookies);
       // console.log("Token:", token);
    
        if(!token){
            throw new ApiError(401, " Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        const User = await UserType.findById(decodedToken?._id).select("-password -refreshToken")
        if(!User){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = User;
        next()
    
    } catch (error) {
        //console.log("JWT Error:", error.message);
        throw new ApiError(401, "verify jwt problem")
    }


})