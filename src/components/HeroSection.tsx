import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { CauseArtwork } from './CauseArtwork';
import { DonationFrequency } from '../types/donation';

interface HeroSectionProps {
  onStartDonation: (amount: number, frequency: DonationFrequency, campaignId?: string) => void;
}

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const IMPACT_TRANSLATIONS: Record<number, string> = {
  500: 'Supplies 1 month of sterile wound dressings & pediatric antibiotics for 6 rural infants',
  1000: 'Delivers 2,500 litres of pure drinking water via solar deep-well reverse osmosis units',
  2500: 'Funds emergency flood relief dry ration kits & solar emergency beacons for 2 displaced families',
  5000: 'Equips a mobile all-terrain tribal ambulance with neonatal incubators & emergency oxygen tanks',
  10000: 'Provides solar laboratory workstations, digital coding tablets, and science apparatus for 4 girls'
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartDonation }) => {
  const [frequency, setFrequency] = useState<DonationFrequency>('once');
  const [selectedAmount, setSelectedAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const getDynamicImpact = (amount: number): string => {
    if (IMPACT_TRANSLATIONS[amount]) return IMPACT_TRANSLATIONS[amount];
    if (amount <= 750) return 'Provides sterile medical packs and emergency water purification tablets for village clinics.';
    if (amount <= 2000) return 'Supplies clean groundwater infrastructure and regular solar pump maintenance.';
    if (amount <= 4000) return 'Equips two displaced families with emergency shelter and thermal flood survival gear.';
    if (amount <= 8000) return 'Operates mobile trauma neonatal ICU ambulance patrols across remote tribal areas.';
    return 'Funds comprehensive community-scale reverse osmosis plants and girl child science laboratories.';
  };

  const handleSelectPreset = (amt: number) => {
    setSelectedAmount(amt);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    setIsCustom(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = isCustom ? Number(customAmount) : selectedAmount;
    if (finalAmount > 0) {
      onStartDonation(finalAmount, frequency);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative pt-8 pb-16 lg:pt-14 lg:pb-20 border-b border-stone-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Institutional Kicker (unboxed metadata, no pill badge) */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-widest uppercase text-stone-500 mb-4"
        >
          <span>Registered Indian Charitable Trust</span>
          <span aria-hidden="true">·</span>
          <span>Section 80G Tax Exemption (Form 10BE)</span>
          <span aria-hidden="true">·</span>
          <span>Trust PAN: AAATK9412F</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
            <Lock className="w-3 h-3" /> 256-Bit SSL Secured
          </span>
        </motion.div>

        {/* 2-Column Split: Editorial Mission + Express Giving Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Manifesto & Lead Photo */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 tracking-tight leading-[1.15] text-balance">
                Direct, audited capital deployment for human relief and ecological preservation.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
                We connect conscientious donors directly to audited frontline rural initiatives.
                Zero intermediary commissions. Cryptographic transaction logs. 88.6% of every
                Rupee is directly converted into solar deep borewells, neonatal medical ICU ambulances, and crisis relief.
              </p>
            </div>

            {/* Visual Anchor: Featured Relief Photo with Motion subtle hover */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="mt-8 relative rounded-xl overflow-hidden border border-stone-200 shadow-sm aspect-[16/9]"
            >
              <CauseArtwork
                theme="water"
                imageUrl="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1400&q=85"
                imageAlt="Clean potable drinking water pouring steadily from solar groundwater borehole well in Barmer, Rajasthan"
                className="w-full h-full"
                badgeText="FIELD AUDIT · BARMER, RAJASTHAN"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end p-5">
                <div className="text-white">
                  <p className="text-xs font-mono uppercase tracking-wider text-amber-300">Live Field Deployment</p>
                  <p className="text-sm font-medium mt-0.5 text-stone-100">
                    Solar deep-aquifer borewells delivering 60,000L daily across drought-prone villages in Barmer.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: High-Intent Express Giving Box with Motion */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div>
                {/* Header of giving box */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
                  <div>
                    <h2 className="text-lg font-serif font-semibold text-stone-900">Make an Immediate Contribution</h2>
                    <p className="text-xs text-stone-500 mt-0.5">Instant Section 80G Tax Exemption Certificate</p>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>2X Match Active</span>
                  </motion.div>
                </div>

                {/* Frequency Selector: Segmented Button Control */}
                <div className="p-1 bg-stone-100 rounded-lg flex items-center mb-6">
                  <button
                    type="button"
                    onClick={() => setFrequency('once')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      frequency === 'once'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    One-Time Seva
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      frequency === 'monthly'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Monthly Sankalpa</span>
                  </button>
                </div>

                {/* Amount Presets in INR */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-2.5">
                    Select Contribution Amount (INR ₹)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS.map((amt) => {
                      const active = !isCustom && selectedAmount === amt;
                      return (
                        <motion.button
                          key={amt}
                          type="button"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectPreset(amt)}
                          className={`py-3 px-2 rounded-lg border text-sm font-semibold tabular-nums transition-all cursor-pointer ${
                            active
                              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                              : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          ₹{amt.toLocaleString('en-IN')}
                        </motion.button>
                      );
                    })}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Custom ₹"
                        value={customAmount}
                        onChange={handleCustomChange}
                        onFocus={() => setIsCustom(true)}
                        className={`w-full h-full py-3 pl-6 pr-2 rounded-lg border text-sm font-semibold tabular-nums transition-all focus:outline-hidden ${
                          isCustom
                            ? 'bg-stone-900 text-white border-stone-900 placeholder:text-stone-400'
                            : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100 placeholder:text-stone-500'
                        }`}
                      />
                      <span className={`absolute left-2.5 top-3.5 text-xs font-bold ${isCustom ? 'text-stone-300' : 'text-stone-400'}`}>
                        ₹
                      </span>
                    </div>
                  </div>
                </div>

                {/* Real-world Impact Translation Box */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentAmount}-${frequency}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3.5 mb-6"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <p className="text-xs text-stone-800 leading-relaxed">
                        <strong className="font-semibold text-stone-900">
                          ₹{currentAmount > 0 ? currentAmount.toLocaleString('en-IN') : 0} {frequency === 'monthly' ? '/ month' : ''}:
                        </strong>{' '}
                        {getDynamicImpact(currentAmount)}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Actions */}
              <div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleSubmit}
                  disabled={currentAmount <= 0}
                  className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                >
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400/40" />
                  <span>
                    Proceed with ₹{currentAmount > 0 ? currentAmount.toLocaleString('en-IN') : 0}{' '}
                    {frequency === 'monthly' ? 'Monthly Pledge' : 'Gift'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </motion.button>

                <div className="mt-3.5 flex items-center justify-center gap-4 text-xs text-stone-500">
                  <span>Instant 80G Tax Receipt</span>
                  <span aria-hidden="true">·</span>
                  <span>UPI / Cards / NetBanking</span>
                  <span aria-hidden="true">·</span>
                  <span>256-Bit Encrypted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Operational Utility Ribbon below hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 pt-6 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-700"
        >
          <div>
            <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">88.6%</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider mt-0.5">Direct Field Deployment</div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">₹12.4 Cr</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider mt-0.5">Deployed to Frontlines</div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">1.8M+</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider mt-0.5">Rural Lives Impacted</div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">50% / 100%</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider mt-0.5">Section 80G Tax Exemption</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
