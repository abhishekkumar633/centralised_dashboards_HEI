import mongoose from 'mongoose';

const proofSchema = new mongoose.Schema(
  {
    hash: String,
    timestamp: String,
    blockNumber: Number,
    network: String,
  },
  { _id: false }
);

const activitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    studentEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    studentName: { type: String, default: 'Student' },
    institution: { type: String, default: '' },
    title: { type: String, required: true },
    category: { type: String, default: 'Technical' },
    date: { type: String, default: '' },
    formattedDate: { type: String, default: '' },
    description: { type: String, default: '' },
    skills: { type: [String], default: [] },
    skillsAwarded: { type: [String], default: [] },
    fileName: { type: String, default: '' },
    fileType: { type: String, default: 'pdf' },
    fileUrl: { type: String, default: null },
    fileHash: { type: String, default: null },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    submittedAt: { type: String, default: '' },
    reviewedBy: { type: String, default: null },
    reviewedAt: { type: String, default: null },
    rejectionReason: { type: String, default: null },
    proof: { type: proofSchema, default: null },
    proofType: { type: String, default: '' },
    issuer: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Activity = mongoose.model('Activity', activitySchema);
