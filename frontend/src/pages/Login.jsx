import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  QrCode, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationToast } from '../components/NotificationToast';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  // Role: 'student' | 'recruiter' | 'admin'
  const [selectedRole, setSelectedRole] = useState('student');
  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState('login');

  // Form Fields - Password initialized as empty string
  const [email, setEmail] = useState('aarav.sharma@nitsri.ac.in');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [adminAccessCode, setAdminAccessCode] = useState('');

  // Validation & Toast states
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

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

  const resetFormFields = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setInstitution('');
    setEnrollmentNo('');
    setCompanyName('');
    setAdminAccessCode('');
    setErrorMessage('');
  };

  const handleRoleChange = (roleId) => {
    if (roleId !== selectedRole) {
      setSelectedRole(roleId);
      resetFormFields();
    }
  };

  const handleModeChange = (newMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      resetFormFields();
    }
  };

  // Quick fill helper for evaluator convenience
  const handleQuickFill = (role) => {
    setSelectedRole(role);
    setMode('login');
    setErrorMessage('');
    if (role === 'student') {
      setEmail('aarav.sharma@nitsri.ac.in');
      setPassword('vault2025pass');
      setFullName('Aarav Sharma');
      setInstitution('NIT Srinagar');
      setEnrollmentNo('2022BCSE042');
    } else if (role === 'recruiter') {
      setEmail('tanya.roy@apexsystems.io');
      setPassword('recruiterSecure1');
      setFullName('Tanya Roy');
      setCompanyName('Apex Systems & AI Labs');
    } else if (role === 'admin') {
      setEmail('dean.academics@nitsri.ac.in');
      setPassword('adminGovtJk2025');
      setFullName('Prof. M. K. Dhar');
      setInstitution('NIT Srinagar (Higher Ed Dept)');
      setAdminAccessCode('JK-HEI-2025-ADMIN');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Non-empty validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Full name is required for registration.');
        return;
      }
      if (selectedRole === 'student' && (!enrollmentNo.trim() || !institution.trim())) {
        setErrorMessage('Enrollment number and institution are required for students.');
        return;
      }
      if (selectedRole === 'recruiter' && !companyName.trim()) {
        setErrorMessage('Company name is required for recruiter registration.');
        return;
      }
      if (selectedRole === 'admin' && (!adminAccessCode.trim() || !institution.trim())) {
        setErrorMessage('Admin access code and institution are required.');
        return;
      }
    }

    try {
      await login({
        role: selectedRole,
        email,
        password,
        mode,
        extraData: {
          fullName,
          institution,
          enrollmentNo,
          companyName,
          adminAccessCode,
        },
      });

      // Redirect logic: check if location.state.from matches the user's role
      const fromPath = location.state?.from?.pathname;
      if (fromPath) {
        if (selectedRole === 'student' && fromPath.startsWith('/student')) {
          navigate(fromPath, { replace: true });
          return;
        }
        if (selectedRole === 'recruiter' && fromPath.startsWith('/recruiter')) {
          navigate(fromPath, { replace: true });
          return;
        }
        if (selectedRole === 'admin' && fromPath.startsWith('/admin')) {
          navigate(fromPath, { replace: true });
          return;
        }
      }

      // Default routes
      if (selectedRole === 'student') {
        navigate('/student');
      } else if (selectedRole === 'recruiter') {
        navigate('/recruiter');
      } else if (selectedRole === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/coming-soon?role=${selectedRole}`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during authentication.');
    }
  };

  // Role Metadata Details
  const roleConfig = {
    student: {
      icon: GraduationCap,
      title: 'Student Credential Portal',
      helperText: 'Access verified records, view AI skill-gap insights, and manage proof portfolios.',
      emailPlaceholder: 'aarav.sharma@nitsri.ac.in (College ID / Email)',
    },
    recruiter: {
      icon: Briefcase,
      title: 'Recruiter Verification Desk',
      helperText: 'Inspect tamper-proof student profiles and verify cryptographic SHA-256 signatures.',
      emailPlaceholder: 'recruiter@company.com (Work Email)',
    },
    admin: {
      icon: ShieldCheck,
      title: 'Institutional Admin Command',
      helperText: 'Generate NAAC/NIRF accreditation analytics and review faculty evaluation workflows.',
      emailPlaceholder: 'admin@institution.edu.in (Official Email)',
    },
  };

  const CurrentRoleIcon = roleConfig[selectedRole].icon;

  return (
    <div className="min-h-screen bg-[#172120] text-[#F3F1EA] flex flex-col justify-between relative overflow-hidden bg-radial-glow">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#B7F34A]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#38BDF8]/5 blur-[140px] pointer-events-none" />

      {/* Top minimal header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#B7F34A] text-[#172120] flex items-center justify-center shadow-[0_0_20px_rgba(183,243,74,0.3)]">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#F3F1EA]">
              Skill<span className="text-[#B7F34A] italic font-normal">Vault</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] text-[#9FB0AD] font-mono ml-2 border-l border-white/10 pl-2">
              Govt. of Jammu & Kashmir
            </span>
          </div>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-[#9FB0AD] text-[11px]">Quick Demo:</span>
          <button
            type="button"
            onClick={() => handleQuickFill('student')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
              selectedRole === 'student'
                ? 'bg-[#B7F34A] text-[#172120] font-semibold'
                : 'bg-[#1E2B2A] text-[#9FB0AD] hover:text-[#F3F1EA] border border-white/10'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('recruiter')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
              selectedRole === 'recruiter'
                ? 'bg-[#B7F34A] text-[#172120] font-semibold'
                : 'bg-[#1E2B2A] text-[#9FB0AD] hover:text-[#F3F1EA] border border-white/10'
            }`}
          >
            Recruiter
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('admin')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-[#B7F34A] text-[#172120] font-semibold'
                : 'bg-[#1E2B2A] text-[#9FB0AD] hover:text-[#F3F1EA] border border-white/10'
            }`}
          >
            Admin
          </button>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex items-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* LEFT: Hero & Story Panel */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E2B2A] border border-[#B7F34A]/30 text-xs font-semibold uppercase tracking-wider text-[#B7F34A] mb-4 shadow-[0_0_15px_rgba(183,243,74,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A] animate-pulse"></span>
                <span>Smart education, verified</span>
              </div>

              {/* Main Heading with Italic Accent */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F3F1EA] leading-[1.1]">
                Every achievement,{' '}
                <span className="italic font-normal text-[#B7F34A]">verified.</span>
              </h1>

              {/* Subtext */}
              <p className="text-[#9FB0AD] text-sm sm:text-base mt-4 max-w-lg leading-relaxed font-sans font-light">
                One trusted record of your academics, sports, clubs and technical wins, approved by faculty and secured with blockchain.
              </p>
            </div>

            {/* 3 Feature Chips/Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl bg-[#1E2B2A]/90 border border-white/[0.08] p-4 flex flex-col justify-between hover:border-[#B7F34A]/30 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F3F1EA]">Faculty-approved</h4>
                  <p className="text-[11px] text-[#9FB0AD] mt-1">
                    Multi-tier institutional sign-off with audit trail.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#1E2B2A]/90 border border-white/[0.08] p-4 flex flex-col justify-between hover:border-[#B7F34A]/30 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F3F1EA]">Blockchain-verified QR</h4>
                  <p className="text-[11px] text-[#9FB0AD] mt-1">
                    SHA-256 hashed records viewable by recruiters.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#1E2B2A]/90 border border-white/[0.08] p-4 flex flex-col justify-between hover:border-[#B7F34A]/30 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F3F1EA]">AI skill-gap insights</h4>
                  <p className="text-[11px] text-[#9FB0AD] mt-1">
                    Vectorized matching against live industry benchmarks.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer line */}
            <div className="pt-2 text-xs font-mono text-[#9FB0AD]/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B7F34A]"></span>
              <span>Government of Jammu & Kashmir · SIH25093</span>
            </div>
          </div>

          {/* RIGHT: Login / Signup Card */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md rounded-[28px] bg-[#1E2B2A] border border-white/[0.1] p-6 sm:p-8 shadow-2xl relative backdrop-blur-xl"
            >
              {/* Role Selector Tabs (3 Segmented Pills) */}
              <div 
                className="grid grid-cols-3 gap-1 bg-[#172120] p-1.5 rounded-full border border-white/[0.08] mb-6"
                role="tablist"
                aria-label="User Roles"
              >
                {[
                  { id: 'student', label: 'Student' },
                  { id: 'recruiter', label: 'Recruiter' },
                  { id: 'admin', label: 'Admin' },
                ].map((roleItem) => {
                  const isActive = selectedRole === roleItem.id;
                  return (
                    <button
                      key={roleItem.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleRoleChange(roleItem.id)}
                      className={`py-2 text-xs font-medium rounded-full transition-all cursor-pointer text-center ${
                        isActive
                          ? 'bg-[#B7F34A] text-[#172120] font-semibold shadow-md'
                          : 'text-[#9FB0AD] hover:text-[#F3F1EA]'
                      }`}
                    >
                      {roleItem.label}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Role Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#263735] border border-white/10 flex items-center justify-center text-[#B7F34A] shrink-0">
                  <CurrentRoleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#F3F1EA]">
                    {roleConfig[selectedRole].title}
                  </h3>
                  <p className="text-[11px] text-[#9FB0AD] line-clamp-1">
                    {roleConfig[selectedRole].helperText}
                  </p>
                </div>
              </div>

              {/* Mode Toggle: Log in vs Sign up */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-5 text-xs">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className={`font-semibold transition-colors pb-1 border-b-2 cursor-pointer ${
                      mode === 'login'
                        ? 'text-[#B7F34A] border-[#B7F34A]'
                        : 'text-[#9FB0AD] border-transparent hover:text-[#F3F1EA]'
                    }`}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className={`font-semibold transition-colors pb-1 border-b-2 cursor-pointer ${
                      mode === 'signup'
                        ? 'text-[#B7F34A] border-[#B7F34A]'
                        : 'text-[#9FB0AD] border-transparent hover:text-[#F3F1EA]'
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                <span className="text-[10px] text-[#9FB0AD] font-mono">
                  Role: <span className="text-[#B7F34A] uppercase">{selectedRole}</span>
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div role="alert" className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* SIGNUP SPECIFIC FIELDS */}
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div>
                      <label htmlFor="signup-fullname" className="block text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD] mb-1">
                        Full Name *
                      </label>
                      <input
                        id="signup-fullname"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Aarav Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-2.5 text-xs text-[#F3F1EA] outline-none transition-colors"
                      />
                    </div>

                    {selectedRole === 'student' && (
                      <>
                        <div>
                          <label htmlFor="signup-enrollment" className="block text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD] mb-1">
                            Enrollment / Roll Number *
                          </label>
                          <input
                            id="signup-enrollment"
                            type="text"
                            required
                            autoComplete="off"
                            placeholder="e.g. 2022BCSE042"
                            value={enrollmentNo}
                            onChange={(e) => setEnrollmentNo(e.target.value)}
                            className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-2.5 text-xs text-[#F3F1EA] outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="signup-institution" className="block text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD] mb-1">
                            Institution / College *
                          </label>
                          <input
                            id="signup-institution"
                            type="text"
                            required
                            autoComplete="organization"
                            placeholder="e.g. NIT Srinagar"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-2.5 text-xs text-[#F3F1EA] outline-none transition-colors"
                          />
                        </div>
                      </>
                    )}

                    {selectedRole === 'recruiter' && (
                      <div>
                        <label htmlFor="signup-company" className="block text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD] mb-1">
                          Company / Organization *
                        </label>
                        <input
                          id="signup-company"
                          type="text"
                          required
                          autoComplete="organization"
                          placeholder="e.g. Apex Systems Ltd"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-2.5 text-xs text-[#F3F1EA] outline-none transition-colors"
                        />
                      </div>
                    )}

                    {selectedRole === 'admin' && (
                      <>
                        <div>
                          <label htmlFor="signup-admin-institution" className="block text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD] mb-1">
                            Higher Education Institution *
                          </label>
                          <input
                            id="signup-admin-institution"
                            type="text"
                            required
                            autoComplete="organization"
                            placeholder="e.g. University of Jammu / NIT"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-2.5 text-xs text-[#F3F1EA] outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="signup-admin-code" className="block text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD] mb-1">
                            Admin Access Code *
                          </label>
                          <input
                            id="signup-admin-code"
                            type="text"
                            required
                            autoComplete="off"
                            placeholder="JK-HEI-2025-XXXX"
                            value={adminAccessCode}
                            onChange={(e) => setAdminAccessCode(e.target.value)}
                            className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-2.5 text-xs text-[#F3F1EA] outline-none transition-colors font-mono"
                          />
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Email / ID */}
                <div>
                  <label htmlFor="auth-email" className="block text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD] mb-1">
                    {mode === 'signup'
                      ? selectedRole === 'student'
                        ? 'College Email *'
                        : selectedRole === 'recruiter'
                        ? 'Work Email *'
                        : 'Official Email *'
                      : 'Email or User ID *'}
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={roleConfig[selectedRole].emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-3 text-xs text-[#F3F1EA] outline-none transition-colors"
                  />
                </div>

                {/* Password with Show/Hide toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="auth-password" className="text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD]">
                      Password *
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => showToast({
                          type: 'info',
                          title: 'Forgot Password',
                          message: 'Demo mode: password reset is not connected yet.'
                        })}
                        className="text-[11px] text-[#B7F34A] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-3 pr-10 text-xs text-[#F3F1EA] outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FB0AD] hover:text-[#F3F1EA] p-1 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Pill Button with Trailing Arrow */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] font-semibold text-xs transition-all shadow-[0_0_20px_rgba(183,243,74,0.3)] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Log in →' : 'Create Account →'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Security Note */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] text-center">
                <p className="text-[10px] text-[#9FB0AD] flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#B7F34A]" />
                  <span>Protected by SHA-256 hashing and role-based access.</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Floating Notification Toast */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      {/* Page Footer */}
      <footer className="w-full py-4 px-6 text-center text-[11px] text-[#9FB0AD]/60 border-t border-white/[0.05] z-10">
        © 2026 SkillVault · Higher Education Department, Govt. of Jammu & Kashmir (SIH25093)
      </footer>
    </div>
  );
};
