import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Filter, 
  Code2, 
  Trophy, 
  Sparkles, 
  BookOpen, 
  Briefcase, 
  HeartHandshake, 
  ShieldCheck, 
  Calendar,
  AlertTriangle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

const CATEGORY_ICONS = {
  Technical: Code2,
  Sports: Trophy,
  Cultural: Sparkles,
  Research: BookOpen,
  Internship: Briefcase,
  Volunteering: HeartHandshake,
};

const CATEGORIES = [
  'All Categories',
  'Technical',
  'Sports',
  'Cultural',
  'Research',
  'Internship',
  'Volunteering',
];

export const Timeline = ({
  activities = [],
  onSelectProof,
  onResubmit,
  highlightedActivityId = null
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      All: activities.length,
      Approved: activities.filter((a) => a.status === 'Approved').length,
      Pending: activities.filter((a) => a.status === 'Pending').length,
      Rejected: activities.filter((a) => a.status === 'Rejected').length,
    };
  }, [activities]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      // Status filter
      if (statusFilter !== 'All' && item.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesApprover = (item.reviewedBy || item.approver)?.toLowerCase().includes(query);
        const matchesCat = item.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesApprover && !matchesCat) {
          return false;
        }
      }
      return true;
    });
  }, [activities, statusFilter, selectedCategory, searchQuery]);

  // Helper to format short hash
  const formatShortHash = (hash) => {
    if (!hash) return '0x9f3a…c21b';
    return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
  };

  const handleResubmitClick = (activity) => {
    if (onResubmit) {
      onResubmit(activity);
    }
    const uploadEl = document.getElementById('upload-section');
    if (uploadEl) {
      uploadEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="activities-section" className="my-16 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#B7F34A] flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#B7F34A]"></span>
            <span>Immutable Student Activity Log</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F3F1EA]">
            Activity <span className="italic text-[#B7F34A]">Timeline</span>
          </h2>
          <p className="text-xs text-[#9FB0AD] mt-1 max-w-xl">
            Chronological audit of institutional credentials, hackathons, papers, and athletic achievements.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter activities by Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1E2B2A] border border-white/10 hover:border-white/20 text-[#F3F1EA] text-xs rounded-full px-4 py-2 pr-8 outline-none appearance-none cursor-pointer transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1E2B2A] text-[#F3F1EA]">
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9FB0AD] text-[10px]">
              ▼
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#9FB0AD] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1E2B2A] border border-white/10 focus:border-[#B7F34A] text-[#F3F1EA] placeholder-[#9FB0AD]/50 text-xs rounded-full pl-8 pr-4 py-2 outline-none w-48 sm:w-56 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Status Segmented Pill Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {['All', 'Approved', 'Pending', 'Rejected'].map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#B7F34A] text-[#172120] font-semibold shadow-[0_0_15px_rgba(183,243,74,0.3)]'
                  : 'bg-[#1E2B2A] border border-white/[0.08] text-[#9FB0AD] hover:text-[#F3F1EA] hover:border-white/20'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-[#172120]/20 text-[#172120]' : 'bg-[#172120] text-[#B7F34A]'
                }`}
              >
                {counts[status]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timeline List */}
      {filteredActivities.length === 0 ? (
        <div className="rounded-[28px] bg-[#1E2B2A] border border-white/[0.08] p-12 text-center my-6">
          <div className="w-12 h-12 rounded-full bg-[#172120] border border-white/10 mx-auto flex items-center justify-center text-[#9FB0AD] mb-3">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#F3F1EA]">No activities match your filters</h3>
          <p className="text-xs text-[#9FB0AD] mt-1 max-w-sm mx-auto">
            Try resetting your category or status filters to view all recorded credentials.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('All');
              setSelectedCategory('All Categories');
              setSearchQuery('');
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs text-[#F3F1EA] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-8 sm:space-y-10 ml-3 sm:ml-4">
          {filteredActivities.map((act, index) => {
            const Icon = CATEGORY_ICONS[act.category] || Sparkles;

            const isApproved = act.status === 'Approved';
            const isPending = act.status === 'Pending';
            const isRejected = act.status === 'Rejected';
            const isHighlighted = highlightedActivityId === act.id;

            const reviewerName = act.reviewedBy || act.approver || 'Departmental Reviewer';
            const approvalDate = act.reviewedAt
              ? new Date(act.reviewedAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : act.formattedDate || act.date;

            const realHash = act.proof?.hash || act.blockchainHash;

            return (
              <motion.div
                key={act.id}
                id={`activity-${act.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className={`relative group scroll-mt-28 ${
                  isHighlighted ? 'ring-2 ring-[#B7F34A] rounded-[26px] p-0.5' : ''
                }`}
              >
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isApproved
                      ? 'bg-[#172120] border-[#B7F34A] text-[#B7F34A] shadow-[0_0_12px_rgba(183,243,74,0.35)]'
                      : isPending
                      ? 'bg-[#172120] border-amber-400 text-amber-300'
                      : 'bg-[#172120] border-rose-500 text-rose-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Timeline Card */}
                <div
                  className={`rounded-[24px] bg-[#1E2B2A] border p-5 sm:p-6 transition-all shadow-md group-hover:shadow-xl ${
                    isHighlighted
                      ? 'border-[#B7F34A] bg-[#223331]'
                      : 'border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {/* Top line: Category, Date, Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#F3F1EA]">
                        {act.category}
                      </span>
                      <span className="text-xs text-[#9FB0AD] flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-[#9FB0AD]" />
                        {act.formattedDate || act.date}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-[#B7F34A] border border-[#B7F34A]/25">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved & Verified</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>Awaiting review</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          <XCircle className="w-3 h-3" />
                          <span>Verification Rejected</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#F3F1EA] mt-1 group-hover:text-[#B7F34A] transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-[#9FB0AD] mt-2 leading-relaxed">
                    {act.description}
                  </p>

                  {/* Skills tags if available */}
                  {(act.skillsAwarded?.length > 0 || act.skills?.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(act.skillsAwarded?.length > 0 ? act.skillsAwarded : act.skills).map((sk) => (
                        <span
                          key={sk}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isApproved
                              ? 'bg-[#172120] text-[#B7F34A] border border-[#B7F34A]/25'
                              : 'bg-white/[0.04] text-[#9FB0AD] border border-white/[0.06]'
                          }`}
                        >
                          {isApproved ? `+${sk}` : sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rejection notice if rejected: Reason + Reviewer + Resubmit button */}
                  {isRejected && (
                    <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 text-rose-300">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold">Reviewer Feedback:</span>{' '}
                            {act.rejectionReason || 'Submission did not meet verification criteria.'}
                          </div>
                        </div>

                        {/* Resubmit CTA Button */}
                        <button
                          type="button"
                          onClick={() => handleResubmitClick(act)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Resubmit</span>
                        </button>
                      </div>

                      <div className="text-[11px] text-[#9FB0AD] pt-1 border-t border-rose-500/15">
                        Reviewed by <span className="text-[#F3F1EA] font-medium">{reviewerName}</span> on{' '}
                        <span className="font-mono text-[#F3F1EA]">{approvalDate}</span>
                      </div>
                    </div>
                  )}

                  {/* Bottom Line: Evaluator, Approval Date, Real Hash & Proof Modal */}
                  <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-[#9FB0AD] flex flex-wrap items-center gap-2">
                      {isApproved ? (
                        <>
                          <span className="text-[#9FB0AD]/60">Verified by:</span>
                          <span className="font-medium text-[#F3F1EA]">{reviewerName}</span>
                          <span className="text-white/20">·</span>
                          <span className="text-[#9FB0AD] font-mono">{approvalDate}</span>
                        </>
                      ) : isPending ? (
                        <span className="text-amber-300/80 italic flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Awaiting faculty reviewer assignment
                        </span>
                      ) : (
                        <span className="text-rose-300/80">Evaluation Complete</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Blockchain real hash chip */}
                      {isApproved && realHash && (
                        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#172120] border border-[#B7F34A]/25 text-[11px] font-mono text-[#B7F34A]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{formatShortHash(realHash)}</span>
                        </div>
                      )}

                      {/* View Proof Button */}
                      {isApproved && (
                        <button
                          type="button"
                          onClick={() => onSelectProof(act)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B7F34A]/10 hover:bg-[#B7F34A] text-[#B7F34A] hover:text-[#172120] border border-[#B7F34A]/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                        >
                          <span>View proof</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};
