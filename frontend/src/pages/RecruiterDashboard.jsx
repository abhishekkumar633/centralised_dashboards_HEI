import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Award, 
  Plus, 
  Lock, 
  Unlock, 
  Inbox,
  TrendingUp
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PostJobForm } from '../components/jobs/PostJobForm';
import { ApplicantCard } from '../components/jobs/ApplicantCard';
import { NotificationToast } from '../components/NotificationToast';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';

export const RecruiterDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    jobs, 
    applications, 
    closeJob, 
    reopenJob, 
    updateApplicationStatus, 
    getJobsByRecruiter 
  } = useJobs();

  // Toast state
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Selected job for inspecting applicants (null = all jobs)
  const [selectedJobId, setSelectedJobId] = useState('job-01');
  const [showPostForm, setShowPostForm] = useState(false);
  const [applicantFilter, setApplicantFilter] = useState('All');

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
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

  // Recruiter's jobs
  const recruiterEmail = currentUser?.email || 'tanya.roy@apexsystems.io';
  // Include jobs posted by this recruiter, or all open mock jobs if testing
  const recruiterJobs = getJobsByRecruiter(recruiterEmail);
  const activePostings = recruiterJobs.length > 0 ? recruiterJobs : jobs;

  // Compute top-level metrics
  const openJobsCount = activePostings.filter((j) => j.status === 'Open').length;
  const totalApplicantsCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const hiredCount = applications.filter((a) => a.status === 'Hired').length;

  // Selected job entity
  const selectedJob = activePostings.find((j) => j.id === selectedJobId) || activePostings[0] || null;

  // Filter applicants for the selected job
  let displayedApplications = selectedJob
    ? applications.filter((a) => a.jobId === selectedJob.id)
    : applications;

  if (applicantFilter !== 'All') {
    displayedApplications = displayedApplications.filter(
      (a) => a.status === applicantFilter
    );
  }

  // Sort applicants by matchScore descending
  displayedApplications.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      handleShowToast({
        type: 'success',
        title: 'Applicant pipeline updated',
        message: `Candidate status moved to "${newStatus}".`,
      });
    } catch (err) {
      handleShowToast({
        type: 'error',
        title: 'Update failed',
        message: err.message || 'Could not update applicant status.',
      });
    }
  };

  const handleToggleJobStatus = async (job) => {
    try {
      if (job.status === 'Open') {
        await closeJob(job.id);
        handleShowToast({
          type: 'info',
          title: 'Job posting closed',
          message: `"${job.title}" is now archived. Students can no longer apply.`,
        });
      } else {
        await reopenJob(job.id);
        handleShowToast({
          type: 'success',
          title: 'Job posting reopened',
          message: `"${job.title}" is now accepting verified applications.`,
        });
      }
    } catch (err) {
      handleShowToast({
        type: 'error',
        title: 'Could not update posting',
        message: err.message || 'The server rejected this change.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#172120] text-[#F3F1EA] flex flex-col relative selection:bg-[#B7F34A] selection:text-[#172120]">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* =========================================================================
            SECTION 1: HERO & TOP STATS
           ========================================================================= */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E2B2A] border border-[#B7F34A]/25 text-xs font-semibold uppercase tracking-wider text-[#B7F34A] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A] animate-pulse"></span>
                <span>Recruiter verification desk</span>
              </div>

              {/* Heading */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#F3F1EA]">
                Welcome back,{' '}
                <span className="italic font-normal text-[#B7F34A]">
                  {currentUser?.name?.split(' ')[0] || 'Tanya'}.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-[#9FB0AD] mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans">
                <span className="flex items-center gap-1.5 text-[#F3F1EA]">
                  <Building2 className="w-3.5 h-3.5 text-[#B7F34A]" />
                  {currentUser?.company || 'Apex Systems & AI Labs'}
                </span>
                <span className="hidden sm:inline text-white/20">·</span>
                <span className="text-[#9FB0AD]">
                  Govt. J&K EduLedger Direct Talent Pipeline
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPostForm(!showPostForm)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] font-semibold text-xs transition-all shadow-[0_0_20px_rgba(183,243,74,0.3)] hover:translate-y-[-1px] cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{showPostForm ? 'Hide form' : 'Post a job →'}</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="rounded-[24px] bg-[#1E2B2A] border border-white/[0.08] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD]">
                  Open Postings
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-[#F3F1EA]">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-[#F3F1EA]">
                  {openJobsCount}
                </div>
                <div className="text-[11px] text-[#B7F34A] mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Active on registry</span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] bg-[#1E2B2A] border border-white/[0.08] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD]">
                  Total Applicants
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-[#F3F1EA]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-[#F3F1EA]">
                  {totalApplicantsCount}
                </div>
                <div className="text-[11px] text-[#9FB0AD] mt-1">
                  Verified HEI candidates
                </div>
              </div>
            </div>

            <div className="rounded-[24px] bg-[#1E2B2A] border border-[#B7F34A]/25 p-5 shadow-[0_0_20px_rgba(183,243,74,0.05)]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#B7F34A]">
                  Shortlisted
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#B7F34A]/10 flex items-center justify-center text-[#B7F34A]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-[#B7F34A]">
                  {shortlistedCount}
                </div>
                <div className="text-[11px] text-[#9FB0AD] mt-1">
                  High-alignment stack
                </div>
              </div>
            </div>

            <div className="rounded-[24px] bg-[#1E2B2A] border border-emerald-500/25 p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">
                  Offers Extended
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-emerald-400">
                  {hiredCount}
                </div>
                <div className="text-[11px] text-[#9FB0AD] mt-1">
                  Hired via SkillVault
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: POST A JOB FORM (COLLAPSIBLE / ACCORDION)
           ========================================================================= */}
        {showPostForm && (
          <section className="mb-10 animate-in fade-in zoom-in-98 duration-200">
            <PostJobForm
              onJobPosted={(newJob) => {
                setSelectedJobId(newJob.id);
                setShowPostForm(false);
              }}
              onShowToast={handleShowToast}
            />
          </section>
        )}

        {/* =========================================================================
            SECTION 3: MY POSTINGS LIST & SELECTION
           ========================================================================= */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-mono uppercase text-[#B7F34A] tracking-wider mb-1">
                INSTITUTIONAL VACANCIES
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F3F1EA]">
                My job <span className="italic text-[#B7F34A]">postings.</span>
              </h2>
            </div>
            <span className="text-xs text-[#9FB0AD] font-mono">
              {activePostings.length} total vacancies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePostings.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              const jobApps = applications.filter((a) => a.jobId === job.id);
              const isClosed = job.status === 'Closed';

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`rounded-[24px] p-5 cursor-pointer transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#223331] border-[#B7F34A] shadow-[0_0_25px_rgba(183,243,74,0.1)]'
                      : 'bg-[#1E2B2A] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                          isClosed
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/25'
                            : 'bg-[#B7F34A]/10 text-[#B7F34A] border-[#B7F34A]/30'
                        }`}
                      >
                        {job.status}
                      </span>
                      <span className="text-xs font-mono text-[#9FB0AD]">
                        {jobApps.length} applicants
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-semibold text-[#F3F1EA] line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-[#9FB0AD] mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#B7F34A]" />
                      <span>{job.company}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px] text-[#9FB0AD]">
                      <span className="px-2 py-0.5 rounded-full bg-[#172120] border border-white/5">
                        {job.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#172120] border border-white/5">
                        {job.location}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#B7F34A]">
                      {job.stipendOrSalary}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleJobStatus(job);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9FB0AD] hover:text-[#F3F1EA] py-1 px-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {isClosed ? (
                        <>
                          <Unlock className="w-3 h-3 text-[#B7F34A]" />
                          <span>Reopen</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-rose-400" />
                          <span>Close</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: APPLICANTS VIEW FOR SELECTED JOB
           ========================================================================= */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="text-xs font-mono uppercase text-[#B7F34A] tracking-wider mb-1">
                TALENT PIPELINE
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F3F1EA]">
                Applicants for{' '}
                <span className="italic text-[#B7F34A]">
                  "{selectedJob?.title || 'Selected Vacancy'}"
                </span>
              </h2>
              <p className="text-xs text-[#9FB0AD] mt-1">
                Sorted by AI algorithmic match against the student's verified J&K EduLedger proofs.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#1E2B2A] border border-white/10 self-start sm:self-auto overflow-x-auto">
              {['All', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setApplicantFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    applicantFilter === status
                      ? 'bg-[#B7F34A] text-[#172120] font-semibold'
                      : 'text-[#9FB0AD] hover:text-[#F3F1EA]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Applicants List */}
          {displayedApplications.length === 0 ? (
            <div className="rounded-[28px] bg-[#1E2B2A] border border-white/[0.08] p-10 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#172120] border border-white/10 flex items-center justify-center text-[#9FB0AD] mb-3">
                <Inbox className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#F3F1EA]">
                No applicants in this stage
              </h4>
              <p className="text-xs text-[#9FB0AD] max-w-md mt-1 leading-relaxed">
                As verified students discover and apply to this vacancy, their profiles will
                appear here ranked by cryptographic credential alignment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedApplications.map((app) => (
                <ApplicantCard
                  key={app.id}
                  application={app}
                  job={selectedJob}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Notification Toast */}
      <NotificationToast toast={toast} onClose={handleCloseToast} />

      {/* Footer */}
      <Footer />
    </div>
  );
};
