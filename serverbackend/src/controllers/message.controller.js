import { Conversation } from "../models/conversation.js";
import { Message } from "../models/message.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user?._id;
  const { conversationId, text } = req.body;

  if (!senderId) throw new ApiError(401, "Unauthorized request");
  if (!conversationId) throw new ApiError(400, "Conversation ID is required");
  if (typeof text !== "string" || !text.trim()) {
    throw new ApiError(400, "Message text is required");
  }

  const existingConversation = await Conversation.findOne({
    _id: conversationId,
    participants: senderId,
  });

  if (!existingConversation) {
    throw new ApiError(404, "Conversation not found or sender is not a participant");
  }

  const deliveredAt = new Date();
  const recipients = existingConversation.participants
    .filter((participantId) => participantId.toString() !== senderId.toString())
    .map((userId) => ({ user: userId, deliveredAt }));

  const newMessage = await Message.create({
    conversation: existingConversation._id,
    sender: senderId,
    type: "text",
    text: text.trim(),
    deliveredTo: recipients,
  });

  await Conversation.findByIdAndUpdate(existingConversation._id, {
    lastMessage: newMessage._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message sent"));
});


export const deleteMessage = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const conversationId = req.params?.conversationId ?? req.body?.conversationId;
  const messageId = req.params?.messageId ?? req.body?.messageId;

  if (!userId) throw new ApiError(401, "Unauthorized request");
  if (!conversationId) throw new ApiError(400, "Conversation ID is required");
  if (!messageId) throw new ApiError(400, "Message ID is required");

  const existingMessage = await Message.findOne({
    _id: messageId,
    conversation: conversationId,
  });

  if (!existingMessage) throw new ApiError(404, "Message not found");
  if (existingMessage.sender.toString() !== userId.toString()) {
    throw new ApiError(403, "Only the sender can delete this message");
  }

  const existingConversation = await Conversation.findById(conversationId);
  if (!existingConversation) throw new ApiError(404, "Conversation not found");

  const update = {
    text: null,
    attachment: null,
    deletedForEveryone: true,
  };

  if (existingConversation.type === "direct") {
    update.deletedFor = existingMessage.deliveredTo.map(({ user }) => user);
  }

  const deletedMessage = await Message.findOneAndUpdate(
    { _id: messageId, conversation: conversationId, sender: userId },
    { $set: update },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, deletedMessage, "Message deleted for everyone"));
});


export const readMessage = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const conversationId = req.params?.conversationId ?? req.body?.conversationId;
  const messageId = req.params?.messageId ?? req.body?.messageId;

  if (!userId) throw new ApiError(401, "Unauthorized request");
  if (!conversationId) throw new ApiError(400, "Conversation ID is required");
  if (!messageId) throw new ApiError(400, "Message ID is required");

  const existingConversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!existingConversation) {
    throw new ApiError(404, "Conversation not found or user is not a participant");
  }
  if (existingConversation.type !== "group") {
    throw new ApiError(400, "Read receipts are only handled here for group conversations");
  }

  const existingMessage = await Message.findOne({
    _id: messageId,
    conversation: existingConversation._id,
  });
  if (!existingMessage) throw new ApiError(404, "Message not found");

  const readAt = new Date();
  const receipt = existingMessage.readBy.find(
    ({ user }) => user.toString() === userId.toString()
  );

  if (receipt) {
    receipt.readAt = readAt;
  } else {
    existingMessage.readBy.push({ user: userId, readAt });
  }

  await existingMessage.save();

  return res
    .status(200)
    .json(new ApiResponse(200, existingMessage, "Message marked as read"));
});
