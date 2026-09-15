import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CAMPUS_LOCATIONS } from '../data/locations';
import { MapPin, Building, Clock, ArrowLeft, Navigation, Info } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const LocationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setDestinationNodeId } = useNavigation();

  const location = CAMPUS_LOCATIONS.find(l => l.id === id || l.node_id === id);

  if (!location) {
    return (
      <div className="glass-card p-8 text-center space-y-4">
        <p className="text-white">Location not found.</p>
        <button onClick={() => navigate('/search')} className="btn-secondary">
          Back to Directory
        </button>
      </div>
    );
  }

  const handleNavigate = () => {
    setDestinationNodeId(location.node_id);
    navigate(`/navigate?dest=${location.node_id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 page-enter">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="glass-card p-6 md:p-8 space-y-6 border border-white/10 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="badge-indigo mb-2">{location.category.toUpperCase()}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-display flex items-center gap-2">
              <MapPin className="w-6 h-6 text-rose-500 shrink-0" />
              {location.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">{location.official_name}</p>
          </div>

          <button onClick={handleNavigate} className="btn-primary">
            <Navigation className="w-4 h-4" />
            <span>Navigate Here</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="bg-surface-800/60 p-4 rounded-xl border border-white/5 space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Building</p>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              <Building className="w-4 h-4 text-brand-400" />
              {location.building}
            </p>
          </div>

          <div className="bg-surface-800/60 p-4 rounded-xl border border-white/5 space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Floor / Room</p>
            <p className="text-sm font-bold text-white">
              Floor {location.floor} {location.room_number ? `(${location.room_number})` : ''}
            </p>
          </div>

          <div className="bg-surface-800/60 p-4 rounded-xl border border-white/5 space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Opening Hours</p>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              {location.opening_hours || 'Standard Hours'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-400" />
            Description
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-surface-900/60 p-4 rounded-xl border border-white/5">
            {location.description}
          </p>
        </div>

        {location.aliases && location.aliases.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Known Natural Aliases</h4>
            <div className="flex flex-wrap gap-1.5">
              {location.aliases.map((alias, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-surface-800 border border-white/5 text-xs text-slate-300">
                  "{alias}"
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
