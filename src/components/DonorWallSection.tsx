import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DonorWallEntry } from '../types/donation';
import { Heart, MessageSquareHeart } from 'lucide-react';

interface DonorWallSectionProps {
  entries: DonorWallEntry[];
  onDonateWithTribute: () => void;
}

export const DonorWallSection: React.FC<DonorWallSectionProps> = ({
  entries,
  onDonateWithTribute
}) => {
  const [filter, setFilter] = useState<'all' | 'tributes' | 'monthly'>('all');

  const filteredEntries = entries.filter((e) => {
    if (filter === 'tributes') return Boolean(e.tributeType && e.tributeName);
    if (filter === 'monthly') return e.frequency === 'monthly';
    return true;
  });

  return (
    <motion.section
      id="donor-wall"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 lg:py-24 border-b border-stone-200 bg-stone-50/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-2">
              Collective Seva & Solidarity
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-stone-900 tracking-tight">
              Live Donor Wall & Memorial Tributes
            </h2>
            <p className="mt-2 text-sm text-stone-600 max-w-xl">
              Every contribution carries a personal blessing. View recent verified offerings and dedications across the nation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onDonateWithTribute}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
              <span>Make a Dedication Seva</span>
            </motion.button>
          </div>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            All Offerings ({entries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('tributes')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'tributes'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            Memorials & Dedications
          </button>
          <button
            type="button"
            onClick={() => setFilter('monthly')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'monthly'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            Monthly Sankalpa
          </button>
        </div>

        {/* Cards Grid with Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-stone-300 transition-all"
            >
              <div>
                {/* Top: Donor Name + Amount in INR */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">
                      {entry.donorName}
                    </h4>
                    <div className="text-xs text-stone-500 font-mono mt-0.5">
                      {entry.timestamp}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-serif font-bold text-stone-900 tabular-nums">
                      ₹{entry.amount.toLocaleString('en-IN')}
                    </span>
                    {entry.frequency === 'monthly' && (
                      <span className="text-[11px] block text-stone-500 font-sans">
                        / month
                      </span>
                    )}
                  </div>
                </div>

                {/* Tribute badge/indicator if present */}
                {entry.tributeType && entry.tributeName && (
                  <div className="mb-3 text-xs bg-amber-50 text-amber-900 border border-amber-200/60 rounded-md p-2 flex items-start gap-2">
                    <MessageSquareHeart className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">
                        {entry.tributeType === 'in_memory' ? 'In memory of ' : 'In honor of '}
                      </span>
                      <span>{entry.tributeName}</span>
                    </div>
                  </div>
                )}

                {/* Message */}
                {entry.message && (
                  <p className="text-xs text-stone-600 italic leading-relaxed">
                    "{entry.message}"
                  </p>
                )}
              </div>

              {/* Bottom: Campaign Target */}
              <div className="mt-5 pt-3 border-t border-stone-100 text-[11px] font-mono text-stone-500 truncate">
                Directed to: <span className="text-stone-700 font-medium">{entry.campaignTitle}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
