import mongoose from "mongoose";
import { ROLE_ENUM } from "../config/constant.js";

const adminSchema = new mongoose.Schema(
    {
        username: { type: String, default: "", trim: true },
        email: { type: String, trim: true, unique: true, lowercase: true },
        countryCode: { type: String, trim: true, default: "" },
        phone: { type: String, trim: true, default: "" },
        profileImage: { type: String, trim: true },
        location: { type: String, default: "" },
        bio: { type: String, default: "" },
        website: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        isProfileCompleted: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ROLE_ENUM,
            default: "ADMIN",
        },
        password: {
            type: String,
            select: false,
        },

        isEmailVerify: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        totalUsers: { type: Number, default: 0 },

        refreshToken: { type: String, select: false }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

adminSchema.index({ role: 1 }); 
adminSchema.index({ isDeleted: 1 });
adminSchema.index({ isEmailVerify: 1 }); 
adminSchema.index({ totalUsers: 1 }); 
adminSchema.index({ createdAt: 1 }); 
adminSchema.index({ updatedAt: 1 }); 

// Compound indexes
adminSchema.index({ role: 1, isDeleted: 1 });

const Admin = mongoose.model("Admin", adminSchema)
export default Admin;