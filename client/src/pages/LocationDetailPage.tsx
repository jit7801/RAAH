import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CAMPUS_LOCATIONS, JIET_GOOGLE_MAPS_URL } from '../data/locations';
import { MapPin, Building, Clock, ArrowLeft, Navigation, Info, ExternalLink } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const LocationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setDestinationNodeId } = useNavigation();

  const location = CAMPUS_LOCATIONS.find(l => l.id === id || l.node_id === id);

  if (!location) {
    return (
      <div className="surface-card p-8 text-center space-y-4">
        <p className="text-slate-700 font-medium">Location not found.</p>
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
    <div className="max-w-3xl mx-auto space-y-5 pb-16 page-enter">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="surface-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="badge-navy mb-2">{location.category.toUpperCase()}</span>
            <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
              <MapPin className="w-6 h-6 text-rose-600 shrink-0" />
              {location.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">{location.official_name}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={JIET_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 text-blue-700 hover:text-blue-800 font-medium"
            >
              <span>Google Maps Pin</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <button onClick={handleNavigate} className="btn-primary py-2 px-4 text-xs font-semibold">
              <Navigation className="w-4 h-4" />
              <span>Navigate Here</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Building</p>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600" />
              {location.building}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Floor / Room</p>
            <p className="text-sm font-bold text-slate-900">
              Floor {location.floor} {location.room_number ? `(${location.room_number})` : ''}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Opening Hours</p>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              {location.opening_hours || 'Standard Hours'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            Description
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200/80">
            {location.description}
          </p>
        </div>

        {location.aliases && location.aliases.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Known Quick Aliases</h4>
            <div className="flex flex-wrap gap-1.5">
              {location.aliases.map((alias, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
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
