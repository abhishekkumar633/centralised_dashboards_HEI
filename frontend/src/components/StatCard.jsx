import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles,
  Briefcase
} from 'lucide-react';

// Animated counter hook
const useCounter = (end, duration = 1200) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endVal = parseInt(end, 10);
    if (isNaN(endVal)) return;
    const increment = endVal / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= endVal) {
        clearInterval(timer);
        setCount(endVal);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

export const StatCard = ({ activities = [], verifiedScore = 94, recommendedJobsCount }) => {
  const total = activities.length;
  const approved = activities.filter((a) => a.status === 'Approved').length;
  const pending = activities.filter((a) => a.status === 'Pending').length;
  const rejected = activities.filter((a) => a.status === 'Rejected').length;

  const countTotal = useCounter(total);
  const countApproved = useCounter(approved);
  const countPending = useCounter(pending);
  const countRejected = useCounter(rejected);
  const countScore = useCounter(verifiedScore);

  // SVG circular gauge math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (verifiedScore / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-8">
      {/* 4 Stat Cards */}
      <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Activities */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[24px] bg-[#1E2B2A] border border-white/[0.08] p-5 flex flex-col justify-between hover:border-white/20 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD]">
              Total Records
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-[#F3F1EA] group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#F3F1EA]">
              {countTotal}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#B7F34A] mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Across 6 categories</span>
            </div>
          </div>
        </motion.div>

        {/* Approved */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-[24px] bg-[#1E2B2A] border border-[#B7F34A]/25 p-5 flex flex-col justify-between hover:border-[#B7F34A]/50 transition-all group shadow-[0_0_20px_rgba(183,243,74,0.06)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#B7F34A]">
              Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#B7F34A]/10 flex items-center justify-center text-[#B7F34A] group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#B7F34A]">
              {countApproved}
            </div>
            <div className="text-[11px] text-[#9FB0AD] mt-1">
              On-chain verified
            </div>
          </div>
        </motion.div>

        {/* Pending */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-[24px] bg-[#1E2B2A] border border-amber-500/25 p-5 flex flex-col justify-between hover:border-amber-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-amber-300">
              In Review
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-300">
              {countPending}
            </div>
            <div className="text-[11px] text-[#9FB0AD] mt-1">
              Faculty queue
            </div>
          </div>
        </motion.div>

        {/* Rejected */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-[24px] bg-[#1E2B2A] border border-rose-500/20 p-5 flex flex-col justify-between hover:border-rose-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-rose-300">
              Rejected
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-rose-300">
              {countRejected}
            </div>
            <div className="text-[11px] text-[#9FB0AD] mt-1">
              Feedback given
            </div>
          </div>
        </motion.div>
      </div>

      {/* Verified Score Ring Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="lg:col-span-4 rounded-[28px] bg-gradient-to-br from-[#1E2B2A] to-[#182423] border border-[#B7F34A]/25 p-6 flex items-center justify-between shadow-[0_0_30px_rgba(183,243,74,0.08)] relative overflow-hidden"
      >
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-1.5 text-xs text-[#B7F34A] font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Institutional Metric</span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#F3F1EA]">
            Verified <span className="italic text-[#B7F34A]">Score</span>
          </h3>
          <p className="text-xs text-[#9FB0AD] mt-1">
            Weighted index based on NAAC Criterion 5 & peer benchmarks.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#172120] border border-white/[0.08] text-[10px] text-[#B7F34A]">
              <ShieldCheck className="w-3 h-3" />
              <span>Top 5% Cohort Rank</span>
            </div>
            {recommendedJobsCount !== undefined && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#172120] border border-[#B7F34A]/30 text-[10px] text-[#B7F34A]">
                <Briefcase className="w-3 h-3" />
                <span>{recommendedJobsCount} Matched Openings</span>
              </div>
            )}
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-[#243534]"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-[#B7F34A] transition-all duration-1000 ease-out"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-2xl font-bold text-[#F3F1EA] leading-none">
              {countScore}
            </span>
            <span className="text-[10px] text-[#9FB0AD] font-mono mt-0.5">/ 100</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
