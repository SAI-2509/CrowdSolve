import mongoose from "mongoose";

const homeZoneSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["citizen", "authority"],
      default: "citizen"
    },
    avatarUrl: { type: String, default: "" },
    area: { type: String, default: "" },
    city: { type: String, default: "" },
    neighborhood: { type: String, default: "" },
    homeZone: { type: homeZoneSchema, required: true },
    contributionPoints: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
