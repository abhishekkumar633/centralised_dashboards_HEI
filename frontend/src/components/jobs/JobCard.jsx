import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Banknote, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  ArrowRight,
  Lock
} from 'lucide-react';
import { isPastDeadline } from '../../utils/dates';

export const JobCard = ({
  job,
  matchData,
  isApplied = false,
  applicationStatus = '',
  onViewDetails,
  onApply,
}) => {
  const { matchScore = 0, matchedSkills = [], missingRequired = [], missingPreferred = [] } =
    matchData || {};

  const allMissing = [...missingRequired, ...missingPreferred];

  // Match Score styling tokens
  const getScoreBadgeStyles = (score) => {
    if (score >= 75) {
      return {
        bg: 'bg-[#B7F34A]/10',
        text: 'text-[#B7F34A]',
        border: 'border-[#B7F34A]/30',
        ring: '#B7F34A',
        label: 'High Match',
      };
    }
    if (score >= 50) {
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        ring: '#F59E0B',
        label: 'Recommended',
      };
    }
    return {
      bg: 'bg-white/5',
      text: 'text-[#9FB0AD]',
      border: 'border-white/10',
      ring: '#9CA3AF',
      label: 'Developing',
    };
  };

  const badgeStyles = getScoreBadgeStyles(matchScore);

  // Check if job is expired or closed (if status is Open, the position is open for applications)
  const isClosed = job.status === 'Closed';
  const isExpired = job.status !== 'Open' && isPastDeadline(job.deadline);

  // Company avatar initial
  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : 'J';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-[28px] bg-[#1E2B2A] border p-6 flex flex-col justify-between transition-all duration-200 hover:border-white/20 group relative overflow-hidden ${
        matchScore >= 75
          ? 'border-[#B7F34A]/25 shadow-[0_0_25px_rgba(183,243,74,0.04)]'
          : 'border-white/[0.08]'
      }`}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Company Initial Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#273836] to-[#172120] border border-white/10 flex items-center justify-center font-serif text-lg font-bold text-[#B7F34A] shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              {companyInitial}
            </div>

            <div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#F3F1EA] group-hover:text-[#B7F34A] transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#9FB0AD] flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-[#B7F34A]" />
                <span className="font-medium text-[#F3F1EA]">{job.company}</span>
              </p>
            </div>
          </div>

          {/* Match Score Gauge Badge */}
          <div
            className={`flex flex-col items-end px-3 py-1.5 rounded-2xl border ${badgeStyles.border} ${badgeStyles.bg} shrink-0`}
          >
            <div className="flex items-center gap-1">
              <span className={`font-serif text-lg font-bold leading-none ${badgeStyles.text}`}>
                {matchScore}%
              </span>
            </div>
            <span className="text-[9px] uppercase font-mono tracking-wider text-[#9FB0AD] mt-0.5">
              {badgeStyles.label}
            </span>
          </div>
        </div>

        {/* Chips row: Type, Mode, Location, Salary */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px]">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#172120] border border-white/[0.08] text-[#F3F1EA]">
            <Briefcase className="w-3 h-3 text-[#B7F34A]" />
            {job.type}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#172120] border border-white/[0.08] text-[#9FB0AD]">
            <MapPin className="w-3 h-3 text-[#9FB0AD]" />
            {job.location} ({job.mode})
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#172120] border border-white/[0.08] text-[#B7F34A] font-medium">
            <Banknote className="w-3 h-3" />
            {job.stipendOrSalary}
          </span>
          {job.deadline && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#172120] border border-white/[0.08] text-[#9FB0AD] font-mono">
              <Calendar className="w-3 h-3" />
              Due: {job.deadline}
            </span>
          )}
          {(isClosed || isExpired) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold uppercase text-[10px]">
              <Lock className="w-3 h-3" />
              {isClosed ? 'Closed' : 'Expired'}
            </span>
          )}
        </div>

        {/* Brief Description */}
        <p className="text-xs text-[#9FB0AD] mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skill Alignment Comparison Section */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.06] space-y-2">
          {/* Matched Skills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-[#B7F34A] font-semibold flex items-center gap-1 mr-1">
              <CheckCircle2 className="w-3 h-3" />
              You match:
            </span>
            {matchedSkills.length > 0 ? (
              <>
                {matchedSkills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B7F34A]/10 border border-[#B7F34A]/30 text-[10px] font-medium text-[#B7F34A]"
                  >
                    <Check className="w-2.5 h-2.5" />
                    {skill}
                  </span>
                ))}
                {matchedSkills.length > 4 && (
                  <span className="text-[10px] text-[#9FB0AD] font-mono px-1">
                    +{matchedSkills.length - 4} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-[11px] text-[#9FB0AD]/60 italic">No direct matches yet</span>
            )}
          </div>

          {/* Missing Skills */}
          {allMissing.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-rose-300 font-semibold flex items-center gap-1 mr-1">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                Missing:
              </span>
              {allMissing.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300/80"
                >
                  {skill}
                </span>
              ))}
              {allMissing.length > 3 && (
                <span className="text-[10px] text-[#9FB0AD] font-mono px-1">
                  +{allMissing.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onViewDetails(job)}
          className="text-xs font-medium text-[#9FB0AD] hover:text-[#F3F1EA] hover:underline cursor-pointer py-1"
        >
          View details
        </button>

        {isApplied ? (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#172120] border border-[#B7F34A]/40 text-xs font-semibold text-[#B7F34A]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Status: {applicationStatus || 'Applied'}
          </span>
        ) : isClosed || isExpired ? (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 text-[#9FB0AD]/50 border border-white/5 text-xs font-medium cursor-not-allowed"
          >
            <span>Applications Closed</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onApply(job)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] text-xs font-semibold transition-all shadow-[0_0_15px_rgba(183,243,74,0.25)] hover:translate-y-[-1px] cursor-pointer"
          >
            <span>Apply</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
