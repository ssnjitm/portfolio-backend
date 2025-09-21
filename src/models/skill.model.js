import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    description: { type: String, default: "" }, 
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    experience: { type: String, default: "" }, 
    iconUrl: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);