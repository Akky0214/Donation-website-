import React, { useState } from 'react';
import { AlertCircle, X, ArrowRight } from 'lucide-react';

interface EmergencyBannerProps {
  onQuickDonateEmergency: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onQuickDonateEmergency }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-stone-900 text-stone-100 text-xs sm:text-sm py-2.5 px-4 border-b border-stone-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="truncate text-stone-200">
            <strong className="font-semibold text-white">Emergency Response Active:</strong> All donations to the Coastal Flood Triage & Sahel Water projects are currently matched 2:1 by our philanthropic syndicate.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickDonateEmergency}
            className="inline-flex items-center gap-1 font-medium text-amber-300 hover:text-amber-200 underline decoration-amber-400/50 hover:decoration-amber-300 transition-colors whitespace-nowrap cursor-pointer text-xs"
          >
            <span>Deploy Matched Gift</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="text-stone-400 hover:text-white transition-colors cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
