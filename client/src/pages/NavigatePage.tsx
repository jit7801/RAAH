import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { CampusMap } from '../components/map/CampusMap';
import { DirectionsPanel } from '../components/navigation/DirectionsPanel';
import { Search, Mic, Sparkles, HelpCircle } from 'lucide-react';
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
    <div className="space-y-5 pb-12 page-enter">
      {/* Search Header */}
      <div className="surface-card p-3.5 shadow-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={startListening}
              className={`p-1.5 rounded transition-colors ${
                isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          <button type="submit" className="btn-primary text-xs py-2.5 px-4 font-semibold shrink-0">
            {isLoading ? 'Calculating...' : 'Search'}
          </button>
        </form>

        {/* AI Response Text */}
        {aiResponseText && (
          <div className="mt-3 p-3 rounded-lg bg-blue-50/80 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-950">RAAH AI: </span>
              {aiResponseText}
            </div>
          </div>
        )}

        {/* Ambiguous Selection Options Chips */}
        {ambiguousOptions && ambiguousOptions.length > 0 && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-2">
            <p className="font-semibold text-amber-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              {t('ambiguousPrompt')}
            </p>
            <div className="flex flex-wrap gap-2">
              {ambiguousOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAmbiguous(opt)}
                  className="px-3 py-1.5 rounded-md bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  📍 {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left/Center Map */}
        <div className="lg:col-span-2 h-[480px] lg:h-[560px] w-full">
          <CampusMap
            polylineCoords={currentRoute?.polylineCoordinates}
            destinationNodeId={destinationNodeId}
            onSelectLocation={(nodeId) => setDestinationNodeId(nodeId)}
          />
        </div>

        {/* Right Directions Panel */}
        <div className="lg:col-span-1">
          <DirectionsPanel />
        </div>
      </div>
    </div>
  );
};
