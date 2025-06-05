import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: { type: String, trim: true, },
    content: { type: String, trim: true, },
    metaDescription: { type: String, trim: true, },
    excerpt: { type: String, trim: true, },
    focusKeyword: { type: String, trim: true, },
    slug: { type: String, trim: true, unique: true, },
    categories: { type: [String], },
    tags: { type: [String], },
    imageUrl: { type: String, trim: true, },
    imageAltText: { type: String, trim: true, },
    imageDescription: {
        type: String,
        trim: true,
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


blogSchema.index({ title: 'text', content: 'text', metaDescription: 'text', focusKeyword: 'text' });
blogSchema.index({ userId: 1, createdAt: -1 }); // For user-specific queries and sorting

blogSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;