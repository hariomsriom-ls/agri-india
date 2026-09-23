import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {authority} from "../models/users/authority.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";

const userModels = {
  worker: worker,
  landowner: landowner,
  authority: authority,
};

export const getUserDetails = async (req, res, next) => {

  try {

      const userId = req.user?._id;
    const role = req.user?.role || req.user?.constructor?.modelName;

    if (!userId || !role) {throw new ApiError(401, "Unauthorized request");}

    const UserModel = userModels[role];

    if (!UserModel) {throw new ApiError(400, "Invalid user role");}
    
    
    const user = await UserModel.findById(userId).select("-password -refreshToken -__v")
  .populate({
    path: "address",
    populate: [
      { path: "district", select: "name" },
      { path: "state", select: "name" },
    ],
  });
  if (!user) {throw new ApiError(404, "User not found")}
    return res.status(200).json(
       new ApiResponse(200,  {userData: { ...user.toObject(), role }},"User details fetched successfully",)
     );
  } catch (error) {
    next(error);
    
  }
};
