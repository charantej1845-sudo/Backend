import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Search,
  Calendar,
  Users,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

const causes = [
  'All',
  'Environment & Climate',
  'Education & Literacy',
  'Healthcare & Mental Health',
  'Community Development',
  'Disaster Relief & Aid',
  'Animal Welfare',
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalNGOs: 0,
    totalEvents: 0,
    totalHoursLogged: 0,
    totalSkills: 0,
  });
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCause, setSelectedCause] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          api.get('/stats/overview'),
          api.get('/events'),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (eventsRes.data.success) {
          setFeaturedEvents(eventsRes.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>MERN-Powered Social Impact Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Manage Volunteers & NGOs With{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Precision & Empathy
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Match skilled volunteers to registered NGO events based on verified competencies and customizable weekly availability. Track service hours, manage applications, and measure social impact in one unified MERN application.
          </p>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-300 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, cause, or city (e.g. Seattle, Tree, CPR)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Find Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {!user ? (
              <>
                <Link
                  to="/register?role=volunteer"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-700/30 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Join as Volunteer</span>
                </Link>
                <Link
                  to="/register?role=ngo"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition flex items-center gap-2"
                >
                  <Building className="w-4 h-4 text-sky-400" />
                  <span>Register Your NGO</span>
                </Link>
              </>
            ) : (
              <Link
                to={
                  user.role === 'ngo'
                    ? '/ngo/events'
                    : user.role === 'admin'
                    ? '/admin/dashboard'
                    : '/volunteer/dashboard'
                }
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition flex items-center gap-2"
              >
                <span>Go to Your {user.role.toUpperCase()} Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Live Metric Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalVolunteers || 4}+</p>
              <p className="text-xs text-slate-500 font-medium">Active Volunteers</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalNGOs || 3}+</p>
              <p className="text-xs text-slate-500 font-medium">Partner NGOs</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalEvents || 5}+</p>
              <p className="text-xs text-slate-500 font-medium">Impact Events</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalHoursLogged || 94}+</p>
              <p className="text-xs text-slate-500 font-medium">Service Hours Logged</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cause Filter Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Explore by Cause</h2>
            <p className="text-xs text-slate-500">Find events matching the causes you are passionate about</p>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {causes.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedCause(c);
                navigate(c === 'All' ? '/events' : `/events?category=${encodeURIComponent(c)}`);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCause === c
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Upcoming Opportunities
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Featured Volunteer Drives</h2>
          </div>
          <Link
            to="/events"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>Browse Full Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm">No events found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* How It Works - Dual Workflow */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              End-to-End System Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Engineered for Seamless Collaboration
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              How our MERN application connects non-profits with verified volunteers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Volunteers */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Volunteers</h3>
                  <p className="text-xs text-slate-500">Contribute your talent where it matters</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-800">Set Profile & Skills:</strong> Select your competencies (CPR, STEM tutoring, coding, media) and set your weekly availability schedule.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-800">Apply With One Click:</strong> Browse events filtered by cause, location, and your matching skills. Submit an application with a note.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-800">Earn Hours & Recognition:</strong> NGOs approve your attendance and credit certified volunteer hours directly to your dashboard.
                  </div>
                </div>
              </div>

              <Link
                to="/register?role=volunteer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                <span>Get Started as Volunteer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* For NGOs */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For NGOs & Organizers</h3>
                  <p className="text-xs text-slate-500">Mobilize the exact volunteers you require</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-800">Create & Manage Events:</strong> Define title, cause, location, shifts, required skills, and capacity with complete CRUD control.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-800">Review Applications:</strong> Inspect applicant profiles, verify skills match, check their availability, and approve or reject candidates.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-800">Log Hours & Impact:</strong> Mark volunteers as attended, log verified hours, and leave official performance feedback.
                  </div>
                </div>
              </div>

              <Link
                to="/register?role=ngo"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>Register Your Organization</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
