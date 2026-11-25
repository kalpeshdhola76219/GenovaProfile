import React from 'react';

export interface GenovaDocLogoProps {
  variant?: 'full' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  showTagline?: boolean;
  className?: string;
}

export const GenovaDocLogo: React.FC<GenovaDocLogoProps> = ({
  variant = 'full',
  size = 'md',
  theme = 'light',
  showTagline = false,
  className = '',
}) => {
  // Proportional dimension tokens
  const iconPixelSize = {
    xs: 28,
    sm: 34,
    md: 40,
    lg: 52,
    xl: 64,
  }[size];

  const brandTextSize = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl sm:text-[22px]',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  }[size];

  const taglineSize = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base',
  }[size];

  // Brand G Glyph Emblem
  const BrandIcon = (
    <div
      style={{
        width: `${iconPixelSize}px`,
        height: `${iconPixelSize}px`,
      }}
      className={`relative shrink-0 select-none group-hover:scale-105 transition-all duration-200 rounded-xl overflow-hidden p-0.5 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 shadow-md shadow-cyan-950/30 hover:border-[#00C2CB] group-hover:border-[#00C2CB]'
          : 'bg-white border border-slate-200/90 shadow-xs shadow-slate-200/50 hover:border-[#00C2CB] group-hover:border-[#00C2CB]'
      }`}
    >
      <img
        src="/genova-logo-transparent.png"
        alt="GenovaProfile"
        width={iconPixelSize}
        height={iconPixelSize}
        className="w-full h-full object-contain transform scale-95"
        loading="eager"
      />
    </div>
  );

  if (variant === 'icon') {
    return <span className={`inline-flex items-center ${className}`}>{BrandIcon}</span>;
  }

  // Clean Typography Lockup matching the site palette
  return (
    <div className={`inline-flex items-center gap-3 select-none shrink-0 ${className}`}>
      {BrandIcon}
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none">
          <span
            className={`font-extrabold tracking-tight leading-none whitespace-nowrap ${brandTextSize}`}
            style={{ fontFamily: "'Manrope', 'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            <span className={theme === 'dark' ? 'text-white' : 'text-[#0B1B3A]'}>Genova</span>
            <span className={theme === 'dark' ? 'text-[#38BDF8]' : 'text-[#0066FF]'}>Profile</span>
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`font-semibold tracking-wider uppercase ${taglineSize} ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Resumes • Biodata • Cover Letters
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
