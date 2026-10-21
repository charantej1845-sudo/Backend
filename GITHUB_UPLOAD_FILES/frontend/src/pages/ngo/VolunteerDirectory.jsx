import React, { useState, useEffect } from 'react';
import { Users2, Search, Filter, Clock, MapPin, Award, Mail, Phone, Calendar } from 'lucide-react';
import api from '../../services/api';
import SkillBadge from '../../components/SkillBadge';

const VolunteerDirectory = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedSkill) params.skill = selectedSkill;

      const res = await api.get('/volunteers', { params });
      if (res.data.success) {
        setVolunteers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      if (res.data.success) {
        setSkills(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchVolunteers();
  }, [selectedSkill]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVolunteers();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users2 className="w-7 h-7 text-blue-600" />
          <span>Talent & Volunteer Directory</span>
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Browse verified volunteers across skills and availability schedules. Reach out to prospective candidates for your upcoming initiatives.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Filter Skill:</span>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All Skills</option>
            {skills.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Volunteers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : volunteers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteers.map((volProfile) => {
            const user = volProfile.user || {};
            const avail = volProfile.availability || {};

            return (
              <div
                key={volProfile._id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Avatar & Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-base flex items-center justify-center shrink-0">
                        {user.name?.charAt(0) || 'V'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{user.name}</h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>
                            {volProfile.location?.city
                              ? `${volProfile.location.city}, ${volProfile.location.state || volProfile.location.country}`
                              : 'Location not specified'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {volProfile.bio && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                      "{volProfile.bio}"
                    </p>
                  )}

                  {/* Skills */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Skills:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {volProfile.skills && volProfile.skills.length > 0 ? (
                        volProfile.skills.slice(0, 3).map((s) => (
                          <SkillBadge key={s._id || s.name} skill={s} />
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">None listed</span>
                      )}
                      {volProfile.skills?.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{volProfile.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Availability Matrix Summary */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        Available Days:
                      </span>
                      <strong className="text-slate-800">
                        {avail.daysOfWeek && avail.daysOfWeek.length > 0
                          ? avail.daysOfWeek.map((d) => d.slice(0, 3)).join(', ')
                          : 'Flexible'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 font-medium">
                      <span>Max Weekly Hours:</span>
                      <strong className="text-slate-800">{avail.maxHoursPerWeek || 10} hrs/wk</strong>
                    </div>
                  </div>
                </div>

                {/* Footer Stats & Contact */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    <span className="font-bold text-emerald-600">{volProfile.totalHoursLogged || 0}</span> hrs served
                  </div>
                  <a
                    href={`mailto:${user.email}?subject=Volunteer Opportunity with our NGO`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Contact</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No volunteers match the current search or skill filter.
        </div>
      )}
    </div>
  );
};

export default VolunteerDirectory;
