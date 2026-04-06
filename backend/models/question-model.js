import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String, // AI suggested answer
      required: true,
    },
    userResponse: {
      type: String,
      default: "",
    },
    evaluation: {
      score: {
        type: Number,
        default: 0,
      },
      feedback: {
        type: String,
        default: "",
      },
      perfectAnswer: {
        type: String,
        default: "",
      },
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
