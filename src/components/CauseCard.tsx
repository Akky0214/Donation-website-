import React from 'react';
import { motion } from 'motion/react';
import { Campaign } from '../types/donation';
import { CauseArtwork } from './CauseArtwork';
import { Heart, FileText, MapPin, Users, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CauseCardProps {
  campaign: Campaign;
  onDonate: (campaignId: string) => void;
  onOpenFieldReport: (campaign: Campaign) => void;
}

export const CauseCard: React.FC<CauseCardProps> = ({
  campaign,
  onDonate,
  onOpenFieldReport
}) => {
  const { language, t } = useLanguage();
  const percentRaised = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Visual Artwork Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <CauseArtwork
            theme={campaign.svgTheme}
            imageUrl={campaign.imageUrl}
            imageAlt={campaign.imageAlt}
            className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {campaign.emergencyMultiplier && campaign.emergencyMultiplier > 1 && (
            <motion.div
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-xs font-mono font-bold px-2.5 py-1 rounded-sm shadow-xs"
            >
              {campaign.emergencyMultiplier}X {language === 'hi' ? 'मैच सक्रिय' : 'MATCH ACTIVE'}
            </motion.div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Metadata Header */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 mb-2.5">
            <span className="font-semibold text-stone-700">{campaign.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" />
              {campaign.location}
            </span>
          </div>

          {/* Campaign Title & Subtitle */}
          <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-stone-700 transition-colors leading-snug mb-2">
            {campaign.title}
          </h3>
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-6">
            {campaign.subtitle}
          </p>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-xs font-mono">
              <span className="font-bold text-stone-900 text-sm">
                ₹{campaign.raisedAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-stone-500">
                {language === 'hi' ? 'लक्ष्य' : 'target'} ₹{campaign.targetAmount.toLocaleString('en-IN')} ({percentRaised}%)
              </span>
            </div>

            {/* Hairline progress track */}
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${percentRaised}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-stone-900 rounded-full"
              />
            </div>

            {/* Secondary Metadata Stats: Donors & Days Remaining */}
            <div className="mt-3 flex items-center justify-between text-xs text-stone-500 font-mono">
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span className="tabular-nums font-semibold text-stone-700">{campaign.donorCount.toLocaleString('en-IN')}</span>{' '}
                {language === 'hi' ? 'दाता' : 'donors'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span className="tabular-nums font-semibold text-stone-700">{campaign.daysLeft}</span>{' '}
                {language === 'hi' ? 'दिन शेष' : 'days left'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-6 pb-6 pt-2 flex items-center gap-2.5">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onDonate(campaign.id)}
          className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
          <span>{t('causes.card.donate')}</span>
        </motion.button>

        <button
          type="button"
          onClick={() => onOpenFieldReport(campaign)}
          className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
          title="Inspect Field Log & Milestones"
        >
          <FileText className="w-3.5 h-3.5 text-stone-500" />
          <span className="hidden sm:inline">{t('causes.card.report')}</span>
        </button>
      </div>
    </motion.article>
  );
};
