import { Router } from 'express';
import { Activity } from '../models/Activity.js';
import { Notification } from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { canonicalJson, sha256Hex, publicId } from '../utils/hash.js';
import { formatDisplayDate, todayISO } from '../utils/dates.js';

const router = Router();

function toActivity(doc) {
  return doc?.toObject ? doc.toObject({ versionKey: false }) : doc;
}

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const filter = req.user.role === 'student' ? { studentEmail: req.user.email } : {};
    const activities = await Activity.find(filter).sort({ submittedAt: -1, createdAt: -1 }).lean();
    res.json({ activities });
  })
);

router.get(
  '/student/:email',
  protect,
  asyncHandler(async (req, res) => {
    const email = req.params.email.trim().toLowerCase();
    if (req.user.role === 'student' && req.user.email !== email) {
      return res.status(403).json({ message: 'You can only view your own activities.' });
    }
    const activities = await Activity.find({ studentEmail: email }).sort({ submittedAt: -1 }).lean();
    res.json({ activities });
  })
);

router.post(
  '/',
  protect,
  authorize('student'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    const date = body.date || todayISO();
    const activity = await Activity.create({
      id: body.id || publicId('act'),
      studentEmail: req.user.email,
      studentName: req.user.name,
      institution: req.user.institution || body.institution || '',
      title: body.title?.trim() || 'Untitled Achievement',
      category: body.category || 'Technical',
      date,
      formattedDate: body.formattedDate || formatDisplayDate(date),
      description: body.description || '',
      skills: Array.isArray(body.skills) ? body.skills : [],
      skillsAwarded: [],
      fileName: body.fileName || 'certificate_proof.pdf',
      fileType: body.fileType || 'pdf',
      fileUrl: body.fileUrl || null,
      fileHash: body.fileHash || null,
      status: 'Pending',
      submittedAt: body.submittedAt || date,
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: null,
      proof: null,
      proofType: body.proofType || '',
      issuer: body.issuer || 'Self-Submitted (Awaiting Dean/HOD Endorsement)',
    });
    res.status(201).json({ activity: toActivity(activity) });
  })
);

router.post(
  '/:id/approve',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const target = await Activity.findOne({ id: req.params.id });
    if (!target) return res.status(404).json({ message: 'Activity not found' });
    if (target.status !== 'Pending') {
      return res.status(409).json({ message: `Activity is already reviewed (${target.status})` });
    }

    const skillsAwarded = Array.isArray(req.body?.skillsAwarded) ? req.body.skillsAwarded : [];
    const adminName = req.body?.adminName || req.user.name;
    const approvedAt = new Date().toISOString();

    const maxDoc = await Activity.findOne({ 'proof.blockNumber': { $ne: null } })
      .sort({ 'proof.blockNumber': -1 })
      .select('proof.blockNumber')
      .lean();
    const nextBlockNumber = (maxDoc?.proof?.blockNumber || 1849220) + 1;

    const canonicalPayload = {
      activityId: target.id,
      approvedAt,
      approvedBy: adminName,
      category: target.category,
      date: target.date,
      description: target.description,
      fileHash: target.fileHash,
      skillsAwarded: skillsAwarded.slice().sort(),
      studentEmail: target.studentEmail,
      title: target.title,
    };
    const proofHash = `0x${sha256Hex(canonicalJson(canonicalPayload))}`;

    target.status = 'Approved';
    target.skillsAwarded = skillsAwarded;
    target.reviewedBy = adminName;
    target.reviewedAt = approvedAt;
    target.rejectionReason = null;
    target.proof = {
      hash: proofHash,
      timestamp: approvedAt,
      blockNumber: nextBlockNumber,
      network: 'Govt. J&K EduLedger PoA (demo)',
    };
    await target.save();

    const skillsText = skillsAwarded.length > 0 ? skillsAwarded.join(', ') : 'Verified Credential';
    await Notification.create({
      id: publicId('notif'),
      studentEmail: target.studentEmail,
      type: 'approved',
      title: 'Achievement Approved',
      message: `Your '${target.title}' was approved. Skills added: ${skillsText}`,
      activityId: target.id,
      createdAt: approvedAt,
      read: false,
    });

    res.json({ activity: toActivity(target) });
  })
);

router.post(
  '/:id/reject',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const target = await Activity.findOne({ id: req.params.id });
    if (!target) return res.status(404).json({ message: 'Activity not found' });
    if (target.status !== 'Pending') {
      return res.status(409).json({ message: `Activity is already reviewed (${target.status})` });
    }

    const reason = String(req.body?.reason || '').trim();
    if (reason.length < 10) {
      return res.status(400).json({ message: 'A rejection reason of at least 10 characters is required.' });
    }

    const adminName = req.body?.adminName || req.user.name;
    const reviewedAt = new Date().toISOString();

    target.status = 'Rejected';
    target.rejectionReason = reason;
    target.reviewedBy = adminName;
    target.reviewedAt = reviewedAt;
    target.proof = null;
    await target.save();

    await Notification.create({
      id: publicId('notif'),
      studentEmail: target.studentEmail,
      type: 'rejected',
      title: 'Achievement Not Verified',
      message: `Your '${target.title}' verification was rejected: ${reason}`,
      activityId: target.id,
      createdAt: reviewedAt,
      read: false,
    });

    res.json({ activity: toActivity(target) });
  })
);

export default router;
