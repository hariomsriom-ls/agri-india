import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {organizationauthority} from "../models/users/authority.js";
import {Review} from "../models/Reviews.js"
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

export const postReviews = asyncHandler(async(req,res) => {
    const { category, message, rating, suggestion = "", contact = false } = req.body ?? {};
    const userId = req.user?._id;
    const role = req.user?.role;
    if (!role || !userId) {
        throw new ApiError(401, "Unauthorized access");
    }
    if (typeof category !== "string" || !category.trim() ||
        typeof message !== "string" || !message.trim()) {
        throw new ApiError(400, "Category and review are required");
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be a whole number from 1 to 5");
    }
    if (typeof suggestion !== "string" || typeof contact !== "boolean") {
        throw new ApiError(400, "Invalid suggestion or contact preference");
    }

    const review = await Review.create({
        ReviewFrom: userId,
        ReviewfromModel: role,
        category: category.trim(),
        rating,
        review: message.trim(),
        suggestion: suggestion.trim(),
        contact,
        status: "Submitted",
    });

    return res.status(201).json(
        new ApiResponse(201, { reviewData: review }, "Review submitted successfully")
    );
});
