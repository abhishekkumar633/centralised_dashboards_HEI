import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    studentEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    type: { type: String, enum: ['approved', 'rejected', 'info'], default: 'info' },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    activityId: { type: String, default: null },
    createdAt: { type: String, default: () => new Date().toISOString() },
    read: { type: Boolean, default: false },
  },
  { timestamps: false }
);

export const Notification = mongoose.model('Notification', notificationSchema);
