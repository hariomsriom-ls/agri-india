import {worker} from "../models/users/workers.js";
import {landowner} from "../models/users/landowner.js";
import {organizationauthority} from "../models/users/authority.js";
import {Payment} from "../models/payment.js"
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";


const userModels = {
  worker: worker,
  landowner: landowner,
  authority: organizationauthority,
};

export const getPaymentDetails = async (req, res) => {

  try {
    // These values should be attached by authentication middleware

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

        const payment = Payment.aggregate([
            {
              $match: {
                PaymentTo: userId,
                PaymentToModel: role  }
            },
            {
        $lookup: {
      from: "organizationauthority",
      localField: "PaymentFrom",
      foreignField: "_id",
      as: "PaymentFrom"
    }
  }
        ])
         
        const transaction = Payment.aggregate([
            {
                $match: {
                    PaymentFrom: userId,
                }
            },
            {
        $lookup: {
      from: "landowners",
      localField: "PaymentTo",
      foreignField: "_id",
      as: "PaymentTo"
    }
  }
        ])

        return res.status(200).json(
           new ApiResponse(200,  {PaymentData: payment, transactionData: transaction},"Payments fetched successfully",)
         );
      } catch (error) {
        throw new ApiError(404, "Failed to fetch user details", error);
        
      }
    };