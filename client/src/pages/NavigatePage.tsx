import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { CampusMap } from '../components/map/CampusMap';
import { DirectionsPanel } from '../components/navigation/DirectionsPanel';
import { Search, Mic, Sparkles, AlertCircle } from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/locations';

export const NavigatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    processQueryText,
    setDestinationNodeId,
    destinationNodeId,
    currentRoute,
    ambiguousOptions,
    aiResponseText,
    isLoading
  } = useNavigation();
  const { t } = useLanguage();
  const [inputVal, setInputVal] = useState('');

  const { isListening, startListening } = useVoiceInput((transcript) => {
    setInputVal(transcript);
    processQueryText(transcript);
  });

  useEffect(() => {
    const qParam = searchParams.get('q');
    const destParam = searchParams.get('dest');

    if (qParam) {
      setInputVal(qParam);
      processQueryText(qParam);
    } else if (destParam) {
      setDestinationNodeId(destParam);
    }
  }, [searchParams]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    processQueryText(inputVal);
  };

  const handleSelectAmbiguous = (optionName: string) => {
    const matched = CAMPUS_LOCATIONS.find(l => l.name.toLowerCase() === optionName.toLowerCase());
    if (matched) {
      setDestinationNodeId(matched.node_id);
    }
  };

  return (
    <div className="space-y-6 pb-12 page-enter">
      {/* Top Search Header */}
      <div className="glass-card p-4 shadow-xl border border-white/10">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="relative flex-1 flex items-center bg-surface-900 border border-white/10 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={startListening}
              className={`p-1.5 rounded-lg transition-colors ${
                isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          <button type="submit" className="btn-primary text-xs py-2 px-4">
            {isLoading ? 'Processing...' : 'Search'}
          </button>
        </form>

        {/* AI Response Text Box */}
        {aiResponseText && (
          <div className="mt-3 p-3 rounded-xl bg-brand-950/60 border border-brand-500/30 text-xs text-brand-200 flex items-start gap-2.5 animate-slide-up">
            <Sparkles className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">DISHA AI: </span>
              {aiResponseText}
            </div>
          </div>
        )}

        {/* Ambiguous Selection Options Chips */}
        {ambiguousOptions && ambiguousOptions.length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-amber-950/50 border border-amber-500/30 text-xs space-y-2 animate-slide-up">
            <p className="font-semibold text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {t('ambiguousPrompt')}
            </p>
            <div className="flex flex-wrap gap-2">
              {ambiguousOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAmbiguous(opt)}
                  className="px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 border border-amber-600/40 text-amber-200 text-xs font-medium transition-colors"
                >
                  📍 {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Campus Map + Directions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Center/Left 2 Cols: Interactive Map */}
        <div className="lg:col-span-2 h-[480px] lg:h-[560px] w-full">
          <CampusMap
            polylineCoords={currentRoute?.polylineCoordinates}
            destinationNodeId={destinationNodeId}
            onSelectLocation={(nodeId) => setDestinationNodeId(nodeId)}
          />
        </div>

        {/* Right Col: Directions & Destination Detail */}
        <div className="lg:col-span-1">
          <DirectionsPanel />
        </div>
      </div>
    </div>
  );
};
