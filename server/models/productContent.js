import mongoose from "mongoose"

const ProductContentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  productName: { type: String, trim: true},
  description: { type: String, trim: true, },
  images: {
    type: [String], 
  },
  postTypes: {
    type: [String],
    enum: ['discount', 'flashSale', 'product'],
    default: 'product'
  },
  discount: {
    percentage: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  flashSale: {
    offer: {
      type: String,
      trim: true,
    },
    validUntil: {
      type: String,
      trim: true,
    },
  },
  
}, { timestamps: true});

const ProductContent = mongoose.model("ProductContent", ProductContentSchema);

export default ProductContent;  