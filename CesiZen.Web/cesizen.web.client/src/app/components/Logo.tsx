import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function Logo({ size = 'md', showTagline = false }: LogoProps) {
  const iconSize = size === 'sm' ? 28 : size === 'md' ? 38 : 56;
  const textClass = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-4xl';

  return (
    <div className="flex items-center gap-2">
      {/* Zen figure SVG inspired by the CesiZen logo */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head circle */}
        <circle cx="20" cy="5" r="3.5" stroke="#2D8A4E" strokeWidth="2" fill="none" />
        {/* Body diamond */}
        <path d="M20 12 L27 19 L20 26 L13 19 Z" stroke="#2D8A4E" strokeWidth="2" fill="none" />
        {/* Infinity-like base */}
        <path d="M10 33 C10 29 15 27 20 30 C25 27 30 29 30 33 C30 37 25 35 20 32 C15 35 10 37 10 33 Z" stroke="#2D8A4E" strokeWidth="2" fill="none" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className={`${textClass} font-black tracking-tight`}>
          <span className="text-green-700">CESI</span>
          <span className="text-amber-500">ZEN</span>
        </span>
        {showTagline && (
          <span className="text-xs text-green-600 tracking-widest uppercase mt-0.5">
            Santé mentale
          </span>
        )}
      </div>
    </div>
  );
}
