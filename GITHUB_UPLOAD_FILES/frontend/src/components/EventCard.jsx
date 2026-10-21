import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Building, Users, Award, CheckCircle2 } from 'lucide-react';
import SkillBadge from './SkillBadge';
import { useAuth } from '../context/AuthContext';

const EventCard = ({ event }) => {
  const { user, profile } = useAuth();

  if (!event) return null;

  // Check matching skills
  const volunteerSkillIds = profile?.skills?.map((s) => (typeof s === 'string' ? s : s._id)) || [];

  const startDateFormatted = new Date(event.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const percentageFilled = Math.min(
    100,
    Math.round(((event.volunteersRegisteredCount || 0) / (event.volunteersNeeded || 1)) * 100)
  );

  const categoryBgMap = {
    'Environment & Climate': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Education & Literacy': 'bg-amber-100 text-amber-800 border-amber-200',
    'Healthcare & Mental Health': 'bg-rose-100 text-rose-800 border-rose-200',
    'Animal Welfare': 'bg-orange-100 text-orange-800 border-orange-200',
    'Disaster Relief & Aid': 'bg-red-100 text-red-800 border-red-200',
    'Community Development': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  const categoryClass = categoryBgMap[event.category] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Banner Image or Gradient Header */}
      <div className="h-44 relative bg-slate-100 overflow-hidden">
        {event.bannerImage ? (
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-700 to-indigo-900 flex items-center justify-center p-4">
            <h3 className="text-white font-bold text-lg text-center">{event.title}</h3>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryClass}`}>
            {event.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900/80 backdrop-blur-sm text-white">
            {event.locationType}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/95 text-indigo-700 shadow-sm flex items-center gap-1">
            <Award className="w-3 h-3" />
            {event.hoursCredit || 4} hrs credit
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* NGO Info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700 truncate">
            {event.ngoProfile?.organizationName || event.ngo?.name || 'NGO Partner'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
          <Link to={`/events/${event._id}`}>{event.title}</Link>
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>

        {/* Date, Time & Location */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{startDateFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{event.startTime || '09:00'} - {event.endTime || '17:00'}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{event.city ? `${event.city}` : 'Virtual / Online'}</span>
          </div>
        </div>

        {/* Required Skills */}
        {event.requiredSkills && event.requiredSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Skills Needed:
            </p>
            <div className="flex flex-wrap gap-1">
              {event.requiredSkills.slice(0, 3).map((skill) => {
                const sId = typeof skill === 'string' ? skill : skill._id;
                const isMatched = user?.role === 'volunteer' && volunteerSkillIds.includes(sId);
                return <SkillBadge key={sId || skill.name} skill={skill} matched={isMatched} />;
              })}
              {event.requiredSkills.length > 3 && (
                <span className="text-[10px] text-slate-400 self-center">
                  +{event.requiredSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Capacity / Volunteers Progress */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Volunteers
            </span>
            <span className="font-semibold text-slate-700">
              {event.volunteersRegisteredCount || 0} / {event.volunteersNeeded}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percentageFilled >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${percentageFilled}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Link
            to={`/events/${event._id}`}
            className="w-full block text-center py-2 px-3 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition duration-150 shadow-sm"
          >
            View Event & Apply →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
