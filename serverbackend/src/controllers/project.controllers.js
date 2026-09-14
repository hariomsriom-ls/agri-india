import mongoose from "mongoose";
import { project } from "../models/project.js";
import { landRecord } from "../models/record/landrecord.js";
import { ApiError, ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// The role comes from the route, after authentication against its user model.
export const getProjects = (role) => asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized request");

  // Worker IDs are strings, while project assignments use ObjectId references.
  const userIds = [userId];
  if (typeof userId === "string" && mongoose.isObjectIdOrHexString(userId)) {
    userIds.push(new mongoose.Types.ObjectId(userId));
  }

  let filter;
  switch (role) {
    case "worker":
      filter = { projectWorkers: { $in: userIds } };
      break;
    case "authority":
      filter = { projectAuthority: { $in: userIds } };
      break;
    case "landowner": {
      const landIds = await landRecord.distinct("_id", { landowner: userId });
      filter = { projectLand: { $in: landIds } };
      break;
    }
    default:
      throw new ApiError(400, "Invalid user role");
  }

  const projects = await project.aggregate([
    { $match: filter },
    { $sort: { createdAt: -1, _id: 1 } },
  ]);

  return res.status(200).json(
    new ApiResponse(200, { ProjectData: projects }, "Projects fetched successfully"),
  );
});
