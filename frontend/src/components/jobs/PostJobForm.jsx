import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { SkillTagInput } from './SkillTagInput';
import { useJobs } from '../../context/JobsContext';
import { useAuth } from '../../context/AuthContext';
import { todayISO, addDays } from '../../utils/dates';

export const PostJobForm = ({ onJobPosted, onShowToast }) => {
  const { postJob } = useJobs();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(currentUser?.company || 'Apex Systems & AI Labs');
  const [location, setLocation] = useState('Srinagar (Rangreth Tech Park)');
  const [type, setType] = useState('Full-time');
  const [mode, setMode] = useState('Hybrid');
  const [stipendOrSalary, setStipendOrSalary] = useState('₹14 - 18 LPA');
  const [deadline, setDeadline] = useState(() => addDays(todayISO(), 30));
  const [description, setDescription] = useState('');
  const [minVerifiedActivities, setMinVerifiedActivities] = useState(2);
  const [requiredSkills, setRequiredSkills] = useState(['Edge AI', 'PyTorch']);
  const [preferredSkills, setPreferredSkills] = useState(['Docker', 'Sensor Telemetry']);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Job title is required.';
    if (!company.trim()) errs.company = 'Company name is required.';
    if (!location.trim()) errs.location = 'Location is required.';
    if (!stipendOrSalary.trim()) errs.stipendOrSalary = 'Compensation range is required.';
    if (!deadline) errs.deadline = 'Application deadline is required.';
    if (!description.trim()) errs.description = 'Job description is required.';
    if (requiredSkills.length === 0) {
      errs.requiredSkills = 'Add at least one required skill for algorithmic matching.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const createdJob = await postJob({
        title,
        company,
        location,
        type,
        mode,
        stipendOrSalary,
        deadline,
        description,
        minVerifiedActivities: Number(minVerifiedActivities) || 1,
        requiredSkills,
        preferredSkills,
        postedBy: currentUser?.email || 'tanya.roy@apexsystems.io',
      });

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Job vacancy published!',
          message: `"${title}" is now open for verified student applicants.`,
        });
      }

      if (onJobPosted) {
        onJobPosted(createdJob);
      }

      // Reset form fields
      setTitle('');
      setDescription('');
      setDeadline(addDays(todayISO(), 30));
      setRequiredSkills(['Edge AI']);
      setPreferredSkills(['Docker']);
    } catch (err) {
      if (onShowToast) {
        onShowToast({
          type: 'error',
          title: 'Could not publish job',
          message: err.message || 'The server rejected this vacancy posting.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] bg-[#1E2B2A] border border-white/[0.08] p-6 sm:p-8 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-1 text-xs uppercase font-mono text-[#B7F34A]">
        <Sparkles className="w-3.5 h-3.5" />
        <span>New Vacancy Posting</span>
      </div>
      <h3 className="font-serif text-2xl font-semibold text-[#F3F1EA] mb-6">
        Post a verified <span className="italic text-[#B7F34A]">job opening.</span>
      </h3>

      <div className="space-y-5">
        {/* Row 1: Title & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="job-title"
              className="block text-xs font-medium text-[#F3F1EA] mb-1.5"
            >
              Job Title *
            </label>
            <div className="relative">
              <input
                id="job-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Edge AI Firmware Engineer"
                className={`w-full rounded-2xl bg-[#172120] border px-4 py-2.5 text-xs text-[#F3F1EA] placeholder-[#9FB0AD]/50 focus:outline-none transition-colors ${
                  errors.title
                    ? 'border-rose-500/60 focus:border-rose-500'
                    : 'border-white/10 focus:border-[#B7F34A]/50 focus:ring-1 focus:ring-[#B7F34A]/20'
                }`}
              />
            </div>
            {errors.title && (
              <p role="alert" className="text-[11px] text-rose-400 mt-1 pl-1">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="job-company"
              className="block text-xs font-medium text-[#F3F1EA] mb-1.5"
            >
              Company / Institution *
            </label>
            <div className="relative">
              <input
                id="job-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Systems & AI Labs"
                className={`w-full rounded-2xl bg-[#172120] border px-4 py-2.5 text-xs text-[#F3F1EA] placeholder-[#9FB0AD]/50 focus:outline-none transition-colors ${
                  errors.company
                    ? 'border-rose-500/60 focus:border-rose-500'
                    : 'border-white/10 focus:border-[#B7F34A]/50'
                }`}
              />
            </div>
            {errors.company && (
              <p role="alert" className="text-[11px] text-rose-400 mt-1 pl-1">
                {errors.company}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Location, Type, Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="job-location"
              className="block text-xs font-medium text-[#F3F1EA] mb-1.5"
            >
              Location *
            </label>
            <input
              id="job-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Srinagar, Remote, Delhi"
              className={`w-full rounded-2xl bg-[#172120] border px-4 py-2.5 text-xs text-[#F3F1EA] placeholder-[#9FB0AD]/50 focus:outline-none transition-colors ${
                errors.location
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-white/10 focus:border-[#B7F34A]/50'
              }`}
            />
            {errors.location && (
              <p role="alert" className="text-[11px] text-rose-400 mt-1 pl-1">
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="job-type"
              className="block text-xs font-medium text-[#F3F1EA] mb-1.5"
            >
              Employment Type
            </label>
            <select
              id="job-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-2xl bg-[#172120] border border-white/10 px-3.5 py-2.5 text-xs text-[#F3F1EA] focus:outline-none focus:border-[#B7F34A]/50 cursor-pointer"
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="job-mode"
              className="block text-xs font-medium text-[#F3F1EA] mb-1.5"
            >
              Workplace Mode
            </label>
            <select
              id="job-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-2xl bg-[#172120] border border-white/10 px-3.5 py-2.5 text-xs text-[#F3F1EA] focus:outline-none focus:border-[#B7F34A]/50 cursor-pointer"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        {/* Row 3: Compensation, Deadline, Min Verified */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="job-salary"
              className="block text-xs font-medium text-[#F3F1EA] mb-1.5"
            >
              Stipend / Salary *
            </label>
            <input
              id="job-salary"
              type="text"
              value={stipendOrSalary}
              onChange={(e) => setStipendOrSalary(e.target.value)}
              placeholder="e.g. ₹12 - 16 LPA or ₹30k/mo"
              className={`w-full rounded-2xl bg-[#172120] border px-4 py-2.5 text-xs text-[#F3F1EA] placeholder-[#9FB0AD]/50 focus:outline-none transition-colors ${
                errors.stipendOrSalary
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-white/10 focus:border-[#B7F34A]/50'
              }`}
            />
            {errors.stipendOrSalary && (
              <p role="alert" className="text-[11px] text-rose-400 mt-1 pl-1">
                {errors.stipendOrSalary}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="job-deadline"
              className="block text-xs font-medium text-[#F3F1EA] mb-1.5"
            >
              Application Deadline *
            </label>
            <input
              id="job-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={`w-full rounded-2xl bg-[#172120] border px-4 py-2 text-xs text-[#F3F1EA] focus:outline-none transition-colors ${
                errors.deadline
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-white/10 focus:border-[#B7F34A]/50'
              }`}
            />
            {errors.deadline && (
              <p role="alert" className="text-[11px] text-rose-400 mt-1 pl-1">
                {errors.deadline}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="min-activities"
              className="block text-xs font-medium text-[#F3F1EA] mb-1.5"
            >
              Min. Verified Records
            </label>
            <input
              id="min-activities"
              type="number"
              min="0"
              max="20"
              value={minVerifiedActivities}
              onChange={(e) => setMinVerifiedActivities(e.target.value)}
              className="w-full rounded-2xl bg-[#172120] border border-white/10 px-4 py-2 text-xs text-[#F3F1EA] focus:outline-none focus:border-[#B7F34A]/50"
            />
          </div>
        </div>

        {/* Row 4: Tag Inputs for Required and Preferred Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <SkillTagInput
            id="required-skills"
            label="Required Skills (70% Matching Weight) *"
            tags={requiredSkills}
            onChange={setRequiredSkills}
            placeholder="Type skill & press Enter..."
            error={errors.requiredSkills}
            helperText="Matches will heavily prioritize candidates holding verified proofs in these skills."
          />

          <SkillTagInput
            id="preferred-skills"
            label="Preferred Skills (30% Matching Weight)"
            tags={preferredSkills}
            onChange={setPreferredSkills}
            placeholder="Type skill & press Enter..."
            helperText="Additional nice-to-have skills for candidate scoring."
          />
        </div>

        {/* Row 5: Description */}
        <div>
          <label
            htmlFor="job-description"
            className="block text-xs font-medium text-[#F3F1EA] mb-1.5"
          >
            Role Description & Responsibilities *
          </label>
          <textarea
            id="job-description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline candidate expectations, key projects, and organizational impact..."
            className={`w-full rounded-2xl bg-[#172120] border px-4 py-3 text-xs text-[#F3F1EA] placeholder-[#9FB0AD]/50 focus:outline-none transition-colors ${
              errors.description
                ? 'border-rose-500/60 focus:border-rose-500'
                : 'border-white/10 focus:border-[#B7F34A]/50 focus:ring-1 focus:ring-[#B7F34A]/20'
            }`}
          />
          {errors.description && (
            <p role="alert" className="text-[11px] text-rose-400 mt-1 pl-1">
              {errors.description}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-[#172120] font-semibold text-xs transition-all shadow-[0_0_20px_rgba(183,243,74,0.3)] hover:translate-y-[-1px] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Publish Vacancy →</span>
          </button>
        </div>
      </div>
    </form>
  );
};
