import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, default: "", trim: true },
        lastName: { type: String, default: "", trim: true },
        email: { type: String, trim: true, unique: true, lowercase: true },
        countryCode: { type: String, trim: true, default: "" },
        phone: { type: String, trim: true, default: "" },
        avatar: { type: String, trim: true, default: "" },
        location: { type: String, default: "" },
        isProfileCompleted: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["ADMIN", "USER", ""],
            default: "USER",
        },
        password: {
            type: String,
            select: false,
        },
        isEmailVerify: { type: Boolean, default: false },
        isPhoneVerify: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },

        refreshToken: { type: String, select: false }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

const User = mongoose.model("User", userSchema)
export default User;