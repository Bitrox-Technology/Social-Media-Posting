import mongoose from "mongoose";

const postTopicsSchema = new mongoose.Schema({
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

const PostTopic = mongoose.model("PostTopic", postTopicsSchema);
export default PostTopic;