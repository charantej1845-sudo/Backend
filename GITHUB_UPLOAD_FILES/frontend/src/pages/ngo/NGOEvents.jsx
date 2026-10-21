import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  Clock,
  MapPin,
  Award,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';

const categories = [
  'Environment & Climate',
  'Education & Literacy',
  'Healthcare & Mental Health',
  'Community Development',
  'Disaster Relief & Aid',
  'Animal Welfare',
  'Arts & Culture',
];

const NGOEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(searchParams.get('action') === 'create');
  const [editingEventId, setEditingEventId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCauseCategory] = useState('Community Development');
  const [locationType, setLocationType] = useState('In-Person');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [volunteersNeeded, setVolunteersNeeded] = useState(5);
  const [bannerImage, setBannerImage] = useState('');
  const [certificateProvided, setCertificateProvided] = useState(true);
  const [hoursCredit, setHoursCredit] = useState(4);
  const [status, setStatus] = useState('Upcoming');

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events/ngo/my-events');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching NGO events:', err);
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
      console.error('Error loading skills:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setEditingEventId(null);
    setTitle('');
    setDescription('');
    setCauseCategory('Community Development');
    setLocationType('In-Person');
    setAddress('');
    setCity('');
    setStartDate('');
    setEndDate('');
    setStartTime('09:00');
    setEndTime('17:00');
    setRequiredSkills([]);
    setVolunteersNeeded(5);
    setBannerImage('');
    setCertificateProvided(true);
    setHoursCredit(4);
    setStatus('Upcoming');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (ev) => {
    setEditingEventId(ev._id);
    setTitle(ev.title || '');
    setDescription(ev.description || '');
    setCauseCategory(ev.category || 'Community Development');
    setLocationType(ev.locationType || 'In-Person');
    setAddress(ev.address || '');
    setCity(ev.city || '');
    setStartDate(ev.startDate ? ev.startDate.substring(0, 10) : '');
    setEndDate(ev.endDate ? ev.endDate.substring(0, 10) : '');
    setStartTime(ev.startTime || '09:00');
    setEndTime(ev.endTime || '17:00');
    setRequiredSkills(ev.requiredSkills?.map((s) => (typeof s === 'string' ? s : s._id)) || []);
    setVolunteersNeeded(ev.volunteersNeeded || 5);
    setBannerImage(ev.bannerImage || '');
    setCertificateProvided(ev.certificateProvided ?? true);
    setHoursCredit(ev.hoursCredit || 4);
    setStatus(ev.status || 'Upcoming');
    setFormError('');
    setModalOpen(true);
  };

  const toggleSkillSelection = (skillId) => {
    setRequiredSkills((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      const payload = {
        title,
        description,
        category,
        locationType,
        address,
        city,
        startDate,
        endDate,
        startTime,
        endTime,
        requiredSkills,
        volunteersNeeded: Number(volunteersNeeded),
        bannerImage,
        certificateProvided,
        hoursCredit: Number(hoursCredit),
        status,
      };

      if (editingEventId) {
        await api.put(`/events/${editingEventId}`, payload);
      } else {
        await api.post('/events', payload);
      }

      setModalOpen(false);
      setSearchParams({});
      fetchEvents();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also remove associated applications.')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-blue-600" />
            <span>Manage Organization Events</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Create, update, and monitor volunteer drives hosted by your organization.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-blue-600/30 flex items-center gap-2 self-start cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Table / List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Event Title</th>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Volunteers</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 font-bold text-slate-900 max-w-xs truncate">
                      <Link to={`/events/${ev._id}`} className="hover:text-blue-600">
                        {ev.title}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      <div>
                        {new Date(ev.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {ev.startTime} - {ev.endTime}
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {ev.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      {ev.city ? `${ev.city}` : ev.locationType}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {ev.approvedApplicants || 0} / {ev.volunteersNeeded}
                        </span>
                      </div>
                      <Link
                        to={`/ngo/applicants?event=${ev._id}`}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        {ev.pendingApplicants || 0} pending review
                      </Link>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ev.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ev.status === 'Completed'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(ev)}
                        title="Edit Event"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev._id)}
                        title="Delete Event"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm space-y-3">
          <p>You haven't posted any events yet.</p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
          >
            Create Your First Event
          </button>
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingEventId ? 'Edit Event Details' : 'Create New Volunteer Event'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Coastal Cleanup & Marine Conservation"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cause Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCauseCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location Type *
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Virtual">Virtual / Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Venue / Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 124 Park Ave"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Seattle"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed instructions, shift requirements, and preparation tips..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Required Skills Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Competencies ({requiredSkills.length} selected)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {skills.map((skill) => {
                    const isSelected = requiredSkills.includes(skill._id);
                    return (
                      <button
                        type="button"
                        key={skill._id}
                        onClick={() => toggleSkillSelection(skill._id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Volunteers Needed *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={volunteersNeeded}
                    onChange={(e) => setVolunteersNeeded(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Volunteer Hours Credit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={hoursCredit}
                    onChange={(e) => setHoursCredit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Lifecycle Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active (In-Progress)</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banner Image URL (Unsplash or direct image link)
                </label>
                <input
                  type="url"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm cursor-pointer"
                >
                  {formSubmitting
                    ? 'Saving...'
                    : editingEventId
                    ? 'Update Event'
                    : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGOEvents;
