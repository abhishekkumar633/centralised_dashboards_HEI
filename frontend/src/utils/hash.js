/**
 * SkillVault Cryptographic Hash Helpers
 * Provides deterministic canonical JSON serialization and SHA-256 hex digest generation
 * using Web Crypto API (window.crypto.subtle).
 *
 * Example 1:
 * canonicalJson({ title: "Hackathon", category: "Technical" })
 * => '{"category":"Technical","title":"Hackathon"}'
 *
 * Example 2:
 * await sha256Hex("SkillVault J&K EduLedger")
 * => 'd46f3cf4a7247348f69a4f9a4baeb0bd76179879671cb505d827b0f7e9880ae6'
 */

/**
 * Returns a canonical JSON representation of any JavaScript value with recursively sorted object keys.
 * This guarantees deterministic serialization for ledger hash computation regardless of key insertion order.
 *
 * @param {*} value - Value to serialize
 * @returns {string} Deterministic canonical JSON string
 */
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

/**
 * Computes a standard SHA-256 hex digest from an ArrayBuffer, Uint8Array, or string.
 *
 * @param {ArrayBuffer | Uint8Array | string} input
 * @returns {Promise<string>} 64-character lowercase hexadecimal hash string
 */
export async function sha256Hex(input) {
  let buffer;

  if (typeof input === 'string') {
    buffer = new TextEncoder().encode(input);
  } else if (input instanceof Uint8Array) {
    buffer = input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
  } else if (input instanceof ArrayBuffer) {
    buffer = input;
  } else {
    buffer = new TextEncoder().encode(String(input ?? ''));
  }

  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
