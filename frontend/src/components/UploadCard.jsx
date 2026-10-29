import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  X, 
  Sparkles, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { SkillTagInput } from './jobs/SkillTagInput';
import { sha256Hex } from '../utils/hash';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Technical',
  'Sports',
  'Cultural',
  'Volunteering',
  'Research',
  'Internship'
];

export const UploadCard = ({ onAddActivity, initialValues = null }) => {
  const { currentUser } = useAuth();

  const [title, setTitle] = useState(() => initialValues?.title || '');
  const [category, setCategory] = useState(() => initialValues?.category || 'Technical');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(() => initialValues?.description || '');
  const [skills, setSkills] = useState(() => (Array.isArray(initialValues?.skills) ? initialValues.skills : []));
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    // Check size (< 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit.');
      return;
    }

    setErrorMessage('');
    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      // PDF or other document
      setFilePreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

const downscaleImage = (imageFile, maxDim = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to render image for compression'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file for compression'));
    reader.readAsDataURL(imageFile);
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!file) {
      setErrorMessage('Please attach a verification proof file (PDF or Image).');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Please provide an achievement title.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a short description.');
      return;
    }

    setIsSubmitting(true);

    /*
     * =========================================================================
     * BACKEND INTEGRATION PLACEHOLDER: AWS S3 PRESIGNED URL UPLOAD
     * =========================================================================
     * 1. Request presigned URL from Backend (POST /api/v1/storage/presigned-url)
     * 2. Direct S3 Upload via PUT request with binary body
     * 3. Submit Achievement metadata & S3 key to REST API (POST /api/v1/activities)
     * =========================================================================
     */

    try {
      // 1. Compute raw file SHA-256 digest from ORIGINAL file bytes
      const arrayBuffer = await file.arrayBuffer();
      const fileHash = await sha256Hex(arrayBuffer);

      // 2. For image uploads, downscale to max 1200px width/height and re-encode as JPEG 0.8
      const isImage = file.type.startsWith('image/');
      const fileType = isImage ? 'image' : 'pdf';
      let fileUrl = null;

      if (isImage) {
        fileUrl = await downscaleImage(file, 1200, 0.8);
      } else {
        fileUrl = null;
      }

      // Simulated network latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      const studentEmail = currentUser?.email || 'aarav.sharma@nitsri.ac.in';
      const studentName = currentUser?.name || 'Aarav Sharma';
      const institution = currentUser?.institution || 'National Institute of Technology, Srinagar';

      const newActivity = {
        id: `act-${Date.now()}`,
        studentEmail,
        studentName,
        institution,
        title: title.trim(),
        category,
        date,
        formattedDate: new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        status: 'Pending',
        description: description.trim(),
        skills: [...skills],
        skillsAwarded: [],
        proofType: file ? file.name : 'Uploaded Digital Verification File',
        issuer: 'Self-Submitted (Awaiting Dean/HOD Endorsement)',
        fileUrl,
        fileType,
        fileName: file ? file.name : (fileType === 'image' ? 'achievement_proof.png' : 'achievement_proof.pdf'),
        fileHash,
        submittedAt: date,
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null,
        proof: null
      };

      await onAddActivity(newActivity);

      // Reset Form
      setTitle('');
      setDescription('');
      setCategory('Technical');
      setSkills([]);
      setFile(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process file checksum.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="upload-section" className="my-12">
      <div className="rounded-[28px] bg-[#1E2B2A] border border-white/[0.08] p-6 sm:p-8 relative overflow-hidden shadow-xl">
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B7F34A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#B7F34A] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accreditation Submission</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F3F1EA]">
              Upload Credential <span className="italic text-[#B7F34A]">Proof</span>
            </h2>
            <p className="text-xs text-[#9FB0AD] mt-1">
              Submit certificates, contest citations, research preprints, or sports citations for
              faculty blockchain verification.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 text-rose-300 text-xs animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drag & Drop File Upload Area */}
          <div>
            <label className="block text-xs font-medium text-[#9FB0AD] mb-2 uppercase tracking-wider">
              Verification Proof File (PDF / Image) *
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-[24px] p-6 sm:p-8 transition-all text-center cursor-pointer ${
                isDragging
                  ? 'border-[#B7F34A] bg-[#B7F34A]/5'
                  : 'border-white/10 hover:border-white/20 bg-[#172120]/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />

              {file ? (
                <div className="flex items-center justify-between bg-[#1E2B2A] p-4 rounded-2xl border border-white/10 text-left">
                  <div className="flex items-center gap-3">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#263836] border border-white/10 flex items-center justify-center text-[#B7F34A]">
                        <FileCheck className="w-7 h-7" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-[#F3F1EA] truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-[#9FB0AD]">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.type || 'Document'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    aria-label="Remove selected file"
                    className="p-2 text-[#9FB0AD] hover:text-rose-400 rounded-full hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E2B2A] border border-white/10 flex items-center justify-center text-[#B7F34A] shadow-inner mb-1">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-semibold text-[#F3F1EA]">
                    Drop your proof file here or{' '}
                    <span className="text-[#B7F34A] underline underline-offset-4">browse files</span>
                  </p>
                  <p className="text-xs text-[#9FB0AD]">
                    Supports PDF citations, scanned certificates, and photo credentials (under 10MB)
                  </p>
                  <div className="mt-2 text-[10px] text-[#9FB0AD]/60 font-mono">
                    Direct SHA-256 client hashing before departmental review
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="achievement-title" className="block text-xs font-medium text-[#9FB0AD] mb-1.5 uppercase tracking-wider">
                Achievement Title *
              </label>
              <div className="relative">
                <input
                  id="achievement-title"
                  type="text"
                  required
                  placeholder="e.g. 1st Prize - State Inter-College Hackathon 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#9FB0AD]/40 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="achievement-category" className="block text-xs font-medium text-[#9FB0AD] mb-1.5 uppercase tracking-wider">
                Category *
              </label>
              <div className="relative">
                <select
                  id="achievement-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-3 text-sm text-[#F3F1EA] outline-none transition-colors appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#172120] text-[#F3F1EA]">
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9FB0AD] text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Date */}
            <div>
              <label htmlFor="achievement-date" className="block text-xs font-medium text-[#9FB0AD] mb-1.5 uppercase tracking-wider">
                Achievement Date *
              </label>
              <div className="relative">
                <input
                  id="achievement-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-3 text-sm text-[#F3F1EA] outline-none transition-colors cursor-pointer"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="achievement-description" className="block text-xs font-medium text-[#9FB0AD] mb-1.5 uppercase tracking-wider">
                Key Highlights & Impact *
              </label>
              <input
                id="achievement-description"
                type="text"
                required
                placeholder="Briefly state your role, project summary, or tournament score..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#172120] border border-white/10 focus:border-[#B7F34A] rounded-2xl px-4 py-3 text-sm text-[#F3F1EA] placeholder-[#9FB0AD]/40 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Optional: Skills This Shows (SkillTagInput with SKILL_VOCABULARY) */}
          <div>
            <SkillTagInput
              id="student-skills-shows-input"
              label="Skills this shows (Optional)"
              tags={skills}
              onChange={setSkills}
              placeholder="Tag skills demonstrated (e.g. React, Python, Edge AI)..."
              helperText="Reviewing faculty can endorse or expand these tags into your verified skill radar upon approval."
            />
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#9FB0AD] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A]" />
              Submission will be queued for college admin review and hashing.
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#B7F34A] hover:bg-[#C9FA62] text-sm font-semibold text-[#172120] transition-all shadow-[0_0_25px_rgba(183,243,74,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Hash & Submitting...</span>
                </>
              ) : (
                <span>Submit for faculty approval →</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
