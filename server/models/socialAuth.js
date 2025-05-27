import mongoose from "mongoose";

const socialAuthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  platform: {
    type: String,
    enum: ['linkedin'], 
    required: true,
    default: 'linkedin',
  },
  accessToken: {
    type: String,
    required: true,
  },
  profileData: {
    type: Object, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the `updatedAt` timestamp before saving
linkedInAuthSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const SocialAuth = mongoose.model('SocialAuth', socialAuthSchema);