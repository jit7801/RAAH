import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { NavigationProvider } from './context/NavigationContext';

import { Header } from './components/shared/Header';
import { HomePage } from './pages/HomePage';
import { NavigatePage } from './pages/NavigatePage';
import { ChatPage } from './pages/ChatPage';
import { SearchPage } from './pages/SearchPage';
import { LocationDetailPage } from './pages/LocationDetailPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <NavigationProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/navigate" element={<NavigatePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/location/:id" element={<LocationDetailPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <footer className="w-full border-t border-slate-200 bg-white py-6 px-4 text-xs text-slate-500">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 font-display">RAAH AI</span>
                  <span>— Multilingual Campus Navigation Assistant</span>
                </div>
                <p>JIET Group of Institutions, Jodhpur (Rajasthan) © 2026</p>
              </div>
            </footer>
          </div>
        </Router>
      </NavigationProvider>
    </LanguageProvider>
  );
};

export default App;
