import mongoose from 'mongoose'
import { BILLING_TYPES, PAYMENT_STATUS_TYPES, PLAN_TITLE_TYPES } from '../config/constant.js';


const paymentSchema = new mongoose.Schema({
    transactionId: { type: String, unique: true, index: true, },
    merchantOrderId: { type: String, },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        index: true,
    },
    amount: { type: Number, min: 1, },
    planTitle: {
        type: String,
        enum: PLAN_TITLE_TYPES,
    },
    billing: {
        type: String,
        enum: BILLING_TYPES,
    },
    phone: { type: String, },
    name: { type: String, minlength: 2, },
    email: { type: String },
    status: {
        type: String,
        enum: PAYMENT_STATUS_TYPES,
        default: 'PENDING',
    },
    paymentDetails: {
        type: Object,
        default: {},
    },

}, { timestamps: true });

paymentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment