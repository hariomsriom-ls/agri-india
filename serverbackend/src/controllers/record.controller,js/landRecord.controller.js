import mongoose from "mongoose";
import {landowner} from "../../models/users/landowner.js";
import { landRecord } from "../../models/record/landrecord.js";
import { ApiResponse, ApiError } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asynchandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { Documents } from "../../models/document.js";
import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs/promises";

const getLandRecords = asyncHandler(async (req, res) => {
  try{
    const userId = req.user?._id;
    const role = req.user?.role;

    if (!userId || !role) {
        throw new ApiError(401, "Unauthorized request");
    }

    let filter;

    if (role === "landowner") {
        filter = { landowner: userId };
    } else if (role === "authority") {
        filter = { authorityAssigned: userId };
    } else {
        throw new ApiError(403, "Only landowners and authorities can access land records");
    }

    const records = await landRecord.find(filter);

    return res.status(200).json(
        new ApiResponse(200, { LandRecordData: records }, "Land records fetched successfully")
    );
}
catch(error){
 throw new ApiError(404, "Failed to fetch Land records", error);  
}
});

const addLandDetails = asyncHandler(async(req,res) => {
    let uploadedFile;
    let newLand;
    let document;
    try {
        const landOwnerId = req.user?._id;
        if (!landOwnerId) throw new ApiError(401, "Unauthorized request");
        if (req.user.role !== "landowner") throw new ApiError(403, "Only landowners can add land");

        const { landArea, landCity, landLocation } = req.body ?? {};
        const area = Number(landArea);
        if (typeof landArea !== "string" || !Number.isFinite(area) || area <= 0) {
            throw new ApiError(400, "Land area must be a positive number");
        }
        if (typeof landCity !== "string" || !landCity.trim() ||
            typeof landLocation !== "string" || !landLocation.trim()) {
            throw new ApiError(400, "Land city and location are required");
        }
        if (!req.file) throw new ApiError(400, "Land document is required");

        uploadedFile = await uploadOnCloudinary(req.file.path);
        if (!uploadedFile?.secure_url) throw new ApiError(502, "Document upload failed. Please try again");

        newLand = await landRecord.create({
            landStatus: "Pending",
            landowner: landOwnerId,
            landArea: area,
            landCity: landCity.trim(),
            landLocation: landLocation.trim(),
            landDocuments: uploadedFile.secure_url,
        });
        document = await Documents.create({
            name: `Land in ${landCity.trim()}`,
            category: "LandDocuments",
            uploadDate: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
            fileUrl: uploadedFile.secure_url,
            publicId: uploadedFile.public_id,
            resourceType: uploadedFile.resource_type,
            format: uploadedFile.format,
            documentOf: landOwnerId,
            documentOfModel: "landowner",
            documentFrom: landOwnerId,
            documentFromModel: "landowner",
        });
        const ownerUpdate = await landowner.updateOne(
            { _id: landOwnerId },
            { $addToSet: { landID: newLand._id } }
        );
        if (!ownerUpdate.matchedCount) throw new ApiError(404, "Landowner not found");

        return res.status(201).json(new ApiResponse(201, newLand, "Land added successfully"));
    } catch (error) {
       
        const cleanup = [];
        if (document) cleanup.push(Documents.deleteOne({ _id: document._id }));
        if (newLand) cleanup.push(landRecord.deleteOne({ _id: newLand._id }));
        if (uploadedFile?.public_id) {
            cleanup.push(cloudinary.uploader.destroy(uploadedFile.public_id, {
                resource_type: uploadedFile.resource_type || "image",
            }));
        }
        const results = await Promise.allSettled(cleanup);
        results.forEach((result) => {
            if (result.status === "rejected") console.error("Land submission cleanup failed:", result.reason);
        });
        throw error;
    } finally {
        if (req.file?.path) {
            try {
                await unlink(req.file.path);
            } catch (error) {
                if (error.code !== "ENOENT") console.error("Temporary land document cleanup failed:", error);
            }
        }
    }
});

const deleteLandDetails = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { landRecordId } = req.params;

    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }
    if (req.user.role !== "landowner") {
        throw new ApiError(403, "Only landowners can delete land records");
    }
    if (!mongoose.isValidObjectId(landRecordId)) {
        throw new ApiError(400, "Invalid land record ID");
    }
     if(landStatus === "in-use"){
        throw new ApiError(200, "you cannot delete the land as it is on lease period")
    }
    const deletedRecord = await landRecord.findOneAndDelete({
        _id: landRecordId,
        landowner: userId,
        landStatus: { $not: /^(active|in-use)$/i },
    });

    if (!deletedRecord) {
        const existingRecord = await landRecord.findOne({ _id: landRecordId, landowner: userId }).select("landStatus");
        if (existingRecord && /^(active|in-use)$/i.test(existingRecord.landStatus)) {
            throw new ApiError(409, "Land currently in use cannot be deleted");
        }
        throw new ApiError(404, "Land record not found or you are not allowed to delete it");
    }

    await landowner.updateOne(
        { _id: userId },
        { $pull: { landID: deletedRecord._id } }
    );

    return res.status(200).json(
        new ApiResponse(200, { deletedLandRecordId: deletedRecord._id.toString() }, "Land record deleted successfully")
    );
});

const verifyLand = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const role = req.user?.role ?? req.user?.constructor?.modelName;
    const { landRecordId } = req.params;

    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }
    if (role !== "authority") {
        throw new ApiError(403, "Only authorities can verify land records");
    }
    if (!mongoose.isValidObjectId(landRecordId)) {
        throw new ApiError(400, "Invalid land record ID");
    }

    const verifiedRecord = await landRecord.findOneAndUpdate(
        { _id: landRecordId, authorityAssigned: userId },
        { $set: { landStatus: "Verified" } },
        { new: true, runValidators: true }
    );

    if (!verifiedRecord) {
        throw new ApiError(404, "Land record not found or not assigned to you");
    }

    return res.status(200).json(
        new ApiResponse(200, { LandRecordData: verifiedRecord }, "Land verified successfully")
    );
});

export {
    getLandRecords,
    addLandDetails,
    deleteLandDetails,
    verifyLand,
}
