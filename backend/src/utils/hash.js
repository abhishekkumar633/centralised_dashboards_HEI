import crypto from 'crypto';

export function canonicalJson(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
  }
  const sortedKeys = Object.keys(value).sort();
  const entries = sortedKeys.map(
    (key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`
  );
  return `{${entries.join(',')}}`;
}

export function sha256Hex(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(String(input ?? ''), 'utf8');
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function publicId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
