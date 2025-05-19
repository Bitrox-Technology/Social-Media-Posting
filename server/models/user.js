import mongoose from "mongoose";
import { PLATFORM_ENUM, PROVIDER_ENUM, ROLE_ENUM, SCHEDULE_STATUS_ENUM, STATUS_ENUM, SUBSCRIPTION_ENUM } from "../config/constant.js";

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
    subscription: { type: String, enum: SUBSCRIPTION_ENUM, default: 'FREE' },
    status: { type: String, enum: STATUS_ENUM, default: 'ACTIVE' },
    bio: { type: String, default: '' },
    password: { type: String, select: false, default: "" },
    provider: { type: String, enum: PROVIDER_ENUM, default: '' },
    uid: { type: String, trim: true, default: "" },
    userScheduledPosts: {
      type: [
        {
          taskId: { type: String, required: true }, // Unique ID for the scheduled task
          platform: { type: String, enum: PLATFORM_ENUM, default: 'linkedin' },
          imageUrl: { type: String, trim: true },
          filePath: { type: String, trim: true }, // Local path of downloaded image
          title: { type: String, trim: true },
          description: { type: String, trim: true },
          scheduleTime: { type: Date, required: true },
          cronExpression: { type: String, trim: true },
          status: { type: String, enum: SCHEDULE_STATUS_ENUM, default: 'pending' },
          postId: { type: String, trim: true }, // LinkedIn post ID after execution
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    isEmailVerify: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: String, select: false },
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

// Indexes for userScheduledPosts array
userSchema.index({ "userScheduledPosts.scheduleTime": 1 }); 
userSchema.index({ "userScheduledPosts.status": 1 }); 
userSchema.index({ "userScheduledPosts.platform": 1 }); 

// Compound indexes
userSchema.index({ status: 1, isDeleted: 1 }); 
userSchema.index({ "userScheduledPosts.platform": 1, "userScheduledPosts.scheduleTime": 1 });

const User = mongoose.model("User", userSchema)
export default User;