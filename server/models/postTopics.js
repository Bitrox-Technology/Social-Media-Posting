import mongoose from "mongoose";
import { POST_STATUS_ENUM } from "../config/constant.js";

const postTopicsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    topicSetId: {
      type: String,
      unique: true, 
    },
    topics: { 
        type: [String]
    },
    status: {
        type: String,
        enum: POST_STATUS_ENUM,
        default: "pending",
    },
}, {timestamps: true });

postTopicsSchema.index({ userId: 1 }); 
postTopicsSchema.index({ status: 1 }); 
postTopicsSchema.index({ topics: 1 });
postTopicsSchema.index({ createdAt: 1 }); 
postTopicsSchema.index({ updatedAt: 1 }); 

// Compound indexes
postTopicsSchema.index({ status: 1, userId: 1 }); 
postTopicsSchema.index({ topics: 1, createdAt: 1 });

const PostTopic = mongoose.model("PostTopic", postTopicsSchema);
export default PostTopic;