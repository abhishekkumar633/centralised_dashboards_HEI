import { Router } from 'express';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { publicId } from '../utils/hash.js';
import { addDays, isPastDeadline, todayISO } from '../utils/dates.js';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (_req, res) => {
    const jobs = await Job.find().sort({ postedAt: -1 }).lean();
    res.json({ jobs });
  })
);

router.get(
  '/recruiter/:email',
  protect,
  asyncHandler(async (req, res) => {
    const email = req.params.email.trim().toLowerCase();
    if (req.user.role === 'recruiter' && req.user.email !== email) {
      return res.status(403).json({ message: 'You can only view your own postings.' });
    }
    const jobs = await Job.find({ postedBy: email }).sort({ postedAt: -1 }).lean();
    res.json({ jobs });
  })
);

router.post(
  '/',
  protect,
  authorize('recruiter'),
  asyncHandler(async (req, res) => {
    const jobData = req.body || {};
    const today = todayISO();
    const job = await Job.create({
      id: publicId('job'),
      title: jobData.title?.trim() || 'Untitled Role',
      company: jobData.company?.trim() || req.user.company || 'SkillVault Partner',
      location: jobData.location?.trim() || 'Remote',
      type: jobData.type || 'Full-time',
      mode: jobData.mode || 'Hybrid',
      stipendOrSalary: jobData.stipendOrSalary?.trim() || 'Competitive',
      description: jobData.description?.trim() || '',
      requiredSkills: Array.isArray(jobData.requiredSkills) ? jobData.requiredSkills : [],
      preferredSkills: Array.isArray(jobData.preferredSkills) ? jobData.preferredSkills : [],
      minVerifiedActivities: Number(jobData.minVerifiedActivities) || 1,
      deadline: jobData.deadline || addDays(today, 30),
      postedBy: req.user.email,
      postedAt: today,
      status: 'Open',
    });
    res.status(201).json({ job: job.toObject({ versionKey: false }) });
  })
);

router.patch(
  '/:id/close',
  protect,
  authorize('recruiter'),
  asyncHandler(async (req, res) => {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy !== req.user.email) {
      return res.status(403).json({ message: 'You can only close your own postings.' });
    }
    job.status = 'Closed';
    await job.save();
    res.json({ job: job.toObject({ versionKey: false }) });
  })
);

router.patch(
  '/:id/reopen',
  protect,
  authorize('recruiter'),
  asyncHandler(async (req, res) => {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy !== req.user.email) {
      return res.status(403).json({ message: 'You can only reopen your own postings.' });
    }
    job.status = 'Open';
    if (isPastDeadline(job.deadline)) {
      job.deadline = addDays(todayISO(), 30);
    }
    await job.save();
    res.json({ job: job.toObject({ versionKey: false }) });
  })
);

router.post(
  '/:id/apply',
  protect,
  authorize('student'),
  asyncHandler(async (req, res) => {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status === 'Closed') {
      return res.status(409).json({ message: 'This vacancy is closed.' });
    }
    if (job.status !== 'Open' && isPastDeadline(job.deadline)) {
      return res.status(409).json({ message: 'The application deadline has expired.' });
    }

    const existing = await Application.findOne({
      jobId: job.id,
      studentEmail: req.user.email,
    });
    if (existing) {
      return res.status(200).json({
        success: false,
        isDuplicate: true,
        application: existing.toObject({ versionKey: false }),
      });
    }

    const body = req.body || {};
    const application = await Application.create({
      id: publicId('app'),
      jobId: job.id,
      studentEmail: req.user.email,
      studentName: req.user.name,
      appliedAt: todayISO(),
      status: 'Applied',
      matchScore: Math.round(Number(body.matchScore) || 0),
      snapshot: body.snapshot || {
        name: req.user.name,
        email: req.user.email,
        institution: req.user.institution,
        verifiedScore: req.user.verifiedScore,
        verifiedSkills: body.verifiedSkills || [],
        approvedActivities: body.approvedActivities || [],
      },
    });

    res.status(201).json({
      success: true,
      application: application.toObject({ versionKey: false }),
    });
  })
);

router.get(
  '/:id/applications',
  protect,
  asyncHandler(async (req, res) => {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (req.user.role === 'recruiter' && job.postedBy !== req.user.email) {
      return res.status(403).json({ message: 'You can only view applicants for your postings.' });
    }
    const applications = await Application.find({ jobId: job.id }).sort({ matchScore: -1 }).lean();
    res.json({ applications });
  })
);

export default router;
