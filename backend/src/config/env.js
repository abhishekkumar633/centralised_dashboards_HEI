import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const envPaths = [path.join(backendRoot, '.env'), path.resolve(backendRoot, '../.env')];

function stripWrappingQuotes(value) {
  const trimmed = String(value || '').trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function encodeMongoUriPassword(uri) {
  const match = String(uri || '').match(/^(mongodb(?:\+srv)?:\/\/)([^/@]+):([^@]+)@(.+)$/);
  if (!match) return uri;
  const [, protocol, user, password, rest] = match;
  try {
    const decodedUser = decodeURIComponent(user);
    const decodedPassword = decodeURIComponent(password);
    return `${protocol}${encodeURIComponent(decodedUser)}:${encodeURIComponent(decodedPassword)}@${rest}`;
  } catch {
    return `${protocol}${encodeURIComponent(user)}:${encodeURIComponent(password)}@${rest}`;
  }
}

function applyRawMongoUriFromFile(filePath) {
  if (process.env.MONGODB_URI || process.env.MONGO_URI) return;
  if (!fs.existsSync(filePath)) return;

  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = stripWrappingQuotes(rawLine);
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('mongodb://') || line.startsWith('mongodb+srv://')) {
      process.env.MONGODB_URI = encodeMongoUriPassword(line);
      return;
    }
  }
}

for (const envPath of envPaths) {
  dotenv.config({ path: envPath });
  if (process.env.MONGODB_URI) {
    process.env.MONGODB_URI = encodeMongoUriPassword(stripWrappingQuotes(process.env.MONGODB_URI));
  }
  if (process.env.MONGO_URI) {
    process.env.MONGO_URI = encodeMongoUriPassword(stripWrappingQuotes(process.env.MONGO_URI));
  }
  applyRawMongoUriFromFile(envPath);
}
