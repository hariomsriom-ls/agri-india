import mongoose from "mongoose";
import { worker } from "../models/users/workers.js";
import { landowner } from "../models/users/landowner.js";
import { organizationauthority } from "../models/users/authority.js";
import { Payment } from "../models/payment.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userModels = { worker, landowner, authority: organizationauthority };

export const getPaymentDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized request");
  // Authority accounts use the model name rather than a stored role field.
  const role = (req.user.role || req.user.constructor?.modelName || "").toLowerCase();
  if (!Object.hasOwn(userModels, role)) throw new ApiError(400, "Invalid user role");

  // Aggregation does not cast string worker IDs to legacy ObjectId references.
  const userIds = [userId];
  if (typeof userId === "string" && mongoose.isObjectIdOrHexString(userId)) {
    userIds.push(new mongoose.Types.ObjectId(userId));
  }

  const payment = await Payment.aggregate([
    { $match: { PaymentTo: { $in: userIds }, PaymentToModel: role === "authority" ? "organizationauthority" : role } },
    { $sort: { paymentdate: -1, _id: 1 } },
    { $lookup: {
      from: organizationauthority.collection.name,
      localField: "PaymentFrom",
      foreignField: "_id",
      pipeline: [{ $project: { _id: 1, fullName: 1 } }],
      as: "PaymentFrom",
    } },
  ]);

  const transaction = await Payment.aggregate([
    { $match: { PaymentFrom: { $in: userIds } } },
    { $sort: { paymentdate: -1, _id: 1 } },
    { $lookup: {
      from: landowner.collection.name,
      localField: "PaymentTo",
      foreignField: "_id",
      pipeline: [{ $project: { _id: 1, fullName: 1 } }],
      as: "PaymentTo",
    } },
  ]);

  return res.status(200).json(new ApiResponse(
    200, { PaymentData: payment, transactionData: transaction }, "Payments fetched successfully",
  ));
});
