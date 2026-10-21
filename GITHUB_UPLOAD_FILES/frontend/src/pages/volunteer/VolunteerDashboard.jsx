import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  Award,
  Calendar,
  FileCheck2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Settings,
  Sparkles,
  MapPin,
} from 'lucide-react';
import api from '../../services/api';
import SkillBadge from '../../components/SkillBadge';

const VolunteerDashboard = () => {
  const { user, profile, availability } = useAuth();
  const [stats, setStats] = useState({
    totalHoursLogged: 0,
    eventsAttendedCount: 0,
    totalApplications: 0,
    approvedCount: 0,
    pendingCount: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, appsRes] = await Promise.all([
          api.get('/stats/volunteer'),
          api.get('/applications/my-applications'),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (appsRes.data.success) {
          setRecentApplications(appsRes.data.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching volunteer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              Volunteer Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Welcome back, {user?.name || 'Volunteer'}!
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl">
              Track your service hours, manage upcoming community commitments, and keep your availability schedule updated.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/events"
              className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold transition shadow-sm"
            >
              Browse Events
            </Link>
            <Link
              to="/volunteer/availability"
              className="px-4 py-2 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition border border-emerald-500/30"
            >
              Update Availability
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">
              {profile?.totalHoursLogged || stats.totalHoursLogged || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Hours Contributed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">
              {profile?.eventsAttendedCount || stats.eventsAttendedCount || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Events Completed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">
              {stats.approvedCount || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Approved Upcoming</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">
              {stats.pendingCount || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Pending Review</p>
          </div>
        </div>
      </div>

      {/* Profile & Availability Quick Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Availability Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>My Availability Schedule</span>
            </h3>
            <Link
              to="/volunteer/availability"
              className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold"
            >
              Edit →
            </Link>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Active Days:
              </p>
              <div className="flex flex-wrap gap-1">
                {availability?.daysOfWeek && availability.daysOfWeek.length > 0 ? (
                  availability.daysOfWeek.map((day) => (
                    <span
                      key={day}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200"
                    >
                      {day}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">Weekends (Default)</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Preferred Time Slots:
              </p>
              <div className="flex flex-wrap gap-1">
                {availability?.timeSlots && availability.timeSlots.length > 0 ? (
                  availability.timeSlots.map((slot) => (
                    <span
                      key={slot}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]"
                    >
                      {slot}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">Morning & Afternoon</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Max Commitment:</span>
              <strong className="text-slate-800">
                {availability?.maxHoursPerWeek || 10} hrs / week
              </strong>
            </div>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>My Skills & Qualifications</span>
            </h3>
            <Link
              to="/volunteer/profile"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Add / Edit →
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <SkillBadge key={typeof skill === 'string' ? skill : skill._id} skill={skill} />
                ))
              ) : (
                <div className="py-4 text-center w-full">
                  <p className="text-xs text-slate-500 mb-2">No skills added yet.</p>
                  <Link
                    to="/volunteer/profile"
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Select your skills from the catalog
                  </Link>
                </div>
              )}
            </div>

            {profile?.badges && profile.badges.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Badges Earned</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
                    >
                      ★ {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location & Emergency Contact Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-600" />
              <span>Location & Contact</span>
            </h3>
            <Link
              to="/volunteer/profile"
              className="text-xs text-slate-600 hover:text-slate-800 font-semibold"
            >
              Edit →
            </Link>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-[11px] text-slate-400">Current Base City:</p>
              <p className="font-semibold text-slate-800">
                {profile?.location?.city
                  ? `${profile.location.city}, ${profile.location.state || profile.location.country}`
                  : 'Not specified'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-[11px] text-slate-400">Emergency Contact:</p>
              <p className="font-semibold text-slate-800">
                {profile?.emergencyContact?.name
                  ? `${profile.emergencyContact.name} (${profile.emergencyContact.relation || 'Contact'}) - ${profile.emergencyContact.phone}`
                  : 'Not specified yet'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
            <p className="text-xs text-slate-500">Track current status of your volunteer event requests</p>
          </div>
          <Link
            to="/volunteer/applications"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Event</th>
                  <th className="py-2.5 px-3 font-semibold">Date</th>
                  <th className="py-2.5 px-3 font-semibold">Location</th>
                  <th className="py-2.5 px-3 font-semibold">Credit</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3 font-semibold text-slate-800 max-w-xs truncate">
                      {app.event?.title || 'Event'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {app.event?.startDate
                        ? new Date(app.event.startDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {app.event?.city || app.event?.locationType || 'In-Person'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {app.hoursLogged || app.event?.hoursCredit || 4} hrs
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'attended'
                            ? 'bg-indigo-100 text-indigo-800'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <Link
                        to={`/events/${app.event?._id || app.event}`}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        View Event
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            You haven't applied to any events yet.{' '}
            <Link to="/events" className="text-indigo-600 font-semibold hover:underline">
              Explore upcoming events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
