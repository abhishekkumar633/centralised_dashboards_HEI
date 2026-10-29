import { Router } from 'express';
import { User } from '../models/User.js';
import { protect, signToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

const ADMIN_CODE = () => process.env.ADMIN_ACCESS_CODE || 'JK-HEI-2025-ADMIN';

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const {
      role,
      email,
      password,
      fullName,
      institution,
      enrollmentNo,
      companyName,
      adminAccessCode,
    } = req.body || {};

    if (!role || !['student', 'recruiter', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'A valid role is required.' });
    }
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (!fullName?.trim()) {
      return res.status(400).json({ message: 'Full name is required for registration.' });
    }
    if (role === 'student' && (!enrollmentNo?.trim() || !institution?.trim())) {
      return res.status(400).json({ message: 'Enrollment number and institution are required for students.' });
    }
    if (role === 'recruiter' && !companyName?.trim()) {
      return res.status(400).json({ message: 'Company name is required for recruiter registration.' });
    }
    if (role === 'admin') {
      if (!institution?.trim()) {
        return res.status(400).json({ message: 'Institution is required for admin registration.' });
      }
      if (String(adminAccessCode || '').trim() !== ADMIN_CODE()) {
        return res.status(403).json({ message: 'Invalid admin access code.' });
      }
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists. Please log in.' });
    }

    const studentId = role === 'student' ? `STU-${Date.now().toString().slice(-6)}` : '';
    const user = await User.create({
      email: email.trim().toLowerCase(),
      password,
      role,
      name: fullName.trim(),
      institution: institution?.trim() || '',
      enrollmentNo: enrollmentNo?.trim() || '',
      company: companyName?.trim() || '',
      studentId,
      portfolioUrl: studentId ? `https://skillvault.app/verify/${studentId}` : '',
      verifiedScore: role === 'student' ? 70 : 0,
    });

    const token = signToken(user);
    res.status(201).json({ token, user: user.toClient() });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password, role } = req.body || {};
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Please fill in both email and password.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as ${user.role}. Switch the role tab and try again.`,
      });
    }

    const token = signToken(user);
    res.json({ token, user: user.toClient() });
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user.toClient() });
  })
);

export default router;
