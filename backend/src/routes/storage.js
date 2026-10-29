import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { publicId } from '../utils/hash.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').slice(0, 8);
    cb(null, `${publicId('file')}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.post(
  '/presigned-url',
  protect,
  authorize('student'),
  asyncHandler(async (req, res) => {
    const { filename, fileType } = req.body || {};
    res.json({
      uploadUrl: '/api/v1/storage/upload',
      method: 'POST',
      filename: filename || 'proof',
      fileType: fileType || 'application/octet-stream',
      note: 'Demo storage: POST the file as multipart field "file" to uploadUrl.',
    });
  })
);

router.post(
  '/upload',
  protect,
  authorize('student'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({
      url,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      size: req.file.size,
    });
  })
);

export default router;
