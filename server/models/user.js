import mongoose from "mongoose";
import { PROVIDER_ENUM, ROLE_ENUM} from "../config/constant.js";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, default: '', trim: true },
    email: { type: String, trim: true, unique: true, lowercase: true },
    countryCode: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    location: { type: String, default: '' },
    logo: { type: String, default: '' },
    companyName: { type: String, default: '' },
    productCategories: {
      type: [
        {
          category: { type: String, trim: true },
          productName: { type: String, trim: true },
          image: { type: String, trim: true, default: '' },
        },
      ],
      default: [],
    },
    services: {
      type: [{ type: String, trim: true, maxlength: 50 }],
      default: []
    },
    keyProducts: {
      type: [{ type: String, trim: true, maxlength: 100 }],
      default: []
    },
    targetMarket: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    isProfileCompleted: { type: Boolean, default: false },
    role: { type: String, enum: ROLE_ENUM, default: 'USER' },
    bio: { type: String, default: '' },
    password: { type: String, select: false, default: "" },
    provider: { type: String, enum: PROVIDER_ENUM, default: '' },
    uid: { type: String, trim: true, default: "" },
    isEmailVerify: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    uniqueIdentifier: {type: String, default: ""}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ uid: 1 });
userSchema.index({ status: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ isBlocked: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: 1 });
userSchema.index({ updatedAt: 1 });

// Compound indexes
userSchema.index({ status: 1, isDeleted: 1 });
userSchema.index({ role: 1, isBlocked: 1 });
userSchema.index({ email: 1, isDeleted: 1 }, { unique: true }); // Unique index for email with isDeleted

const User = mongoose.model("User", userSchema)
export default User;