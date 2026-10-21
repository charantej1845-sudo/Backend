import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, Calendar, MapPin, Building, Clock, Award, XCircle, CheckCircle, Star } from 'lucide-react';
import api from '../../services/api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my-applications');
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCancelApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw your application for this event?')) {
      return;
    }

    try {
      setCancellingId(appId);
      const res = await api.delete(`/applications/${appId}/cancel`);
      if (res.data.success) {
        fetchApplications();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel application');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileCheck2 className="w-7 h-7 text-emerald-600" />
          <span>My Event Applications</span>
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Track the status of all your volunteer applications, review organizer feedback, and manage your participations.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const ev = app.event || {};
            const isAttended = app.status === 'attended';
            const isApproved = app.status === 'approved';
            const isPending = app.status === 'pending';
            const isCancelled = app.status === 'cancelled';
            const isRejected = app.status === 'rejected';

            const statusClass = isApproved
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : isAttended
              ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
              : isPending
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : isRejected
              ? 'bg-rose-100 text-rose-800 border-rose-200'
              : 'bg-slate-100 text-slate-600 border-slate-200';

            return (
              <div
                key={app._id}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Event Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${statusClass}`}>
                      {app.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    <Link to={`/events/${ev._id}`} className="hover:text-indigo-600 transition">
                      {ev.title || 'Event Record'}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {ev.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {new Date(ev.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {ev.city ? `${ev.city} (${ev.locationType})` : ev.locationType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      {app.hoursLogged || ev.hoursCredit || 4} hrs credit
                    </span>
                  </div>

                  {app.message && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                      " {app.message} "
                    </div>
                  )}

                  {/* Feedback / Rating if attended */}
                  {isAttended && (app.feedback || app.rating) && (
                    <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                      <div className="flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>NGO Feedback & Recognition</span>
                      </div>
                      {app.feedback && <p className="italic">"{app.feedback}"</p>}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    to={`/events/${ev._id}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    Event Details
                  </Link>

                  {(isPending || isApproved) && (
                    <button
                      type="button"
                      disabled={cancellingId === app._id}
                      onClick={() => handleCancelApplication(app._id)}
                      className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                    >
                      {cancellingId === app._id ? 'Cancelling...' : 'Withdraw Application'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm space-y-3">
          <p>You have not submitted any volunteer applications yet.</p>
          <Link
            to="/events"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            Find Events to Join
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
