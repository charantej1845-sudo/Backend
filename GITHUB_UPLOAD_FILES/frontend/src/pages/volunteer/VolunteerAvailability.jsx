import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Check, AlertCircle, Save, Info } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const daysList = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const timeSlotOptions = [
  'Morning (8AM - 12PM)',
  'Afternoon (12PM - 5PM)',
  'Evening (5PM - 9PM)',
  'Flexible / Any Time',
];

const locationOptions = ['Any', 'In-Person', 'Remote'];

const VolunteerAvailability = () => {
  const { availability, updateAvailabilityState } = useAuth();

  const [daysOfWeek, setDaysOfWeek] = useState(['Saturday', 'Sunday']);
  const [timeSlots, setTimeSlots] = useState(['Morning (8AM - 12PM)', 'Afternoon (12PM - 5PM)']);
  const [maxHoursPerWeek, setMaxHoursPerWeek] = useState(10);
  const [preferredLocationType, setPreferredLocationType] = useState('Any');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const res = await api.get('/availability/me');
        if (res.data.success && res.data.availability) {
          const a = res.data.availability;
          setDaysOfWeek(a.daysOfWeek || []);
          setTimeSlots(a.timeSlots || []);
          setMaxHoursPerWeek(a.maxHoursPerWeek || 10);
          setPreferredLocationType(a.preferredLocationType || 'Any');
          setNotes(a.notes || '');
          updateAvailabilityState(a);
        }
      } catch (err) {
        console.error('Error loading availability:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const toggleDay = (day) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTimeSlot = (slot) => {
    setTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const res = await api.put('/availability/me', {
        daysOfWeek,
        timeSlots,
        maxHoursPerWeek: Number(maxHoursPerWeek),
        preferredLocationType,
        notes,
      });

      if (res.data.success) {
        setFeedback({
          type: 'success',
          message: 'Your availability schedule was updated successfully!',
        });
        updateAvailabilityState(res.data.availability);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update availability schedule.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Clock className="w-7 h-7 text-emerald-600" />
          <span>My Availability Schedule</span>
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Keep your schedule current so NGOs know when you are open to volunteer for events and disaster relief efforts.
        </p>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback({ type: '', message: '' })}
            className="font-bold text-base ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        {/* Days of Week */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Available Days of the Week
            </label>
            <p className="text-[11px] text-slate-500">
              Select all days you are generally accessible for volunteering
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {daysList.map((day) => {
              const isSelected = daysOfWeek.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`py-3 px-2 rounded-xl text-xs font-semibold border transition text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{day.slice(0, 3)}</span>
                  <span className="text-[10px] font-normal text-slate-400">{day}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Preferred Time Slots
            </label>
            <p className="text-[11px] text-slate-500">
              Which parts of the day do you prefer shifts?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {timeSlotOptions.map((slot) => {
              const isSelected = timeSlots.includes(slot);
              return (
                <button
                  type="button"
                  key={slot}
                  onClick={() => toggleTimeSlot(slot)}
                  className={`py-3 px-4 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{slot}</span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Max Hours & Location Preference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Max Hours Per Week: <span className="text-emerald-700 font-extrabold">{maxHoursPerWeek} hrs</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Maximum hours you are comfortable dedicating weekly
            </p>
            <input
              type="range"
              min={1}
              max={40}
              value={maxHoursPerWeek}
              onChange={(e) => setMaxHoursPerWeek(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 hr/wk</span>
              <span>20 hrs/wk</span>
              <span>40 hrs/wk</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Location Preference
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              In-Person on site or remote virtual volunteering
            </p>
            <select
              value={preferredLocationType}
              onChange={(e) => setPreferredLocationType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc} Preference
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Special Notes */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
            Availability Notes & Constraints (Optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Can provide my own vehicle, available for emergency calls, unavailable first week of December..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Availability'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VolunteerAvailability;
