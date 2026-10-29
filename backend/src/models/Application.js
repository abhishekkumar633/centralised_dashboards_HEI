import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    jobId: { type: String, required: true, index: true },
    studentEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    studentName: { type: String, default: 'Applicant' },
    appliedAt: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'],
      default: 'Applied',
    },
    matchScore: { type: Number, default: 0 },
    snapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, studentEmail: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);
