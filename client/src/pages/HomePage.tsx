import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { CampusMap } from '../components/map/CampusMap';
import { Search, Mic, Compass, Sparkles, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

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

  const exampleQuestions = [
    "Library kaha hai?",
    "CSE lab kidhar hai?",
    "Where is Mechanical Lab?",
    "Meri class B-204 mein hai, kaise jaun?",
    "Auditorium kidhar hai?",
    "Canteen tak kaise pahuchu?"
  ];

  return (
    <div className="space-y-12 pb-16 page-enter">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-4 text-center max-w-4xl mx-auto px-4">
        {/* Glowing background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/20 blur-[100px] rounded-full pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-900/50 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-6 shadow-lg shadow-brand-950/50">
          <Sparkles className="w-3.5 h-3.5 text-accent-400" />
          <span>Multilingual Campus Navigation MVP</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight text-white mb-4 leading-tight">
          {t('tagline')}
        </h1>
        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-8 font-normal">
          {t('heroSubtitle')}
        </p>

        {/* Search / NLU Input Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center bg-surface-800/90 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-2xl focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent px-3 py-2 text-sm md:text-base text-white placeholder-slate-500 focus:outline-none"
            />
            
            {/* Mic Button */}
            <button
              type="button"
              onClick={startListening}
              title="Speak query"
              className={`p-2.5 rounded-xl transition-all mr-1 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Find Route CTA */}
            <button
              type="button"
              onClick={() => handleSearch()}
              className="btn-primary py-2.5 px-5 rounded-xl shrink-0 font-semibold"
            >
              <span>{t('askBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Example Questions Chips */}
        <div className="space-y-2 max-w-3xl mx-auto">
          <p className="text-xs text-slate-400 font-medium">{t('tryAsking')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryInput(q);
                  handleSearch(q);
                }}
                className="px-3 py-1.5 rounded-xl bg-surface-800/70 hover:bg-brand-600/30 border border-white/10 hover:border-brand-500/40 text-xs text-slate-300 hover:text-white transition-all"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Map Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-card p-4 md:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Compass className="w-5 h-5 text-brand-400" />
                Interactive Campus Overview
              </h2>
              <p className="text-xs text-slate-400">Click any building or location to navigate</p>
            </div>
            <button
              onClick={() => navigate('/navigate')}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <span>Open Full Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[360px] w-full rounded-xl overflow-hidden">
            <CampusMap
              onSelectLocation={(nodeId) => navigate(`/navigate?dest=${nodeId}`)}
            />
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-hover p-6">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-display">Natural Language AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understands Hinglish, Hindi, and English queries naturally. Extracting intent, rooms, and departments automatically.
            </p>
          </div>

          <div className="glass-card-hover p-6">
            <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-accent-400 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-display">Campus Pathfinding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Custom SVG indoor-outdoor campus graph routing powered by Dijkstra algorithm for accurate shortest paths.
            </p>
          </div>

          <div className="glass-card-hover p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-display">Classroom Change Sync</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Directly addresses real field research: admins can dynamically reassign subject classrooms, updating directions instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
