import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, User, Building2, LogOut, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoBanner = () => {
  const { user, quickDemoLogin, logout } = useAuth();
  const [loadingRole, setLoadingRole] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleQuickLogin = async (role) => {
    try {
      setLoadingRole(role);
      await quickDemoLogin(role);
      if (role === 'volunteer') navigate('/volunteer/dashboard');
      if (role === 'ngo') navigate('/ngo/dashboard');
      if (role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      console.error('Demo login error', err);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            1-Click Demo Sandbox
          </span>
          <span className="hidden md:inline text-slate-400">
            Switch between personas instantly to test full MERN role-based workflows:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleQuickLogin('volunteer')}
            disabled={loadingRole !== null}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
              user?.role === 'volunteer'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Volunteer</span>
            {user?.role === 'volunteer' && <CheckCircle className="w-3 h-3 text-emerald-200" />}
          </button>

          <button
            onClick={() => handleQuickLogin('ngo')}
            disabled={loadingRole !== null}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
              user?.role === 'ngo'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>NGO (Green Earth)</span>
            {user?.role === 'ngo' && <CheckCircle className="w-3 h-3 text-blue-200" />}
          </button>

          <button
            onClick={() => handleQuickLogin('admin')}
            disabled={loadingRole !== null}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
              user?.role === 'admin'
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
            {user?.role === 'admin' && <CheckCircle className="w-3 h-3 text-purple-200" />}
          </button>

          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Sign Out"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 border border-rose-800/40 transition cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
