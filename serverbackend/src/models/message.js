const messageSchema = new Schema(
  {
    conversation: {type: Schema.Types.ObjectId,ref: "Conversation",required: true,},
    sender: {type: Schema.Types.ObjectId,ref: "User",required: true,},
    type: {type: String,enum: ["text", "image", "video", "audio", "document"],default: "text",required: true, },
    text: { type: String, trim: true,},
    attachment: { url: String, publicId: String,  fileName: String, mimeType: String, size: Number,  },
    replyTo: { type: Schema.Types.ObjectId, ref: "Message", default: null, },
    deliveredTo: [{ user: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        deliveredAt: { type: Date, default: Date.now, }, }, ],
    readBy: [{ user: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        readAt: { type: Date, default: Date.now,  }, }, ],
    editedAt: { type: Date, default: null, },
    deletedForEveryone: { type: Boolean, default: false,},
    deletedFor: [{ type: Schema.Types.ObjectId, ref: "User",},],
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: -1, _id: -1,});

export const Message = mongoose.model("Message", messageSchema);