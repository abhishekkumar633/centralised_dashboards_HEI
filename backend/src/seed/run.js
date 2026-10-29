import '../config/env.js';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { seedUsers, seedActivities, seedJobs, seedApplications } from './data.js';
import mongoose from 'mongoose';

async function seed() {
  await connectDB();
  const force = process.argv.includes('--force');
  const existing = await User.countDocuments();

  if (existing > 0 && !force) {
    console.log(`Database already has ${existing} users. Skipping seed (use --force to reset).`);
    await mongoose.disconnect();
    return;
  }

  if (force) {
    await Promise.all([
      User.deleteMany({}),
      Activity.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
    ]);
  }

  for (const user of seedUsers) {
    await User.create(user);
  }
  await Activity.insertMany(seedActivities);
  await Job.insertMany(seedJobs);
  await Application.insertMany(seedApplications);

  console.log(
    `Seeded ${seedUsers.length} users, ${seedActivities.length} activities, ${seedJobs.length} jobs, ${seedApplications.length} applications.`
  );
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
