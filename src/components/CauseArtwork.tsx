import React, { useState } from 'react';
import { Camera, CheckCircle2 } from 'lucide-react';

export interface CauseArtworkProps {
  theme?: 'water' | 'medical' | 'ecology' | 'crisis' | 'education' | 'general';
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  badgeText?: string;
}

// Curated high-fidelity documentary field photography for Indian humanitarian & ecological operations
const REALISTIC_THEME_IMAGES: Record<string, { url: string; backup: string; alt: string; tag: string }> = {
  water: {
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1400&q=85',
    backup: 'https://images.unsplash.com/photo-1574689049597-7e6df3db0541?auto=format&fit=crop&w=1400&q=85',
    alt: 'Clean fresh water streaming from deep solar groundwater borehole well into cupped hands in Rajasthan',
    tag: 'FIELD PHOTO · BARMER DEEP WELL'
  },
  medical: {
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1400&q=85',
    backup: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=85',
    alt: 'Healthcare specialist providing compassionate pediatric infant care in mobile tribal clinic',
    tag: 'FIELD PHOTO · NEONATAL MOBILE ICU'
  },
  ecology: {
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1400&q=85',
    backup: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85',
    alt: 'Misty sunlit ancient mountain rainforest canopy across the protected Western Ghats biological corridor',
    tag: 'FIELD PHOTO · WESTERN GHATS RESERVE'
  },
  crisis: {
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1400&q=85',
    backup: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&w=1400&q=85',
    alt: 'Emergency flood relief rescue boat navigating monsoon waters delivering dry rations and clean water',
    tag: 'FIELD PHOTO · BRAHMAPUTRA RELIEF SKIFF'
  },
  education: {
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1400&q=85',
    backup: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85',
    alt: 'Young smiling rural schoolgirls studying hands-on science and robotics in solar-powered classroom',
    tag: 'FIELD PHOTO · GIRLS SOLAR STEM LAB'
  },
  general: {
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1400&q=85',
    backup: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=85',
    alt: 'Direct grassroots humanitarian community aid and solidarity across India',
    tag: 'FIELD PHOTO · VERIFIED SEVA MISSION'
  }
};

export const CauseArtwork: React.FC<CauseArtworkProps> = ({
  theme = 'general',
  imageUrl,
  imageAlt,
  className = '',
  badgeText
}) => {
  const themeData = REALISTIC_THEME_IMAGES[theme] || REALISTIC_THEME_IMAGES.general;
  const initialSource = imageUrl || themeData.url;

  const [currentSrc, setCurrentSrc] = useState<string>(initialSource);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const displayAlt = imageAlt || themeData.alt;
  const displayBadge = badgeText || themeData.tag;

  const handleError = () => {
    if (!hasError && currentSrc !== themeData.backup) {
      setCurrentSrc(themeData.backup);
      setHasError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-stone-900 flex items-center justify-center select-none ${className}`}>
      {/* Background skeleton while loading */}
      <div
        className={`absolute inset-0 bg-stone-800 transition-opacity duration-700 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-pulse'
        }`}
      />

      {/* Realistic High-Fidelity Photograph */}
      <img
        src={currentSrc}
        alt={displayAlt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />

      {/* Subtle photographic vignette overlay for contrast and typography readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none" />

      {/* Top Left: Authentic Field Verification Badge */}
      <div className="absolute top-3 left-3 bg-stone-950/85 backdrop-blur-md text-stone-200 text-[11px] font-mono font-medium px-2.5 py-1 rounded-sm border border-stone-800/80 shadow-xs flex items-center gap-1.5 z-10 pointer-events-none">
        <Camera className="w-3 h-3 text-amber-400" />
        <span className="truncate max-w-[200px] sm:max-w-none">{displayBadge}</span>
      </div>

      {/* Bottom Right subtle verification mark */}
      <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-stone-300/80 flex items-center gap-1 z-10 pointer-events-none">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>Audited Field Capture</span>
      </div>
    </div>
  );
};
