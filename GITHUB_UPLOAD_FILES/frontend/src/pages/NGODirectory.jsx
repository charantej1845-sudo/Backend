import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, MapPin, Globe, Calendar, ShieldCheck, Mail, Phone } from 'lucide-react';
import api from '../services/api';

const NGODirectory = () => {
  const [ngos, setNgos] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/ngos', { params });
      if (res.data.success) {
        setNgos(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching NGOs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNGOs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Partner Non-Profit Organizations
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl">
          Connect with trusted organizations leading social change. Explore missions across climate, healthcare, education, and community assistance.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm max-w-xl">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search NGOs by name, cause or mission..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* NGO Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : ngos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map((ngo) => (
            <div
              key={ngo._id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition flex flex-col space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified NGO</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                  {ngo.organizationName}
                </h3>
                <span className="inline-block mt-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                  {ngo.causeCategory}
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {ngo.mission || ngo.description || 'Dedicated to advancing social welfare and humanitarian causes.'}
              </p>

              <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                {ngo.address?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ngo.address.city}, {ngo.address.state || ngo.address.country}</span>
                  </div>
                )}
                {ngo.website && (
                  <div className="flex items-center gap-2 truncate">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={ngo.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline truncate"
                    >
                      {ngo.website.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <strong>{ngo.eventsCount || 0}</strong> active events
                </span>
                <Link
                  to={`/events?search=${encodeURIComponent(ngo.organizationName)}`}
                  className="font-bold text-indigo-600 hover:text-indigo-800"
                >
                  View Events →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
          No organizations match your query.
        </div>
      )}
    </div>
  );
};

export default NGODirectory;
