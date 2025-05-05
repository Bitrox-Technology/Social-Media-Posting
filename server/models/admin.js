import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        username: { type: String, default: "", trim: true },
        email: { type: String, trim: true, unique: true, lowercase: true },
        countryCode: { type: String, trim: true, default: "" },
        phone: { type: String, trim: true, default: "" },
        profileImage: { type: String, trim: true },
        location: { type: String, default: "" },
        isProfileCompleted: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["ADMIN", "USER", ""],
            default: "ADMIN",
        },
        password: {
            type: String,
            select: false,
        },
        
        isEmailVerify: { type: Boolean, default: false },
        isPhoneVerify: { type: Boolean, default: false },
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

const Admin = mongoose.model("Admin", adminSchema)
export default Admin;