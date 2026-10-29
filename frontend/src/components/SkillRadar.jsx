import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  Sparkles, 
  TrendingUp, 
  ChevronRight, 
  Target, 
  Lightbulb, 
  Compass 
} from 'lucide-react';
import { skillRadarDatasets, careerRecommendations } from '../data/mock';

// Custom Tooltip for dark mode radar
const CustomRadarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#172120] border border-white/15 p-3 rounded-xl shadow-xl text-xs font-sans">
        <p className="font-semibold text-[#F3F1EA] mb-1.5">{data.subject}</p>
        <div className="flex items-center justify-between gap-4 text-[#B7F34A]">
          <span>Your Credited Level:</span>
          <span className="font-mono font-bold">{data.student}%</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sky-400 mt-1">
          <span>Industry Requirement:</span>
          <span className="font-mono font-bold">{data.industry}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export const SkillRadar = () => {
  const [selectedRole, setSelectedRole] = useState('Full-Stack Developer');

  const currentDataset = skillRadarDatasets[selectedRole] || skillRadarDatasets['Full-Stack Developer'];

  return (
    <section id="skills-section" className="my-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#B7F34A] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered Career Vectorization</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F3F1EA]">
            Skill-Gap & Career <span className="italic text-[#B7F34A]">Dashboard</span>
          </h2>
          <p className="text-xs text-[#9FB0AD] mt-1 max-w-xl">
            Real-time benchmarking of your verified institutional achievements against current tier-1 job descriptions and public sector hiring mandates.
          </p>
        </div>

        {/* Role Selector Pill */}
        <div className="flex items-center gap-2 bg-[#1E2B2A] border border-white/10 p-1.5 rounded-full">
          <span className="text-[11px] text-[#9FB0AD] font-medium pl-3 hidden sm:inline">
            Target Archetype:
          </span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-[#172120] border border-white/10 text-[#F3F1EA] text-xs font-medium rounded-full px-4 py-2 outline-none cursor-pointer focus:border-[#B7F34A] transition-colors"
          >
            {Object.keys(skillRadarDatasets).map((role) => (
              <option key={role} value={role} className="bg-[#172120] text-[#F3F1EA]">
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Skill Gap Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Chart Card */}
        <div className="lg:col-span-6 rounded-[28px] bg-[#1E2B2A] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#B7F34A]" />
                <h3 className="font-serif text-lg font-semibold text-[#F3F1EA]">
                  Competency <span className="italic text-[#B7F34A]">Radar</span>
                </h3>
              </div>
              <p className="text-xs text-[#9FB0AD] mt-0.5">
                Targeting: <span className="text-[#F3F1EA] font-medium">{selectedRole}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#9FB0AD] uppercase tracking-wider block">
                Role Fit Index
              </span>
              <span className="font-serif text-2xl font-bold text-[#B7F34A]">
                {currentDataset.roleMatchScore}%
              </span>
            </div>
          </div>

          {/* Chart Container */}
          <div className="w-full h-80 my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={currentDataset.radarData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#9FB0AD', fontSize: 11, fontFamily: 'Inter' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#9FB0AD', fontSize: 9 }}
                  stroke="rgba(255, 255, 255, 0.06)"
                />
                <Tooltip content={<CustomRadarTooltip />} />
                <Radar
                  name="Your Verified Skills"
                  dataKey="student"
                  stroke="#B7F34A"
                  fill="#B7F34A"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
                <Radar
                  name="Industry Benchmark"
                  dataKey="industry"
                  stroke="#38BDF8"
                  fill="#38BDF8"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-3 border-t border-white/[0.06] text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#B7F34A] shadow-[0_0_8px_rgba(183,243,74,0.5)]"></span>
              <span className="text-[#F3F1EA]">Your Skills ({currentDataset.roleMatchScore}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400"></span>
              <span className="text-[#9FB0AD]">Industry Baseline</span>
            </div>
          </div>
        </div>

        {/* Skill Gaps & Recommended Next Steps */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="rounded-[28px] bg-[#1E2B2A] border border-white/[0.08] p-6 sm:p-8 flex-1">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#B7F34A]" />
                <h3 className="font-serif text-lg font-semibold text-[#F3F1EA]">
                  Actionable <span className="italic text-[#B7F34A]">Skill Gaps</span>
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#B7F34A] bg-[#B7F34A]/10 px-2 py-0.5 rounded-full border border-[#B7F34A]/20">
                {currentDataset.gaps.length} Target Gaps Identified
              </span>
            </div>

            <div className="space-y-4">
              {currentDataset.gaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="bg-[#172120] rounded-2xl p-4 border border-white/[0.06] hover:border-white/15 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#F3F1EA]">
                      {gap.skill}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                      {gap.delta}
                    </span>
                  </div>

                  {/* Dual progress bar */}
                  <div className="w-full bg-[#243534] h-2 rounded-full overflow-hidden relative mb-3">
                    {/* Industry level marker */}
                    <div
                      className="absolute top-0 bottom-0 bg-sky-400/40"
                      style={{ width: `${gap.targetLevel}%` }}
                    />
                    {/* Student level */}
                    <div
                      className="absolute top-0 bottom-0 bg-[#B7F34A] rounded-full"
                      style={{ width: `${gap.currentLevel}%` }}
                    />
                  </div>

                  {/* Recommendation pill */}
                  <div className="mt-2.5 p-3 rounded-xl bg-[#1E2B2A] border border-white/[0.05] flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-lg bg-[#B7F34A]/10 flex items-center justify-center text-[#B7F34A] shrink-0 mt-0.5">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B7F34A] block">
                        Recommended Next Step:
                      </span>
                      <p className="text-xs text-[#9FB0AD] mt-0.5 leading-relaxed">
                        {gap.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Career Path Recommendation Cards */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-4 h-4 text-[#B7F34A]" />
          <h3 className="font-serif text-xl font-semibold text-[#F3F1EA]">
            AI Recommended <span className="italic text-[#B7F34A]">Career Pathways</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careerRecommendations.map((career, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="rounded-[24px] bg-[#1E2B2A] border border-white/[0.08] hover:border-[#B7F34A]/40 p-6 flex flex-col justify-between transition-all group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-[#9FB0AD]">
                    Match Tier #{idx + 1}
                  </span>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B7F34A]/10 border border-[#B7F34A]/25 text-[#B7F34A] text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>{career.match}% Match</span>
                  </div>
                </div>

                <h4 className="font-serif text-lg font-semibold text-[#F3F1EA] group-hover:text-[#B7F34A] transition-colors">
                  {career.role}
                </h4>
                <p className="text-xs text-[#9FB0AD] mt-1">
                  {career.companyCategory}
                </p>

                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#9FB0AD]">Estimated CTC:</span>
                    <span className="text-[#F3F1EA] font-semibold">{career.avgPackage}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#9FB0AD]">Market Momentum:</span>
                    <span className="text-emerald-400 font-medium">{career.growthIndex}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#9FB0AD] block mb-1.5">
                    Skills You Already Have:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.topSkillsMatched.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#172120] text-[#F3F1EA] border border-white/10"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#9FB0AD] font-mono">
                  {career.openingsInRegion}
                </span>
                <span className="text-[#B7F34A] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Explore →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
