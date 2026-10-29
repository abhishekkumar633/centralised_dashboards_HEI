import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole = 'student' }) => {
  const { currentRole, isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-[#172120] text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-[#B7F34A] border-t-transparent animate-spin" />
          <span className="font-serif italic text-lg text-slate-200">Restoring session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentRole) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole && currentRole !== requiredRole) {
    if (currentRole === 'recruiter') {
      return <Navigate to="/recruiter" replace />;
    }
    if (currentRole === 'student') {
      return <Navigate to="/student" replace />;
    }
    if (currentRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
