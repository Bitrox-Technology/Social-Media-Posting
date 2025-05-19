import mongoose from 'mongoose';
import { CONTENT_TYPE_ENUM, POST_STATUS_ENUM, POST_TYPE_ENUM } from '../config/constant.js';

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
        enum: CONTENT_TYPE_ENUM,
    },
    postContentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostTopic',
    },
    topic: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: POST_TYPE_ENUM,
    },
    status: {
        type: String,
        enum: POST_STATUS_ENUM,
        default: 'success',
    },
    images: [
        {
            url: { type: String, required: true },
            label: { type: String, required: true },
        },
    ],
}, { timestamps: true });


savePostsSchema.index({ userId: 1 }); 
savePostsSchema.index({ contentId: 1 }); 
savePostsSchema.index({ contentType: 1 }); 
savePostsSchema.index({ postContentId: 1 }); 
savePostsSchema.index({ status: 1 }); 
savePostsSchema.index({ topic: 1 });
savePostsSchema.index({ type: 1 }); 
savePostsSchema.index({ createdAt: 1 }); 
savePostsSchema.index({ updatedAt: 1 });

// Compound indexes
savePostsSchema.index({ userId: 1, status: 1 }); 
savePostsSchema.index({ contentType: 1, contentId: 1 }); 
savePostsSchema.index({ topic: 1, createdAt: 1 });

const SavePosts = mongoose.model('SavePosts', savePostsSchema);
export default SavePosts;