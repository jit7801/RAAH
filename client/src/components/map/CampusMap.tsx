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
  const [pan] = useState({ x: 0, y: 0 });

  // Convert polyline array into SVG points attribute string "x1,y1 x2,y2 ..."
  const svgPolylinePoints = polylineCoords.map(c => `${c[0]},${c[1]}`).join(' ');

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => { setZoom(1); };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-surface-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center select-none">
      {/* Zoom Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-surface-800/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset Map View"
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-surface-800/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs flex items-center gap-4 text-slate-300 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-sm shadow-blue-500/50" />
          <span>Start (You)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span>Destination</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 bg-brand-500 rounded" />
          <span>Route</span>
        </div>
      </div>

      {/* Main Interactive SVG */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-h-[600px] object-contain"
          style={{ background: '#0a0a14' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e1e36" strokeWidth="0.8" />
            </pattern>

            {/* Glowing route effect */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="600" fill="url(#grid)" />

          {/* Walkable Pathways / Corridors */}
          <g id="pathways" opacity="0.6">
            {/* Main Outer Path */}
            <path d="M 120 530 L 400 530 L 650 530 L 650 300 L 230 300 Z" fill="none" stroke="#252545" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            {/* Inner Corridors */}
            <line x1="230" y1="300" x2="230" y2="160" stroke="#252545" strokeWidth="12" strokeLinecap="round" />
            <line x1="430" y1="300" x2="430" y2="150" stroke="#252545" strokeWidth="12" strokeLinecap="round" />
            <line x1="630" y1="300" x2="630" y2="160" stroke="#252545" strokeWidth="12" strokeLinecap="round" />
            <line x1="400" y1="530" x2="400" y2="310" stroke="#252545" strokeWidth="12" strokeLinecap="round" />
          </g>

          {/* Buildings Layer */}
          <g id="buildings">
            {/* Gate Area */}
            <rect x="70" y="500" width="100" height="60" rx="8" fill="#1e1e36" stroke="#4f46e5" strokeWidth="1.5" />
            <text x="120" y="535" textAnchor="middle" fill="#818cf8" fontSize="11" fontWeight="600">Main Gate</text>

            {/* Block A (Library & Seminar) */}
            <rect x="170" y="140" width="120" height="130" rx="10" fill="#16162a" stroke="#3b82f6" strokeWidth="1.5" />
            <rect x="180" y="150" width="100" height="40" rx="6" fill="#1e1e36" />
            <text x="230" y="175" textAnchor="middle" fill="#93c5fd" fontSize="10">Seminar / A-201</text>
            <rect x="180" y="195" width="100" height="65" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
            <text x="230" y="232" textAnchor="middle" fill="#e0e7ff" fontSize="12" fontWeight="700">Block A Library</text>

            {/* Block B (CSE Dept, Labs, Classrooms) */}
            <rect x="360" y="120" width="130" height="150" rx="10" fill="#16162a" stroke="#8b5cf6" strokeWidth="1.5" />
            <text x="425" y="142" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="700">Block B (CSE)</text>
            <rect x="375" y="150" width="100" height="30" rx="4" fill="#1e1e36" />
            <text x="425" y="169" textAnchor="middle" fill="#e9d5ff" fontSize="9">Class B-204 (2F)</text>
            <rect x="375" y="185" width="100" height="35" rx="4" fill="#2e1065" stroke="#a855f7" strokeWidth="1" />
            <text x="425" y="206" textAnchor="middle" fill="#f3e8ff" fontSize="10" fontWeight="600">CSE Dept & Lab 1</text>

            {/* Block C (Mech Dept, Lab, Classroom C-103) */}
            <rect x="560" y="130" width="130" height="140" rx="10" fill="#16162a" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="625" y="150" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700">Block C (Mech)</text>
            <rect x="575" y="160" width="100" height="35" rx="4" fill="#1e1e36" />
            <text x="625" y="181" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="600">Class C-103 (1F)</text>
            <rect x="575" y="200" width="100" height="55" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
            <text x="625" y="232" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="600">Mech Lab / Dept</text>

            {/* Block D (Electrical) */}
            <rect x="590" y="340" width="120" height="80" rx="8" fill="#16162a" stroke="#10b981" strokeWidth="1.5" />
            <text x="650" y="385" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="700">Block D Elec Lab</text>

            {/* Main Building (Admin + Auditorium + Principal) */}
            <rect x="320" y="310" width="160" height="140" rx="12" fill="#16162a" stroke="#ec4899" strokeWidth="1.5" />
            <text x="400" y="335" textAnchor="middle" fill="#f472b6" fontSize="11" fontWeight="700">Main Building</text>
            <rect x="335" y="345" width="130" height="40" rx="4" fill="#1e1e36" />
            <text x="400" y="369" textAnchor="middle" fill="#fce7f3" fontSize="10" fontWeight="600">Admin & Principal</text>
            <rect x="335" y="390" width="130" height="45" rx="4" fill="#831843" stroke="#f472b6" strokeWidth="1" />
            <text x="400" y="417" textAnchor="middle" fill="#fce7f3" fontSize="11" fontWeight="700">Auditorium</text>

            {/* Amenities (Canteen & Medical) */}
            <rect x="150" y="350" width="120" height="80" rx="10" fill="#16162a" stroke="#06b6d4" strokeWidth="1.5" />
            <text x="210" y="375" textAnchor="middle" fill="#67e8f9" fontSize="10" fontWeight="600">Medical Centre</text>
            <rect x="160" y="385" width="100" height="35" rx="6" fill="#164e63" />
            <text x="210" y="407" textAnchor="middle" fill="#cffaffe" fontSize="11" fontWeight="700">Campus Canteen</text>

            {/* Hostel */}
            <rect x="70" y="160" width="90" height="90" rx="8" fill="#16162a" stroke="#64748b" strokeWidth="1.5" />
            <text x="115" y="210" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Hostel Block</text>

            {/* Sports Ground */}
            <rect x="540" y="450" width="180" height="80" rx="20" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="630" y="495" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="700">Sports Ground</text>
          </g>

          {/* DYNAMIC CALCULATED ROUTE POLYLINE */}
          {svgPolylinePoints && (
            <g id="route-animated-layer">
              {/* Outer Glow */}
              <polyline
                points={svgPolylinePoints}
                fill="none"
                stroke="#6366f1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
                filter="url(#glow)"
              />
              {/* Main Line */}
              <polyline
                points={svgPolylinePoints}
                fill="none"
                stroke="#818cf8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="route-animated"
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
                      <circle r="12" fill="#3b82f6" opacity="0.3" className="animate-ping" />
                      <circle r="8" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                    </g>
                  )}

                  {/* Destination Pin */}
                  {isDest && (
                    <g className="animate-bounce-subtle">
                      <circle r="14" fill="#ef4444" opacity="0.3" className="animate-ping" />
                      <circle r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                      <path d="M-4 -3 L0 5 L4 -3 Z" fill="#ffffff" />
                    </g>
                  )}

                  {/* Normal Location Dot */}
                  {!isStart && !isDest && (
                    <circle r="4" fill="#94a3b8" stroke="#1e1e36" strokeWidth="1" className="group-hover:fill-brand-400" />
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
