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

  const badgeSize = {
    xs: 'text-[8px] px-1 py-0.2',
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
    xl: 'text-sm px-3 py-1',
  }[size];

  const taglineSize = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base',
  }[size];

  // Modern Electric Blue -> Cyan -> Mint G Glyph Emblem
  const BrandIcon = (
    <div
      style={{
        width: `${iconPixelSize}px`,
        height: `${iconPixelSize}px`,
      }}
      className={`relative shrink-0 select-none group-hover:scale-105 transition-all duration-200 rounded-xl overflow-hidden p-0.5 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 shadow-md shadow-cyan-950/30'
          : 'bg-white border border-slate-200/90 shadow-xs shadow-slate-200/50 hover:border-cyan-300'
      }`}
    >
      <img
        src="/genova-logo-transparent.png"
        alt="Genova Profile Logo"
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

  // Pure Typography Lockup with New Vibrant Azure-to-Mint Brand Palette
  return (
    <div className={`inline-flex items-center gap-3 select-none shrink-0 ${className}`}>
      {BrandIcon}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight leading-none ${brandTextSize} ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Genova
          </span>
          <span
            className={`font-black tracking-tight leading-none ${brandTextSize} bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-[#38BDF8] via-[#00D2C4] to-[#34D399]'
                : 'from-[#0066FF] via-[#00C2CB] to-[#10B981]'
            } bg-clip-text text-transparent`}
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Profile
          </span>
          <span
            className={`font-bold uppercase tracking-wider rounded-md border ${badgeSize} ${
              theme === 'dark'
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60 shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-2xs'
            }`}
          >
            Studio
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`font-semibold tracking-wider uppercase ${taglineSize} ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Resumes • Biodatas • Invitations
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
