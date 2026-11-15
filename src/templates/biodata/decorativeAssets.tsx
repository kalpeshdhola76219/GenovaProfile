import React from 'react';

/**
 * High-definition vector decorative assets for Premium Marriage Biodata templates.
 * All paths use standard hex colors and scalable SVG viewboxes for crystal-clear 300 DPI exports.
 */

// Auspicious Lord Ganesha Vector (Rich Golden / Traditional Line Art)
export const GaneshaVector: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  variant?: 'gold' | 'line' | 'maroon' | 'modern';
}> = ({ className = '', size = 48, color = '#d97706', variant = 'gold' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Crown / Mukut */}
      <path
        d="M50 8 L58 24 L52 24 L60 36 L40 36 L48 24 L42 24 Z"
        fill={color}
        stroke={variant === 'line' ? color : '#92400e'}
        strokeWidth="1.5"
      />
      <circle cx="50" cy="14" r="2.5" fill="#fef08a" />
      {/* Head & Big Ears */}
      {/* Left Ear */}
      <path
        d="M40 38 C28 32 16 38 18 52 C20 62 30 65 38 60"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill={variant === 'gold' ? `${color}20` : 'none'}
      />
      {/* Right Ear */}
      <path
        d="M60 38 C72 32 84 38 82 52 C80 62 70 65 62 60"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill={variant === 'gold' ? `${color}20` : 'none'}
      />
      {/* Forehead & Tilak / Trishul */}
      <path
        d="M50 36 L50 50 M46 42 Q50 45 54 42"
        stroke="#dc2626"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="50" cy="38" r="1.5" fill="#eab308" />
      {/* Curved Trunk / Vakratunda */}
      <path
        d="M47 50 C46 62 48 74 56 76 C64 78 68 70 68 64 C68 60 64 58 60 62"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Modak in Trunk / Hand */}
      <circle cx="61" cy="62" r="3" fill="#eab308" stroke="#92400e" strokeWidth="1" />
      {/* Left Tusk (Single tusk / Ekdanta) */}
      <path d="M42 54 L38 58" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      {/* Halos & Auspicious Ring */}
      <circle cx="50" cy="52" r="42" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="50" cy="52" r="45" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
};

// Auspicious Golden Lotus Symbol
export const LotusVector: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 40, color = '#d97706' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M40 5 C34 18 36 34 40 44 C44 34 46 18 40 5 Z"
        fill={color}
        stroke="#b45309"
        strokeWidth="1.2"
      />
      <path
        d="M39 12 C30 20 28 35 38 44 C33 36 34 22 39 12 Z"
        fill={`${color}dd`}
        stroke="#b45309"
        strokeWidth="1"
      />
      <path
        d="M41 12 C50 20 52 35 42 44 C47 36 46 22 41 12 Z"
        fill={`${color}dd`}
        stroke="#b45309"
        strokeWidth="1"
      />
      <path
        d="M36 20 C22 28 18 40 34 45 C24 38 28 26 36 20 Z"
        fill={`${color}aa`}
        stroke="#b45309"
        strokeWidth="1"
      />
      <path
        d="M44 20 C58 28 62 40 46 45 C56 38 52 26 44 20 Z"
        fill={`${color}aa`}
        stroke="#b45309"
        strokeWidth="1"
      />
      <path
        d="M26 45 Q40 49 54 45 Q40 47 26 45 Z"
        fill="#b45309"
      />
    </svg>
  );
};

// Sacred Om (ॐ) inside Lotus / Ring
export const OmLotusVector: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 48, color = '#b45309' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="43" stroke={color} strokeWidth="0.8" strokeDasharray="3 2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <circle
          key={deg}
          cx={50 + 43 * Math.cos((deg * Math.PI) / 180)}
          cy={50 + 43 * Math.sin((deg * Math.PI) / 180)}
          r="2.5"
          fill={color}
        />
      ))}
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontSize="44"
        fontFamily="'Cormorant Garamond', 'Cinzel', serif"
        fontWeight="bold"
        fill={color}
      >
        ॐ
      </text>
    </svg>
  );
};

// Interlocked Diamond Wedding Rings
export const WeddingRingsVector: React.FC<{
  className?: string;
  size?: number;
  goldColor?: string;
}> = ({ className = '', size = 64, goldColor = '#d97706' }) => {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M48 10 L54 18 L50 24 L42 24 L38 18 Z"
        fill="#e0f2fe"
        stroke="#0284c7"
        strokeWidth="1.2"
      />
      <line x1="46" y1="4" x2="46" y2="8" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="8" x2="41" y2="11" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="54" y1="8" x2="51" y2="11" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse
        cx="48"
        cy="46"
        rx="26"
        ry="24"
        stroke={goldColor}
        strokeWidth="5"
        fill="none"
      />
      <ellipse
        cx="48"
        cy="46"
        rx="27"
        ry="25"
        stroke="#fef08a"
        strokeWidth="1.2"
        fill="none"
      />
      <ellipse
        cx="72"
        cy="48"
        rx="26"
        ry="24"
        stroke="#b45309"
        strokeWidth="5"
        fill="none"
      />
      <ellipse
        cx="72"
        cy="48"
        rx="27"
        ry="25"
        stroke="#fef08a"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M60 32 C62 38 62 54 60 62"
        stroke={goldColor}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M60 32 C62 38 62 54 60 62"
        stroke="#fef08a"
        strokeWidth="1.2"
      />
      <path
        d="M20 72 Q46 62 70 70 Q94 78 108 66"
        stroke="#0d9488"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="28" cy="70" r="2" fill="#0d9488" />
      <circle cx="85" cy="72" r="2.5" fill="#0d9488" />
      <circle cx="102" cy="68" r="2" fill="#0d9488" />
    </svg>
  );
};

// Royal Traditional Indian Hanging Diya Lamp
export const DiyaLampVector: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 32, color = '#b45309' }) => {
  return (
    <svg
      width={size}
      height={size * 2.2}
      viewBox="0 0 40 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="20" y1="0" x2="20" y2="40" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M14 40 L26 40 L24 46 L16 46 Z" fill={color} />
      <circle cx="20" cy="48" r="3" fill="#f59e0b" />
      <path
        d="M8 58 Q20 54 32 58 Q20 74 8 58 Z"
        fill={color}
        stroke="#78350f"
        strokeWidth="1"
      />
      <path
        d="M20 48 C17 53 16 56 20 58 C24 56 23 53 20 48 Z"
        fill="#f59e0b"
      />
      <path
        d="M20 51 C19 54 18 56 20 57 C22 56 21 54 20 51 Z"
        fill="#fef08a"
      />
      <line x1="20" y1="70" x2="20" y2="80" stroke={color} strokeWidth="1.2" />
      <circle cx="20" cy="83" r="2.5" fill={color} />
    </svg>
  );
};

// Royal Corner Filigree Accent
export const CornerFiligreeVector: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ className = '', size = 70, color = '#b45309', position = 'top-left' }) => {
  const transform =
    position === 'top-right'
      ? 'scale(-1, 1)'
      : position === 'bottom-left'
      ? 'scale(1, -1)'
      : position === 'bottom-right'
      ? 'scale(-1, -1)'
      : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform, transformOrigin: 'center' }}
    >
      <path d="M6 94 L6 6 L94 6" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M12 94 L12 12 L94 12" stroke={color} strokeWidth="0.8" fill="none" />
      <path
        d="M12 12 C24 16 36 28 36 40 C36 48 30 54 22 54 C14 54 12 46 18 42 C24 38 28 44 26 48"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 12 C16 24 28 36 40 36 C48 36 54 30 54 22 C54 14 46 12 42 18 C38 24 44 28 48 26"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="22" cy="22" r="3" fill={color} />
      <path d="M22 14 L22 30 M14 22 L30 22" stroke={color} strokeWidth="1" />
    </svg>
  );
};

// Traditional Indian Toran / Arch Border Pattern
export const ToranArchPattern: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#d97706' }) => {
  return (
    <div className={`w-full overflow-hidden flex justify-center ${className}`}>
      <svg
        viewBox="0 0 600 36"
        preserveAspectRatio="none"
        className="w-full h-9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 4 L600 4 M0 8 L600 8"
          stroke={color}
          strokeWidth="1"
        />
        {Array.from({ length: 20 }).map((_, i) => {
          const x = i * 30 + 15;
          return (
            <g key={i}>
              <path
                d={`M${x - 15} 8 Q${x} 28 ${x + 15} 8`}
                stroke={color}
                strokeWidth="1.2"
                fill={`${color}15`}
              />
              <path
                d={`M${x - 10} 8 Q${x} 22 ${x + 10} 8`}
                stroke={color}
                strokeWidth="0.8"
                fill="none"
              />
              <circle cx={x} cy={30} r="2" fill={color} />
              <line x1={x} y1={24} x2={x} y2={28} stroke={color} strokeWidth="1" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Royal Indian Couple in Traditional Attire (Vector Artwork for Blue Wedding Template)
export const RoyalCoupleVector: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 260 }) => {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 300 345"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="tealSherwani" x1="160" y1="120" x2="260" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67b2bd" />
          <stop offset="0.6" stopColor="#3d8b98" />
          <stop offset="1" stopColor="#25626d" />
        </linearGradient>
        <linearGradient id="lehengaTeal" x1="30" y1="140" x2="160" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#99d6de" />
          <stop offset="0.5" stopColor="#5ea7b2" />
          <stop offset="1" stopColor="#347580" />
        </linearGradient>
        <linearGradient id="goldGleam" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fef08a" />
          <stop offset="0.7" stopColor="#d97706" />
          <stop offset="1" stopColor="#92400e" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="180" r="130" fill="#e0f2fe" opacity="0.6" />
      <path
        d="M175 140 C195 130 225 140 240 165 L255 330 L165 330 L160 210 Z"
        fill="url(#tealSherwani)"
        stroke="#25626d"
        strokeWidth="1.5"
      />
      <path d="M195 135 L195 330" stroke="url(#goldGleam)" strokeWidth="2.5" />
      {[160, 190, 220, 250, 280, 310].map((y) => (
        <circle key={y} cx="195" cy={y} r="2.5" fill="#fef08a" stroke="#b45309" strokeWidth="0.8" />
      ))}
      <path d="M222 195 L235 190 L238 202 L225 204 Z" fill="url(#goldGleam)" />
      <path d="M185 85 C190 70 215 65 225 80 C235 75 242 85 240 100 C238 115 220 125 200 120 Z" fill="#262626" />
      <path d="M190 90 C185 105 190 125 205 125 C215 125 225 115 225 100 C225 88 205 85 190 90 Z" fill="#fcd34d" opacity="0.7" />
      <path
        d="M60 220 C80 160 140 150 170 180 L170 330 L45 330 C40 290 45 250 60 220 Z"
        fill="url(#lehengaTeal)"
        stroke="#285e67"
        strokeWidth="1.5"
      />
      <path d="M70 200 Q120 220 165 200 Q110 260 70 310" stroke="url(#goldGleam)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
      <path d="M90 180 Q140 200 170 190" stroke="url(#goldGleam)" strokeWidth="1.5" fill="none" />
      <path
        d="M125 70 C105 70 95 95 90 125 C85 155 75 185 85 220 C95 210 105 170 115 150 C125 140 140 135 145 120 Z"
        fill="#1f1f1f"
      />
      <circle cx="128" cy="80" r="3" fill="#fef08a" stroke="#b45309" strokeWidth="0.8" />
      <line x1="128" y1="72" x2="128" y2="78" stroke="#d97706" strokeWidth="1" />
      <path
        d="M120 85 C125 98 135 112 145 115 C155 112 155 98 145 90 C138 85 128 80 120 85 Z"
        fill="#fed7aa"
      />
      <path
        d="M170 140 Q190 200 185 270"
        stroke="#f8fafc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="2 10"
      />
      <path
        d="M170 140 Q190 200 185 270"
        stroke="#0d9488"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="4 8"
      />
      <g transform="translate(10, 270)">
        <circle cx="40" cy="40" r="22" fill="#bae6fd" opacity="0.8" />
        <circle cx="40" cy="40" r="16" fill="#f0f9ff" />
        <circle cx="90" cy="48" r="20" fill="#99f6e4" opacity="0.8" />
        <circle cx="210" cy="46" r="22" fill="#bae6fd" opacity="0.8" />
        <circle cx="260" cy="40" r="24" fill="#99f6e4" opacity="0.8" />
        <circle cx="260" cy="40" r="17" fill="#f0f9ff" />
      </g>
    </svg>
  );
};
