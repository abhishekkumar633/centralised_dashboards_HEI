import { Router } from 'express';
import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

const STATUSES = ['Applied', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'];

router.get(
  '/',
  protect,
  asyncHandler(async (_req, res) => {
    const applications = await Application.find().sort({ appliedAt: -1 }).lean();
    res.json({ applications });
  })
);

router.get(
  '/student/:email',
  protect,
  asyncHandler(async (req, res) => {
    const email = req.params.email.trim().toLowerCase();
    if (req.user.role === 'student' && req.user.email !== email) {
      return res.status(403).json({ message: 'You can only view your own applications.' });
    }
    const applications = await Application.find({ studentEmail: email }).sort({ appliedAt: -1 }).lean();
    res.json({ applications });
  })
);

router.patch(
  '/:id',
  protect,
  authorize('recruiter'),
  asyncHandler(async (req, res) => {
    const newStatus = req.body?.status;
    if (!STATUSES.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid application status.' });
    }
    const application = await Application.findOne({ id: req.params.id });
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const job = await Job.findOne({ id: application.jobId });
    if (!job || job.postedBy !== req.user.email) {
      return res.status(403).json({ message: 'You can only update applicants for your postings.' });
    }

    application.status = newStatus;
    await application.save();
    res.json({ application: application.toObject({ versionKey: false }) });
  })
);

export default router;
