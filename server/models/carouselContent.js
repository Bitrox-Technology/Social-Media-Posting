import mongoose from "mongoose";

const carouselContentSchema = new mongoose.Schema({ 
    postContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostContent"
    },
    templateId: { type: String, trim: true },
    content: [
        {
          tagline: { type: String, trim: true },
          title: { type: String, trim: true},
          description: { type: String, trim: true},
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
