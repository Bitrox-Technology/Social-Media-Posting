import mongoose from "mongoose"

const ProductContentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    productName: { type: String, trim: true, minlength: 1 },
    imagesUrl: { type: [String], trim: true, default: [] },
    contentType: { type: String, trim: true, default: 'ProductContent' },
    postTypes: {
      type: [String],
      enum: ['discount', 'flashSale', 'product'],
      default: ['product'],
    },
    description: { type: String, trim: true, minlength: 1 },
    footer: { type: String, trim: true, minlength: 1 },
    websiteUrl: { type: String, trim: true, minlength: 1 },
    price: { type: String, trim: true, minlength: 1 },
    discount: {
      title: { type: String, trim: true, minlength: 1 }, 
      percentage: { type: Number, min: 1, max: 100 },
      description: { type: String, trim: true, minlength: 1 },
    },
    flashSale: {
      title: { type: String, trim: true, minlength: 1 }, 
      offer: { type: String, trim: true, minlength: 1 },
      validUntil: { type: String, trim: true, minlength: 1 },
      pricesStartingAt: { type: String, trim: true, minlength: 1 },
      description: { type: String, trim: true, minlength: 1 },
    },
  },
  {
    timestamps: true,
  }
);

ProductContentSchema.index({ userId: 1 });
ProductContentSchema.index({ productName: 1 });
ProductContentSchema.index({ postTypes: 1 });
ProductContentSchema.index({ createdAt: 1 });
ProductContentSchema.index({ updatedAt: 1 });
ProductContentSchema.index({ schedule: 1 });
ProductContentSchema.index({ schedule: 1, fromDate: 1 });
ProductContentSchema.index({ schedule: 1, toDate: 1 });
ProductContentSchema.index({ schedule: 1, time: 1 });
ProductContentSchema.index({ postTypes: 1, userId: 1 });
const ProductContent = mongoose.model("ProductContent", ProductContentSchema);

export default ProductContent;  