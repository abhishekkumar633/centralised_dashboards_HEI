import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const JobsContext = createContext(null);

export const JobsProvider = ({ children }) => {
  const { isAuthenticated, isBootstrapping, currentRole, currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const refreshJobs = useCallback(async () => {
    const { jobs: nextJobs } = await api('/jobs');
    setJobs(Array.isArray(nextJobs) ? nextJobs : []);
  }, []);

  const refreshApplications = useCallback(async () => {
    if (currentRole === 'student' && currentUser?.email) {
      const { applications: next } = await api(
        `/applications/student/${encodeURIComponent(currentUser.email)}`
      );
      setApplications(Array.isArray(next) ? next : []);
      return;
    }
    const { applications: next } = await api('/applications');
    setApplications(Array.isArray(next) ? next : []);
  }, [currentRole, currentUser?.email]);

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated) {
      if (!isAuthenticated) {
        setJobs([]);
        setApplications([]);
      }
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await Promise.all([refreshJobs(), refreshApplications()]);
      } catch (err) {
        if (!cancelled) console.warn('Failed to load jobs data:', err.message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isBootstrapping, refreshJobs, refreshApplications]);

  const postJob = async (jobData) => {
    const { job } = await api('/jobs', { method: 'POST', body: jobData });
    setJobs((prev) => [job, ...prev]);
    return job;
  };

  const closeJob = async (jobId) => {
    const { job } = await api(`/jobs/${jobId}/close`, { method: 'PATCH' });
    setJobs((prev) => prev.map((item) => (item.id === jobId ? job : item)));
  };

  const reopenJob = async (jobId) => {
    const { job } = await api(`/jobs/${jobId}/reopen`, { method: 'PATCH' });
    setJobs((prev) => prev.map((item) => (item.id === jobId ? job : item)));
  };

  const applyToJob = async ({
    jobId,
    matchScore = 0,
    verifiedSkills = [],
    approvedActivities = [],
    institution = '',
    verifiedScore = 94,
    studentName,
    studentEmail,
  }) => {
    const { success, application, isDuplicate } = await api(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: {
        matchScore,
        verifiedSkills,
        approvedActivities,
        snapshot: {
          name: studentName || currentUser?.name || 'Applicant',
          email: studentEmail || currentUser?.email,
          institution: institution || currentUser?.institution || '',
          verifiedScore: verifiedScore || currentUser?.verifiedScore || 94,
          verifiedSkills,
          approvedActivities,
        },
      },
    });

    if (application && !isDuplicate) {
      setApplications((prev) => [application, ...prev]);
    }
    return { success, application, isDuplicate };
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    const { application } = await api(`/applications/${applicationId}`, {
      method: 'PATCH',
      body: { status: newStatus },
    });
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? application : app))
    );
  };

  const getJobsByRecruiter = (recruiterEmail) => {
    if (!recruiterEmail) return jobs;
    return jobs.filter((j) => j.postedBy?.toLowerCase() === recruiterEmail.toLowerCase());
  };

  const getApplicationsForJob = (jobId) => {
    return applications.filter((app) => app.jobId === jobId);
  };

  const getApplicationsForStudent = (studentEmail) => {
    if (!studentEmail) return [];
    return applications.filter(
      (app) => app.studentEmail?.toLowerCase() === studentEmail.toLowerCase()
    );
  };

  const getJobById = (jobId) => {
    return jobs.find((j) => j.id === jobId) || null;
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        applications,
        postJob,
        closeJob,
        reopenJob,
        applyToJob,
        updateApplicationStatus,
        getJobsByRecruiter,
        getApplicationsForJob,
        getApplicationsForStudent,
        getJobById,
        refreshJobs,
        refreshApplications,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};
