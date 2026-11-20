import { Conversation } from "../models/conversation.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const startConversation = asyncHandler(async (req, res) => {
  const creatorId = req.user?._id;
  const role = req.user?.role;

  if (!creatorId) throw new ApiError(401, "Unauthorized request");
  if (!role) throw new ApiError(400, "User role is required");
  if (role !== "worker" && role !== "authority") {
    throw new ApiError(400, "Invalid user role");
  }

  const { type = "direct", receiverId, groupName, groupImage } = req.body;
  const groupMembers = req.body.members ?? req.body.participants ?? [];

  if (type === "direct") {
    if (!receiverId) throw new ApiError(400, "Receiver ID is required");

    const participantIds = [creatorId.toString(), receiverId.toString()].sort();
    const existingConversation = await Conversation.findOne({
      type: "direct",
      participants: { $all: participantIds, $size: 2 },
    });

    if (existingConversation) {
      return res
        .status(200)
        .json(new ApiResponse(200, { conversationId: existingConversation._id }, "Conversation already exists"));
    }

    const newConversation = await Conversation.create({
      type: "direct",
      participants: participantIds,
      directKey: participantIds.join(":"),
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { conversationId: newConversation._id }, "Conversation created"));
  }

  if (type === "group") {
    const participantIds = [...new Set([creatorId.toString(), ...groupMembers.map((memberId) => memberId.toString())])];
    const newConversation = await Conversation.create({
      type: "group",
      participants: participantIds,
      admins: [creatorId],
      groupName,
      groupImage,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { conversationId: newConversation._id }, "Group conversation created"));
  }

  throw new ApiError(400, "Invalid conversation type");
});

export const leaveGroup = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const conversationId = req.params?.conversationId ?? req.body?.conversationId;

  if (!userId) throw new ApiError(401, "Unauthorized request");
  if (!conversationId) throw new ApiError(400, "Conversation ID is required");

  const updatedConversation = await Conversation.findOneAndUpdate(
    {
      _id: conversationId,
      type: "group",
      participants: userId,
    },
    { $pull: { participants: userId } },
    { new: true }
  );

  if (!updatedConversation) {
    throw new ApiError(404, "Group conversation not found or user is not a participant");
  }


  return res
    .status(200)
    .json(new ApiResponse(200, { conversationId: updatedConversation._id }, "Left group conversation"));
});

export const blockConversation = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const conversationId = req.params?.conversationId ?? req.body?.conversationId;

  if (!userId) throw new ApiError(401, "Unauthorized request");
  if (!conversationId) throw new ApiError(400, "Conversation ID is required");

  const updatedConversation = await Conversation.findOneAndUpdate(
    {
      _id: conversationId,
      participants: userId,
    },
    { $pull: { participants: userId } },
    { new: true }
  );

  if (!updatedConversation) {
    throw new ApiError(404, "Conversation not found or user is not a participant");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { conversationId: updatedConversation._id }, "Conversation blocked"));
});
