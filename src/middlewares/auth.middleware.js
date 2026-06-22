import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import jwt from "jsonwebtoken"
import { landowner } from "../models/users/landowner"

export const verifyJwt = asyncHandler(async(req,res,next) => {
    try {
        const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    
        if(!token){
            throw new ApiError(401, " Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const landOwner = await landowner.findById(decodedToken?._id).select("-password -refreshToken")
        if(!landOwner){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.landOwner = landOwner;
        next()
    
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token")
    }


})