import mongoose from "mongoose";

const postContentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    topics: { 
        type: [String]
    }
}, {timestamp: true });

const PostContent = mongoose.model("PostContent", postContentSchema);
export default PostContent;