import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Compass, Map, MessageSquare, Search, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-950/80 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 p-0.5 shadow-lg shadow-brand-600/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-surface-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-brand-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg text-white tracking-tight">DISHA AI</span>
              <span className="text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 px-1.5 py-0.2 rounded">MVP</span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Campus Navigation Assistant</p>
          </div>
        </Link>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-900/60 p-1 rounded-xl border border-white/5">
          <Link to="/navigate" className={isActive('/navigate') ? 'nav-item-active' : 'nav-item'}>
            <Map className="w-4 h-4" />
            <span>{t('navMap')}</span>
          </Link>
          <Link to="/chat" className={isActive('/chat') ? 'nav-item-active' : 'nav-item'}>
            <MessageSquare className="w-4 h-4" />
            <span>{t('chatAssistant')}</span>
          </Link>
          <Link to="/search" className={isActive('/search') ? 'nav-item-active' : 'nav-item'}>
            <Search className="w-4 h-4" />
            <span>{t('explore')}</span>
          </Link>
          <Link to="/admin" className={isActive('/admin') ? 'nav-item-active' : 'nav-item'}>
            <Shield className="w-4 h-4" />
            <span>{t('admin')}</span>
          </Link>
        </nav>

        {/* Right Section: Language Switcher */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};
