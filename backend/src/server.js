import './config/env.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import activityRoutes from './routes/activities.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import notificationRoutes from './routes/notifications.js';
import storageRoutes from './routes/storage.js';
import verifyRoutes from './routes/verify.js';
import { notFound, errorHandler } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin, credentials: true }));
app.use(express.json({ limit: '12mb' }));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.get('/api/v1/health', (_req, res) => {
  res.json({ ok: true, service: 'skillvault-api' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/storage', storageRoutes);
app.use('/api/v1/verify', verifyRoutes);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`SkillVault API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
