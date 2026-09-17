import { Documents } from "../models/document.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs/promises";

export const uploadDocument = asyncHandler(async (req, res) => {
    let uploadedFile;

    try {
        const userId = req.user?._id;
        const role = req.user?.role ?? req.user?.constructor?.modelName;
        const userRole = role === "authority" ? "organizationauthority" : role;
        if (!userId) {
            throw new ApiError(401, "Unauthorized request");
        }
        if (!["landowner", "worker", "organizationauthority"].includes(userRole)) {
            throw new ApiError(403, "Invalid document owner role");
        }
        if (!req.file) {
            throw new ApiError(400, "Please select a document");
        }

        const { name, category } = req.body ?? {};
        if (typeof name !== "string" || !name.trim() ||
            typeof category !== "string" || !category.trim()) {
            throw new ApiError(400, "Document name and category are required");
        }

        uploadedFile = await uploadOnCloudinary(req.file.path);
        if (!uploadedFile?.secure_url) {
            throw new ApiError(502, "Document upload failed. Please try again");
        }

        const document = await Documents.create({
            name: name.trim(),
            category: category.trim(),
            uploadDate: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
            fileUrl: uploadedFile.secure_url,
            publicId: uploadedFile.public_id,
            resourceType: uploadedFile.resource_type,
            format: uploadedFile.format,
            documentOf: userId,
            documentOfModel: userRole,
            documentFrom: userId,
            documentFromModel: userRole,
        });

        return res.status(201).json(
            new ApiResponse(201, { document }, "Document uploaded successfully")
        );
    } catch (error) {
        if (uploadedFile?.public_id) {
            try {
                await cloudinary.uploader.destroy(uploadedFile.public_id, {
                    resource_type: uploadedFile.resource_type || "image",
                });
            } catch (cleanupError) {
                console.error("Uploaded document cleanup failed:", cleanupError);
            }
        }
        throw error;
    } finally {
        if (req.file?.path) {
            try {
                await unlink(req.file.path);
            } catch (cleanupError) {
                if (cleanupError.code !== "ENOENT") {
                    console.error("Temporary document cleanup failed:", cleanupError);
                }
            }
        }
    }
});

const getDocumentsForRole = (role) => asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }
    if (req.user.role !== role) {
        throw new ApiError(403, "You cannot access these documents");
    }

    const documents = await Documents.find({
        documentOf: userId,
        documentOfModel: role,
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, { Documents: documents }, "Documents fetched successfully")
    );
});

export const getLandownerDocuments = getDocumentsForRole("landowner");
export const getWorkerDocuments = getDocumentsForRole("worker");
