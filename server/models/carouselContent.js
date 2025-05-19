import mongoose from "mongoose";
import { POST_STATUS_ENUM } from "../config/constant.js";

const carouselContentSchema = new mongoose.Schema({
    postContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostTopic"
    },
    templateId: { type: String, trim: true },
    content: [
        {
            tagline: { type: String, trim: true, default: '' },
            title: { type: String, trim: true, default: '' },
            description: { type: String, trim: true, default: '' },
            hashtags: {
                type: [String],
                default: [],
            },
        },
    ],
    topic: {
        type: String,
        trim: true
    },

    status: {
        type: String,
        enum: POST_STATUS_ENUM,
        default: "pending",
    },
}, { timestamps: true });


carouselContentSchema.index({ postContentId: 1 }); 
carouselContentSchema.index({ templateId: 1 }); 
carouselContentSchema.index({ status: 1 }); 
carouselContentSchema.index({ topic: 1 }); 
carouselContentSchema.index({ "content.hashtags": 1 }); 
carouselContentSchema.index({ createdAt: 1 }); 
carouselContentSchema.index({ updatedAt: 1 }); 

// Compound indexes
carouselContentSchema.index({ status: 1, postContentId: 1 }); 
carouselContentSchema.index({ topic: 1, createdAt: 1 });

const CarouselContent = mongoose.model("CarouselContent", carouselContentSchema);
export default CarouselContent;
