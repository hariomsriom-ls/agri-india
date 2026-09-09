import mongoose from "mongoose";
import { Review } from "../models/Reviews.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function reviewOwner(req) {
  const userId = req.user?._id;
  const role = req.user?.role ?? req.user?.constructor?.modelName;
  if (!userId || !role) throw new ApiError(401, "Unauthorized request");
  if (!["worker", "landowner", "authority"].includes(role)) {
    throw new ApiError(403, "Invalid user role");
  }
  return { userId, role };
}

function ownerFilter({ userId, role }) {
  // Include reviews stored before worker IDs were accepted as strings.
  const ownerIds = [userId];
  if (typeof userId === "string" && mongoose.isObjectIdOrHexString(userId)) {
    ownerIds.push(new mongoose.Types.ObjectId(userId));
  }
  return {
    ReviewFrom: { $in: ownerIds },
    ReviewfromModel: role === "authority" ? { $in: ["authority", "organizationauthority"] } : role,
  };
}

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find(ownerFilter(reviewOwner(req)))
    .sort({ createdAt: -1, _id: -1 });
  return res.status(200).json(new ApiResponse(200, { ReviewData: reviews }, "Reviews fetched successfully"));
});

export const postReviews = asyncHandler(async (req, res) => {
  const { userId, role } = reviewOwner(req);
  const { category, rating, message, suggestion = "", contact = false } = req.body ?? {};

  if (!Review.schema.path("category").enumValues.includes(category)) {
    throw new ApiError(400, "Please select a valid review category");
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ApiError(400, "Please select a rating between 1 and 5");
  }
  if (typeof message !== "string" || !message.trim() || message.trim().length > 1000) {
    throw new ApiError(400, "Your review must contain between 1 and 1000 characters");
  }
  if (typeof suggestion !== "string" || suggestion.trim().length > 1000) {
    throw new ApiError(400, "Suggestions must be no longer than 1000 characters");
  }
  if (typeof contact !== "boolean") {
    throw new ApiError(400, "Contact preference must be true or false");
  }

  const review = await Review.create({
    ReviewFrom: userId,
    ReviewfromModel: role,
    category,
    rating,
    review: message.trim(),
    suggestion: suggestion.trim(),
    contact,
    status: "Submitted",
  });

  return res.status(201).json(new ApiResponse(201, { reviewData: review }, "Your review has been submitted"));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const owner = reviewOwner(req);
  const { reviewId } = req.params;
  if (!mongoose.isObjectIdOrHexString(reviewId)) throw new ApiError(400, "Invalid review ID");

  const deletedReview = await Review.findOneAndDelete({ _id: reviewId, ...ownerFilter(owner) });
  if (!deletedReview) throw new ApiError(404, "Review not found or you are not allowed to delete it");

  return res.status(200).json(new ApiResponse(200, { deletedReviewId: deletedReview._id.toString() }, "Review deleted successfully"));
});
