import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { isAuthenticated, isBootstrapping, currentRole, currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const refreshNotifications = useCallback(async () => {
    if (currentRole !== 'student') {
      setNotifications([]);
      return;
    }
    const { notifications: next } = await api('/notifications');
    setNotifications(Array.isArray(next) ? next : []);
  }, [currentRole]);

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated) {
      if (!isAuthenticated) setNotifications([]);
      return;
    }

    let cancelled = false;
    refreshNotifications().catch((err) => {
      if (!cancelled) console.warn('Failed to load notifications:', err.message);
    });

    const onFocus = () => {
      refreshNotifications().catch(() => {});
    };
    window.addEventListener('focus', onFocus);
    const timer = window.setInterval(() => {
      refreshNotifications().catch(() => {});
    }, 20000);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', onFocus);
      window.clearInterval(timer);
    };
  }, [isAuthenticated, isBootstrapping, refreshNotifications]);

  const addNotification = useCallback((payload) => {
    const newNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      studentEmail: payload.studentEmail?.trim().toLowerCase() || currentUser?.email || '',
      type: payload.type,
      title: payload.title,
      message: payload.message,
      activityId: payload.activityId || null,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    return newNotification;
  }, [currentUser?.email]);

  const markAsRead = useCallback(async (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    try {
      await api(`/notifications/${notificationId}/read`, { method: 'PATCH' });
    } catch (err) {
      console.warn('Failed to mark notification read:', err.message);
    }
  }, []);

  const markAllAsRead = useCallback(async (studentEmail) => {
    const emailNorm = studentEmail?.trim().toLowerCase();
    setNotifications((prev) =>
      prev.map((n) =>
        !emailNorm || n.studentEmail === emailNorm ? { ...n, read: true } : n
      )
    );
    try {
      await api('/notifications/read-all', {
        method: 'PATCH',
        body: { studentEmail: emailNorm },
      });
    } catch (err) {
      console.warn('Failed to mark all notifications read:', err.message);
    }
  }, []);

  const getNotificationsForStudent = useCallback(
    (studentEmail) => {
      const emailNorm = studentEmail?.trim().toLowerCase();
      return notifications.filter((n) => n.studentEmail === emailNorm);
    },
    [notifications]
  );

  const getUnreadCount = useCallback(
    (studentEmail) => {
      const emailNorm = studentEmail?.trim().toLowerCase();
      return notifications.filter((n) => n.studentEmail === emailNorm && !n.read).length;
    },
    [notifications]
  );

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        getNotificationsForStudent,
        getUnreadCount,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components, react/only-export-components
export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
