import mongoose, { Schema } from "mongoose";

const TypingStatusSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  lastTypedAt: { type: Date, default: Date.now },
});

export const TypingStatus =
  mongoose.models.TypingStatus ||
  mongoose.model("TypingStatus", TypingStatusSchema);
