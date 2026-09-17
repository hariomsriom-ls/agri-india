import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {organizationauthority} from "../models/users/authority.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asynchandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs/promises";
const userModels = {
  worker: worker,
  landowner: landowner,
  authority: organizationauthority,
};

export const uploaduserProfileImage = asyncHandler(async (req, res) => {
  let uploadedImage;
  try {
    const userId = req.user?._id;
    const model = userModels[req.user?.role];
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!model) throw new ApiError(400, "Invalid user role");
    if (!req.file) throw new ApiError(400, "Please select a profile image");

    uploadedImage = await uploadOnCloudinary(req.file.path);

    if (!uploadedImage?.secure_url) { throw new ApiError(502, "Image upload failed");}

    const updatedUser = await model.findByIdAndUpdate(
      userId,
      { $set: { image: uploadedImage.secure_url } },
      { new: true, runValidators: true }
    ).select("image");

    if (!updatedUser) {throw new ApiError(404, "User not found");}

    return res.status(200).json(
      new ApiResponse( 200, { profileImage: updatedUser.image }, "Profile image updated successfully")
    );
  } catch (error) {
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.public_id, {
          resource_type: uploadedImage.resource_type || "image",
        });
      } catch (cleanupError) {
        console.error("Uploaded profile image cleanup failed:", cleanupError);
      }
    }
    throw error;
  } finally {
    if (req.file?.path) {
      try {
        await unlink(req.file.path);
      } catch (cleanupError) {
        if (cleanupError.code !== "ENOENT") console.error("Temporary image cleanup failed:", cleanupError);
      }
    }
  }
});
