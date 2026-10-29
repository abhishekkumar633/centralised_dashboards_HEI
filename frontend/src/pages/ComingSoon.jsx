import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Building2, 
  Briefcase, 
  Sparkles, 
  Check, 
  FileSpreadsheet, 
  Users, 
  SearchCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ComingSoon = () => {
  const navigate = useNavigate();
  const { currentRole, isAuthenticated, login } = useAuth();
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // Guard /coming-soon: if no logged-in role, redirect to "/"
  if (!isAuthenticated || !currentRole) {
    return <Navigate to="/" replace />;
  }

  // If logged in as student, redirect to /student
  if (currentRole === 'student') {
    return <Navigate to="/student" replace />;
  }

  // If logged in as admin, redirect to /admin
  if (currentRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const isAdmin = false;

  const handleSwitchToStudent = async () => {
    await login({ role: 'student', email: 'aarav.sharma@nitsri.ac.in' });
    navigate('/student');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#172120] text-[#F3F1EA] flex flex-col justify-between relative overflow-hidden bg-radial-glow">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B7F34A]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#B7F34A] text-[#172120] flex items-center justify-center shadow-[0_0_20px_rgba(183,243,74,0.3)] group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#F3F1EA]">
              Skill<span className="text-[#B7F34A] italic font-normal">Vault</span>
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E2B2A] border border-white/10 hover:border-white/20 text-xs font-medium text-[#9FB0AD] hover:text-[#F3F1EA] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
      </header>

      {/* Center Hero Card */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 flex-1 flex flex-col justify-center items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full rounded-[32px] bg-[#1E2B2A] border border-white/[0.08] p-8 sm:p-12 shadow-2xl relative"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172120] border border-[#B7F34A]/30 text-xs font-semibold uppercase tracking-wider text-[#B7F34A] mb-4">
            {isAdmin ? <Building2 className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
            <span>{isAdmin ? 'Institutional Accreditation Module' : 'Enterprise Recruiter Suite'}</span>
          </div>

          {/* Heading with Italic Accent */}
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#F3F1EA] tracking-tight mb-4">
            {isAdmin ? (
              <>
                Admin command, <span className="italic text-[#B7F34A]">coming soon.</span>
              </>
            ) : (
              <>
                Recruiter portal, <span className="italic text-[#B7F34A]">coming soon.</span>
              </>
            )}
          </h1>

          <p className="text-sm text-[#9FB0AD] max-w-lg mx-auto leading-relaxed mb-8">
            {isAdmin
              ? 'We are calibrating the automated NAAC Criterion 5 and NIRF institutional export engine for Higher Education Institutions across Jammu & Kashmir.'
              : 'Direct candidate verification APIs, ATS integrations, and batch blockchain proof audits for technical hiring teams are launching shortly.'}
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            {isAdmin ? (
              <>
                <div className="p-4 rounded-2xl bg-[#172120] border border-white/[0.06]">
                  <FileSpreadsheet className="w-5 h-5 text-[#B7F34A] mb-2" />
                  <h4 className="text-xs font-semibold text-[#F3F1EA]">NAAC / NIRF Reports</h4>
                  <p className="text-[11px] text-[#9FB0AD] mt-1">One-click accredited data generation.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#172120] border border-white/[0.06]">
                  <Users className="w-5 h-5 text-[#B7F34A] mb-2" />
                  <h4 className="text-xs font-semibold text-[#F3F1EA]">Faculty Workflows</h4>
                  <p className="text-[11px] text-[#9FB0AD] mt-1">Departmental approval hierarchies.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#172120] border border-white/[0.06]">
                  <ShieldCheck className="w-5 h-5 text-[#B7F34A] mb-2" />
                  <h4 className="text-xs font-semibold text-[#F3F1EA]">State EduLedger</h4>
                  <p className="text-[11px] text-[#9FB0AD] mt-1">Govt. PoA node consensus monitoring.</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-[#172120] border border-white/[0.06]">
                  <SearchCheck className="w-5 h-5 text-[#B7F34A] mb-2" />
                  <h4 className="text-xs font-semibold text-[#F3F1EA]">Verified Talent Search</h4>
                  <p className="text-[11px] text-[#9FB0AD] mt-1">Filter by verified hackathons & CGPA.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#172120] border border-white/[0.06]">
                  <Sparkles className="w-5 h-5 text-[#B7F34A] mb-2" />
                  <h4 className="text-xs font-semibold text-[#F3F1EA]">AI Match Engine</h4>
                  <p className="text-[11px] text-[#9FB0AD] mt-1">Direct job description embedding match.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#172120] border border-white/[0.06]">
                  <ShieldCheck className="w-5 h-5 text-[#B7F34A] mb-2" />
                  <h4 className="text-xs font-semibold text-[#F3F1EA]">Batch Verification</h4>
                  <p className="text-[11px] text-[#9FB0AD] mt-1">Zero-friction credential background check.</p>
                </div>
              </>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleSwitchToStudent}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] font-semibold text-xs transition-all shadow-[0_0_20px_rgba(183,243,74,0.3)] cursor-pointer"
            >
              <span>Explore Student Dashboard Demo →</span>
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-[#F3F1EA] transition-colors"
            >
              Back to Role Selection
            </Link>
          </div>

          {/* Notification form */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] max-w-md mx-auto">
            {emailSubscribed ? (
              <div className="flex items-center justify-center gap-2 text-xs text-[#B7F34A]">
                <Check className="w-4 h-4" />
                <span>You're on the early access priority notification list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Get notified at launch..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-full px-4 py-2 text-xs text-[#F3F1EA] outline-none flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-xs font-medium text-[#F3F1EA] transition-colors cursor-pointer"
                >
                  Notify me
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[11px] text-[#9FB0AD]/60 border-t border-white/[0.05] z-10">
        © 2026 SkillVault · Higher Education Department, Govt. of Jammu & Kashmir (SIH25093)
      </footer>
    </div>
  );
};
