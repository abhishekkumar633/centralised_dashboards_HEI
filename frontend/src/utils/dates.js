/**
 * Date utility helpers for SkillVault
 * Ensures consistent local timezone YYYY-MM-DD ISO representation
 */

/**
 * Returns today's local date in YYYY-MM-DD format
 * @returns {string}
 */
export const todayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Adds or subtracts days from a YYYY-MM-DD ISO date string
 * @param {string} isoDateStr
 * @param {number} days
 * @returns {string}
 */
export const addDays = (isoDateStr, days) => {
  const [y, m, d] = isoDateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Checks whether a given deadline date is in the past compared to todayISO()
 * @param {string} deadline
 * @returns {boolean}
 */
export const isPastDeadline = (deadline) => {
  if (!deadline) return false;
  return String(deadline).trim() < todayISO();
};
