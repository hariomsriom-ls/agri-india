import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {organizationauthority} from "../models/users/authority.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";

const userModels = {
  worker: worker,
  landowner: landowner,
  authority: organizationauthority,
};

export const getUserDetails = async (req, res) => {
  console.log("get User details started");
  try {
    // These values should be attached by authentication middleware
    console.log("entered try block");
    console.log("req.user:", req.user);
    const User = req.user;
    const userId = User?._id;
    const role = User?.role;

    if (!userId || !role) {
      throw new ApiError(401, "Unauthorized request");
    }

    const UserModel = userModels[role.toLowerCase()];
    console.log(`User model for role ${role}:`, UserModel);

    if (!UserModel) {
      throw new ApiError(400, "Invalid user role");
    }

    const user = await UserModel.findById(userId).select("-password -refreshToken -__v");
    console.log("Fetched user details:", user);
    
    if (!user) {throw new ApiError(404, "User not found")}
    return res.status(200).json(
       new ApiResponse(200, "User details fetched successfully", {userData:user},)
     );
  } catch (error) {
    throw new ApiError(404, "Failed to fetch user details", error);
    
  }
};