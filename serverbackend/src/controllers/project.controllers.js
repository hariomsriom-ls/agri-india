import mongoose from "mongoose";
import { project } from "../models/project.js";
import { landRecord } from "../models/record/landrecord.js";
import { ApiError, ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getProjects = (role) => asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized request");

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


export const createProject = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const role = (req.user?.role || req.user?.constructor?.modelName || "").toLowerCase();

  if (!userId) throw new ApiError(401, "Unauthorized request");
  if (role !== "authority" && role !== "organizationauthority") {
    throw new ApiError(403, "Only an authority can create a project");
  }

  const {
    _id,
    projectId,
    projectLocation,
    projectStartDate,
    projectDays,
    projectWorkers = [],
    projectLand = [],
    projectStatus,
    projectOutput,
  } = req.body ?? {};

  const id = _id ?? projectId;
  if (typeof id !== "string" || !id.trim()) {
    throw new ApiError(400, "Project ID is required");
  }
  if (typeof projectLocation !== "string" || !projectLocation.trim()) {
    throw new ApiError(400, "Project location is required");
  }
  if (!projectStartDate || Number.isNaN(new Date(projectStartDate).getTime())) {
    throw new ApiError(400, "Valid project start date is required");
  }
  if (!Number.isFinite(Number(projectDays)) || Number(projectDays) <= 0) {
    throw new ApiError(400, "Project duration must be greater than zero");
  }
  if (typeof projectStatus !== "string" || !projectStatus.trim()) {
    throw new ApiError(400, "Project status is required");
  }
  if (typeof projectOutput !== "string" || !projectOutput.trim()) {
    throw new ApiError(400, "Project output is required");
  }
  if (!Array.isArray(projectWorkers) || !Array.isArray(projectLand)) {
    throw new ApiError(400, "Project workers and land must be arrays");
  }

  const newProject = await project.create({
    _id: id.trim(),
    projectLocation: projectLocation.trim(),
    projectStartDate: new Date(projectStartDate),
    projectDays: Number(projectDays),
    projectWorkers,
    projectAuthority: userId,
    projectLand,
    projectStatus: projectStatus.trim(),
    projectOutput: projectOutput.trim(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { project: newProject }, "Project created successfully"));
});


export const updateProjectStatus = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const role = (req.user?.role || req.user?.constructor?.modelName || "").toLowerCase();

  if (!userId) throw new ApiError(401, "Unauthorized request");
  if (role !== "authority" && role !== "organizationauthority") {
    throw new ApiError(403, "Only an authority can update project status");
  }

  const projectId = req.params?.projectId ?? req.body?.projectId ?? req.body?._id;
  const { projectStatus } = req.body ?? {};

  if (typeof projectId !== "string" || !projectId.trim()) {
    throw new ApiError(400, "Project ID is required");
  }
  if (typeof projectStatus !== "string" || !projectStatus.trim()) {
    throw new ApiError(400, "Project status is required");
  }

  const updatedProject = await project.findOneAndUpdate(
    { _id: projectId.trim(), projectAuthority: userId },
    { $set: { projectStatus: projectStatus.trim() } },
    { new: true, runValidators: true }
  );

  if (!updatedProject) {
    throw new ApiError(404, "Project not found or not assigned to this authority");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { project: updatedProject }, "Project status updated successfully"));
});
