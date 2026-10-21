import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileCheck2,
  Users,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  MapPin,
  Calendar,
  Star,
  MessageSquare,
  Search,
  Filter,
} from 'lucide-react';
import api from '../../services/api';
import SkillBadge from '../../components/SkillBadge';

const NGOApplicants = () => {
  const [searchParams] = useSearchParams();
  const initialEventFilter = searchParams.get('event') || 'All';

  const [applications, setApplications] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventFilter);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Attendance Modal state
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [hoursLogged, setHoursLogged] = useState(4);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [updating, setUpdating] = useState(false);

  const fetchApplicationsAndEvents = async () => {
    try {
      setLoading(true);
      const [appsRes, eventsRes] = await Promise.all([
        api.get('/applications/ngo/all'),
        api.get('/events/ngo/my-events'),
      ]);

      if (appsRes.data.success) {
        setApplications(appsRes.data.data);
      }
      if (eventsRes.data.success) {
        setEvents(eventsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationsAndEvents();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchApplicationsAndEvents();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const openAttendanceModal = (app) => {
    setSelectedApp(app);
    setHoursLogged(app.event?.hoursCredit || 4);
    setFeedback(app.feedback || 'Outstanding participation and community spirit!');
    setRating(app.rating || 5);
    setAttendanceModalOpen(true);
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setUpdating(true);
      const res = await api.put(`/applications/${selectedApp._id}/status`, {
        status: 'attended',
        hoursLogged: Number(hoursLogged),
        feedback,
        rating: Number(rating),
      });

      if (res.data.success) {
        setAttendanceModalOpen(false);
        fetchApplicationsAndEvents();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record attendance');
    } finally {
      setUpdating(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (selectedEventId !== 'All' && app.event?._id !== selectedEventId) {
      return false;
    }
    if (statusFilter !== 'All' && app.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileCheck2 className="w-7 h-7 text-blue-600" />
          <span>Volunteer Applications & Attendance</span>
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Review candidate qualifications, approve event rosters, and award certified volunteer service hours.
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filter by Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Events ({events.length})</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Application Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="attended">Attended & Credited</option>
              <option value="rejected">Declined</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 self-end sm:self-center">
          Showing <strong>{filteredApplications.length}</strong> applicants
        </div>
      </div>

      {/* Applicants List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const vol = app.volunteer || {};
            const ev = app.event || {};
            const prof = app.volunteerProfile || {};
            const isPending = app.status === 'pending';
            const isApproved = app.status === 'approved';
            const isAttended = app.status === 'attended';

            return (
              <div
                key={app._id}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Volunteer & Event Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isAttended
                          ? 'bg-indigo-100 text-indigo-800'
                          : isPending
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {app.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{vol.name || 'Volunteer'}</h3>
                    <p className="text-xs text-slate-500">
                      {vol.email} {vol.phone && `• ${vol.phone}`}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <p className="font-semibold text-slate-700">Target Event: {ev.title}</p>
                    {app.message && <p className="text-slate-600 italic">"{app.message}"</p>}
                  </div>

                  {/* Skills preview */}
                  {prof.skills && prof.skills.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Volunteer Skills:</span>
                      {prof.skills.map((s) => (
                        <span
                          key={s._id || s.name}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Attended Hours Badge */}
                  {isAttended && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-800 rounded-lg text-xs font-bold border border-indigo-100">
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{app.hoursLogged} Hours Credited to Volunteer Profile</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-end gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'approved')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/20"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve Application</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'rejected')}
                        className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <button
                      onClick={() => openAttendanceModal(app)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/20"
                    >
                      <Award className="w-4 h-4" />
                      <span>Mark Attended & Credit Hours</span>
                    </button>
                  )}

                  {isAttended && (
                    <button
                      onClick={() => openAttendanceModal(app)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-medium transition cursor-pointer"
                    >
                      Update Recorded Hours
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No applicants found matching the selected filter.
        </div>
      )}

      {/* Attendance & Hours Credit Modal */}
      {attendanceModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Record Attendance & Credit Hours
              </h3>
              <button
                onClick={() => setAttendanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>
                Volunteer: <strong className="text-slate-800">{selectedApp.volunteer?.name}</strong>
              </p>
              <p>
                Event: <strong className="text-slate-800">{selectedApp.event?.title}</strong>
              </p>
            </div>

            <form onSubmit={handleAttendanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Hours to Credit
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  required
                  value={hoursLogged}
                  onChange={(e) => setHoursLogged(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Performance Feedback / Note
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Leave encouraging feedback for the volunteer..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 ml-2 font-bold">{rating} / 5</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAttendanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
                >
                  {updating ? 'Saving...' : 'Confirm Attendance & Hours'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGOApplicants;
