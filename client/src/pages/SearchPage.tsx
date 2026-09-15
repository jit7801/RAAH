import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAMPUS_LOCATIONS } from '../data/locations';
import { Search, MapPin, ArrowRight } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Places' },
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
      <div className="surface-card p-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Campus Directory</h1>
          <p className="text-xs text-slate-500">Explore classrooms, departments, offices, and campus amenities</p>
        </div>

        {/* Input Bar */}
        <div className="relative max-w-2xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by location, room (e.g. B-204), building, or department..."
            className="input-field pl-10"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-navy-800 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
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
            className="surface-card-hover p-4 space-y-3 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge-navy">{loc.category.toUpperCase()}</span>
                <span className="text-xs text-slate-500 font-medium">{loc.building}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                {loc.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{loc.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Floor {loc.floor} {loc.room_number ? `· Room ${loc.room_number}` : ''}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/navigate?dest=${loc.node_id}`);
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>Navigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="surface-card p-8 text-center text-slate-500">
          <p className="text-sm font-medium">No campus locations found matching your search.</p>
          <p className="text-xs text-slate-400 mt-1">Try searching for a room number, department name, or building.</p>
        </div>
      )}
    </div>
  );
};
