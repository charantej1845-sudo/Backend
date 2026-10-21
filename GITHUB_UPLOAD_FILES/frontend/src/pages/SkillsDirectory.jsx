import React, { useState, useEffect } from 'react';
import { Award, Search, Sparkles, Filter } from 'lucide-react';
import api from '../services/api';
import SkillBadge from '../components/SkillBadge';

const SkillsDirectory = () => {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Technical & IT',
    'Teaching & Mentoring',
    'Healthcare & First Aid',
    'Logistics & Events',
    'Media, Content & Design',
    'Environment & Conservation',
    'General & Community',
  ];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await api.get('/skills', { params });
      if (res.data.success) {
        setSkills(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Competency & Talent Catalog</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Skills & Qualifications Directory
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl">
          Volunteers select from this verified skill catalog to match with event requirements. NGOs use these standard competency tags to accurately recruit the exact talent required.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills (e.g. CPR, Coding, Tree)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : skills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{skill.name}</h3>
                  <Award className="w-4 h-4 text-indigo-500 shrink-0" />
                </div>
                <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {skill.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {skill.description || 'Standard non-profit skill verification profile.'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No skills found matching your search.
        </div>
      )}
    </div>
  );
};

export default SkillsDirectory;
