import React from 'react';

export const RaahLogo: React.FC<{ className?: string; size?: number }> = ({ className = "w-9 h-9", size = 36 }) => {
  return (
    <div className={`rounded-xl bg-navy-800 text-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden ${className}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="16" fill="#1E3A5F" />
        {/* Dynamic Route Path */}
        <path d="M16 44 L26 44 L26 28 C26 22, 34 22, 34 28 C34 34, 26 34, 26 34 L44 44" stroke="#3B82F6" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Vertical R stem base */}
        <path d="M20 20 L20 44" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        {/* Location Pin apex */}
        <circle cx="36" cy="24" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
        {/* Destination dot */}
        <circle cx="44" cy="44" r="3.5" fill="#3B82F6" />
      </svg>
    </div>
  );
};
