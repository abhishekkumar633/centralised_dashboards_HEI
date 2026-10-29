/**
 * SkillVault Job Matching Logic
 * Pure functions to compute match scores and skill alignments between verified
 * student credentials and job postings.
 *
 * FORMULA:
 * - Match Score (0 - 100) =
 *     70% * (matched required skills / total required skills)
 *   + 30% * (matched preferred skills / total preferred skills)
 *
 * RULES:
 * 1. Student skills are gathered ONLY from 'Approved' activities (Pending and Rejected are ignored).
 * 2. Case and leading/trailing whitespace are normalised for comparison.
 * 3. If a job defines 0 preferred skills, full 30% credit is awarded.
 * 4. If a job defines 0 required skills, full 70% credit is awarded.
 * 5. Final matchScore is rounded to the nearest integer [0, 100].
 * 6. A job is designated 'isRecommended' when matchScore >= 50.
 *
 * EXAMPLE CALCULATIONS:
 * -------------------------------------------------------------
 * Example 1 score = round((0.70 * 0.5 + 0.30 * 1.0) * 100) = 65; Example 2 score = round((0.70 * 0 + 0.30 * 1.0) * 100) = 30.
 * -------------------------------------------------------------
 */

/**
 * Extracts normalized, deduplicated list of skills exclusively from APPROVED activities.
 * @param {Array<Object>} activities - Array of activity objects
 * @returns {Array<string>} Array of original case-preserved unique skill names
 */
export const extractVerifiedSkills = (activities = []) => {
  if (!Array.isArray(activities)) return [];

  const seenMap = new Map(); // lowercase -> original case

  activities
    .filter((act) => act && act.status === 'Approved')
    .forEach((act) => {
      if (Array.isArray(act.skillsAwarded)) {
        act.skillsAwarded.forEach((skill) => {
          if (typeof skill === 'string' && skill.trim().length > 0) {
            const key = skill.trim().toLowerCase();
            if (!seenMap.has(key)) {
              seenMap.set(key, skill.trim());
            }
          }
        });
      }
    });

  return Array.from(seenMap.values());
};

/**
 * Normalizes a string for comparison.
 * @param {string} str
 * @returns {string}
 */
const normalize = (str) => (typeof str === 'string' ? str.trim().toLowerCase() : '');

/**
 * Calculates match score and skill breakdown for a single job against a set of verified skills.
 * @param {Object} job - The job posting object
 * @param {Array<string>} verifiedSkills - List of verified skills
 * @returns {Object} { matchScore, matchedSkills, missingRequired, missingPreferred, isRecommended }
 */
export const matchJob = (job, verifiedSkills = []) => {
  if (!job) {
    return {
      matchScore: 0,
      matchedSkills: [],
      missingRequired: [],
      missingPreferred: [],
      isRecommended: false,
    };
  }

  // Create lookup set of normalized student skills
  const studentSkillSet = new Set(
    (Array.isArray(verifiedSkills) ? verifiedSkills : []).map(normalize).filter(Boolean)
  );

  const required = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  const preferred = Array.isArray(job.preferredSkills) ? job.preferredSkills : [];

  const matchedRequired = [];
  const missingRequired = [];
  required.forEach((req) => {
    if (studentSkillSet.has(normalize(req))) {
      matchedRequired.push(req);
    } else {
      missingRequired.push(req);
    }
  });

  const matchedPreferred = [];
  const missingPreferred = [];
  preferred.forEach((pref) => {
    if (studentSkillSet.has(normalize(pref))) {
      matchedPreferred.push(pref);
    } else {
      missingPreferred.push(pref);
    }
  });

  // Calculate Required component (70% weight)
  let requiredRatio = 1.0;
  if (required.length > 0) {
    requiredRatio = matchedRequired.length / required.length;
  }

  // Calculate Preferred component (30% weight)
  let preferredRatio = 1.0;
  if (preferred.length > 0) {
    preferredRatio = matchedPreferred.length / preferred.length;
  }

  const rawScore = (0.70 * requiredRatio + 0.30 * preferredRatio) * 100;
  const matchScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Combine matched skills without duplicates
  const matchedSkillsSet = new Set([...matchedRequired, ...matchedPreferred]);
  const matchedSkills = Array.from(matchedSkillsSet);

  return {
    matchScore,
    matchedSkills,
    missingRequired,
    missingPreferred,
    isRecommended: matchScore >= 50,
  };
};

/**
 * Matches and ranks an array of jobs for a given student (either activities or pre-extracted skills).
 * Sorted descending by matchScore.
 * @param {Array<Object>} jobs - List of all job postings
 * @param {Array<Object>|Array<string>} activitiesOrSkills - Array of activities or verified skills
 * @returns {Array<Object>} Jobs enriched with matchData, sorted by matchScore desc
 */
export const rankJobsForStudent = (jobs = [], activitiesOrSkills = []) => {
  if (!Array.isArray(jobs)) return [];

  let verifiedSkills = [];
  if (activitiesOrSkills.length > 0 && typeof activitiesOrSkills[0] === 'object') {
    verifiedSkills = extractVerifiedSkills(activitiesOrSkills);
  } else {
    verifiedSkills = activitiesOrSkills;
  }

  const ranked = jobs.map((job) => {
    const matchData = matchJob(job, verifiedSkills);
    return {
      ...job,
      matchData,
    };
  });

  // Sort descending by matchScore; secondary sort by postedAt descending
  ranked.sort((a, b) => {
    if (b.matchData.matchScore !== a.matchData.matchScore) {
      return b.matchData.matchScore - a.matchData.matchScore;
    }
    return (b.postedAt || '').localeCompare(a.postedAt || '');
  });

  return ranked;
};
