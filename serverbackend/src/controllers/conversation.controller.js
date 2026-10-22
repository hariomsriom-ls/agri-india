import {worker} from "../models/users/workers.js";
import {authority} from "../models/users/authority.js";
import {conversation} from "../models/conversations.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {message} from "../models/message.js";

export const startConversation = asyncHandler(async (req, res) => {
  const User = req.user
  const senderId = User?._id;
  const role = User?.role;

  if(!senderId) throw new ApiError(401, "Unauthorized request");
  if(!role) throw new ApiError(400, "User role is required");
  if(role !== "worker" && role !== "authority") throw new ApiError(400, "Invalid user role");
  
  const { receiverId } = req.body;
  if(!receiverId) throw new ApiError(400, "Receiver ID is required");

    const existingConversation = await conversation.findOne({
       
    })

})
