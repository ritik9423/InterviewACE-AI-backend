import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    role: {
      type: String,
      required: [true, "Target role is required"],
    },
    experience: {
      type: Number,
      required: [true, "Experience level is required"],
    },
    topicsToFocus: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
