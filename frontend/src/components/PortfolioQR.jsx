import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Copy, 
  Check, 
  ShieldCheck, 
  QrCode, 
  ArrowRight
} from 'lucide-react';
import { verificationSteps } from '../data/mock';

export const PortfolioQR = ({ student, onShowToast }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = student?.portfolioUrl || `https://skillvault.app/verify/${student?.id || 'STU-2025-0142'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Portfolio link copied!',
        message: 'Share this link with recruiters or include it on your resume.'
      });
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="portfolio-section" className="my-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#B7F34A] flex items-center gap-1.5 mb-1">
          <QrCode className="w-3.5 h-3.5" />
          <span>Tamper-Proof Credential Distribution</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F3F1EA]">
          Verified Portfolio & <span className="italic text-[#B7F34A]">Recruiter QR</span>
        </h2>
        <p className="text-xs text-[#9FB0AD] mt-1 max-w-xl">
          Instantly share your immutable achievement dossier with campus recruiters, international admissions, and NAAC accreditation committees.
        </p>
      </div>

      {/* Main Recruiter & QR Card */}
      <div className="rounded-[28px] bg-[#1E2B2A] border border-white/[0.08] p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left QR Code Box */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-[24px] bg-[#172120] border border-white/10 shadow-inner text-center">
            <div className="p-3 bg-white rounded-2xl shadow-xl inline-block">
              <QRCodeSVG
                value={shareUrl}
                size={160}
                bgColor="#FFFFFF"
                fgColor="#172120"
                level="Q"
                includeMargin={false}
              />
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs text-[#B7F34A] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Cryptographically Signed Record</span>
            </div>
            <p className="text-[11px] text-[#9FB0AD] mt-1 font-mono">
              Identifier: {student?.id || 'STU-2025-0142'}
            </p>
            <p className="text-[10px] text-[#9FB0AD]/60 font-mono italic mt-0.5">
              Demo data: not a live blockchain record
            </p>
          </div>

          {/* Right Details & Copy Link */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7F34A]/10 border border-[#B7F34A]/30 text-xs text-[#B7F34A] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#B7F34A] animate-ping" />
                <span>Live Blockchain Verified Portfolio</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F3F1EA]">
                One link to <span className="italic text-[#B7F34A]">verify them all.</span>
              </h3>
              
              <p className="text-xs text-[#9FB0AD] mt-2 leading-relaxed">
                Recruiters scanning this link can view every original PDF proof, issuing authority seal, and faculty endorsement without contacting university administration.
              </p>
            </div>

            {/* Copyable Link Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="portfolio-share-link" className="block text-[11px] font-medium uppercase tracking-wider text-[#9FB0AD]">
                  Public Shareable Link:
                </label>
                <span className="text-[10px] text-[#9FB0AD]/60 font-mono italic">
                  Demo data: not a live blockchain record
                </span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#172120] border border-white/10 focus-within:border-[#B7F34A] transition-all">
                <input
                  id="portfolio-share-link"
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="px-4 text-xs font-mono text-[#F3F1EA] bg-transparent outline-none truncate flex-1 cursor-text"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Copy public portfolio link"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] font-semibold text-xs transition-all shadow-[0_0_15px_rgba(183,243,74,0.3)] shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy link →</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#9FB0AD] text-[11px] block">Accreditation:</span>
                <span className="text-[#F3F1EA] font-medium">Govt. J&K EduLedger</span>
              </div>
              <div>
                <span className="text-[#9FB0AD] text-[11px] block">Audit Integrity:</span>
                <span className="text-emerald-400 font-medium">100% Tamper Proof</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Numbered Step Cards: How Verification Works */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9FB0AD] mb-4">
          Verification Architecture
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {verificationSteps.map((stepItem, index) => (
            <div
              key={index}
              className="rounded-[24px] bg-[#1E2B2A] border border-white/[0.08] hover:border-[#B7F34A]/30 p-6 flex flex-col justify-between transition-all group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-3xl font-bold text-[#B7F34A] opacity-80 group-hover:opacity-100 transition-opacity">
                    {stepItem.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-[#9FB0AD] group-hover:text-[#B7F34A] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="font-serif text-lg font-semibold text-[#F3F1EA] mb-2">
                  {stepItem.title}
                </h4>

                <p className="text-xs text-[#9FB0AD] leading-relaxed">
                  {stepItem.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[10px] font-mono text-[#9FB0AD]/70">
                Phase {index + 1} of 3 · Zero Trust Model
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
