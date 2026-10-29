import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api/client';

const AuthContext = createContext(null);

function persistSession(user, role) {
  try {
    if (user) localStorage.setItem('skillvault_user', JSON.stringify(user));
    else localStorage.removeItem('skillvault_user');
    if (role) localStorage.setItem('skillvault_role', role);
    else localStorage.removeItem('skillvault_role');
  } catch {
    // ignore
  }
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('skillvault_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => {
    try {
      return localStorage.getItem('skillvault_role') || null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(() => !!getToken());

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    let cancelled = false;
    api('/auth/me')
      .then(({ user }) => {
        if (cancelled) return;
        setCurrentUser(user);
        setCurrentRole(user.role);
        persistSession(user, user.role);
      })
      .catch(() => {
        if (cancelled) return;
        setToken(null);
        setCurrentUser(null);
        setCurrentRole(null);
        persistSession(null, null);
      })
      .finally(() => {
        if (!cancelled) setIsBootstrapping(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async ({ role, email, password, extraData = {}, mode = 'login' }) => {
    setIsLoading(true);
    try {
      const payload =
        mode === 'signup'
          ? {
              role,
              email,
              password,
              fullName: extraData.fullName,
              institution: extraData.institution,
              enrollmentNo: extraData.enrollmentNo,
              companyName: extraData.companyName,
              adminAccessCode: extraData.adminAccessCode,
            }
          : { role, email, password };

      const data = await api(mode === 'signup' ? '/auth/register' : '/auth/login', {
        method: 'POST',
        body: payload,
      });

      setToken(data.token);
      setCurrentUser(data.user);
      setCurrentRole(data.user.role);
      persistSession(data.user, data.user.role);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setCurrentRole(null);
    persistSession(null, null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoading,
        isBootstrapping,
        login,
        logout,
        isAuthenticated: !!currentRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
