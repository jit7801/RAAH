import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { AppLanguage } from '../../data/directionTemplates';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const langs: Array<{ code: AppLanguage; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'hl', label: 'Hinglish' },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-lg border border-slate-200 text-xs">
      <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          className={`px-2 py-1 font-medium rounded-md transition-all cursor-pointer ${
            language === l.code
              ? 'bg-white text-navy-800 shadow-sm border border-slate-200/80 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};
