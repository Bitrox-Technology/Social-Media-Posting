import mongoose from 'mongoose';
import { POST_STATUS_ENUM, PRODUCT_POST_TYPE_ENUM } from '../config/constant';
const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productName: { type: String, trim: true, minlength: 1, },
    imagesUrl: { type: String, trim: true, },
    contentType: {type: 'ProductContent', trim: true },
    postTypes: { type: [String], enum: PRODUCT_POST_TYPE_ENUM, default: 'newProduct' },
    productContent: {
        title: { type: String, trim: true, minlength: 1, },
        description: { type: String, trim: true, minlength: 1, },
        footer: { type: String, trim: true, minlength: 1, },
        websiteUrl: { type: String, trim: true, minlength: 1, },
    },
    discount: {
        percentage: { type: Number, min: 1, max: 100, },
        description: { type: String, trim: true, minlength: 1 },
    },
    flashSale: {
        offer: { type: String, trim: true, minlength: 1, },
        validUntil: { type: String, trim: true, minlength: 1 },
    },
    schedule: {
        fromDate: { type: String, trim: true },
        toDate: { type: String, trim: true },
        time: { type: String, trim: true, },
    },
    status: {
        type: String,
        enum: POST_STATUS_ENUM,
        default: 'pending',
    },

}, {
    timestamps: true,
});

productSchema.index({ userId: 1 });
productSchema.index({ productName: 1 });
productSchema.index({ postTypes: 1 });
productSchema.index({ createdAt: 1 });
productSchema.index({ updatedAt: 1 });
productSchema.index({ schedule: 1 });
productSchema.index({ schedule: 1, fromDate: 1 });
productSchema.index({ schedule: 1, toDate: 1 });
productSchema.index({ schedule: 1, time: 1 });
productSchema.index({ postTypes: 1, userId: 1 });
const Product = mongoose.model('Product', productSchema);

export default Product;