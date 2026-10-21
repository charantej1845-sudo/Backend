import React, { useState, useEffect } from 'react';
import { User, Award, MapPin, Phone, Heart, Save, Check, Plus, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SkillBadge from '../../components/SkillBadge';

const VolunteerProfile = () => {
  const { user, profile, updateProfileState, refreshUser } = useAuth();

  const [allSkills, setAllSkills] = useState([]);
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('USA');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [skillsRes, profRes] = await Promise.all([
          api.get('/skills'),
          api.get('/volunteers/profile/me'),
        ]);

        if (skillsRes.data.success) {
          setAllSkills(skillsRes.data.data);
        }

        if (profRes.data.success && profRes.data.profile) {
          const p = profRes.data.profile;
          setBio(p.bio || '');
          setSelectedSkills(p.skills?.map((s) => (typeof s === 'string' ? s : s._id)) || []);
          setCity(p.location?.city || '');
          setState(p.location?.state || '');
          setCountry(p.location?.country || 'USA');
          setEmergencyName(p.emergencyContact?.name || '');
          setEmergencyPhone(p.emergencyContact?.phone || '');
          setEmergencyRelation(p.emergencyContact?.relation || '');
          updateProfileState(p);
        }
      } catch (err) {
        console.error('Error fetching volunteer profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSkill = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        bio,
        skills: selectedSkills,
        location: { city, state, country },
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relation: emergencyRelation,
        },
      };

      const res = await api.put('/volunteers/profile/me', payload);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Volunteer profile updated successfully!' });
        updateProfileState(res.data.profile);
        refreshUser();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
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
          <User className="w-7 h-7 text-indigo-600" />
          <span>Edit Volunteer Profile</span>
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Select your verified skills, share your background, and provide contact details for NGO organizers.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="font-bold text-base ml-2">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        {/* Personal Bio */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            Volunteer Bio & Motivation
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell NGOs about your background, relevant volunteering experience, and the causes you care deeply about..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* Skills Multi-Select Picker */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              My Skills & Competencies ({selectedSkills.length} selected)
            </label>
            <p className="text-[11px] text-slate-500">
              Click a skill badge to toggle it on or off. Events requiring matching skills will be highlighted for you!
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {allSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill._id);
              return (
                <button
                  type="button"
                  key={skill._id}
                  onClick={() => toggleSkill(skill._id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{skill.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            Location Information
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Seattle"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">State / Province</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. WA"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="USA"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            Emergency Contact Information
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Contact Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="e.g. Mark Jenkins"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Phone Number</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+1 555-0209"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Relationship</label>
              <input
                type="text"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
                placeholder="e.g. Spouse / Parent"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VolunteerProfile;
