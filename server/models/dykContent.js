import mongoose from "mongoose";

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
        enum: ["pending", "error", "success"],
        default: "pending",
    },
     
}, {timestamp: true });

const DYKContent = mongoose.model("DYKContent", dykContentSchema);
export default DYKContent;