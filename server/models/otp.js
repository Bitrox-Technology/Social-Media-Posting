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

otpSchema.index({ email: 1 }); 
otpSchema.index({ otp: 1 }); 

// Compound index
otpSchema.index({ email: 1, otp: 1 }); 
// TTL index on expiredAt to delete documents immediately after expiration (0 seconds delay)
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export default OTP