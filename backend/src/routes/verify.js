import { Router } from 'express';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

router.get(
  '/:studentId',
  asyncHandler(async (req, res) => {
    const user = await User.findOne({
      $or: [{ studentId: req.params.studentId }, { email: req.params.studentId.toLowerCase() }],
    });
    if (!user || user.role !== 'student') {
      return res.status(404).json({ message: 'Verified portfolio not found' });
    }
    const activities = await Activity.find({
      studentEmail: user.email,
      status: 'Approved',
    })
      .sort({ date: -1 })
      .lean();

    res.json({
      student: user.toClient(),
      approvedActivities: activities,
    });
  })
);

export default router;
