import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { RaahLogo } from './RaahLogo';
import { MapPin, Navigation, Compass, Shield, ExternalLink } from 'lucide-react';
import { JIET_GOOGLE_MAPS_URL } from '../../data/locations';

export const Header: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <RaahLogo className="w-9 h-9 group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">RAAH AI</span>
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 px-1.5 py-0.5 rounded">JIET Jodhpur</span>
            </div>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-lg border border-slate-200/60">
          <Link to="/navigate" className={isActive('/navigate') ? 'nav-item-active' : 'nav-item'}>
            <Navigation className="w-4 h-4" />
            <span>Navigation</span>
          </Link>
          <Link to="/search" className={isActive('/search') ? 'nav-item-active' : 'nav-item'}>
            <Compass className="w-4 h-4" />
            <span>Explore</span>
          </Link>

          <Link to="/chat" className={isActive('/chat') ? 'nav-item-active' : 'nav-item'}>
            <MapPin className="w-4 h-4" />
            <span>AI Assistant</span>
          </Link>
          <Link to="/admin" className={isActive('/admin') ? 'nav-item-active' : 'nav-item'}>
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </Link>
        </nav>

        {/* Right Section: Google Maps Pin Link & Language Switcher */}
        <div className="flex items-center gap-2.5">
          <a
            href={JIET_GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Open exact JIET campus pin on Google Maps"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50/80 px-2.5 py-1.5 rounded-lg border border-slate-200/80 hover:border-blue-200 font-medium transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};
