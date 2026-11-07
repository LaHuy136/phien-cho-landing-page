import React from 'react';

interface CoinSvgProps {
  className?: string;
  serifFont?: string;
  sansFont?: string;
  accentColor?: string;
  goldColor?: string;
  dateText?: string;
  brandText?: string;
}

export const CoinSvg: React.FC<CoinSvgProps> = ({
  className = 'w-full max-w-[340px] md:max-w-[380px]',
  serifFont = 'Cormorant Garamond, Georgia, serif',
  sansFont = 'Be Vietnam Pro, Arial, sans-serif',
  accentColor = '#7d2c19',
  goldColor = '#d99c48',
  dateText = '24 · 11',
  brandText = 'chồ',
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 400"
        role="img"
        aria-label="Xu tre Phiên chợ ký ức ở Chồ"
        className="w-full h-auto drop-shadow-2xl transition-transform duration-700 hover:rotate-2 select-none"
        style={{ filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.38))' }}
      >
        <circle cx="200" cy="200" r="190" fill={goldColor} />
        <circle cx="200" cy="200" r="190" fill="none" stroke="#a46a22" strokeWidth="6" />
        <circle cx="200" cy="200" r="168" fill="none" stroke={accentColor} strokeWidth="3" />
        <circle cx="200" cy="200" r="150" fill="none" stroke={accentColor} strokeWidth="3" />
        <circle cx="200" cy="200" r="132" fill="none" stroke={accentColor} strokeWidth="3" />
        
        {/* Subtle bamboo grain rings */}
        <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(125,44,25,0.15)" strokeWidth="1.5" strokeDasharray="4 6" />
        <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(125,44,25,0.12)" strokeWidth="1" />
        
        {/* Central slot reminiscent of traditional ancient cash coins */}
        <rect
          x="176"
          y="176"
          width="48"
          height="48"
          rx="6"
          fill="none"
          stroke={accentColor}
          strokeWidth="2.5"
          opacity="0.3"
        />

        <text
          x="200"
          y="180"
          textAnchor="middle"
          fontFamily={serifFont}
          fontSize="92"
          fontWeight="600"
          fill={accentColor}
          letterSpacing="0.02em"
        >
          {brandText}
        </text>

        <text
          x="200"
          y="250"
          textAnchor="middle"
          fontFamily={serifFont}
          fontSize="46"
          fontWeight="500"
          fill={accentColor}
        >
          {dateText}
        </text>

        <text
          x="200"
          y="288"
          textAnchor="middle"
          fontFamily={sansFont}
          fontSize="15"
          fontWeight="600"
          letterSpacing="0.08em"
          fill={accentColor}
        >
          1 XU · 1 GÁNH
        </text>
      </svg>
    </div>
  );
};
