import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {organizationauthority} from "../models/users/authority.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asynchandler.js"
const userModels = {
  worker: worker,
  landowner: landowner,
  authority: organizationauthority,
};

export const uploaduserProfileImage = asyncHandler(async (req, res) => {
      const User = req.user;
    const userId = User?._id;
    const role = User?.role; 
  if (!req.file) {throw new ApiError(400, "Please select a profile image");}

  try {
    const uploadedImage = await uploadOnCloudinary(req.file.path);

    if (!uploadedImage?.secure_url) { throw new ApiError(502, "Image upload failed");}

    const updatedUser = await role.findByIdAndUpdate(
      userId,
      { $set: { image: uploadedImage.secure_url } },
      { new: true, runValidators: true }
    ).select("image");

    if (!updatedUser) {throw new ApiError(404, `${role} not found`);}

    return res.status(200).json(
      new ApiResponse( 200, { profileImage: updatedUser.image }, "Profile image updated successfully")
    );
  } 
 catch{(error) => {console.error("Temporary image cleanup failed:", error); }
}
});