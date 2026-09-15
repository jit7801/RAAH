import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Footprints, Clock, CornerDownRight, RefreshCw, Navigation } from 'lucide-react';

export const DirectionsPanel: React.FC = () => {
  const { currentRoute, activeDestination, startNodeId, setStartNodeId, resetNavigation } = useNavigation();
  const { t } = useLanguage();

  if (!currentRoute || !activeDestination) {
    return (
      <div className="surface-card p-6 text-center flex flex-col items-center justify-center min-h-[240px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <Navigation className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">No Destination Selected</h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Search for a department, lab, classroom, or facility above to view step-by-step directions.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-card p-5 space-y-4">
      {/* Destination Card Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-navy">{activeDestination.category.toUpperCase()}</span>
            <span className="text-xs text-slate-500 font-medium">{activeDestination.building} · Floor {activeDestination.floor}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
            {activeDestination.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{activeDestination.description}</p>
        </div>

        <button
          onClick={resetNavigation}
          title="Change destination"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Starting Location Dropdown */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          {t('startPoint')}:
        </span>
        <select
          value={startNodeId}
          onChange={(e) => setStartNodeId(e.target.value)}
          className="bg-white text-navy-800 font-semibold px-2.5 py-1 rounded border border-slate-200 focus:outline-none cursor-pointer"
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
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{t('distance')}</p>
            <p className="text-sm font-bold text-slate-900 font-display">{currentRoute.totalDistance} meters</p>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{t('eta')}</p>
            <p className="text-sm font-bold text-slate-900 font-display">{currentRoute.etaMinutes} min</p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Directions */}
      <div className="space-y-2 pt-1">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <CornerDownRight className="w-4 h-4 text-blue-600" />
          {t('steps')}
        </h4>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-hide">
          {currentRoute.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-navy-800 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium leading-tight">{step.instruction}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{step.building} · Floor {step.floor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
