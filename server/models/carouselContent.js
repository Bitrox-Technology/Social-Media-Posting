import mongoose from "mongoose";

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
        enum: ["pending", "error", "success"],
        default: "pending",
    },
}, { timestamp: true });


const CarouselContent = mongoose.model("CarouselContent", carouselContentSchema);
export default CarouselContent;
