import mongoose from 'mongoose';

const savePostsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'contentType',
    },
    contentType: {
        type: String,
        enum: ['ImageContent', 'CarouselContent', 'DYKContent'],
    },
    postContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostContent',
    },
    topic: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: ['image', 'carousel', 'doyouknow'],
    },
    status: {
        type: String,
        enum: ['pending', 'error', 'success'],
        default: 'success',
    },
    images: [
        {
            url: { type: String, required: true },
            label: { type: String, required: true },
        },
    ],
}, { timestamps: true });
const SavePosts = mongoose.model('SavePosts', savePostsSchema);

export default SavePosts;