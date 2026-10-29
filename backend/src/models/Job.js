import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    company: { type: String, default: 'SkillVault Partner' },
    location: { type: String, default: 'Remote' },
    type: { type: String, default: 'Full-time' },
    mode: { type: String, default: 'Hybrid' },
    stipendOrSalary: { type: String, default: 'Competitive' },
    description: { type: String, default: '' },
    requiredSkills: { type: [String], default: [] },
    preferredSkills: { type: [String], default: [] },
    minVerifiedActivities: { type: Number, default: 1 },
    deadline: { type: String, default: '' },
    postedBy: { type: String, required: true, lowercase: true, trim: true, index: true },
    postedAt: { type: String, default: '' },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
