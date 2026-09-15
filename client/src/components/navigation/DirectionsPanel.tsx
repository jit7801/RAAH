import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Footprints, Clock, CornerDownRight, RefreshCw } from 'lucide-react';

export const DirectionsPanel: React.FC = () => {
  const { currentRoute, activeDestination, startNodeId, setStartNodeId, resetNavigation } = useNavigation();
  const { t } = useLanguage();

  if (!currentRoute || !activeDestination) {
    return (
      <div className="glass-card p-6 text-center flex flex-col items-center justify-center min-h-[220px]">
        <Footprints className="w-10 h-10 text-brand-400 opacity-60 mb-3 animate-pulse" />
        <h3 className="text-base font-semibold text-white mb-1">No Destination Selected</h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Search for a department, lab, classroom, or canteen above to generate walking directions.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 space-y-4 shadow-xl border border-white/10 animate-fade-in">
      {/* Destination Card Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">{activeDestination.category.toUpperCase()}</span>
            <span className="text-xs text-slate-400 font-medium">{activeDestination.building} · Floor {activeDestination.floor}</span>
          </div>
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
            {activeDestination.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{activeDestination.description}</p>
        </div>

        <button
          onClick={resetNavigation}
          title="Change destination"
          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Starting Location Dropdown */}
      <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Starting Point:
        </span>
        <select
          value={startNodeId}
          onChange={(e) => setStartNodeId(e.target.value)}
          className="bg-surface-800 text-brand-300 font-semibold px-2.5 py-1 rounded-lg border border-white/10 focus:outline-none cursor-pointer"
        >
          <option value="main_gate">Main Gate</option>
          <option value="hostel">Hostel Block</option>
          <option value="canteen">Campus Canteen</option>
          <option value="library">Central Library</option>
          <option value="block_b_entrance">Block B Entrance</option>
        </select>
      </div>

      {/* Route Stats: Distance & Walking ETA */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-800/80 p-3 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Distance</p>
            <p className="text-sm font-bold text-white font-display">{currentRoute.totalDistance} meters</p>
          </div>
        </div>

        <div className="bg-surface-800/80 p-3 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Est. Walk Time</p>
            <p className="text-sm font-bold text-white font-display">{currentRoute.etaMinutes} min</p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Directions */}
      <div className="space-y-2 pt-1">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <CornerDownRight className="w-4 h-4 text-brand-400" />
          {t('steps')}
        </h4>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-hide">
          {currentRoute.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-800/40 hover:bg-surface-700/50 border border-white/5 transition-colors text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-brand-600/30 border border-brand-500/40 text-brand-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-slate-200 font-medium">{step.instruction}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{step.building} · Floor {step.floor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
