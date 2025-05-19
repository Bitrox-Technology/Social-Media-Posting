import mongoose from "mongoose";
import { POST_STATUS_ENUM } from "../config/constant.js";

const dykContentSchema = new mongoose.Schema({
    postContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostTopic"
    },
    templateId: { type: String, trim: true },
    content: {
        title: { type: String, trim: true },
        fact: { type: String, trim: true },
    },
    topic: {
        type: String,
        trim: true
    },
    hashtags: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: POST_STATUS_ENUM,
        default: "pending",
    },

}, { timestamps: true });
dykContentSchema.index({ postContentId: 1 }); 
dykContentSchema.index({ templateId: 1 }); 
dykContentSchema.index({ status: 1 }); 
dykContentSchema.index({ topic: 1 }); 
dykContentSchema.index({ hashtags: 1 }); 
dykContentSchema.index({ createdAt: 1 }); 
dykContentSchema.index({ updatedAt: 1 }); 

// Compound indexes
dykContentSchema.index({ status: 1, postContentId: 1 });
dykContentSchema.index({ topic: 1, createdAt: 1 });

const DYKContent = mongoose.model("DYKContent", dykContentSchema);
export default DYKContent;