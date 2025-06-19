import mongoose from 'mongoose';
import { PLATFORM_ENUM, SCHEDULE_STATUS_ENUM } from '../config/constant.js'; // Adjust path as needed

const scheduleTaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    taskId: {
      type: String,
      trim: true,
      unique: true, // Unique identifier for the task
    },
    task: {
      type: String,
      trim: true, // Description of the task
    },
    platform: {
      type: String,
      enum: PLATFORM_ENUM,
      default: 'linkedin',
    },
    imagesUrl: {
      type: [String],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    scheduleTime: {
      type: Date,
      required: true,
    },
    cronExpression: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: SCHEDULE_STATUS_ENUM,
      default: 'pending',
    },
    postId: {
      type: String,
      trim: true, // LinkedIn post ID after execution
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


scheduleTaskSchema.index({ userId: 1 }); // Index for userId
scheduleTaskSchema.index({ platform: 1, scheduleTime: 1 }); // Index for platform and scheduleTime
const UserScheduledTask = mongoose.model('UserScheduledTask', scheduleTaskSchema);
export default UserScheduledTask;