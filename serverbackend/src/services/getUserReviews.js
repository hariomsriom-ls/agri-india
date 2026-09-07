import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {organizationauthority} from "../models/users/authority.js";
import {Review} from "../models/Reviws.js"
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const userModels = {
  worker: worker,
  landowner: landowner,
  authority: organizationauthority,
};

export const getReviews = async (req, res) => {

  try {
    const User = req.user;
    const userId = User?._id;
    const role = User?.role;

    if (!userId || !role) {
      throw new ApiError(401, "Unauthorized request");
    }
    const UserModel = userModels[role.toLowerCase()];
    
     if (!UserModel) {
          throw new ApiError(400, "Invalid user role");
    }

        const review = await Review.aggregate([
            {
              $match: {
               ReviewFrom: userId }
            },
        ])

        return res.status(200).json(
           new ApiResponse(200,  {ReviewData: review},"Reviews fetched successfully",)
         );
      } 
  catch (error) {
        throw new ApiError(404, "Failed to fetch user Reviews", error);
        
      }
    };

export const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { reviewId } = req.params;

  if (!userId) {throw new ApiError(401, "Unauthorized request");}
  if (!mongoose.isValidObjectId(reviewId)) {throw new ApiError(400, "Invalid review ID");}

  const deletedReview = await Review.findOneAndDelete({ _id: reviewId, ReviewFrom: userId, });

  if (!deletedReview) { throw new ApiError(404, "Review not found or you are not allowed to delete it"); }

  return res.status(200).json(new ApiResponse( 200, {deletedReviewId: deletedReview._id.toString(),},"Review deleted successfully"));
});