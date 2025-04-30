import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: { type: String, default: '', trim: true },
        email: { type: String, trim: true, unique: true, lowercase: true },
        countryCode: { type: String, trim: true, default: '' },
        phone: { type: String, trim: true, default: '' },
        location: { type: String, default: '' },
        logo: { type: String, default: '' }, // File path or URL
        companyName: { type: String, default: '' },
        productCategories: {
            type: [
                {
                    category: {
                        type: String,
                        trim: true,
                    },
                    productName: {
                        type: String,
                        trim: true,
                    },
                }
            ],
            default: []
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
        role: { type: String, enum: ['ADMIN', 'USER', ''], default: 'USER' },
        password: { type: String, select: false },
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

const User = mongoose.model("User", userSchema)
export default User;