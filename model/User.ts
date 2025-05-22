import { UserRole } from "@/constants/enum";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    lastSeenAt: { type: Date, default: Date.now }, // For presence
    // Optionally cache conversations here (denormalized)
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    conversations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
