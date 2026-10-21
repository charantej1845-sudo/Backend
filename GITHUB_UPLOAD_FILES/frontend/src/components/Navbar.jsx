import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  Calendar,
  Building,
  Award,
  User,
  Clock,
  Layers,
  LogOut,
  Menu,
  X,
  FileCheck2,
  Users2,
  ShieldAlert,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 px-3 py-2 rounded-lg flex items-center gap-1.5 ${
      isActive
        ? 'text-indigo-600 bg-indigo-50 font-semibold'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                VolunteerHub
              </span>
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                MERN Volunteer Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/events" className={navLinkClass}>
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </NavLink>

            <NavLink to="/ngos" className={navLinkClass}>
              <Building className="w-4 h-4" />
              <span>NGOs</span>
            </NavLink>

            <NavLink to="/skills" className={navLinkClass}>
              <Award className="w-4 h-4" />
              <span>Skills Catalog</span>
            </NavLink>

            {/* Volunteer Links */}
            {user?.role === 'volunteer' && (
              <>
                <NavLink to="/volunteer/dashboard" className={navLinkClass}>
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/volunteer/availability" className={navLinkClass}>
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Availability</span>
                </NavLink>
                <NavLink to="/volunteer/applications" className={navLinkClass}>
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>My Applications</span>
                </NavLink>
              </>
            )}

            {/* NGO Links */}
            {user?.role === 'ngo' && (
              <>
                <NavLink to="/ngo/dashboard" className={navLinkClass}>
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/ngo/events" className={navLinkClass}>
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Manage Events</span>
                </NavLink>
                <NavLink to="/ngo/applicants" className={navLinkClass}>
                  <FileCheck2 className="w-4 h-4 text-blue-600" />
                  <span>Applicants</span>
                </NavLink>
                <NavLink to="/ngo/volunteers" className={navLinkClass}>
                  <Users2 className="w-4 h-4 text-blue-600" />
                  <span>Find Volunteers</span>
                </NavLink>
              </>
            )}

            {/* Admin Links */}
            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin/dashboard" className={navLinkClass}>
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span>Admin Portal</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Section / Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={
                    user.role === 'ngo'
                      ? '/ngo/profile'
                      : user.role === 'volunteer'
                      ? '/volunteer/profile'
                      : '/admin/dashboard'
                  }
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition text-slate-700 text-xs font-medium border border-slate-200"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      user.role === 'ngo'
                        ? 'bg-blue-600'
                        : user.role === 'admin'
                        ? 'bg-purple-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-800 leading-tight max-w-[120px] truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Events
          </Link>
          <Link
            to="/ngos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            NGOs Directory
          </Link>
          <Link
            to="/skills"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Skills Catalog
          </Link>

          {user?.role === 'volunteer' && (
            <>
              <div className="pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Volunteer Portal
              </div>
              <Link
                to="/volunteer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/volunteer/availability"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Availability
              </Link>
              <Link
                to="/volunteer/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Applications
              </Link>
              <Link
                to="/volunteer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Edit Profile
              </Link>
            </>
          )}

          {user?.role === 'ngo' && (
            <>
              <div className="pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                NGO Portal
              </div>
              <Link
                to="/ngo/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                NGO Dashboard
              </Link>
              <Link
                to="/ngo/events"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Manage Events
              </Link>
              <Link
                to="/ngo/applicants"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Applicants Review
              </Link>
              <Link
                to="/ngo/volunteers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Find Volunteers
              </Link>
              <Link
                to="/ngo/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                NGO Profile
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <div className="pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Administration
              </div>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Admin Portal
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-200">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
