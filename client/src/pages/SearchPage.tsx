import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAMPUS_LOCATIONS } from '../data/locations';
import { Search, MapPin, ArrowRight } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'department', label: 'Departments' },
    { id: 'lab', label: 'Labs' },
    { id: 'classroom', label: 'Classrooms' },
    { id: 'office', label: 'Offices' },
    { id: 'facility', label: 'Facilities' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'medical', label: 'Medical' },
  ];

  const filtered = CAMPUS_LOCATIONS.filter(loc => {
    const matchesCat = selectedCategory === 'all' || loc.category === selectedCategory;
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      loc.name.toLowerCase().includes(s) ||
      loc.building.toLowerCase().includes(s) ||
      loc.official_name.toLowerCase().includes(s) ||
      (loc.room_number && loc.room_number.toLowerCase().includes(s)) ||
      loc.aliases.some(a => a.toLowerCase().includes(s));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16 page-enter">
      {/* Search Header */}
      <div className="glass-card p-6 space-y-4 border border-white/10">
        <div>
          <h1 className="text-xl font-bold text-white font-display">Campus Directory</h1>
          <p className="text-xs text-slate-400">Browse classrooms, departments, offices, and facilities across campus</p>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, room number (e.g. B-204), building, or keyword..."
            className="input-field pl-9"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === c.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-surface-800 text-slate-400 hover:text-white hover:bg-surface-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((loc) => (
          <div
            key={loc.id}
            onClick={() => navigate(`/location/${loc.id}`)}
            className="glass-card-hover p-5 space-y-3 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge-indigo">{loc.category.toUpperCase()}</span>
                <span className="text-xs text-slate-400">{loc.building}</span>
              </div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                {loc.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{loc.description}</p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Floor {loc.floor} {loc.room_number ? `· Room ${loc.room_number}` : ''}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/navigate?dest=${loc.node_id}`);
                }}
                className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                <span>Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-8 text-center text-slate-400">
          <p className="text-sm">No campus locations found matching your search.</p>
        </div>
      )}
    </div>
  );
};
