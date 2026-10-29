import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'recruiter', 'admin'], required: true },
    name: { type: String, required: true, trim: true },
    institution: { type: String, default: '' },
    enrollmentNo: { type: String, default: '' },
    company: { type: String, default: '' },
    department: { type: String, default: '' },
    degree: { type: String, default: '' },
    batch: { type: String, default: '' },
    currentSemester: { type: String, default: '' },
    verifiedScore: { type: Number, default: 80 },
    studentId: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    accreditationSummary: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toClient = function toClient() {
  return {
    id: this.studentId || this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    institution: this.institution,
    enrollmentNo: this.enrollmentNo,
    company: this.company,
    department: this.department,
    degree: this.degree,
    batch: this.batch,
    currentSemester: this.currentSemester,
    verifiedScore: this.verifiedScore,
    portfolioUrl: this.portfolioUrl || (this.studentId ? `https://skillvault.app/verify/${this.studentId}` : ''),
    accreditationSummary: this.accreditationSummary,
  };
};

export const User = mongoose.model('User', userSchema);
