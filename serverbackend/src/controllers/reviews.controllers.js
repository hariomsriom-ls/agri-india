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
    const {category, message, rating} = req.body;
    
    try {
     const  userId = req.user?._id;
    const role = req.user?.role;
    if(!role || !userId){
        throw new ApiError(400, "Unauthorized access")
    }
    const RegisterReview = await Review.create({
    ReviewFrom: userId,
    ReviewfromModel: role,
    category: category,
    rating: rating,
    review: message,
    createdAt: Date.now(),
    })
    if(!RegisterReview){
      throw new ApiError(400, "Something went wrong while Registering the review")
    }
    const review = await Review.findByIdAndUpdate(
      RegisterReview._id,
      { status: "Submitted"},
      { new: true, runValidators: true}
    )
    return res.status(200).json(200,{reviewData: review}, "Review has been successfully registered Thank You")
    } catch (error) {
        throw new ApiError(404, "Failed to fetch userComplaints", error); 
    }
});