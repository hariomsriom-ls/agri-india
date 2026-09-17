import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {authority} from "../models/users/authority.js";
import { Complaint } from "../models/complaints.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { landRecord } from "../models/record/landrecord.js";

const userModels = {
  worker: worker,
  landowner: landowner,
  authority: authority,
};

export const getComplaints = asyncHandler(async (req, res) => {
    const User = req.user;
    const userId = User?._id;
    const role = User?.role ?? User?.constructor?.modelName;

    if (!userId || !role) { throw new ApiError(401, "Unauthorized request");}
    const UserModel = userModels[role.toLowerCase()];
    
     if (!UserModel) { throw new ApiError(400, "Invalid user role"); }

        const filter = role === "landowner"
          ? { complaintfrom: userId, ComplaintFromModel: "landowner" }
          : { complaintto: userId };

        const complaint = await Complaint.aggregate([
            {
              $match: filter
            },
        ])

        return res.status(200).json(
           new ApiResponse(200,  {ComplaintData: complaint},"complaints fetched successfully",)
         );
});


export const postComplaints = asyncHandler(async(req,res) => {
    const { category, message } = req.body ?? {};
    const userId = req.user?._id;
    const role = req.user?.role ?? req.user?.constructor?.modelName;
    if (!role || !userId) throw new ApiError(401, "Unauthorized access");
    if (!["landowner", "worker"].includes(role)) {
        throw new ApiError(403, "Only landowners and workers can submit complaints");
    }
    if (typeof category !== "string" || !category.trim() || typeof message !== "string" || !message.trim()) {
        throw new ApiError(400, "Complaint category and description are required");
    }
    if (message.trim().length > 1000) throw new ApiError(400, "Complaint must be 1000 characters or fewer");
    if (!Complaint.schema.path("category").enumValues.includes(category.trim())) {
        throw new ApiError(400, "Invalid complaint category");
    }

    let recipientId;
    let locations = role === "worker" ? [req.user.workingZone].filter(Boolean) : [];
    if (role === "landowner") {
        const land = await landRecord.findOne({ landowner: userId })
            .sort({ createdAt: -1 }).select("authorityAssigned landLocation landCity");
        recipientId = land?.authorityAssigned;
        locations = [land?.landLocation, land?.landCity].filter(Boolean);
    }
    if (!recipientId && locations.length) {
        const assignedAuthority = await authority.findOne({ workingZone: { $in: locations } }).select("_id");
        recipientId = assignedAuthority?._id;
    }

    const complaint = await Complaint.create({
        message: message.trim(),
        category: category.trim(),
        status: "Pending",
        complaintfrom: userId,
        ComplaintFromModel: role,
        ...(recipientId ? { complaintto: recipientId, ComplaintToModel: "authority" } : {}),
    });
    return res.status(201).json(new ApiResponse(201, { complaint }, "Complaint registered successfully"));
});
