import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Users,
  Clock,
  FileCheck2,
  PlusCircle,
  Building2,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const NGODashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    upcomingEvents: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    attendedApplications: 0,
    hoursDelivered: 0,
  });
  const [pendingApps, setPendingApps] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, appsRes, eventsRes] = await Promise.all([
        api.get('/stats/ngo'),
        api.get('/applications/ngo/all'),
        api.get('/events/ngo/my-events'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (appsRes.data.success) {
        setPendingApps(appsRes.data.data.filter((a) => a.status === 'pending').slice(0, 5));
      }
      if (eventsRes.data.success) {
        setMyEvents(eventsRes.data.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Error fetching NGO dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setActionLoading(appId);
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-blue-300 text-xs font-semibold uppercase tracking-wider">
              NGO Organizer Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {user?.name || 'Organization Dashboard'}
            </h1>
            <p className="text-blue-100/80 text-xs sm:text-sm max-w-xl">
              Coordinate events, review volunteer applicants, and verify community service hours for social impact.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/ngo/events?action=create"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </Link>
            <Link
              to="/ngo/volunteers"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition border border-white/20"
            >
              Find Volunteers
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalEvents || 0}</p>
            <p className="text-xs text-slate-500 font-medium">Events Hosted</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.pendingApplications || 0}</p>
            <p className="text-xs text-slate-500 font-medium">Pending Reviews</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.approvedApplications || 0}</p>
            <p className="text-xs text-slate-500 font-medium">Approved Volunteers</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.hoursDelivered || 0}</p>
            <p className="text-xs text-slate-500 font-medium">Hours Delivered</p>
          </div>
        </div>
      </div>

      {/* Urgent Pending Applications */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Pending Volunteer Applications</span>
            </h3>
            <p className="text-xs text-slate-500">
              Review and approve volunteers waiting for your confirmation
            </p>
          </div>
          <Link
            to="/ngo/applicants"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Applicants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingApps.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {pendingApps.map((app) => (
              <div
                key={app._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {app.volunteer?.name || 'Volunteer Candidate'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({app.volunteer?.email})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Applying for: <strong className="text-slate-800">{app.event?.title}</strong>
                  </p>
                  {app.message && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg max-w-xl">
                      "{app.message}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    disabled={actionLoading === app._id}
                    onClick={() => handleUpdateStatus(app._id, 'approved')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    disabled={actionLoading === app._id}
                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">
            No pending applications right now. All caught up!
          </div>
        )}
      </div>

      {/* Events Quick Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Organization's Events</h3>
            <p className="text-xs text-slate-500">Live roster and volunteer attendance statistics</p>
          </div>
          <Link
            to="/ngo/events"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Manage All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myEvents.map((ev) => (
              <div
                key={ev._id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition space-y-2 bg-slate-50/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {ev.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{ev.status}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    Volunteers: <strong>{ev.approvedApplicants || 0}</strong> / {ev.volunteersNeeded}
                  </span>
                  <Link
                    to={`/ngo/applicants?event=${ev._id}`}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    View Applicants ({ev.pendingApplicants || 0} pending)
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs space-y-2">
            <p>You haven't posted any events yet.</p>
            <Link
              to="/ngo/events?action=create"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Post Your First Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGODashboard;
