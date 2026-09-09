import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {organizationauthority} from "../models/users/authority.js";
import {Notification} from "../models/notification.js"
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";


const userModels = {
  worker: worker,
  landowner: landowner,
  authority: organizationauthority,
};

export const getNotifications = async (req, res) => {

  try {
    const User = req.user;
    const userId = User?._id;
    const role = User?.role;

    if (!userId || !role) { throw new ApiError(401, "Unauthorized request");}
    const UserModel = userModels[role.toLowerCase()];
    
     if (!UserModel) { throw new ApiError(400, "Invalid user role"); }

        const notification = await Notification.aggregate([
            {
              $match: {
              notificationto : userId }
            },
        ])

        return res.status(200).json(
           new ApiResponse(200,  {NotificationData: notification},"notifications fetched successfully",)
         );
      } 
  catch (error) {
        throw new ApiError(404, "Failed to fetch usernotifications", error);  
      }
    };