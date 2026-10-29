import { Router } from 'express';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const email =
      req.user.role === 'student'
        ? req.user.email
        : (req.query.studentEmail || '').trim().toLowerCase();
    if (!email) return res.json({ notifications: [] });
    const notifications = await Notification.find({ studentEmail: email })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ notifications });
  })
);

router.patch(
  '/:id/read',
  protect,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ id: req.params.id });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (req.user.role === 'student' && notification.studentEmail !== req.user.email) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    notification.read = true;
    await notification.save();
    res.json({ notification: notification.toObject({ versionKey: false }) });
  })
);

router.patch(
  '/read-all',
  protect,
  asyncHandler(async (req, res) => {
    const email = req.user.role === 'student' ? req.user.email : (req.body?.studentEmail || '').trim().toLowerCase();
    if (!email) return res.json({ updated: 0 });
    const result = await Notification.updateMany({ studentEmail: email, read: false }, { $set: { read: true } });
    res.json({ updated: result.modifiedCount });
  })
);

export default router;
