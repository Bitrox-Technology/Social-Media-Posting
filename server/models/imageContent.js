import mongoose from "mongoose";
import { POST_STATUS_ENUM } from "../config/constant.js";

const imageContentSchema = new mongoose.Schema({
    postContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostTopic"
    },
    templateId: { type: String, trim: true },
    content: {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        footer: { type: String, trim: true },
        websiteUrl: { type: String, trim: true },
        imageUrl: { type: String, trim: true },
    },
    hashtags: {
        type: [String],
        default: [],
    },
    topic: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: POST_STATUS_ENUM,
        default: "pending",
    },
     
}, {timestamps: true });

imageContentSchema.index({ postContentId: 1 }); 
imageContentSchema.index({ templateId: 1 }); 
imageContentSchema.index({ status: 1 }); 
imageContentSchema.index({ topic: 1 }); 
imageContentSchema.index({ hashtags: 1 }); 
imageContentSchema.index({ createdAt: 1 }); 
imageContentSchema.index({ updatedAt: 1 }); 

// Compound indexes
imageContentSchema.index({ status: 1, postContentId: 1 }); 
imageContentSchema.index({ topic: 1, createdAt: 1 });

const ImageContent = mongoose.model("ImageContent", imageContentSchema);
export default ImageContent;