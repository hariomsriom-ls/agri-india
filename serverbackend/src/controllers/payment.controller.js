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


export const createPayment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const role = (req.user?.role || req.user?.constructor?.modelName || "").toLowerCase();

  if (!userId) throw new ApiError(401, "Unauthorized request");
  if (role !== "authority" && role !== "organizationauthority") {
    throw new ApiError(403, "Only an authority can create a payment");
  }

  const {
    bankaccount,
    amount,
    paymentdate,
    transactionId,
    paymentMethod,
    paymentStatus = "Pending",
    paymentType,
    PaymentTo,
    PaymentToModel,
  } = req.body ?? {};

  if (!Number.isFinite(Number(bankaccount))) {
    throw new ApiError(400, "Valid bank account number is required");
  }
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    throw new ApiError(400, "Amount must be greater than zero");
  }
  if (!paymentdate || Number.isNaN(new Date(paymentdate).getTime())) {
    throw new ApiError(400, "Valid payment date is required");
  }
  if (typeof transactionId !== "string" || !transactionId.trim()) {
    throw new ApiError(400, "Transaction ID is required");
  }
  if (typeof paymentMethod !== "string" || !paymentMethod.trim()) {
    throw new ApiError(400, "Payment method is required");
  }
  if (typeof paymentType !== "string" || !paymentType.trim()) {
    throw new ApiError(400, "Payment type is required");
  }
  if (!["Paid", "Pending", "Failed"].includes(paymentStatus)) {
    throw new ApiError(400, "Invalid payment status");
  }
  if (!mongoose.isValidObjectId(PaymentTo)) {
    throw new ApiError(400, "Valid payment recipient ID is required");
  }

  const recipientModelName = PaymentToModel?.toLowerCase();
  const recipientModel = {
    landowner,
    worker,
    organizationauthority,
  }[recipientModelName];

  if (!recipientModel) {
    throw new ApiError(400, "Invalid payment recipient type");
  }
  const recipientExists = await recipientModel.exists({ _id: PaymentTo });
  if (!recipientExists) throw new ApiError(404, "Payment recipient not found");

  const payment = await Payment.create({
    bankaccount: Number(bankaccount),
    amount: Number(amount),
    paymentdate: new Date(paymentdate),
    transactionId: transactionId.trim(),
    paymentMethod: paymentMethod.trim(),
    paymentStatus,
    paymentType: paymentType.trim(),
    PaymentTo,
    PaymentToModel: recipientModelName,
    PaymentFrom: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { payment }, "Payment created successfully"));
});
