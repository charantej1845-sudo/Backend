import React from 'react';
import { HeartHandshake, Heart, Shield, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">VolunteerHub</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A comprehensive MERN-stack Volunteer Management System connecting non-profit organizations with passionate volunteers based on verified skills and availability.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Role-Based Access Control • JWT Auth</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events" className="hover:text-indigo-400 transition">
                  Browse Volunteer Events
                </Link>
              </li>
              <li>
                <Link to="/ngos" className="hover:text-indigo-400 transition">
                  Non-Profit Organizations
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-indigo-400 transition">
                  Skills Directory
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition">
                  Register as Volunteer / NGO
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Stack */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">MERN Architecture</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><strong className="text-slate-200">MongoDB:</strong> Schema validation, relations</li>
              <li><strong className="text-slate-200">Express.js:</strong> RESTful API routes & middleware</li>
              <li><strong className="text-slate-200">React 18:</strong> Modern hooks, Context, SPA routing</li>
              <li><strong className="text-slate-200">Node.js:</strong> Runtime, JWT & Bcrypt security</li>
            </ul>
          </div>

          {/* Impact Stats Info */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Core Capabilities</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>✓ Volunteer Availability Schedule Matrix</li>
              <li>✓ NGO Event Lifecycle Management</li>
              <li>✓ Skill Matching & Application Review</li>
              <li>✓ Service Hours Tracking & Badges</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Volunteer Management System. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>for Social Impact NGOs and Volunteers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
