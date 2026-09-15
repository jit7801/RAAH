import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { CampusMap } from '../components/map/CampusMap';
import { Search, Mic, ArrowRight, Compass, Sparkles, MapPin, CheckCircle2, GraduationCap } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { processQueryText } = useNavigation();
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState('');

  const { isListening, startListening } = useVoiceInput((transcript) => {
    setQueryInput(transcript);
    handleSearch(transcript);
  });

  const handleSearch = (textToSubmit?: string) => {
    const text = textToSubmit || queryInput;
    if (!text.trim()) return;
    processQueryText(text);
    navigate(`/navigate?q=${encodeURIComponent(text)}`);
  };

  const quickSearches = [
    { label: "Dr. Kalam Library", query: "Kalam library kaha hai?" },
    { label: "CSE Department", query: "CSE department kidhar hai?" },
    { label: "Visvesvaraya Auditorium", query: "Visvesvaraya auditorium jana hai" },
    { label: "Classroom A-101", query: "Meri DBMS class A-101 mein hai" },
    { label: "JIET Canteen", query: "Canteen tak kaise pahuchu?" },
    { label: "Tagore Boys Hostel", query: "Tagore hostel kaha hai?" },
  ];

  return (
    <div className="space-y-10 pb-16 page-enter">
      {/* Hero Section */}
      <section className="pt-6 pb-2 text-center max-w-3xl mx-auto px-4">
        {/* Campus Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-4 shadow-xs">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>JIET Campus, Jodhpur (Rajasthan)</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 mb-3 leading-tight">
          {t('tagline')}
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
          RAAH AI helps students, faculty, and visitors find classrooms, labs, departments, and hostels across JIET campus with simple multilingual search and step directions.
        </p>

        {/* Dominant Search Input Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center bg-white border border-slate-300 rounded-xl p-1.5 shadow-card hover:border-slate-400 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent px-3 py-2 text-sm md:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            
            {/* Mic Button */}
            <button
              type="button"
              onClick={startListening}
              title="Speak query"
              className={`p-2.5 rounded-lg transition-colors mr-1 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Find Route Button */}
            <button
              type="button"
              onClick={() => handleSearch()}
              className="btn-primary py-2.5 px-5 rounded-lg shrink-0 font-semibold"
            >
              <span>{t('askBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Popular Quick Searches */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-medium">JIET Campus Quick Searches:</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {quickSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryInput(item.query);
                  handleSearch(item.query);
                }}
                className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium shadow-xs transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Map Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="surface-card p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <Compass className="w-5 h-5 text-navy-800" />
                JIET Campus Overview Map
              </h2>
              <p className="text-xs text-slate-500">Select any department or facility to generate indoor-outdoor walking directions</p>
            </div>
            <button
              onClick={() => navigate('/navigate')}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <span>Full Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[360px] w-full rounded-lg overflow-hidden border border-slate-200">
            <CampusMap
              onSelectLocation={(nodeId) => navigate(`/navigate?dest=${nodeId}`)}
            />
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="surface-card p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-display">Multilingual Assistant</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ask queries in Hinglish, Hindi, or English. RAAH AI resolves JIET departments, Kalam library, hostels, and labs.
            </p>
          </div>

          <div className="surface-card p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-display">Campus Pathfinding</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dijkstra graph pathfinding mapping Pali Road entrance, Main Academic Block, Block B, Block C, hostels, and canteen.
            </p>
          </div>

          <div className="surface-card p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-display">Dynamic Room Sync</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Solves real field research issues: JIET admins can dynamically update lecture rooms (e.g. DBMS in A-101), updating directions live.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
