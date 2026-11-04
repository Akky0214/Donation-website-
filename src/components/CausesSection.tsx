import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Campaign, CauseCategory } from '../types/donation';
import { CauseCard } from './CauseCard';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CausesSectionProps {
  campaigns: Campaign[];
  onDonateToCampaign: (campaignId: string) => void;
  onOpenFieldReport: (campaign: Campaign) => void;
}

const CATEGORIES: { id: CauseCategory; labelKey: string }[] = [
  { id: 'all', labelKey: 'causes.cat.all' },
  { id: 'water', labelKey: 'causes.cat.water' },
  { id: 'medical', labelKey: 'causes.cat.medical' },
  { id: 'crisis', labelKey: 'causes.cat.crisis' },
  { id: 'ecology', labelKey: 'causes.cat.ecology' },
  { id: 'education', labelKey: 'causes.cat.education' }
];

export const CausesSection: React.FC<CausesSectionProps> = ({
  campaigns,
  onDonateToCampaign,
  onOpenFieldReport
}) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<CauseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.section
      id="causes"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 lg:py-24 border-b border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-2">
              {t('causes.kicker')}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-stone-900 tracking-tight">
              {t('causes.title')}
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md">
            {t('causes.subtitle')}
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-5 border-b border-stone-200">
          {/* Category Tabs: Segmented Control */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {t(cat.labelKey)}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t('causes.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white rounded-md border border-stone-200 focus:outline-hidden focus:border-stone-400 text-stone-900 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Campaign Cards Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
            <p className="text-stone-600 text-sm">
              {language === 'hi' ? 'आपके खोज मानदंडों से कोई अभियान मेल नहीं खाता।' : 'No campaigns match your selected criteria.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-semibold text-stone-900 underline cursor-pointer"
            >
              {language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <CauseCard
                key={campaign.id}
                campaign={campaign}
                onDonate={onDonateToCampaign}
                onOpenFieldReport={onOpenFieldReport}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};
