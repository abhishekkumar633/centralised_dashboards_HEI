import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { ActivitiesProvider } from './context/ActivitiesContext';
import { JobsProvider } from './context/JobsContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Login } from './pages/Login';

const StudentDashboard = lazy(() =>
  import('./pages/StudentDashboard').then((module) => ({ default: module.StudentDashboard }))
);
const RecruiterDashboard = lazy(() =>
  import('./pages/RecruiterDashboard').then((module) => ({ default: module.RecruiterDashboard }))
);
const AdminDashboard = lazy(() =>
  import('./pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard }))
);
const ComingSoon = lazy(() =>
  import('./pages/ComingSoon').then((module) => ({ default: module.ComingSoon }))
);

function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#172120] text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full border-2 border-[#B7F34A] border-t-transparent animate-spin" />
        <span className="font-serif italic text-lg text-slate-200">Loading SkillVault...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <ActivitiesProvider>
          <JobsProvider>
            <Router>
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  {/* Page 1: Login */}
                  <Route path="/" element={<Login />} />

                  {/* Page 2: Student Dashboard (Protected for students) */}
                  <Route
                    path="/student"
                    element={
                      <ProtectedRoute requiredRole="student">
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Page 3: Recruiter Dashboard (Protected for recruiters) */}
                  <Route
                    path="/recruiter"
                    element={
                      <ProtectedRoute requiredRole="recruiter">
                        <RecruiterDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Page 4: Admin Dashboard (Protected for college admin) */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Placeholder for NIRF reports & institutional accreditation */}
                  <Route path="/coming-soon" element={<ComingSoon />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Router>
          </JobsProvider>
        </ActivitiesProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;
