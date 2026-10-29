import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { useJobs } from '../../context/JobsContext';

const PIPELINE_STEPS = ['Applied', 'Shortlisted', 'Interviewing', 'Hired'];

export const ApplicationTracker = ({ applications = [] }) => {
  const { getJobById } = useJobs();

  if (!applications || applications.length === 0) {
    return (
      <div className="rounded-[28px] bg-[#1E2B2A] border border-white/[0.08] p-10 text-center flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-[#172120] border border-white/10 flex items-center justify-center text-[#9FB0AD] mb-3">
          <Inbox className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h4 className="font-serif text-lg font-semibold text-[#F3F1EA]">
          No job applications submitted yet
        </h4>
        <p className="text-xs text-[#9FB0AD] max-w-md mt-1 leading-relaxed">
          Explore your recommended positions above and apply using your tamper-proof J&K
          EduLedger verified skill profile.
        </p>
      </div>
    );
  }

  const getStepIndex = (status) => {
    return PIPELINE_STEPS.indexOf(status);
  };

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const job = getJobById(app.jobId);
        const jobTitle = job?.title || 'Open Vacancy';
        const companyName = job?.company || 'Industry Partner';
        const isRejected = app.status === 'Rejected';
        const currentStepIdx = getStepIndex(app.status);

        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[24px] bg-[#1E2B2A] border border-white/[0.08] p-5 sm:p-6 hover:border-white/15 transition-all"
          >
            {/* Header: Title, Company, Applied Date, Match Score */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#172120] border border-white/10 flex items-center justify-center font-serif font-bold text-[#B7F34A] shrink-0 text-sm">
                  {companyName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-semibold text-[#F3F1EA]">
                    {jobTitle}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9FB0AD] mt-0.5">
                    <span className="flex items-center gap-1 text-[#F3F1EA]">
                      <Building2 className="w-3.5 h-3.5 text-[#B7F34A]" />
                      {companyName}
                    </span>
                    <span className="hidden sm:inline text-white/20">·</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3 h-3 text-[#9FB0AD]" />
                      Applied: {app.appliedAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] font-mono text-[#9FB0AD] hidden md:inline">
                  Verified Match:
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#172120] border border-[#B7F34A]/30 text-xs font-semibold text-[#B7F34A] font-mono">
                  <Sparkles className="w-3 h-3" />
                  {app.matchScore || (job ? 85 : 75)}%
                </span>
              </div>
            </div>

            {/* Pipeline Stepper */}
            <div className="pt-5">
              {isRejected ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-rose-300">
                        Status: Not Selected
                      </p>
                      <p className="text-[11px] text-rose-200/70">
                        The recruiter concluded this review round. Expand your verified portfolio
                        for upcoming openings.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/30">
                    Closed
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#9FB0AD] mb-1">
                    <span className="font-mono uppercase text-[10px] tracking-wider">
                      Application Progress
                    </span>
                    <span className="text-[#B7F34A] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Current Phase: {app.status}
                    </span>
                  </div>

                  {/* 4-Step Visual Track */}
                  <div className="grid grid-cols-4 gap-2 relative">
                    {PIPELINE_STEPS.map((stepName, idx) => {
                      const isCompleted = currentStepIdx > idx;
                      const isCurrent = currentStepIdx === idx;

                      return (
                        <div key={stepName} className="flex flex-col items-center text-center">
                          {/* Step Node */}
                          <div
                            className={`w-full h-1.5 rounded-full mb-2 transition-all ${
                              isCompleted || isCurrent
                                ? 'bg-[#B7F34A] shadow-[0_0_8px_rgba(183,243,74,0.4)]'
                                : 'bg-[#172120] border border-white/10'
                            }`}
                          />
                          <div className="flex items-center gap-1">
                            {isCompleted ? (
                              <CheckCircle2 className="w-3 h-3 text-[#B7F34A]" />
                            ) : isCurrent ? (
                              <span className="w-2 h-2 rounded-full bg-[#B7F34A] animate-pulse" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            )}
                            <span
                              className={`text-[11px] font-medium transition-colors ${
                                isCurrent
                                  ? 'text-[#B7F34A] font-semibold'
                                  : isCompleted
                                  ? 'text-[#F3F1EA]'
                                  : 'text-[#9FB0AD]/60'
                              }`}
                            >
                              {stepName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
