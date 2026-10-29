import React, { useState, useRef, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  Hash, 
  Share2,
  Briefcase,
  Search,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { StatCard } from '../components/StatCard';
import { UploadCard } from '../components/UploadCard';
import { Timeline } from '../components/Timeline';
import { SkillRadar } from '../components/SkillRadar';
import { PortfolioQR } from '../components/PortfolioQR';
import { ProofModal } from '../components/ProofModal';
import { NotificationToast } from '../components/NotificationToast';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { ApplicationTracker } from '../components/jobs/ApplicationTracker';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';
import { useActivities } from '../context/ActivitiesContext';
import { rankJobsForStudent } from '../utils/matchJobs';
import { isPastDeadline } from '../utils/dates';
import { mockStudent } from '../data/mock';

export const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const student = currentUser || mockStudent;
  const studentEmail = student.email || 'aarav.sharma@nitsri.ac.in';

  const { getActivitiesForStudent, addActivity } = useActivities();
  const activities = getActivitiesForStudent(studentEmail);
  const { jobs, applyToJob, getApplicationsForStudent } = useJobs();

  // Prefill state for resubmission
  const [prefillData, setPrefillData] = useState(null);
  const [prefillKey, setPrefillKey] = useState(0);
  const [highlightedActivityId, setHighlightedActivityId] = useState(null);

  // Modal & Toast state
  const [selectedProof, setSelectedProof] = useState(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Jobs filtering state
  const [typeFilter, setTypeFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Job Modal states
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [confirmApplyJob, setConfirmApplyJob] = useState(null);
  const [isConfirmApplyOpen, setIsConfirmApplyOpen] = useState(false);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Listen for activity focus from notifications bell
  useEffect(() => {
    const handleNavigateActivity = (e) => {
      const actId = e.detail?.activityId;
      if (actId) {
        setHighlightedActivityId(actId);
        const el = document.getElementById(`activity-${actId}`) || document.getElementById('activities-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTimeout(() => setHighlightedActivityId(null), 5000);
      }
    };
    window.addEventListener('skillvault:navigate-activity', handleNavigateActivity);
    return () => window.removeEventListener('skillvault:navigate-activity', handleNavigateActivity);
  }, []);

  const handleShowToast = (toastObj) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(toastObj);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 4500);
  };

  const handleCloseToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToast(null);
  };

  const handleOpenProof = (activity) => {
    setSelectedProof(activity);
    setIsProofModalOpen(true);
  };

  const handleAddActivity = async (newActivity) => {
    await addActivity(newActivity);

    // Trigger subtle celebratory confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#B7F34A', '#F3F1EA', '#38BDF8'],
      });
    } catch {
      // safe fallback
    }

    handleShowToast({
      type: 'success',
      title: 'Achievement queued for verification!',
      message: `"${newActivity.title}" was submitted to the faculty review queue.`,
    });
  };

  const handleResubmit = (act) => {
    setPrefillData({
      title: act.title,
      category: act.category,
      description: act.description,
      skills: act.skills || []
    });
    setPrefillKey((k) => k + 1);
    handleShowToast({
      type: 'info',
      title: 'Details prefilled for resubmission',
      message: 'Review or update your achievement proof, then re-submit for faculty verification.'
    });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Rank jobs against the student's verified activities
  const rankedJobs = useMemo(() => {
    return rankJobsForStudent(jobs, activities);
  }, [jobs, activities]);

  // Recommended jobs count (matchScore >= 50)
  const recommendedCount = useMemo(() => {
    return rankedJobs.filter((j) => j.matchData?.isRecommended).length;
  }, [rankedJobs]);

  // Applications submitted by current student
  const studentApplications = getApplicationsForStudent(studentEmail);
  const appliedJobMap = useMemo(() => {
    const map = new Map();
    studentApplications.forEach((app) => {
      map.set(app.jobId, app.status);
    });
    return map;
  }, [studentApplications]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return rankedJobs.filter((job) => {
      if (typeFilter !== 'All' && job.type !== typeFilter) return false;
      if (modeFilter !== 'All' && job.mode !== modeFilter) return false;
      if (recommendedOnly && !job.matchData?.isRecommended) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = job.title?.toLowerCase().includes(q);
        const matchCompany = job.company?.toLowerCase().includes(q);
        const matchLocation = job.location?.toLowerCase().includes(q);
        const matchSkills = [
          ...(job.requiredSkills || []),
          ...(job.preferredSkills || []),
        ].some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchLocation && !matchSkills) return false;
      }
      return true;
    });
  }, [rankedJobs, typeFilter, modeFilter, recommendedOnly, searchQuery]);

  // View details modal trigger
  const handleViewJobDetails = (job) => {
    setSelectedJobForModal(job);
    setIsJobDetailsOpen(true);
  };

  // Initiate Apply
  const handleInitiateApply = (job) => {
    if (appliedJobMap.has(job.id)) {
      handleShowToast({
        type: 'info',
        title: 'Already applied',
        message: 'You have already submitted an application for this position.',
      });
      return;
    }
    if (job.status === 'Closed') {
      handleShowToast({
        type: 'error',
        title: 'Position closed',
        message: 'This vacancy is closed and is no longer accepting applications.',
      });
      return;
    }
    if (job.status !== 'Open' && isPastDeadline(job.deadline)) {
      handleShowToast({
        type: 'error',
        title: 'Deadline passed',
        message: 'The application deadline for this position has expired.',
      });
      return;
    }
    setConfirmApplyJob(job);
    setIsConfirmApplyOpen(true);
  };

  // Submit confirmed application
  const handleConfirmSubmitApplication = async () => {
    if (!confirmApplyJob) return;

    if (confirmApplyJob.status === 'Closed' || (confirmApplyJob.status !== 'Open' && isPastDeadline(confirmApplyJob.deadline))) {
      setIsConfirmApplyOpen(false);
      handleShowToast({
        type: 'error',
        title: 'Cannot apply',
        message: 'This position is closed or past its deadline.',
      });
      setConfirmApplyJob(null);
      return;
    }

    const approved = activities.filter((a) => a && a.status === 'Approved');
    const approvedActivities = approved.map((act) => ({
      title: act.title,
      category: act.category,
      date: act.formattedDate || act.date || '',
      blockchainHash: act.proof?.hash || act.blockchainHash || '',
      hashShort: act.proof?.hash
        ? `${act.proof.hash.slice(0, 6)}...${act.proof.hash.slice(-4)}`
        : act.blockchainHash
        ? `${act.blockchainHash.slice(0, 6)}...${act.blockchainHash.slice(-4)}`
        : '0x7f4c...e6d1',
      skillsAwarded: Array.isArray(act.skillsAwarded) ? act.skillsAwarded : [],
    }));
    const verifiedSkills = Array.from(
      new Set(approved.flatMap((act) => act.skillsAwarded || []).filter(Boolean))
    );

    const jobCompany = confirmApplyJob.company;

    try {
      const result = await applyToJob({
        jobId: confirmApplyJob.id,
        studentEmail,
        studentName: student.name || 'Aarav Sharma',
        matchScore: confirmApplyJob.matchData?.matchScore || 0,
        verifiedSkills,
        approvedActivities,
        institution: student.institution || 'National Institute of Technology, Srinagar',
        verifiedScore: student.verifiedScore || 94,
      });

      setIsConfirmApplyOpen(false);
      setConfirmApplyJob(null);

      if (result?.isDuplicate) {
        handleShowToast({
          type: 'info',
          title: 'Already applied',
          message: 'You have already submitted an application for this position.',
        });
        return;
      }
    } catch (err) {
      setIsConfirmApplyOpen(false);
      handleShowToast({
        type: 'error',
        title: 'Application failed',
        message: err.message || 'Could not submit this application.',
      });
      setConfirmApplyJob(null);
      return;
    }

    handleShowToast({
      type: 'success',
      title: 'Application sent',
      message: `Your verified profile was submitted to ${jobCompany}.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#172120] text-[#F3F1EA] flex flex-col relative selection:bg-[#B7F34A] selection:text-[#172120]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area (Clean container, no heavy sidebar) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* =========================================================================
            SECTION 1: WELCOME HERO
           ========================================================================= */}
        <section id="overview-section" className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E2B2A] border border-[#B7F34A]/25 text-xs font-semibold uppercase tracking-wider text-[#B7F34A] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A] animate-pulse"></span>
                <span>Student dashboard</span>
              </div>

              {/* Heading with Italic Accent */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#F3F1EA]">
                Welcome back,{' '}
                <span className="italic font-normal text-[#B7F34A]">
                  {student.name?.split(' ')[0] || 'Aarav'}.
                </span>
              </h1>

              {/* Subtext with Institution + Enrollment Number */}
              <p className="text-xs sm:text-sm text-[#9FB0AD] mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans">
                <span className="flex items-center gap-1.5 text-[#F3F1EA]">
                  <Building2 className="w-3.5 h-3.5 text-[#B7F34A]" />
                  {student.institution || 'National Institute of Technology, Srinagar'}
                </span>
                <span className="hidden sm:inline text-white/20">·</span>
                <span className="font-mono text-[#9FB0AD] flex items-center gap-1">
                  <Hash className="w-3 h-3 text-[#9FB0AD]" />
                  Roll: {student.enrollmentNo || '2022BCSE042'}
                </span>
                <span className="hidden sm:inline text-white/20">·</span>
                <span className="text-[#9FB0AD]">
                  {student.currentSemester || '7th Semester'} · {student.department || 'CSE'}
                </span>
                <span className="hidden sm:inline text-white/20">·</span>
                <button
                  type="button"
                  onClick={() => scrollToSection('jobs-section')}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B7F34A]/10 border border-[#B7F34A]/30 text-[11px] font-medium text-[#B7F34A] hover:bg-[#B7F34A]/20 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{recommendedCount} Recommended Jobs</span>
                </button>
              </p>
            </div>

            {/* Two Pill CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('upload-section')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] font-semibold text-xs transition-all shadow-[0_0_20px_rgba(183,243,74,0.3)] cursor-pointer hover:translate-y-[-1px]"
              >
                <span>Upload achievement →</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('portfolio-section')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E2B2A] hover:bg-[#253735] text-[#F3F1EA] border border-white/[0.12] hover:border-white/25 font-medium text-xs transition-all cursor-pointer hover:translate-y-[-1px]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#B7F34A]" />
                <span>Share my portfolio</span>
              </button>
            </div>
          </div>

          {/* Stat Cards Row & Verified Score Ring */}
          <StatCard
            activities={activities}
            verifiedScore={student.verifiedScore || 94}
            recommendedJobsCount={recommendedCount}
          />
        </section>

        {/* =========================================================================
            SECTION 2: UPLOAD ACHIEVEMENT (CARD)
           ========================================================================= */}
        <UploadCard
          key={prefillKey}
          onAddActivity={handleAddActivity}
          initialValues={prefillData}
        />

        {/* =========================================================================
            SECTION 3: ACTIVITY TIMELINE
           ========================================================================= */}
        <Timeline
          activities={activities}
          onSelectProof={handleOpenProof}
          onResubmit={handleResubmit}
          highlightedActivityId={highlightedActivityId}
        />

        {/* =========================================================================
            SECTION 4: AI SKILL-GAP & CAREER DASHBOARD
           ========================================================================= */}
        <SkillRadar activities={activities} />

        {/* =========================================================================
            SECTION 5: JOBS FOR YOU (MATCHED TO VERIFIED SKILLS)
           ========================================================================= */}
        <section id="jobs-section" className="mb-14 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E2B2A] border border-[#B7F34A]/25 text-xs font-semibold uppercase tracking-wider text-[#B7F34A] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MATCHED TO YOUR VERIFIED SKILLS</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F3F1EA]">
                Jobs picked <span className="italic text-[#B7F34A]">for you.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#9FB0AD] mt-1">
                Ranked using your approved J&K EduLedger activities (70% core required + 30% preferred).
              </p>
            </div>

            {/* Recommended Toggle */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="recommended-toggle"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1E2B2A] border border-white/10 text-xs font-medium text-[#F3F1EA] cursor-pointer hover:border-white/20 transition-all select-none"
              >
                <input
                  id="recommended-toggle"
                  type="checkbox"
                  checked={recommendedOnly}
                  onChange={(e) => setRecommendedOnly(e.target.checked)}
                  className="rounded bg-[#172120] border-white/20 text-[#B7F34A] focus:ring-[#B7F34A] cursor-pointer"
                />
                <span>Recommended only (50%+)</span>
                <span className="px-2 py-0.5 rounded-full bg-[#172120] text-[#B7F34A] font-mono text-[10px]">
                  {recommendedCount}
                </span>
              </label>
            </div>
          </div>

          {/* Filters Bar: Search, Type, Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6 p-3 sm:p-4 rounded-3xl bg-[#1E2B2A] border border-white/[0.08]">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-[#9FB0AD] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, company, or skills..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#172120] border border-white/10 text-xs text-[#F3F1EA] placeholder-[#9FB0AD]/50 focus:outline-none focus:border-[#B7F34A]/50 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FB0AD] hover:text-[#F3F1EA]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="sm:col-span-4 flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-[#9FB0AD] pl-1 shrink-0 hidden lg:inline">
                Type:
              </span>
              <div className="flex items-center gap-1 w-full overflow-x-auto">
                {['All', 'Full-time', 'Internship', 'Part-time'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      typeFilter === t
                        ? 'bg-[#B7F34A] text-[#172120] font-semibold'
                        : 'bg-[#172120] text-[#9FB0AD] hover:text-[#F3F1EA]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Filter */}
            <div className="sm:col-span-3 flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-[#9FB0AD] pl-1 shrink-0 hidden lg:inline">
                Mode:
              </span>
              <div className="flex items-center gap-1 w-full overflow-x-auto">
                {['All', 'Remote', 'Hybrid', 'On-site'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModeFilter(m)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      modeFilter === m
                        ? 'bg-[#B7F34A] text-[#172120] font-semibold'
                        : 'bg-[#172120] text-[#9FB0AD] hover:text-[#F3F1EA]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          {filteredJobs.length === 0 ? (
            <div className="rounded-[32px] bg-[#1E2B2A] border border-white/[0.08] p-12 text-center flex flex-col items-center justify-center my-6">
              <div className="w-14 h-14 rounded-2xl bg-[#172120] border border-white/10 flex items-center justify-center text-[#9FB0AD] mb-3">
                <Briefcase className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#F3F1EA]">
                {recommendedOnly
                  ? 'No recommended jobs meeting 50%+ threshold'
                  : 'No matching vacancies found'}
              </h3>
              <p className="text-xs text-[#9FB0AD] max-w-md mt-1 leading-relaxed">
                {recommendedOnly
                  ? 'Get more activities approved to unlock matches, or uncheck "Recommended only" to inspect all open positions.'
                  : 'Try loosening your filter parameters or clearing your search keywords.'}
              </p>
              {recommendedOnly && (
                <button
                  type="button"
                  onClick={() => setRecommendedOnly(false)}
                  className="mt-4 px-5 py-2 rounded-full bg-[#172120] border border-[#B7F34A]/30 text-xs text-[#B7F34A] hover:bg-white/5 cursor-pointer transition-colors"
                >
                  Show all open vacancies
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  matchData={job.matchData}
                  isApplied={appliedJobMap.has(job.id)}
                  applicationStatus={appliedJobMap.get(job.id)}
                  onViewDetails={handleViewJobDetails}
                  onApply={handleInitiateApply}
                />
              ))}
            </div>
          )}

          {/* =========================================================================
              SUBSECTION: MY APPLICATIONS TRACKER
             ========================================================================= */}
          <div className="mt-14 pt-8 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1E2B2A] border border-white/10 text-[10px] font-mono uppercase text-[#B7F34A] mb-1">
                  <span>REAL-TIME AUDIT TRACKER</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#F3F1EA]">
                  My applications & <span className="italic text-[#B7F34A]">status.</span>
                </h3>
              </div>
              <span className="text-xs font-mono text-[#9FB0AD]">
                {studentApplications.length} active applications
              </span>
            </div>

            <ApplicationTracker applications={studentApplications} />
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: VERIFIED PORTFOLIO / RECRUITER LINK
           ========================================================================= */}
        <PortfolioQR student={student} onShowToast={handleShowToast} />
      </main>

      {/* Proof Modal for Inspecting Certificates & Blockchain Hashes */}
      <ProofModal
        item={selectedProof}
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJobForModal}
        matchData={selectedJobForModal?.matchData}
        isOpen={isJobDetailsOpen}
        onClose={() => {
          setIsJobDetailsOpen(false);
          setSelectedJobForModal(null);
        }}
        isApplied={selectedJobForModal ? appliedJobMap.has(selectedJobForModal.id) : false}
        applicationStatus={
          selectedJobForModal ? appliedJobMap.get(selectedJobForModal.id) : ''
        }
        onApply={handleInitiateApply}
      />

      {/* Confirm Application Modal */}
      {isConfirmApplyOpen && confirmApplyJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setIsConfirmApplyOpen(false)}
            className="fixed inset-0 bg-[#0E1514]/80 backdrop-blur-md"
          />
          <div className="relative w-full max-w-lg bg-[#1E2B2A] border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsConfirmApplyOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#9FB0AD] hover:text-[#F3F1EA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#172120] border border-white/10 flex items-center justify-center font-serif text-xl font-bold text-[#B7F34A]">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#B7F34A]">
                  SkillVault Direct Application
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#F3F1EA]">
                  Apply to {confirmApplyJob.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#9FB0AD] mb-4 leading-relaxed">
              You are submitting your tamper-proof institutional credentials to{' '}
              <strong className="text-[#F3F1EA]">{confirmApplyJob.company}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-[#172120] border border-white/[0.06] space-y-2 mb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-[#9FB0AD]">Candidate:</span>
                <span className="font-semibold text-[#F3F1EA]">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9FB0AD]">Institutional Email:</span>
                <span className="font-mono text-[#F3F1EA]">{studentEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9FB0AD]">Verified NAAC Index:</span>
                <span className="font-semibold text-[#B7F34A]">
                  {student.verifiedScore || 94} / 100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9FB0AD]">Algorithmic Match:</span>
                <span className="font-semibold text-[#B7F34A]">
                  {confirmApplyJob.matchData?.matchScore || 0}%
                </span>
              </div>
            </div>

            {confirmApplyJob.matchData?.matchedSkills?.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-mono uppercase text-[#9FB0AD] mb-1.5">
                  Verified Skills Included in Submission:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {confirmApplyJob.matchData.matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#B7F34A]/10 text-[#B7F34A] border border-[#B7F34A]/25"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setIsConfirmApplyOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-medium text-[#9FB0AD] hover:text-[#F3F1EA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmitApplication}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] font-semibold text-xs transition-all shadow-[0_0_20px_rgba(183,243,74,0.3)] cursor-pointer"
              >
                <span>Confirm & Submit →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      <NotificationToast toast={toast} onClose={handleCloseToast} />

      {/* Footer */}
      <Footer />
    </div>
  );
};
