import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building2,
  Calendar,
  Award,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle,
  FileCheck2,
  Layers,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const skillCategories = [
  'Technical & IT',
  'Teaching & Mentoring',
  'Healthcare & First Aid',
  'Logistics & Events',
  'Media, Content & Design',
  'Environment & Conservation',
  'General & Community',
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolunteers: 0,
    totalNGOs: 0,
    totalEvents: 0,
    totalSkills: 0,
    totalApplications: 0,
    eventsByCategory: [],
    recentUsers: [],
  });

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Skill Modal State
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('General & Community');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillSubmitting, setSkillSubmitting] = useState(false);
  const [skillError, setSkillError] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [adminStatsRes, skillsRes] = await Promise.all([
        api.get('/stats/admin'),
        api.get('/skills'),
      ]);

      if (adminStatsRes.data.success) {
        setStats(adminStatsRes.data.data);
      }
      if (skillsRes.data.success) {
        setSkills(skillsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const openAddSkillModal = () => {
    setEditingSkillId(null);
    setSkillName('');
    setSkillCategory('General & Community');
    setSkillDesc('');
    setSkillError('');
    setSkillModalOpen(true);
  };

  const openEditSkillModal = (skill) => {
    setEditingSkillId(skill._id);
    setSkillName(skill.name);
    setSkillCategory(skill.category);
    setSkillDesc(skill.description || '');
    setSkillError('');
    setSkillModalOpen(true);
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setSkillSubmitting(true);
    setSkillError('');

    try {
      if (editingSkillId) {
        await api.put(`/skills/${editingSkillId}`, {
          name: skillName,
          category: skillCategory,
          description: skillDesc,
        });
      } else {
        await api.post('/skills', {
          name: skillName,
          category: skillCategory,
          description: skillDesc,
        });
      }

      setSkillModalOpen(false);
      fetchAdminData();
    } catch (err) {
      setSkillError(err.response?.data?.message || 'Failed to save skill');
    } finally {
      setSkillSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.delete(`/skills/${skillId}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete skill');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-purple-300 text-xs font-semibold uppercase tracking-wider">
              System Administrator Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Platform Governance</h1>
            <p className="text-purple-100/80 text-xs sm:text-sm max-w-xl">
              Real-time platform metrics, global skill taxonomy management, and user oversight.
            </p>
          </div>

          <button
            onClick={openAddSkillModal}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Platform Skill</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] text-slate-500 font-semibold uppercase">Total Users</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{stats.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] text-slate-500 font-semibold uppercase">Volunteers</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">{stats.totalVolunteers || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] text-slate-500 font-semibold uppercase">Partner NGOs</p>
          <p className="text-xl font-extrabold text-blue-600 mt-1">{stats.totalNGOs || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] text-slate-500 font-semibold uppercase">Total Events</p>
          <p className="text-xl font-extrabold text-indigo-600 mt-1">{stats.totalEvents || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] text-slate-500 font-semibold uppercase">Skills Catalog</p>
          <p className="text-xl font-extrabold text-purple-600 mt-1">{stats.totalSkills || skills.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-[11px] text-slate-500 font-semibold uppercase">Applications</p>
          <p className="text-xl font-extrabold text-amber-600 mt-1">{stats.totalApplications || 0}</p>
        </div>
      </div>

      {/* Events by Category Breakdown */}
      {stats.eventsByCategory && stats.eventsByCategory.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
            Event Causes Distribution
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {stats.eventsByCategory.map((cat) => (
              <div key={cat._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 line-clamp-1">{cat._id}</span>
                <span className="text-lg font-bold text-slate-800">{cat.count} Events</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Management Section (CRUD) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>Skills Catalog Management</span>
            </h3>
            <p className="text-xs text-slate-500">
              Manage platform-wide competency standards used for volunteer-event matching
            </p>
          </div>
          <button
            onClick={openAddSkillModal}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            + Add Skill
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Skill Name</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold">Description</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {skills.map((skill) => (
                <tr key={skill._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3 font-bold text-slate-900">{skill.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      {skill.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-md truncate">
                    {skill.description || '—'}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                    <button
                      onClick={() => openEditSkillModal(skill)}
                      className="p-1 text-slate-500 hover:text-purple-600 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill._id)}
                      className="p-1 text-slate-500 hover:text-rose-600 rounded"
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

      {/* Recent Users Table */}
      {stats.recentUsers && stats.recentUsers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Recently Registered Accounts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Name</th>
                  <th className="py-2.5 px-3 font-semibold">Email</th>
                  <th className="py-2.5 px-3 font-semibold">Role</th>
                  <th className="py-2.5 px-3 font-semibold">Phone</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'ngo'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{u.phone || '—'}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-600 font-bold text-[11px]">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSkillId ? 'Edit Skill Definition' : 'Add New Skill to Catalog'}
              </h3>
              <button
                onClick={() => setSkillModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {skillError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {skillError}
              </div>
            )}

            <form onSubmit={handleSkillSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. CPR & Emergency Medical Response"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skill Category *
                </label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {skillCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Qualification Criteria
                </label>
                <textarea
                  rows={3}
                  value={skillDesc}
                  onChange={(e) => setSkillDesc(e.target.value)}
                  placeholder="Describe proficiency expectations and tasks..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={skillSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm cursor-pointer"
                >
                  {skillSubmitting ? 'Saving...' : editingSkillId ? 'Update Skill' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
