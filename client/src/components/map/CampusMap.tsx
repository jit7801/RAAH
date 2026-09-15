import React, { useState } from 'react';
import { CAMPUS_LOCATIONS } from '../../data/locations';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface CampusMapProps {
  routeNodes?: string[];
  polylineCoords?: Array<[number, number]>;
  startNodeId?: string;
  destinationNodeId?: string | null;
  onSelectLocation?: (nodeId: string) => void;
  interactive?: boolean;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  polylineCoords = [],
  startNodeId = 'main_gate',
  destinationNodeId,
  onSelectLocation,
  interactive = true,
}) => {
  const [zoom, setZoom] = useState(1);

  const svgPolylinePoints = polylineCoords.map(c => `${c[0]},${c[1]}`).join(' ');

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 1.75));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.85));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-card flex items-center justify-center select-none">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-200 shadow-sm">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset Map View"
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 text-xs flex items-center gap-4 text-slate-600 shadow-sm font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />
          <span>Start Point</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-sm" />
          <span>Destination</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 bg-blue-600 rounded" />
          <span>Active Route</span>
        </div>
      </div>

      {/* Main Clean Map SVG */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoom})` }}
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-h-[600px] object-contain"
          style={{ background: '#F8FAFC' }}
        >
          <defs>
            {/* Subtle Grid */}
            <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="600" fill="url(#campus-grid)" />

          {/* Walkable Pathways / Corridors */}
          <g id="pathways" opacity="0.8">
            <path d="M 120 530 L 400 530 L 650 530 L 650 300 L 230 300 Z" fill="none" stroke="#E2E8F0" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="230" y1="300" x2="230" y2="160" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="round" />
            <line x1="430" y1="300" x2="430" y2="150" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="round" />
            <line x1="630" y1="300" x2="630" y2="160" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="round" />
            <line x1="400" y1="530" x2="400" y2="310" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="round" />
          </g>

          {/* Campus Buildings Layer */}
          <g id="buildings">
            {/* Main Gate */}
            <rect x="70" y="500" width="100" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="120" y="535" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="600">Main Gate</text>

            {/* Block A (Library & Seminar) */}
            <rect x="170" y="140" width="120" height="130" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="180" y="150" width="100" height="40" rx="6" fill="#F1F5F9" />
            <text x="230" y="175" textAnchor="middle" fill="#475569" fontSize="10">Seminar A-201</text>
            <rect x="180" y="195" width="100" height="65" rx="6" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
            <text x="230" y="232" textAnchor="middle" fill="#1E3A8A" fontSize="12" fontWeight="700">Block A Library</text>

            {/* Block B (CSE Dept & Lab) */}
            <rect x="360" y="120" width="130" height="150" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="425" y="142" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="700">Block B (CSE)</text>
            <rect x="375" y="150" width="100" height="30" rx="4" fill="#F1F5F9" />
            <text x="425" y="169" textAnchor="middle" fill="#475569" fontSize="9">Class B-204 (2F)</text>
            <rect x="375" y="185" width="100" height="35" rx="4" fill="#F5F3FF" stroke="#DDD6FE" strokeWidth="1" />
            <text x="425" y="206" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="600">CSE Dept & Lab 1</text>

            {/* Block C (Mech Dept & Lab) */}
            <rect x="560" y="130" width="130" height="140" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="625" y="150" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="700">Block C (Mech)</text>
            <rect x="575" y="160" width="100" height="35" rx="4" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
            <text x="625" y="181" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="600">Class C-103 (1F)</text>
            <rect x="575" y="200" width="100" height="55" rx="4" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
            <text x="625" y="232" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="600">Mech Lab / Dept</text>

            {/* Block D (Electrical) */}
            <rect x="590" y="340" width="120" height="80" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="650" y="385" textAnchor="middle" fill="#065F46" fontSize="11" fontWeight="700">Block D Elec Lab</text>

            {/* Main Building (Admin & Auditorium) */}
            <rect x="320" y="310" width="160" height="140" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="400" y="335" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">Main Building</text>
            <rect x="335" y="345" width="130" height="40" rx="4" fill="#F8FAFC" />
            <text x="400" y="369" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="600">Admin & Principal</text>
            <rect x="335" y="390" width="130" height="45" rx="4" fill="#FDF2F8" stroke="#FBCFE8" strokeWidth="1" />
            <text x="400" y="417" textAnchor="middle" fill="#9D174D" fontSize="11" fontWeight="700">Auditorium</text>

            {/* Amenities (Canteen & Medical) */}
            <rect x="150" y="350" width="120" height="80" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="210" y="375" textAnchor="middle" fill="#0891B2" fontSize="10" fontWeight="600">Medical Centre</text>
            <rect x="160" y="385" width="100" height="35" rx="6" fill="#ECFEFF" stroke="#CFFAFE" strokeWidth="1" />
            <text x="210" y="407" textAnchor="middle" fill="#155E75" fontSize="11" fontWeight="700">Campus Canteen</text>

            {/* Hostel Block */}
            <rect x="70" y="160" width="90" height="90" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="115" y="210" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="600">Hostel Block</text>

            {/* Sports Ground */}
            <rect x="540" y="450" width="180" height="80" rx="20" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="630" y="495" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="700">Sports Ground</text>
          </g>

          {/* ACTIVE ROUTE POLYLINE */}
          {svgPolylinePoints && (
            <g id="route-animated-layer">
              <polyline
                points={svgPolylinePoints}
                fill="none"
                stroke="#93C5FD"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
              <polyline
                points={svgPolylinePoints}
                fill="none"
                stroke="#2563EB"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="route-animated-line"
              />
            </g>
          )}

          {/* Location Pins & Markers */}
          <g id="location-pins">
            {CAMPUS_LOCATIONS.map((loc) => {
              const isStart = loc.node_id === startNodeId;
              const isDest = loc.node_id === destinationNodeId;

              return (
                <g
                  key={loc.id}
                  transform={`translate(${loc.map_x}, ${loc.map_y})`}
                  onClick={() => interactive && onSelectLocation && onSelectLocation(loc.node_id)}
                  className={`cursor-pointer group transition-transform ${isDest ? 'scale-125' : 'hover:scale-110'}`}
                >
                  {/* Start Pin */}
                  {isStart && (
                    <g>
                      <circle r="10" fill="#2563EB" opacity="0.2" className="animate-ping" />
                      <circle r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                    </g>
                  )}

                  {/* Destination Pin */}
                  {isDest && (
                    <g>
                      <circle r="12" fill="#DC2626" opacity="0.2" className="animate-ping" />
                      <circle r="8" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                      <path d="M-3 -2 L0 4 L3 -2 Z" fill="#FFFFFF" />
                    </g>
                  )}

                  {/* Normal Location Dot */}
                  {!isStart && !isDest && (
                    <circle r="3.5" fill="#64748B" stroke="#FFFFFF" strokeWidth="1" className="group-hover:fill-blue-600" />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
