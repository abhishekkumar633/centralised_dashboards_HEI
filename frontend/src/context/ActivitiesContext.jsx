import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const ActivitiesContext = createContext(null);

export function ActivitiesProvider({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const [activities, setActivities] = useState([]);

  const refreshActivities = useCallback(async () => {
    const { activities: next } = await api('/activities');
    setActivities(Array.isArray(next) ? next : []);
  }, []);

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated) {
      if (!isAuthenticated) setActivities([]);
      return;
    }

    let cancelled = false;
    refreshActivities().catch((err) => {
      if (!cancelled) console.warn('Failed to load activities:', err.message);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isBootstrapping, refreshActivities]);

  const addActivity = useCallback(async (newActivity) => {
    const { activity } = await api('/activities', {
      method: 'POST',
      body: newActivity,
    });
    setActivities((prev) => [activity, ...prev]);
    return activity;
  }, []);

  const approveActivity = useCallback(async ({ id, skillsAwarded = [], adminName }) => {
    const { activity } = await api(`/activities/${id}/approve`, {
      method: 'POST',
      body: { skillsAwarded, adminName },
    });
    setActivities((prev) => prev.map((item) => (item.id === id ? activity : item)));
    return activity;
  }, []);

  const rejectActivity = useCallback(async ({ id, reason, adminName }) => {
    const { activity } = await api(`/activities/${id}/reject`, {
      method: 'POST',
      body: { reason, adminName },
    });
    setActivities((prev) => prev.map((item) => (item.id === id ? activity : item)));
    return activity;
  }, []);

  const getActivitiesForStudent = useCallback(
    (email) => {
      if (!email) return [];
      const norm = email.trim().toLowerCase();
      return activities.filter((a) => a.studentEmail?.toLowerCase() === norm);
    },
    [activities]
  );

  const getPending = useCallback(() => {
    return activities.filter((a) => a.status === 'Pending');
  }, [activities]);

  const getAll = useCallback(() => activities, [activities]);

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        addActivity,
        approveActivity,
        rejectActivity,
        getActivitiesForStudent,
        getPending,
        getAll,
        refreshActivities,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components, react/only-export-components
export function useActivities() {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error('useActivities must be used within an ActivitiesProvider');
  }
  return context;
}
