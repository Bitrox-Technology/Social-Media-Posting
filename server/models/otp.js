import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: { type: String },
        otp: { type: String, required: true,},
        expiredAt: {
            type: Date,
            default: new Date(),
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600, 
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

const OTP = mongoose.model("OTP", otpSchema);

export  default OTP