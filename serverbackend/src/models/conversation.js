import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    type: { type: String, enum: ["direct", "group"], default: "direct", required: true, },
    participants: [ { type: Schema.Types.ObjectId, ref: "User", required: true,},],
    directKey: { type: String, },
    groupName: { type: String, trim: true,},
    groupImage: String,
    admins: [{ type: Schema.Types.ObjectId, ref: "User",}, ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null, },
  },
  { timestamps: true }
);

conversationSchema.index(
  { directKey: 1 },
  { unique: true, partialFilterExpression: {  directKey: { $type: "string" },  }, }
);

conversationSchema.index({ participants: 1, updatedAt: -1 });

export const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);