import React from 'react';
import { motion } from 'motion/react';
import { Campaign } from '../types/donation';
import { X, MapPin, CheckCircle, Clock, Heart, Calendar } from 'lucide-react';
import { CauseArtwork } from './CauseArtwork';

interface FieldReportModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onDonate: (campaignId: string) => void;
}

export const FieldReportModal: React.FC<FieldReportModalProps> = ({
  campaign,
  onClose,
  onDonate
}) => {
  if (!campaign) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
      >
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <span>Verified Field Log</span>
            <span aria-hidden="true">·</span>
            <span>{campaign.categoryLabel}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Header & Artwork */}
          <div className="relative rounded-xl overflow-hidden border border-stone-200 aspect-[16/9]">
            <CauseArtwork
              theme={campaign.svgTheme}
              imageUrl={campaign.imageUrl}
              imageAlt={campaign.imageAlt}
              badgeText={`FIELD LOG · ${campaign.location.toUpperCase()}`}
              className="w-full h-full"
            />
            <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-sm font-mono flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{campaign.location}</span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              {campaign.title}
            </h3>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              {campaign.summary}
            </p>
          </div>

          {/* Impact Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-stone-100">
            {campaign.impactMetrics.map((metric, idx) => (
              <div key={idx} className="bg-stone-50 p-3 rounded-lg border border-stone-200/60">
                <div className="text-base font-serif font-bold text-stone-900 tabular-nums">
                  {metric.value}
                </div>
                <div className="text-[11px] text-stone-500 font-mono mt-0.5 leading-tight">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Field Log Dispatches */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-700" />
              <span>Partner Ground Dispatches & Telemetry</span>
            </h4>
            <div className="space-y-2.5">
              {campaign.fieldNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/60 text-xs text-stone-700 leading-relaxed"
                >
                  {note}
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Timeline */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-stone-700" />
              <span>Implementation Roadmap & Milestones</span>
            </h4>
            <div className="space-y-3">
              {campaign.milestones.map((ms, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="mt-0.5">
                    {ms.completed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{ms.title}</span>
                      <span className="text-[11px] font-mono text-stone-500">({ms.date})</span>
                    </div>
                    <p className="text-stone-600 mt-0.5">{ms.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-4 sticky bottom-0">
          <div className="text-xs text-stone-600 font-mono">
            <span className="font-bold text-stone-900">₹{campaign.raisedAmount.toLocaleString('en-IN')}</span> raised of ₹{campaign.targetAmount.toLocaleString('en-IN')}
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onDonate(campaign.id);
            }}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-lg inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
            <span>Donate in ₹</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
