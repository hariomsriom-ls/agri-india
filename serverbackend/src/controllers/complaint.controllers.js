import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {authority} from "../models/users/authority.js";
import { Complaint } from "../models/complaints.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userModels = {
  worker: worker,
  landowner: landowner,
  authority: authority,
};

export const getComplaints = async (req, res) => {

  try {
    const User = req.user;
    const userId = User?._id;
    const role = User?.role;

    if (!userId || !role) { throw new ApiError(401, "Unauthorized request");}
    const UserModel = userModels[role.toLowerCase()];
    
     if (!UserModel) { throw new ApiError(400, "Invalid user role"); }

        const complaint = await Complaint.aggregate([
            {
              $match: {
              complaintto : userId }
            },
        ])

        return res.status(200).json(
           new ApiResponse(200,  {ComplaintData: complaint},"complaints fetched successfully",)
         );
      } 
  catch (error) {
        throw new ApiError(404, "Failed to fetch userComplaints", error);  
      }
    };


export const postComplaints = asyncHandler(async(req,res) => {
    const {category, message, date} = req.body;
    
    try {
     const  userId = req.user?._id;
    const role = req.user?.role;
    if(!role || !userId){
        throw new ApiError(400, "Unauthorized access")
    }
    if(role === "worker"){
        const User = await worker.findById(userId);
        const location = User?.workingZone;
        const authority = await authority.findOne({
            workingZone: location,
        });
    }
    if(role === "landowner"){
        const User = await landowner.findById(userId);
        const location = User?.landLocation;
        const authority = await authority.findOne({
            workingZone: location,
        });
    }

   if(role !== "authority"){
    const RegisterComplaint = Complaint.create({
        message: String(message).trim(),
        Date: Date(date),
        category: String(category),
        status: "pending",
        complaintfrom: userId,
        ComplaintFromModel: role,
        complaintto: authority._id,
        ComplaintToModel: "authority",
    });

    if(!RegisterComplaint){
        throw new ApiError(401, "some issue occured while registering the complaint")
    }
}  
    return res.status(200).json(new ApiResponse(200,{},"Complaint registered successfully"));

    } catch (error) {
        throw new ApiError(404, "Failed to fetch userComplaints", error); 
    }
});
