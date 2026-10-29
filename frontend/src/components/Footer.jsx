import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#141D1C] text-[#9FB0AD] text-xs py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-[#1E2B2A] border border-white/10 flex items-center justify-center text-[#B7F34A]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-sm font-semibold text-[#F3F1EA]">SkillVault</span>
              <span className="text-[11px] text-[#9FB0AD] ml-2">Higher Education Verification Infrastructure</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#9FB0AD]">
            <span className="hover:text-[#F3F1EA] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#F3F1EA] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#F3F1EA] cursor-pointer transition-colors">NAAC & NIRF Credit Matrix</span>
            <span className="hover:text-[#F3F1EA] cursor-pointer transition-colors">Blockchain Node Status</span>
            <span className="hover:text-[#F3F1EA] cursor-pointer transition-colors">J&K Smart Ed Portal</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-center sm:text-left text-[#9FB0AD]/80">
            © 2026 SkillVault · Department of Higher Education, Government of Jammu & Kashmir (SIH25093).
          </p>
          <div className="flex items-center gap-2 text-[#9FB0AD]/70">
            <span>Secured with SHA-256 Ledger</span>
            <span>·</span>
            <span>Zero-Trust Credentialing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
