import mongoose from "mongoose";

const socialAuthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  facebook: {
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      token: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    profilePage: {
      type: String,
    },
    profileData: {
      type: Object,
    },
  },
  linkedin: {
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      token: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    profilePage: {
      type: String,
    },
    profileData: {
      type: Object,
    },
  },
  instagram: {
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      token: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    profilePage: {
      type: String,
    },
    profileData: {
      type: Object,
    },
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
socialAuthSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries on userId
socialAuthSchema.index({ userId: 1 }, { unique: true });

const SocialAuth = mongoose.model('SocialAuth', socialAuthSchema);

export default SocialAuth;