import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  X,
  Hash,
  Sparkles,
  Calendar
} from 'lucide-react';
import { mockApplicantPool } from '../../data/jobsMock';

const STATUS_OPTIONS = ['Applied', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'];

export const ApplicantCard = ({
  application,
  job,
  onStatusChange,
}) => {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Look up student details from mockApplicantPool, application.snapshot, or minimal fallback
  const applicantProfile =
    mockApplicantPool[application.studentEmail] ||
    application.snapshot || {
      name: application.studentName || 'Student Applicant',
      email: application.studentEmail,
      institution: 'Jammu & Kashmir Higher Education Institution',
      verifiedScore: 88,
      verifiedSkills: ['System Architecture', 'PyTorch'],
      approvedActivities: [],
    };

  const approvedActivities = applicantProfile.approvedActivities || [];
  const verifiedCount = approvedActivities.length;

  // Compute matched skills against the current job
  const jobSkills = [
    ...(job?.requiredSkills || []),
    ...(job?.preferredSkills || []),
  ];
  const normalizedCandidateSkills = (applicantProfile.verifiedSkills || []).map((s) =>
    s.toLowerCase().trim()
  );
  const matchedCandidateSkills = jobSkills.filter((s) =>
    normalizedCandidateSkills.includes(s.toLowerCase().trim())
  );

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-[#B7F34A]/10 text-[#B7F34A] border-[#B7F34A]/30';
      case 'Interviewing':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Hired':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/25';
      default:
        return 'bg-white/5 text-[#9FB0AD] border-white/10';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] bg-[#1E2B2A] border border-white/[0.08] p-5 sm:p-6 hover:border-white/20 transition-all flex flex-col justify-between"
      >
        <div>
          {/* Top Row: Name, Institution, Match Score */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#273836] to-[#172120] border border-white/10 flex items-center justify-center font-serif text-lg font-bold text-[#B7F34A] shrink-0">
                {applicantProfile.name?.charAt(0) || 'A'}
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#F3F1EA]">
                  {applicantProfile.name}
                </h4>
                <p className="text-xs text-[#9FB0AD] flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#B7F34A]" />
                  <span>{applicantProfile.institution}</span>
                </p>
                <p className="text-[11px] font-mono text-[#9FB0AD]/70 mt-0.5">
                  {applicantProfile.email}
                </p>
              </div>
            </div>

            {/* Score Ring / Pill */}
            <div className="flex flex-col items-end">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#172120] border border-[#B7F34A]/30 text-xs font-bold text-[#B7F34A] font-mono">
                <Sparkles className="w-3 h-3" />
                {application.matchScore}% Match
              </span>
              <span className="text-[10px] text-[#9FB0AD] font-mono mt-1">
                Verified Score: {applicantProfile.verifiedScore}/100
              </span>
            </div>
          </div>

          {/* Matched Skills Chips */}
          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <p className="text-[10px] font-mono uppercase text-[#9FB0AD] mb-1.5">
              Verified Skills Matched for this Job:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {matchedCandidateSkills.length > 0 ? (
                matchedCandidateSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B7F34A]/10 border border-[#B7F34A]/30 text-[11px] text-[#B7F34A] font-medium"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#9FB0AD]/60 italic">
                  General background match
                </span>
              )}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="mt-3.5 flex items-center gap-2 text-xs text-[#9FB0AD]">
            <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
            <span>
              <strong className="text-[#F3F1EA]">{verifiedCount}</strong> on-chain verified
              credentials
            </span>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsPortfolioModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#172120] hover:bg-white/[0.08] text-[#F3F1EA] border border-white/10 text-xs font-medium transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>View verified portfolio</span>
          </button>

          {/* Status Pipeline Dropdown / Changer */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all ${getStatusBadgeStyle(
                application.status
              )}`}
            >
              <span>Status: {application.status}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl bg-[#172120] border border-white/15 p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 py-1 text-[10px] uppercase font-mono text-[#9FB0AD] border-b border-white/[0.06] mb-1">
                    Advance Candidate
                  </div>
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onStatusChange(application.id, opt);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                        opt === application.status
                          ? 'bg-[#B7F34A] text-[#172120] font-semibold'
                          : 'text-[#F3F1EA] hover:bg-white/[0.08]'
                      }`}
                    >
                      <span>{opt}</span>
                      {opt === application.status && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Verified Portfolio Modal */}
      <AnimatePresence>
        {isPortfolioModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPortfolioModalOpen(false)}
              className="fixed inset-0 bg-[#0E1514]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#1E2B2A] border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[85vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setIsPortfolioModalOpen(false)}
                aria-label="Close modal"
                className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#9FB0AD] hover:text-[#F3F1EA] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#172120] border border-white/10 flex items-center justify-center font-serif text-xl font-bold text-[#B7F34A]">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#172120] border border-white/[0.08] text-[10px] uppercase font-mono text-[#B7F34A] mb-1">
                    <span>Verified Credential Record</span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-[#F3F1EA]">
                    {applicantProfile.name}
                  </h3>
                  <p className="text-xs text-[#9FB0AD] flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#B7F34A]" />
                    <span>{applicantProfile.institution}</span>
                  </p>
                </div>
              </div>

              {/* Demo Notice Banner */}
              <div className="p-3 rounded-2xl bg-[#172120] border border-amber-500/20 text-xs text-amber-300/90 mb-6 flex items-center justify-between">
                <span>Demo data: not a live blockchain record</span>
                <span className="font-mono text-[10px] text-[#9FB0AD]">
                  Govt. J&K EduLedger Protocol
                </span>
              </div>

              {/* Approved Activities List */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-[#9FB0AD] tracking-wider mb-2">
                  Approved Institutional Submissions ({approvedActivities.length})
                </h4>

                {approvedActivities.length === 0 ? (
                  <p className="text-xs text-[#9FB0AD] italic py-4">
                    No approved activities recorded yet.
                  </p>
                ) : (
                  approvedActivities.map((act, idx) => (
                    <div
                      key={act.id || `${act.title}-${idx}`}
                      className="p-4 rounded-2xl bg-[#172120] border border-white/[0.06] hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#243534] text-[#B7F34A]">
                              {act.category || 'Credential'}
                            </span>
                            <span className="text-[10px] text-[#9FB0AD] flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {act.formattedDate || act.date || 'Verified Proof'}
                            </span>
                          </div>
                          <h5 className="font-serif text-sm font-semibold text-[#F3F1EA]">
                            {act.title}
                          </h5>
                        </div>

                        {/* Short Hash Chip */}
                        <div className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E2B2A] border border-white/10 font-mono text-[10px] text-[#9FB0AD]">
                          <Hash className="w-3 h-3 text-[#B7F34A]" />
                          <span>
                            {act.hashShort ||
                              (act.blockchainHash
                                ? `${act.blockchainHash.slice(0, 6)}...${act.blockchainHash.slice(-4)}`
                                : '0x7f4c...e6d1')}
                          </span>
                        </div>
                      </div>

                      {/* Skills awarded */}
                      {act.skillsAwarded && act.skillsAwarded.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-white/[0.04]">
                          {act.skillsAwarded.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#B7F34A]/10 text-[#B7F34A] border border-[#B7F34A]/20"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
