import React, { useState, useMemo, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  FileText,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Download,
  Building2,
  Calendar,
  AlertTriangle,
  Loader2,
  CheckCheck
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { NotificationToast } from '../components/NotificationToast';
import { SkillTagInput } from '../components/jobs/SkillTagInput';
import { useAuth } from '../context/AuthContext';
import { useActivities } from '../context/ActivitiesContext';
import { todayISO } from '../utils/dates';

const CATEGORIES = [
  'All Categories',
  'Technical',
  'Sports',
  'Cultural',
  'Research',
  'Internship',
  'Volunteering'
];

const QUICK_REJECTION_REASONS = [
  'Document unreadable',
  'Not an institutional achievement',
  "Details don't match certificate",
  'Duplicate submission'
];

/**
 * Helper to escape CSV cells and protect against formula injection:
 * Converts to string, prefixes with ' if starting with =, +, -, @, \t, or \r,
 * escapes double quotes and wraps in quotes.
 */
function csvCell(value) {
  let str = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export function AdminDashboard() {
  const { currentUser } = useAuth();
  const { activities, approveActivity, rejectActivity } = useActivities();

  const adminName = currentUser?.name || 'Dr. Sunita Koul';
  const todayStr = todayISO();

  // Review Queue Filter States
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Review Panel State
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [skillsToAward, setSkillsToAward] = useState([]);
  const [skillsError, setSkillsError] = useState('');

  // Reject flow state
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  // Loading & Copy States
  const [isApproving, setIsApproving] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Focus trap / escape ref & double-submit locks
  const modalRef = useRef(null);
  const openerRef = useRef(null);
  const reviewingRef = useRef(false);

  // Cleanup toast timer
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (toastObj) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(toastObj);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 4500);
  };

  // Stat computations
  const stats = useMemo(() => {
    const pending = activities.filter((a) => a.status === 'Pending').length;
    const approved = activities.filter((a) => a.status === 'Approved').length;
    const rejected = activities.filter((a) => a.status === 'Rejected').length;
    const totalReviewed = approved + rejected;
    const approvalRate = totalReviewed > 0 ? Math.round((approved / totalReviewed) * 100) : 100;
    const reviewedToday = activities.filter(
      (a) => a.reviewedAt && a.reviewedAt.startsWith(todayStr)
    ).length;

    return { pending, approved, rejected, approvalRate, reviewedToday };
  }, [activities, todayStr]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      Pending: activities.filter((a) => a.status === 'Pending').length,
      Approved: activities.filter((a) => a.status === 'Approved').length,
      Rejected: activities.filter((a) => a.status === 'Rejected').length,
      All: activities.length
    };
  }, [activities]);

  // Filtered & Sorted Queue
  const filteredQueue = useMemo(() => {
    return activities
      .filter((item) => {
        if (activeTab !== 'All' && item.status !== activeTab) {
          return false;
        }
        if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchStudent = item.studentName?.toLowerCase().includes(q);
          const matchEmail = item.studentEmail?.toLowerCase().includes(q);
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchInst = item.institution?.toLowerCase().includes(q);
          if (!matchStudent && !matchEmail && !matchTitle && !matchInst) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        // Pending sorted oldest first
        if (activeTab === 'Pending') {
          const dateA = a.submittedAt || a.date || '';
          const dateB = b.submittedAt || b.date || '';
          return dateA.localeCompare(dateB);
        }
        // Others sorted newest first
        const dateA = a.submittedAt || a.date || '';
        const dateB = b.submittedAt || b.date || '';
        return dateB.localeCompare(dateA);
      });
  }, [activities, activeTab, selectedCategory, searchQuery]);

  // Currently reviewed activity object
  const selectedActivity = useMemo(() => {
    return activities.find((a) => a.id === selectedActivityId) || null;
  }, [activities, selectedActivityId]);

  // Index of currently selected item in the filtered list
  const currentQueueIndex = useMemo(() => {
    if (!selectedActivityId) return -1;
    return filteredQueue.findIndex((a) => a.id === selectedActivityId);
  }, [filteredQueue, selectedActivityId]);

  // Open Review Panel
  const handleOpenReview = (activity, e) => {
    if (e?.currentTarget) {
      openerRef.current = e.currentTarget;
    } else if (document.activeElement && document.activeElement !== document.body) {
      openerRef.current = document.activeElement;
    }

    setSelectedActivityId(activity.id);
    setIsReviewOpen(true);
    setIsRejecting(false);
    setRejectionReason('');
    setRejectionError('');
    setSkillsError('');

    // Pre-fill skills to award with student-stated skills or existing awarded
    if (activity.status === 'Approved' && activity.skillsAwarded?.length > 0) {
      setSkillsToAward([...activity.skillsAwarded]);
    } else if (activity.skills && activity.skills.length > 0) {
      setSkillsToAward([...activity.skills]);
    } else {
      setSkillsToAward([`${activity.category} Core`]);
    }
  };

  // Close Review Panel
  const handleCloseReview = () => {
    setIsReviewOpen(false);
    setSelectedActivityId(null);
    setIsRejecting(false);
    setIsApproving(false);

    if (openerRef.current && typeof openerRef.current.focus === 'function') {
      const elToFocus = openerRef.current;
      openerRef.current = null;
      setTimeout(() => {
        elToFocus.focus();
      }, 0);
    }
  };

  // Keyboard navigation, focus trap & escape listener
  useEffect(() => {
    if (!isReviewOpen || !modalRef.current) return;

    const modalElement = modalRef.current;

    const getFocusableElements = () => {
      const selector =
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return Array.from(modalElement.querySelectorAll(selector)).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
      );
    };

    // On open, focus the first focusable element
    const initialTimer = setTimeout(() => {
      const focusables = getFocusableElements();
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }, 10);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseReview();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusableElements();
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !modalElement.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !modalElement.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReviewOpen]);

  // Navigate next/prev in queue
  const handleNavigateQueue = (direction) => {
    if (filteredQueue.length === 0) return;
    let nextIndex = currentQueueIndex + direction;
    if (nextIndex < 0) nextIndex = filteredQueue.length - 1;
    if (nextIndex >= filteredQueue.length) nextIndex = 0;
    const nextItem = filteredQueue[nextIndex];
    if (nextItem) {
      handleOpenReview(nextItem);
    }
  };

  // Approve Activity Flow with double-submit guard
  const handleApprove = async () => {
    if (!selectedActivity || reviewingRef.current) return;

    if (skillsToAward.length === 0) {
      setSkillsError('At least one verified skill is required to approve this credential.');
      return;
    }
    setSkillsError('');

    reviewingRef.current = true;
    setIsApproving(true);

    try {
      // Simulated short 700ms minting state
      await new Promise((r) => setTimeout(r, 700));

      const updated = await approveActivity({
        id: selectedActivity.id,
        skillsAwarded: skillsToAward,
        adminName
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#B7F34A', '#22C55E', '#38BDF8', '#F3F1EA']
        });
      } catch {
        // Safe fallback
      }

      const shortHash = updated.proof?.hash
        ? `${updated.proof.hash.slice(0, 10)}...${updated.proof.hash.slice(-6)}`
        : '0x...';

      showToast({
        type: 'success',
        title: 'Credential Approved & Hash Minted!',
        message: `Ledger Proof: ${shortHash} on Govt. J&K EduLedger.`
      });

      // Auto-advance to next pending item if available
      const remainingPending = filteredQueue.filter(
        (a) => a.id !== selectedActivity.id && a.status === 'Pending'
      );
      if (remainingPending.length > 0) {
        handleOpenReview(remainingPending[0]);
      } else {
        handleCloseReview();
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Approval Failed',
        message: err.message || 'Could not approve activity.'
      });
    } finally {
      reviewingRef.current = false;
      setIsApproving(false);
    }
  };

  // Reject Activity Flow with double-submit guard
  const handleReject = async () => {
    if (!selectedActivity || reviewingRef.current) return;

    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      setRejectionError('Rejection reason must be at least 10 characters long.');
      return;
    }
    setRejectionError('');

    reviewingRef.current = true;
    try {
      await rejectActivity({
        id: selectedActivity.id,
        reason: rejectionReason.trim(),
        adminName
      });

      showToast({
        type: 'info',
        title: 'Submission Rejected',
        message: `Reason recorded and feedback notified to ${selectedActivity.studentName}.`
      });

      // Auto-advance
      const remainingPending = filteredQueue.filter(
        (a) => a.id !== selectedActivity.id && a.status === 'Pending'
      );
      if (remainingPending.length > 0) {
        handleOpenReview(remainingPending[0]);
      } else {
        handleCloseReview();
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Rejection Failed',
        message: err.message || 'Could not reject activity.'
      });
    } finally {
      reviewingRef.current = false;
    }
  };

  // Copy SHA-256 Checksum
  const handleCopyChecksum = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Export Accreditation CSV with formula injection escaping and UTF-8 BOM
  const handleExportCSV = () => {
    const approvedActivities = activities.filter((a) => a.status === 'Approved');
    if (approvedActivities.length === 0) {
      showToast({
        type: 'info',
        title: 'No approved records',
        message: 'There are no approved credentials ready for accreditation export.'
      });
      return;
    }

    const headers = [
      'Student Name',
      'Student Email',
      'Institution',
      'Title',
      'Category',
      'Date',
      'Skills Awarded',
      'File Checksum (SHA-256)',
      'Blockchain Proof Hash',
      'Reviewed By',
      'Reviewed At'
    ].map(csvCell);

    const rows = approvedActivities.map((act) => [
      csvCell(act.studentName),
      csvCell(act.studentEmail),
      csvCell(act.institution),
      csvCell(act.title),
      csvCell(act.category),
      csvCell(act.date),
      csvCell((act.skillsAwarded || []).join('; ')),
      csvCell(act.fileHash),
      csvCell(act.proof?.hash),
      csvCell(act.reviewedBy),
      csvCell(act.reviewedAt)
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SkillVault_NAAC_NIRF_Accreditation_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'Accreditation CSV Exported',
      message: `Downloaded ${approvedActivities.length} approved institutional records.`
    });
  };

  // Summary counts for Accreditation Card
  const accreditationGrouped = useMemo(() => {
    const approved = activities.filter((a) => a.status === 'Approved');
    const byCategory = {};
    const byInstitution = {};

    approved.forEach((a) => {
      byCategory[a.category] = (byCategory[a.category] || 0) + 1;
      const inst = a.institution || 'Unknown Institution';
      byInstitution[inst] = (byInstitution[inst] || 0) + 1;
    });

    return { approvedCount: approved.length, byCategory, byInstitution };
  }, [activities]);

  return (
    <div className="min-h-screen bg-[#172120] text-[#F3F1EA] flex flex-col relative selection:bg-[#B7F34A] selection:text-[#172120]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* =========================================================================
            SECTION 1: HERO & STAT METRICS
           ========================================================================= */}
        <section id="admin-hero" className="mb-10">
          <div className="pb-6 border-b border-white/[0.06]">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E2B2A] border border-[#B7F34A]/25 text-xs font-semibold uppercase tracking-wider text-[#B7F34A] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A] animate-pulse"></span>
              <span>College admin</span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#F3F1EA]">
              Verification <span className="italic font-normal text-[#B7F34A]">desk.</span>
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-sm text-[#9FB0AD] mt-2 max-w-2xl font-sans">
              Welcome back, <span className="text-[#F3F1EA] font-medium">{adminName}</span>. Review
              student achievement proofs, digitally sign and mint on-chain verification digests, and
              streamline institutional NAAC/NIRF accreditation.
            </p>
          </div>

          {/* 5 Admin Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {/* Pending */}
            <div className="rounded-[22px] bg-[#1E2B2A] border border-amber-500/30 p-4 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-amber-300 mb-2">
                <span className="font-medium">Pending Review</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#F3F1EA]">
                {stats.pending}
              </div>
              <p className="text-[11px] text-[#9FB0AD] mt-1">Awaiting digital signoff</p>
            </div>

            {/* Approved */}
            <div className="rounded-[22px] bg-[#1E2B2A] border border-[#B7F34A]/25 p-4 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#B7F34A] mb-2">
                <span className="font-medium">Approved & Minted</span>
                <CheckCircle2 className="w-4 h-4 text-[#B7F34A]" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#F3F1EA]">
                {stats.approved}
              </div>
              <p className="text-[11px] text-[#9FB0AD] mt-1">Tamper-proof on-chain</p>
            </div>

            {/* Rejected */}
            <div className="rounded-[22px] bg-[#1E2B2A] border border-rose-500/25 p-4 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-rose-300 mb-2">
                <span className="font-medium">Rejected</span>
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#F3F1EA]">
                {stats.rejected}
              </div>
              <p className="text-[11px] text-[#9FB0AD] mt-1">Returned with feedback</p>
            </div>

            {/* Approval Rate */}
            <div className="rounded-[22px] bg-[#1E2B2A] border border-white/[0.08] p-4 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#9FB0AD] mb-2">
                <span className="font-medium">Approval Rate</span>
                <Sparkles className="w-4 h-4 text-[#B7F34A]" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#B7F34A]">
                {stats.approvalRate}%
              </div>
              <p className="text-[11px] text-[#9FB0AD] mt-1">Institutional acceptance</p>
            </div>

            {/* Reviewed Today */}
            <div className="rounded-[22px] bg-[#1E2B2A] border border-white/[0.08] p-4 relative overflow-hidden shadow-sm col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs text-sky-300 mb-2">
                <span className="font-medium">Reviewed Today</span>
                <CheckCheck className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#F3F1EA]">
                {stats.reviewedToday}
              </div>
              <p className="text-[11px] text-[#9FB0AD] mt-1">Decisions made today</p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: REVIEW QUEUE
           ========================================================================= */}
        <section id="review-queue-section" className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#B7F34A] flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#B7F34A]"></span>
                <span>Verification Queue</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F3F1EA]">
                Student Submission <span className="italic text-[#B7F34A]">Queue</span>
              </h2>
            </div>

            {/* Search and Category Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  aria-label="Filter by Category"
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
                  placeholder="Search student, title, college..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1E2B2A] border border-white/10 focus:border-[#B7F34A] text-[#F3F1EA] placeholder-[#9FB0AD]/50 text-xs rounded-full pl-8 pr-4 py-2 outline-none w-56 sm:w-64 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Tab Filter Pills */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#B7F34A] text-[#172120] font-semibold shadow-[0_0_15px_rgba(183,243,74,0.3)]'
                      : 'bg-[#1E2B2A] border border-white/[0.08] text-[#9FB0AD] hover:text-[#F3F1EA] hover:border-white/20'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-[#172120]/20 text-[#172120]' : 'bg-[#172120] text-[#B7F34A]'
                    }`}
                  >
                    {tabCounts[tab]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Queue List Table / Cards */}
          {filteredQueue.length === 0 ? (
            <div className="rounded-[28px] bg-[#1E2B2A] border border-white/[0.08] p-12 text-center my-6">
              <div className="w-12 h-12 rounded-full bg-[#172120] border border-white/10 mx-auto flex items-center justify-center text-[#B7F34A] mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#F3F1EA]">
                No pending submissions. You're all caught up.
              </h3>
              <p className="text-xs text-[#9FB0AD] mt-1 max-w-sm mx-auto">
                All student credentials in this view have been audited, or no submissions match the
                selected filters.
              </p>
              {(selectedCategory !== 'All Categories' || searchQuery.trim()) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All Categories');
                    setSearchQuery('');
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs text-[#F3F1EA] transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQueue.map((item) => {
                const isPending = item.status === 'Pending';
                const isApproved = item.status === 'Approved';
                const isRejected = item.status === 'Rejected';

                return (
                  <div
                    key={item.id}
                    className="rounded-[22px] bg-[#1E2B2A] border border-white/[0.08] hover:border-white/20 p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:shadow-lg"
                  >
                    {/* Left: Student & Activity Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-[#F3F1EA]">
                          {item.studentName}
                        </span>
                        <span className="text-[11px] text-[#9FB0AD] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#B7F34A]" />
                          {item.institution}
                        </span>
                        <span className="text-white/20 hidden sm:inline">·</span>
                        <span className="text-[11px] font-mono text-[#9FB0AD]">
                          {item.studentEmail}
                        </span>
                      </div>

                      <h4 className="font-serif text-base sm:text-lg font-medium text-[#F3F1EA] truncate group-hover:text-[#B7F34A] transition-colors">
                        {item.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#F3F1EA]">
                          {item.category}
                        </span>
                        <span className="text-xs text-[#9FB0AD] flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-[#9FB0AD]" />
                          Submitted: {item.submittedAt || item.date}
                        </span>
                        {item.skills && item.skills.length > 0 && (
                          <div className="hidden lg:flex items-center gap-1">
                            <span className="text-[10px] text-[#9FB0AD]">Skills:</span>
                            {item.skills.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-[#172120] text-[#B7F34A] border border-[#B7F34A]/20"
                              >
                                {s}
                              </span>
                            ))}
                            {item.skills.length > 3 && (
                              <span className="text-[10px] text-[#9FB0AD]">
                                +{item.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Status badge & Action button */}
                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                      <div>
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-emerald-500/15 text-[#B7F34A] border border-[#B7F34A]/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approved</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleOpenReview(item, e)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isPending
                            ? 'bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] shadow-[0_0_15px_rgba(183,243,74,0.25)]'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] text-[#F3F1EA]'
                        }`}
                      >
                        <span>{isPending ? 'Review →' : 'View Audit'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 3: ACCREDITATION SUMMARY (WEEK-8 TEASER)
           ========================================================================= */}
        <section id="accreditation-summary" className="mb-14">
          <div className="rounded-[28px] bg-[#1E2B2A] border border-white/[0.08] p-6 sm:p-8 relative overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172120] border border-[#B7F34A]/25 text-[11px] font-semibold uppercase tracking-wider text-[#B7F34A] mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Institutional Accreditation</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F3F1EA]">
                  NAAC Criterion 5 & NIRF <span className="italic text-[#B7F34A]">Metrics</span>
                </h3>
                <p className="text-xs text-[#9FB0AD] mt-1">
                  Centralized aggregation of verified student records with cryptographic checksums
                  for regulatory audits.
                </p>
              </div>

              {/* Export CSV CTA */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] font-semibold text-xs transition-all shadow-[0_0_20px_rgba(183,243,74,0.3)] cursor-pointer hover:translate-y-[-1px] shrink-0 self-start md:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Export Accreditation CSV</span>
              </button>
            </div>

            {/* Breakdown by Category & Institution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Category Breakdown */}
              <div className="bg-[#172120] rounded-2xl p-4 sm:p-5 border border-white/[0.06]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9FB0AD] mb-3 flex items-center justify-between">
                  <span>Approved Achievements by Category</span>
                  <span className="text-[#B7F34A] font-mono">
                    {accreditationGrouped.approvedCount} Total
                  </span>
                </h4>
                <div className="space-y-2">
                  {Object.entries(accreditationGrouped.byCategory).length === 0 ? (
                    <p className="text-xs text-[#9FB0AD]/60 italic">No approved records yet.</p>
                  ) : (
                    Object.entries(accreditationGrouped.byCategory).map(([cat, count]) => (
                      <div
                        key={cat}
                        className="flex items-center justify-between text-xs py-1 border-b border-white/[0.04]"
                      >
                        <span className="text-[#F3F1EA]">{cat}</span>
                        <span className="font-mono text-[#B7F34A] font-semibold">{count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Institution Breakdown */}
              <div className="bg-[#172120] rounded-2xl p-4 sm:p-5 border border-white/[0.06]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9FB0AD] mb-3 flex items-center justify-between">
                  <span>Approved Achievements by HEI</span>
                  <span className="text-[#B7F34A] font-mono">
                    {Object.keys(accreditationGrouped.byInstitution).length} Colleges
                  </span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scroll">
                  {Object.entries(accreditationGrouped.byInstitution).length === 0 ? (
                    <p className="text-xs text-[#9FB0AD]/60 italic">No approved records yet.</p>
                  ) : (
                    Object.entries(accreditationGrouped.byInstitution).map(([inst, count]) => (
                      <div
                        key={inst}
                        className="flex items-center justify-between text-xs py-1 border-b border-white/[0.04]"
                      >
                        <span className="text-[#F3F1EA] truncate max-w-[240px] sm:max-w-xs">
                          {inst}
                        </span>
                        <span className="font-mono text-[#B7F34A] font-semibold">{count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* =========================================================================
          REVIEW PANEL MODAL (SPLIT VIEW)
         ========================================================================= */}
      {isReviewOpen && selectedActivity && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-panel-title"
          tabIndex={-1}
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto outline-none"
        >
          {/* Backdrop */}
          <div
            onClick={handleCloseReview}
            className="fixed inset-0 bg-[#0d1413]/85 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-5xl rounded-[28px] bg-[#1E2B2A] border border-white/[0.12] p-5 sm:p-8 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B7F34A]/10 border border-[#B7F34A]/30 flex items-center justify-center text-[#B7F34A]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="review-panel-title"
                    className="font-serif text-lg sm:text-xl font-semibold text-[#F3F1EA]"
                  >
                    Submission <span className="italic text-[#B7F34A]">Review & Verification</span>
                  </h3>
                  <p className="text-[11px] text-[#9FB0AD] font-mono">
                    ID: {selectedActivity.id} · Status:{' '}
                    <span
                      className={`font-semibold ${
                        selectedActivity.status === 'Approved'
                          ? 'text-[#B7F34A]'
                          : selectedActivity.status === 'Pending'
                          ? 'text-amber-300'
                          : 'text-rose-400'
                      }`}
                    >
                      {selectedActivity.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Prev / Next & Close */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigateQueue(-1)}
                  aria-label="Previous submission"
                  className="p-2 rounded-full text-[#9FB0AD] hover:text-[#F3F1EA] hover:bg-white/[0.06] transition-colors cursor-pointer"
                  title="Previous submission"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[#9FB0AD] hidden sm:inline">
                  {currentQueueIndex + 1} of {filteredQueue.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleNavigateQueue(1)}
                  aria-label="Next submission"
                  className="p-2 rounded-full text-[#9FB0AD] hover:text-[#F3F1EA] hover:bg-white/[0.06] transition-colors cursor-pointer"
                  title="Next submission"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCloseReview}
                  aria-label="Close review modal"
                  className="p-2 rounded-full text-[#9FB0AD] hover:text-[#F3F1EA] hover:bg-white/[0.06] transition-colors cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Body */}
            <div className="overflow-y-auto py-5 custom-scroll flex-1 pr-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* =================================================================
                    LEFT: DOCUMENT PREVIEW & FILE SHA-256
                   ================================================================= */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#9FB0AD] block mb-2">
                      Proof Document Preview
                    </span>

                    {selectedActivity.fileUrl && selectedActivity.fileType === 'image' ? (
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#141D1C]">
                        <img
                          src={selectedActivity.fileUrl}
                          alt="Certificate Proof"
                          className="w-full max-h-64 sm:max-h-80 object-contain p-2 bg-[#121817]"
                        />
                        <div className="p-3 bg-[#172120] border-t border-white/[0.08] flex items-center justify-between text-xs">
                          <span className="text-[#F3F1EA] truncate">
                            {selectedActivity.fileName}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#B7F34A]">
                            Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Styled PDF Placeholder Card */
                      <div className="rounded-2xl border border-white/10 bg-[#141D1C] p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#1E2B2A] border border-white/10 flex items-center justify-center text-[#B7F34A] mb-3 shadow-inner">
                          <FileText className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-semibold text-[#F3F1EA] max-w-xs break-all">
                          {selectedActivity.fileName || 'certificate_proof.pdf'}
                        </p>
                        <p className="text-xs text-[#9FB0AD] mt-1">
                          Digitally submitted institutional PDF document
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                          <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#1E2B2A] text-[#9FB0AD] border border-white/[0.08]">
                            {selectedActivity.category} Credential
                          </span>
                          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#B7F34A] border border-[#B7F34A]/20">
                            Digital Seal Verified
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Raw File Checksum (SHA-256) */}
                  <div className="bg-[#172120] rounded-2xl p-4 border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="text-[10px] uppercase font-mono text-[#9FB0AD]">
                        File Binary Checksum (SHA-256)
                      </span>
                      {selectedActivity.fileHash && (
                        <button
                          type="button"
                          onClick={() => handleCopyChecksum(selectedActivity.fileHash)}
                          className="inline-flex items-center gap-1 text-[11px] text-[#B7F34A] hover:underline cursor-pointer"
                        >
                          {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                    <div className={`p-2.5 rounded-xl bg-[#121918] border border-white/[0.08] text-[11px] break-all ${selectedActivity.fileHash ? 'font-mono text-[#F3F1EA] select-all' : 'text-[#9FB0AD]/60 italic'}`}>
                      {selectedActivity.fileHash || 'No file attached'}
                    </div>
                  </div>
                </div>

                {/* =================================================================
                    RIGHT: STUDENT & ACTIVITY DETAILS + SKILLS TO AWARD
                   ================================================================= */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Student Details Card */}
                  <div className="bg-[#172120] rounded-2xl p-4 sm:p-5 border border-white/[0.06]">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/[0.06] text-[#F3F1EA]">
                        {selectedActivity.category}
                      </span>
                      <span className="text-xs text-[#9FB0AD] flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        Date: {selectedActivity.date}
                      </span>
                    </div>

                    <h4 className="text-lg font-serif font-semibold text-[#F3F1EA] mb-2">
                      {selectedActivity.title}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-2 border-y border-white/[0.04] text-[#9FB0AD]">
                      <div>
                        <span className="text-[#9FB0AD]/60">Student:</span>{' '}
                        <span className="font-semibold text-[#F3F1EA]">
                          {selectedActivity.studentName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#9FB0AD]/60">Email:</span>{' '}
                        <span className="font-mono text-[#F3F1EA]">
                          {selectedActivity.studentEmail}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[#9FB0AD]/60">Institution:</span>{' '}
                        <span className="text-[#F3F1EA]">{selectedActivity.institution}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-xs font-medium text-[#9FB0AD] block mb-1">
                        Achievement Description:
                      </span>
                      <p className="text-xs text-[#F3F1EA] leading-relaxed bg-[#141D1C] p-3 rounded-xl border border-white/[0.04]">
                        {selectedActivity.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Student stated skills */}
                    {selectedActivity.skills && selectedActivity.skills.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[11px] text-[#9FB0AD] block mb-1.5 font-medium">
                          Skills the student indicated this shows:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedActivity.skills.map((s) => (
                            <span
                              key={s}
                              className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1A2624] text-[#B7F34A] border border-[#B7F34A]/20"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Skills to Award Tag Input */}
                  {selectedActivity.status === 'Pending' ? (
                    <div className="bg-[#172120] rounded-2xl p-4 sm:p-5 border border-white/[0.06]">
                      <div className="mb-2">
                        <span className="text-xs font-semibold text-[#F3F1EA] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#B7F34A]" />
                          Verified Skills to Award (Minted to Student Record)
                        </span>
                        <p className="text-[11px] text-[#9FB0AD] mt-0.5">
                          Admin can add or remove verified skills from the accredited vocabulary. At
                          least one skill is required to approve.
                        </p>
                      </div>

                      <SkillTagInput
                        id="skills-to-award-input"
                        tags={skillsToAward}
                        onChange={(newTags) => {
                          setSkillsToAward(newTags);
                          if (newTags.length > 0) setSkillsError('');
                        }}
                        placeholder="Add verified skill (e.g. Edge AI, PyTorch)..."
                        error={skillsError}
                      />
                    </div>
                  ) : selectedActivity.status === 'Approved' ? (
                    <div className="bg-[#172120] rounded-2xl p-4 sm:p-5 border border-[#B7F34A]/25">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#B7F34A] mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approved & Ledger Proof Minted</span>
                      </div>
                      <p className="text-xs text-[#9FB0AD]">
                        Reviewed by <span className="text-[#F3F1EA]">{selectedActivity.reviewedBy}</span> on{' '}
                        <span className="font-mono text-[#F3F1EA]">{selectedActivity.reviewedAt}</span>
                      </p>
                      <div className="mt-2 text-xs">
                        <span className="text-[#9FB0AD] block mb-1">Awarded Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedActivity.skillsAwarded?.map((sk) => (
                            <span
                              key={sk}
                              className="text-xs px-2.5 py-0.5 rounded-full bg-[#1E2B2A] text-[#B7F34A] border border-[#B7F34A]/30"
                            >
                              +{sk}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedActivity.proof?.hash && (
                        <div className="mt-3 pt-3 border-t border-white/[0.06]">
                          <span className="text-[10px] font-mono uppercase text-[#9FB0AD] block mb-1">
                            Ledger Proof Hash:
                          </span>
                          <div className="p-2 rounded-lg bg-[#121817] font-mono text-[11px] text-[#B7F34A] break-all select-all">
                            {selectedActivity.proof.hash}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Rejected Notice */
                    <div className="bg-rose-500/10 rounded-2xl p-4 sm:p-5 border border-rose-500/25">
                      <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 mb-1">
                        <XCircle className="w-4 h-4" />
                        <span>Submission Rejected</span>
                      </div>
                      <p className="text-xs text-[#9FB0AD]">
                        Reviewed by <span className="text-[#F3F1EA]">{selectedActivity.reviewedBy}</span> on{' '}
                        <span className="font-mono text-[#F3F1EA]">{selectedActivity.reviewedAt}</span>
                      </p>
                      <div className="mt-2 p-3 rounded-xl bg-black/20 text-rose-200 text-xs">
                        <span className="font-semibold">Reason:</span> {selectedActivity.rejectionReason}
                      </div>
                    </div>
                  )}

                  {/* =================================================================
                      ACTION BUTTONS (APPROVE / REJECT)
                     ================================================================= */}
                  {selectedActivity.status === 'Pending' ? (
                    <div>
                      {!isRejecting ? (
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          {/* Approve & Mint Hash */}
                          <button
                            type="button"
                            disabled={isApproving}
                            onClick={handleApprove}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] font-semibold text-xs transition-all shadow-[0_0_20px_rgba(183,243,74,0.3)] cursor-pointer hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isApproving ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Minting Hash to Ledger...</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4" />
                                <span>Approve & Mint Hash</span>
                              </>
                            )}
                          </button>

                          {/* Reject Button */}
                          <button
                            type="button"
                            disabled={isApproving}
                            onClick={() => {
                              setIsRejecting(true);
                              setRejectionError('');
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        /* Inline Rejection Panel */
                        <div className="bg-[#172120] rounded-2xl p-4 sm:p-5 border border-rose-500/30 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Specify Rejection Reason (Required)
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsRejecting(false)}
                              className="text-xs text-[#9FB0AD] hover:text-[#F3F1EA] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>

                          {/* Quick Reason Chips */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {QUICK_REJECTION_REASONS.map((reason) => (
                              <button
                                key={reason}
                                type="button"
                                onClick={() => {
                                  setRejectionReason(reason);
                                  setRejectionError('');
                                }}
                                className="text-[11px] px-2.5 py-1 rounded-full bg-[#1E2B2A] hover:bg-[#253735] text-[#F3F1EA] border border-white/10 transition-colors cursor-pointer"
                              >
                                {reason}
                              </button>
                            ))}
                          </div>

                          <label htmlFor="rejection-reason-textarea" className="sr-only">
                            Rejection Reason
                          </label>
                          <textarea
                            id="rejection-reason-textarea"
                            rows={3}
                            value={rejectionReason}
                            onChange={(e) => {
                              setRejectionReason(e.target.value);
                              if (e.target.value.trim().length >= 10) {
                                setRejectionError('');
                              }
                            }}
                            placeholder="Provide constructive feedback for the student (minimum 10 characters)..."
                            className="w-full bg-[#121918] border border-white/10 rounded-xl p-3 text-xs text-[#F3F1EA] placeholder-[#9FB0AD]/50 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 resize-none transition-all"
                          />

                          {rejectionError && (
                            <p role="alert" className="text-[11px] text-rose-400 mt-1">
                              {rejectionError}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-3">
                            <button
                              type="button"
                              onClick={handleReject}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Confirm Rejection</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsRejecting(false)}
                              className="px-4 py-2 text-xs text-[#9FB0AD] hover:text-[#F3F1EA] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pt-2 text-xs text-[#9FB0AD] italic">
                      This item has already been audited. Digital signatures cannot be modified.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleNavigateQueue(-1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-[#F3F1EA] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleCloseReview}
                className="px-5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-[#F3F1EA] transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleNavigateQueue(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-[#F3F1EA] transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {toast && (
        <NotificationToast
          toast={toast}
          onClose={() => {
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
            setToast(null);
          }}
        />
      )}
    </div>
  );
}
