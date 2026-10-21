import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Award,
  Users,
  CheckCircle,
  AlertCircle,
  FileCheck2,
  ArrowLeft,
  Send,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/SkillBadge';

const EventDetail = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Application state for volunteer
  const [userApplication, setUserApplication] = useState(null);
  const [checkingApp, setCheckingApp] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  // Check if current volunteer has applied
  const checkApplicationStatus = async () => {
    if (!user || user.role !== 'volunteer') return;
    try {
      setCheckingApp(true);
      const res = await api.get('/applications/my-applications');
      if (res.data.success) {
        const matchingApp = res.data.data.find(
          (app) => app.event?._id === id || app.event === id
        );
        setUserApplication(matchingApp || null);
      }
    } catch (err) {
      console.error('Error checking user application:', err);
    } finally {
      setCheckingApp(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  useEffect(() => {
    checkApplicationStatus();
  }, [id, user]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingApp(true);
      const res = await api.post(`/applications/apply/${id}`, {
        message: applyMessage,
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Application submitted successfully!');
        setApplyModalOpen(false);
        setApplyMessage('');
        checkApplicationStatus();
        fetchEventData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-slate-600 text-sm">{error || 'This event may have been removed or does not exist.'}</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  const volunteerSkillIds = profile?.skills?.map((s) => (typeof s === 'string' ? s : s._id)) || [];

  const startDateFormatted = new Date(event.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isOrganizer = user?.role === 'ngo' && (event.ngo?._id === user.id || event.ngo === user.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 font-bold">×</button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Banner */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative bg-slate-900 h-64 sm:h-80">
            {event.bannerImage ? (
              <img
                src={event.bannerImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 flex items-center justify-center p-8">
                <h1 className="text-2xl font-bold text-white text-center">{event.title}</h1>
              </div>
            )}

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow">
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 backdrop-blur-sm text-white">
                {event.locationType}
              </span>
            </div>

            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${
                event.status === 'Active'
                  ? 'bg-emerald-500 text-white'
                  : event.status === 'Completed'
                  ? 'bg-slate-700 text-white'
                  : 'bg-indigo-600 text-white'
              }`}>
                {event.status}
              </span>
            </div>
          </div>

          {/* Title & Organizer Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {event.title}
            </h1>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">Organized by</p>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {event.ngoProfile?.organizationName || event.ngo?.name || 'NGO Partner'}
                </p>
              </div>
              {event.ngoProfile?._id && (
                <Link
                  to={`/ngos/${event.ngoProfile._id}`}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 shrink-0"
                >
                  <span>View NGO</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-900 mb-2">About This Event</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Required Skills Section */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Required Skills & Competencies</span>
              </h3>
              {event.requiredSkills && event.requiredSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {event.requiredSkills.map((skill) => {
                    const sId = typeof skill === 'string' ? skill : skill._id;
                    const isMatched = user?.role === 'volunteer' && volunteerSkillIds.includes(sId);
                    return (
                      <SkillBadge
                        key={sId || skill.name}
                        skill={skill}
                        matched={isMatched}
                        showCategory={true}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No specific technical skills required. All volunteers welcome!</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Schedule & Application Actions */}
        <div className="space-y-6">
          {/* Logistics Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              Event Logistics
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">{startDateFormatted}</p>
                  <p className="text-slate-500 text-[11px]">
                    {event.startTime || '09:00'} - {event.endTime || '17:00'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">{event.locationType}</p>
                  <p className="text-slate-500 text-[11px]">
                    {event.address ? `${event.address}, ` : ''}{event.city || 'Virtual Link will be shared'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">{event.hoursCredit || 4} Certified Volunteer Hours</p>
                  <p className="text-slate-500 text-[11px]">
                    {event.certificateProvided ? 'Official certificate of participation awarded' : 'Hours logged to profile'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">
                    {event.volunteersRegisteredCount || 0} / {event.volunteersNeeded} Volunteers Joined
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    {Math.max(0, event.volunteersNeeded - (event.volunteersRegisteredCount || 0))} open spots remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="pt-4 border-t border-slate-100">
              {isOrganizer ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                    You are the organizer of this event.
                  </div>
                  <Link
                    to="/ngo/applicants"
                    className="w-full block text-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Manage Event Applicants
                  </Link>
                </div>
              ) : user?.role === 'volunteer' ? (
                userApplication ? (
                  <div className="space-y-3">
                    <div
                      className={`p-4 rounded-xl border text-xs space-y-1 ${
                        userApplication.status === 'approved'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : userApplication.status === 'attended'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                          : userApplication.status === 'rejected'
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle className="w-4 h-4" />
                        <span className="capitalize">Status: {userApplication.status}</span>
                      </div>
                      <p className="text-[11px] opacity-80">
                        {userApplication.status === 'approved' &&
                          'Congratulations! Your application is approved. Please arrive on time.'}
                        {userApplication.status === 'pending' &&
                          'The NGO coordinator has received your application and is reviewing it.'}
                        {userApplication.status === 'attended' &&
                          `You attended this event! ${userApplication.hoursLogged || event.hoursCredit} hours credited.`}
                      </p>
                    </div>

                    <Link
                      to="/volunteer/applications"
                      className="w-full block text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                    >
                      View in My Applications
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Apply for this Volunteer Position</span>
                  </button>
                )
              ) : !user ? (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="w-full block text-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Sign In to Apply
                  </Link>
                  <p className="text-[11px] text-center text-slate-500">
                    New volunteer?{' '}
                    <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                      Create an account
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs text-center">
                  Signed in as <strong>{user.role}</strong>. Applications are reserved for Volunteer accounts.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Apply to Volunteer</h3>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Applying for: <strong className="text-slate-800">{event.title}</strong>
            </p>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note to Organizer (Optional)
                </label>
                <textarea
                  rows={4}
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="Share any relevant experience, equipment you can bring, or why you'd love to help..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  {submittingApp ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
