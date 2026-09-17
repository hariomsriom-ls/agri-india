import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

export const verifyJwt = (UserType) => asyncHandler(async (req, res, next) => {
    const bearerToken = req.header("Authorization")?.match(/^Bearer\s+(\S+)$/i)?.[1];
    const token = bearerToken || req.cookies?.accessToken;
    if (!token) throw new ApiError(401, "Please sign in to continue");

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        if (error.name === "TokenExpiredError") throw new ApiError(401, "Access token expired");
        if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
            throw new ApiError(401, "Invalid access token");
        }
        throw error;
    }
    if (!decodedToken?._id || typeof decodedToken._id !== "string") {
        throw new ApiError(401, "Invalid access token");
    }
    // A database failure is a server error, not a failed token verification.
    const user = await UserType.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) throw new ApiError(401, "Session user not found. Please sign in again");
    req.user = user;
    next();
});
