import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { isPastDeadline } from '../../utils/dates';

export const JobDetailsModal = ({
  job,
  matchData,
  isOpen,
  onClose,
  isApplied = false,
  applicationStatus = '',
  onApply,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const { matchScore = 0, matchedSkills = [], missingRequired = [], missingPreferred = [] } =
    matchData || {};

  const requiredSkills = job.requiredSkills || [];
  const preferredSkills = job.preferredSkills || [];
  const allMissing = [...missingRequired, ...missingPreferred];

  const isClosed = job.status === 'Closed';
  const isExpired = job.status !== 'Open' && isPastDeadline(job.deadline);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0E1514]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#1E2B2A] border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close job details"
            className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#9FB0AD] hover:text-[#F3F1EA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Info */}
          <div className="flex items-start gap-4 pr-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#273836] to-[#172120] border border-white/10 flex items-center justify-center font-serif text-2xl font-bold text-[#B7F34A] shrink-0">
              {job.company?.charAt(0).toUpperCase() || 'J'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#172120] border border-white/[0.08] text-[10px] uppercase font-mono text-[#B7F34A] mb-1">
                <span>Verified HEI Vacancy</span>
              </div>
              <h2
                id="job-details-title"
                className="font-serif text-2xl sm:text-3xl font-semibold text-[#F3F1EA] leading-tight"
              >
                {job.title}
              </h2>
              <p className="text-sm text-[#9FB0AD] flex items-center gap-1.5 mt-1">
                <Building2 className="w-4 h-4 text-[#B7F34A]" />
                <span className="font-medium text-[#F3F1EA]">{job.company}</span>
              </p>
            </div>
          </div>

          {/* Metadata Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 p-4 rounded-2xl bg-[#172120] border border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#9FB0AD]">Type & Mode</span>
              <p className="text-xs font-semibold text-[#F3F1EA] mt-0.5 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-[#B7F34A]" />
                {job.type} ({job.mode})
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#9FB0AD]">Location</span>
              <p className="text-xs font-semibold text-[#F3F1EA] mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9FB0AD]" />
                {job.location}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#9FB0AD]">Compensation</span>
              <p className="text-xs font-semibold text-[#B7F34A] mt-0.5 flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5" />
                {job.stipendOrSalary}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#9FB0AD]">Deadline</span>
              <p className="text-xs font-semibold text-[#F3F1EA] mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#9FB0AD]" />
                {job.deadline}
              </p>
            </div>
          </div>

          {/* Match Score Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#243534]/70 to-[#172120] border border-[#B7F34A]/20 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B7F34A]/10 border border-[#B7F34A]/30 flex items-center justify-center font-serif text-lg font-bold text-[#B7F34A]">
                {matchScore}%
              </div>
              <div>
                <p className="text-xs font-semibold text-[#F3F1EA]">
                  Verified Skill Match Score
                </p>
                <p className="text-[11px] text-[#9FB0AD]">
                  Calculated against your approved J&K EduLedger activities.
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-mono uppercase px-3 py-1 rounded-full border ${
                matchScore >= 50
                  ? 'bg-[#B7F34A]/10 text-[#B7F34A] border-[#B7F34A]/30'
                  : 'bg-white/5 text-[#9FB0AD] border-white/10'
              }`}
            >
              {matchScore >= 50 ? 'Recommended' : 'Skill Gap'}
            </span>
          </div>

          {/* Full Description */}
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#9FB0AD] mb-2">
              Role Overview & Responsibilities
            </h4>
            <p className="text-sm text-[#F3F1EA]/90 leading-relaxed font-sans">
              {job.description}
            </p>
          </div>

          {/* Required Skills Section */}
          <div className="mb-5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#9FB0AD] mb-2 flex items-center justify-between">
              <span>Required Core Skills (70% Weight)</span>
              <span className="text-[10px] text-[#B7F34A]">
                {requiredSkills.filter((s) => matchedSkills.includes(s)).length} /{' '}
                {requiredSkills.length} Matched
              </span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill) => {
                const isMatched = matchedSkills.includes(skill);
                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      isMatched
                        ? 'bg-[#B7F34A]/10 border-[#B7F34A]/30 text-[#B7F34A]'
                        : 'bg-rose-500/10 border-rose-500/25 text-rose-300'
                    }`}
                  >
                    {isMatched ? (
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <AlertCircle className="w-3 h-3 stroke-[2]" />
                    )}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Preferred Skills Section */}
          {preferredSkills.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#9FB0AD] mb-2 flex items-center justify-between">
                <span>Preferred Bonus Skills (30% Weight)</span>
                <span className="text-[10px] text-[#B7F34A]">
                  {preferredSkills.filter((s) => matchedSkills.includes(s)).length} /{' '}
                  {preferredSkills.length} Matched
                </span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {preferredSkills.map((skill) => {
                  const isMatched = matchedSkills.includes(skill);
                  return (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        isMatched
                          ? 'bg-[#B7F34A]/10 border-[#B7F34A]/30 text-[#B7F34A]'
                          : 'bg-white/5 border-white/10 text-[#9FB0AD]'
                      }`}
                    >
                      {isMatched ? (
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      )}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* How to Close the Gap Hint */}
          <div className="p-4 rounded-2xl bg-[#172120] border border-amber-500/20 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-300 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-amber-300 mb-1">
                  How to close your skill gap for this role
                </p>
                {allMissing.length > 0 ? (
                  <p className="text-[#9FB0AD] leading-relaxed">
                    Upload certificates or capstone milestones demonstrating{' '}
                    <span className="text-[#F3F1EA] font-semibold">
                      {allMissing.join(', ')}
                    </span>
                    . Once verified by your faculty advisor, your match score for this vacancy will
                    automatically climb towards 100%.
                  </p>
                ) : (
                  <p className="text-[#9FB0AD] leading-relaxed">
                    Outstanding! You have verified credentials for all required and preferred
                    skills. Your application will appear at the top of the recruiter's candidate
                    stack.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs text-[#9FB0AD]">
              <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
              <span>Verified credentials shared directly with recruiter</span>
            </div>

            {isApplied ? (
              <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#172120] border border-[#B7F34A]/40 text-xs font-semibold text-[#B7F34A]">
                <CheckCircle2 className="w-4 h-4" />
                Status: {applicationStatus || 'Applied'}
              </span>
            ) : isClosed || isExpired ? (
              <button
                type="button"
                disabled
                className="px-5 py-2.5 rounded-full bg-white/5 text-[#9FB0AD]/50 border border-white/5 text-xs font-medium cursor-not-allowed"
              >
                Applications Closed
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onApply(job);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] text-xs font-semibold transition-all shadow-[0_0_20px_rgba(183,243,74,0.3)] hover:translate-y-[-1px] cursor-pointer"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
