import mongoose from 'mongoose';
import { BILLING_TYPES, PLAN_TITLE_TYPES, SUBSCRIPTION_STATUS_TYPES } from '../config/constant.js';

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    planTitle: {
        type: String,
        enum: PLAN_TITLE_TYPES,
    },
    billing: {
        type: String,
        enum: BILLING_TYPES,
    },
    amount: { type: Number, min: 1, },
    status: {
        type: String,
        enum: SUBSCRIPTION_STATUS_TYPES,
        default: 'PENDING',
    },
    transactionId: { type: String, index: true, },
    startDate: { type: Date, },
    expiryDate: { type: Date, index: true, },

}, { timestamps: true });

subscriptionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;