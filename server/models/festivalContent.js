import mongoose from "mongoose";

const festivalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    contentType: { type: String, default: 'FestivalContent', trim: true },
    festivalName: { type: String, trim: true },
    description: { type: String, trim: true },
    festivalDate: { type: String },
    imageUrl: { type: String, trim: true },
    colors: { type: Object, default: {} },
}, { timestamps: true });

const FestivalContent = mongoose.model("FestivalContent", festivalSchema);
export default FestivalContent;