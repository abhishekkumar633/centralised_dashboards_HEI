import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { SKILL_VOCABULARY } from '../../data/jobsMock';

export const SkillTagInput = ({
  id,
  label,
  tags = [],
  onChange,
  placeholder = 'Type skill & press Enter...',
  error = '',
  helperText = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Filter vocabulary suggestions not already selected
  const normalizedTags = tags.map((t) => t.trim().toLowerCase());
  const filteredSuggestions = SKILL_VOCABULARY.filter((skill) => {
    const norm = skill.trim().toLowerCase();
    const matchesInput = norm.includes(inputValue.trim().toLowerCase());
    const notAlreadyAdded = !normalizedTags.includes(norm);
    return matchesInput && notAlreadyAdded;
  }).slice(0, 6);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!normalizedTags.includes(trimmed.toLowerCase())) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
    setIsDropdownOpen(false);
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isDropdownOpen && filteredSuggestions.length > 0 && highlightedIndex >= 0) {
        addTag(filteredSuggestions[highlightedIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    } else if (e.key === 'ArrowDown' && isDropdownOpen) {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === 'ArrowUp' && isDropdownOpen) {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev <= 0 ? filteredSuggestions.length - 1 : prev - 1
      );
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-[#F3F1EA] mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Tags Box */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`min-h-[46px] w-full rounded-2xl bg-[#172120] border p-2 flex flex-wrap items-center gap-1.5 cursor-text transition-colors ${
          error
            ? 'border-rose-500/50 focus-within:border-rose-500'
            : 'border-white/[0.1] focus-within:border-[#B7F34A]/50 focus-within:ring-1 focus-within:ring-[#B7F34A]/20'
        }`}
      >
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E2B2A] border border-[#B7F34A]/30 text-xs font-medium text-[#F3F1EA] shadow-sm animate-in fade-in"
          >
            <span className="text-[#B7F34A]">{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(idx);
              }}
              aria-label={`Remove ${tag}`}
              className="p-0.5 rounded-full hover:bg-white/10 text-[#9FB0AD] hover:text-rose-400 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="relative flex-1 min-w-[140px]">
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsDropdownOpen(true);
              setHighlightedIndex(0);
            }}
            onFocus={() => {
              if (inputValue.trim()) setIsDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : 'Add more...'}
            className="w-full bg-transparent text-xs text-[#F3F1EA] placeholder-[#9FB0AD]/50 focus:outline-none py-1 px-1"
          />

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-[#1E2B2A] border border-white/15 p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[10px] uppercase font-mono text-[#9FB0AD] flex items-center gap-1 border-b border-white/[0.06] mb-1">
                <Sparkles className="w-3 h-3 text-[#B7F34A]" />
                <span>Skill Suggestions</span>
              </div>
              <ul className="max-h-48 overflow-y-auto space-y-0.5">
                {filteredSuggestions.map((suggestion, idx) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => addTag(suggestion)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        idx === highlightedIndex
                          ? 'bg-[#B7F34A] text-[#172120] font-semibold'
                          : 'text-[#F3F1EA] hover:bg-white/[0.06]'
                      }`}
                    >
                      <span>{suggestion}</span>
                      <Plus className="w-3 h-3 opacity-60" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Helper / Error Text */}
      {error ? (
        <p role="alert" className="text-[11px] text-rose-400 mt-1 pl-1">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-[#9FB0AD] mt-1 pl-1 font-mono">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
