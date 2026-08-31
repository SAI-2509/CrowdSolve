import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    body: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const updateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Reported", "Verified", "Assigned", "Fixed", "Resolved"],
      required: true
    },
    note: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    mediaUrl: { type: String, default: "" },
    locationName: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    area: { type: String, default: "" },
    city: { type: String, default: "" },
    neighborhood: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    },
    authorityFlagged: { type: Boolean, default: false },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    votesCount: { type: Number, default: 0 },
    comments: [commentSchema],
    updates: [updateSchema],
    resultPhotoUrl: { type: String, default: "" },
    urgencyScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

issueSchema.index({ location: "2dsphere" });

export default mongoose.model("Issue", issueSchema);
