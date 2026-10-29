import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  LogOut, 
  User, 
  ChevronDown, 
  Sparkles, 
  ExternalLink,
  Bell,
  CheckCircle2,
  XCircle,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';

export const Navbar = () => {
  const { currentUser, currentRole, logout } = useAuth();
  const { getNotificationsForStudent, getUnreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const isStudentPage = location.pathname.startsWith('/student');
  const isStudent = currentRole === 'student';

  const studentEmail = currentUser?.email || 'aarav.sharma@nitsri.ac.in';
  const unreadCount = isStudent ? getUnreadCount(studentEmail) : 0;
  const studentNotifications = isStudent ? getNotificationsForStudent(studentEmail) : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setBellOpen(false);
    if (!isStudentPage) {
      navigate('/student');
    }
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('skillvault:navigate-activity', {
          detail: { activityId: notif.activityId }
        })
      );
    }, 150);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#172120]/85 border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          to={currentRole === 'student' ? '/student' : currentRole === 'recruiter' ? '/recruiter' : currentRole === 'admin' ? '/admin' : '/'} 
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#B7F34A] to-[#86C227] flex items-center justify-center text-[#172120] shadow-[0_0_20px_rgba(183,243,74,0.3)] transition-transform duration-200 group-hover:scale-105">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl tracking-tight font-semibold text-[#F3F1EA]">
                Skill<span className="text-[#B7F34A] italic font-normal">Vault</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1E2B2A] text-[#B7F34A] border border-[#B7F34A]/20">
                Govt J&K
              </span>
            </div>
            <span className="text-[10px] text-[#9FB0AD] font-mono tracking-tight hidden sm:block">
              SIH25093 · Smart Higher Ed
            </span>
          </div>
        </Link>

        {/* Navigation items for Student Dashboard */}
        {isStudentPage ? (
          <nav className="hidden md:flex items-center gap-1 bg-[#1E2B2A]/90 p-1.5 rounded-full border border-white/[0.08] shadow-inner">
            <button
              type="button"
              onClick={() => scrollToSection('overview-section')}
              className="px-4 py-1.5 text-xs font-medium text-[#F3F1EA] hover:text-[#B7F34A] hover:bg-white/[0.04] rounded-full transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('upload-section')}
              className="px-4 py-1.5 text-xs font-medium text-[#9FB0AD] hover:text-[#F3F1EA] hover:bg-white/[0.04] rounded-full transition-colors cursor-pointer"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('activities-section')}
              className="px-4 py-1.5 text-xs font-medium text-[#9FB0AD] hover:text-[#F3F1EA] hover:bg-white/[0.04] rounded-full transition-colors cursor-pointer"
            >
              My Activities
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('skills-section')}
              className="px-4 py-1.5 text-xs font-medium text-[#9FB0AD] hover:text-[#F3F1EA] hover:bg-white/[0.04] rounded-full transition-colors cursor-pointer"
            >
              AI Skill-Gap
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('jobs-section')}
              className="px-4 py-1.5 text-xs font-medium text-[#9FB0AD] hover:text-[#F3F1EA] hover:bg-white/[0.04] rounded-full transition-colors cursor-pointer"
            >
              Jobs
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('portfolio-section')}
              className="px-4 py-1.5 text-xs font-medium text-[#9FB0AD] hover:text-[#F3F1EA] hover:bg-white/[0.04] rounded-full transition-colors cursor-pointer"
            >
              Portfolio & QR
            </button>
          </nav>
        ) : (
          <div className="hidden sm:flex items-center gap-4 text-xs text-[#9FB0AD]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E2B2A] border border-white/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A] animate-pulse"></span>
              J&K Higher Education Registry v2.4
            </span>
          </div>
        )}

        {/* User / Action Profile + Student Notifications */}
        <div className="flex items-center gap-3">
          {/* Bell Icon for Student Notifications */}
          {isStudent && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setBellOpen(!bellOpen);
                  setDropdownOpen(false);
                }}
                aria-label="Student notifications"
                className="relative p-2 rounded-full bg-[#1E2B2A] border border-white/[0.08] hover:border-[#B7F34A]/40 text-[#9FB0AD] hover:text-[#F3F1EA] transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#B7F34A] text-[#172120] text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {bellOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setBellOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#1E2B2A] border border-white/10 p-3 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#F3F1EA]">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] font-mono">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {studentNotifications.length > 0 && (
                        <button
                          type="button"
                          onClick={() => markAllAsRead(studentEmail)}
                          className="text-[11px] text-[#B7F34A] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scroll">
                      {studentNotifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-[#9FB0AD]">
                          No notifications yet.
                        </div>
                      ) : (
                        studentNotifications.map((n) => {
                          const isApproved = n.type === 'approved';
                          return (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                                !n.read
                                  ? 'bg-[#172120] border-[#B7F34A]/30'
                                  : 'bg-white/[0.02] border-transparent hover:bg-white/[0.05]'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 shrink-0">
                                  {isApproved ? (
                                    <CheckCircle2 className="w-4 h-4 text-[#B7F34A]" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-rose-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <p className="text-xs font-semibold text-[#F3F1EA] truncate">
                                      {n.title}
                                    </p>
                                    {!n.read && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A]" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#9FB0AD] mt-0.5 leading-snug">
                                    {n.message}
                                  </p>
                                  <span className="text-[9px] text-[#9FB0AD]/60 font-mono mt-1 block">
                                    Click to view in timeline
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setBellOpen(false);
                }}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#1E2B2A] border border-white/[0.08] hover:border-[#B7F34A]/40 transition-all text-left cursor-pointer"
                aria-expanded={dropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-[#273836] border border-white/10 flex items-center justify-center text-[#B7F34A] overflow-hidden">
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-medium text-[#F3F1EA] leading-tight">
                    {currentUser.name?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#B7F34A] capitalize font-mono">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#9FB0AD] ml-0.5" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#1E2B2A] border border-white/10 p-2 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/[0.06]">
                      <p className="text-sm font-semibold text-[#F3F1EA]">{currentUser.name}</p>
                      <p className="text-xs text-[#9FB0AD] truncate">{currentUser.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#263735] text-[#B7F34A]">
                          ID: {currentUser.id || currentUser.enrollmentNo || 'ROLE-' + currentUser.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {currentRole === 'recruiter' ? (
                        <Link
                          to="/recruiter"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#F3F1EA] hover:bg-white/[0.05] rounded-xl transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#B7F34A]" />
                          Recruiter Desk
                        </Link>
                      ) : currentRole === 'admin' ? (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#F3F1EA] hover:bg-white/[0.05] rounded-xl transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#B7F34A]" />
                          Admin Verification Desk
                        </Link>
                      ) : isStudentPage ? (
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            scrollToSection('portfolio-section');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#F3F1EA] hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#B7F34A]" />
                          View Public Portfolio
                        </button>
                      ) : (
                        <Link
                          to="/student"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#F3F1EA] hover:bg-white/[0.05] rounded-xl transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#B7F34A]" />
                          Student Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-white/[0.06]">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B7F34A] text-[#172120] text-xs font-semibold hover:bg-[#C9FA62] transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
