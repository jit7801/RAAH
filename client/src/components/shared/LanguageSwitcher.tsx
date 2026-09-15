import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { AppLanguage } from '../../data/directionTemplates';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const langs: Array<{ code: AppLanguage; label: string }> = [
    { code: 'hl', label: 'Hinglish' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'en', label: 'English' },
  ];

  return (
    <div className="flex items-center gap-1 bg-surface-800 p-1 rounded-xl border border-white/10">
      <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
            language === l.code
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};
