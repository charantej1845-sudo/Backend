import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, Mail, Lock, AlertCircle, ArrowRight, Sparkles, User, Building2, Shield } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      const role = res.user.role;

      if (from) {
        navigate(from, { replace: true });
      } else if (role === 'ngo') {
        navigate('/ngo/dashboard', { replace: true });
      } else if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/volunteer/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (fillEmail, fillPassword) => {
    setEmail(fillEmail);
    setPassword(fillPassword);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-100">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign in to VolunteerHub</h2>
          <p className="text-xs text-slate-500">
            Access your volunteer profile, event roster, or NGO management portal
          </p>
        </div>

        {/* Demo Quick-Fill Pill Box */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 shadow-md">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Click to Auto-fill Demo Account:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('sarah.jenkins@example.com', 'password123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-medium transition text-center truncate border border-slate-700 cursor-pointer"
            >
              👤 Volunteer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('greenearth@ngo.org', 'password123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-medium transition text-center truncate border border-slate-700 cursor-pointer"
            >
              🌱 Green Earth NGO
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@volunteerhub.org', 'adminpassword123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-medium transition text-center truncate border border-slate-700 cursor-pointer"
            >
              ⚡ Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
