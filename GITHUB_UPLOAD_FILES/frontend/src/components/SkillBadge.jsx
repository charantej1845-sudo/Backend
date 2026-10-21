import React from 'react';

const categoryColorMap = {
  'Healthcare & First Aid': 'bg-rose-50 text-rose-700 border-rose-200',
  'Teaching & Mentoring': 'bg-amber-50 text-amber-700 border-amber-200',
  'Environment & Conservation': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Technical & IT': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Media, Content & Design': 'bg-purple-50 text-purple-700 border-purple-200',
  'Logistics & Events': 'bg-blue-50 text-blue-700 border-blue-200',
  'General & Community': 'bg-slate-100 text-slate-700 border-slate-300',
};

const SkillBadge = ({ skill, matched = false, showCategory = false, onRemove }) => {
  if (!skill) return null;

  const name = typeof skill === 'string' ? skill : skill.name;
  const category = typeof skill === 'object' ? skill.category : 'General & Community';
  const colorClass = categoryColorMap[category] || categoryColorMap['General & Community'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${colorClass} ${
        matched ? 'ring-2 ring-emerald-500 shadow-sm' : ''
      }`}
    >
      <span>{name}</span>
      {showCategory && <span className="opacity-60 text-[10px]">({category})</span>}
      {matched && (
        <span className="text-[10px] bg-emerald-600 text-white px-1 rounded font-bold">
          Match!
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 text-slate-400 hover:text-rose-600 focus:outline-none"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
