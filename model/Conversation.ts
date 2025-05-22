import mongoose from "mongoose";
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    readStatus: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        lastReadAt: Date,
        lastReadMessageId: { type: Schema.Types.ObjectId, ref: "Message" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
