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
          templateImageUrl: { type: String , trim: true},
        },
    ],
    topic: {
        type: String,
        trim: true
    }
}, { timestamp: true });

