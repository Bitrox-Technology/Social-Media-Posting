import mongoose from "mongoose";

const postContentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    topics: { 
        type: [String]
    },
    status: {
        type: String,
        enum: ["pending", "error", "success"],
        default: "pending",
    },
}, {timestamp: true });

const PostContent = mongoose.model("PostContent", postContentSchema);
export default PostContent;