import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DonationFrequency } from '../types/donation';
import { Droplet, Activity, Trees, Package, BookOpen, ArrowRight } from 'lucide-react';

interface ImpactCalculatorProps {
  onDonateFromCalculator: (amount: number, frequency: DonationFrequency) => void;
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ onDonateFromCalculator }) => {
  const [sliderAmount, setSliderAmount] = useState<number>(2500);
  const [frequency, setFrequency] = useState<DonationFrequency>('monthly');

  const effectiveAnnualAmount = frequency === 'monthly' ? sliderAmount * 12 : sliderAmount;

  // Tangible multipliers based on audited procurement costs in INR (₹)
  const waterLitres = Math.round(effectiveAnnualAmount * 12); // ₹1 = 12 Litres of solar sweet-well RO water
  const antibioticCourses = Math.round(effectiveAnnualAmount / 90); // ₹90 = 1 full pediatric course
  const forestAcres = (effectiveAnnualAmount / 3000).toFixed(1); // ₹3,000 = 1 acre conservation easement
  const emergencyMeals = Math.round(effectiveAnnualAmount / 35); // ₹35 = 1 fortified flood ration meal
  const labKits = Math.round(effectiveAnnualAmount / 1500); // ₹1,500 = 1 STEM lab apparatus set

  return (
    <motion.section
      id="impact-calculator"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 lg:py-24 bg-[#F5F2EB] border-b border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-2">
            Resource Translation Matrix
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-stone-900 tracking-tight">
            Calculate your tangible field yield in Rupees
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600">
            See exactly how your tax-deductible Rupees translate into audited physical outputs over 12 months.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs"
        >
          {/* Controls: Frequency & Slider */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-100">
            {/* Frequency Toggle */}
            <div className="p-1 bg-stone-100 rounded-lg flex items-center w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  frequency === 'monthly'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Monthly Sankalpa
              </button>
              <button
                type="button"
                onClick={() => setFrequency('once')}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  frequency === 'once'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                One-Time Seva
              </button>
            </div>

            {/* Current Amount Display in Rupees */}
            <div className="text-center sm:text-right">
              <span className="text-xs text-stone-500 uppercase tracking-wider block">Contribution Level</span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tabular-nums">
                ₹{sliderAmount.toLocaleString('en-IN')}
                <span className="text-sm font-sans font-normal text-stone-500">
                  {frequency === 'monthly' ? ' / month' : ' one-time'}
                </span>
              </div>
              {frequency === 'monthly' && (
                <span className="text-xs font-mono text-stone-500">
                  (₹{effectiveAnnualAmount.toLocaleString('en-IN')} deployed annually)
                </span>
              )}
            </div>
          </div>

          {/* Slider */}
          <div className="py-8">
            <div className="flex justify-between text-xs text-stone-500 font-mono mb-2">
              <span>₹500</span>
              <span>₹2,500</span>
              <span>₹10,000</span>
              <span>₹25,000</span>
              <span>₹50,000</span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="250"
              value={sliderAmount}
              onChange={(e) => setSliderAmount(Number(e.target.value))}
              className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900 focus:outline-hidden"
            />
          </div>

          {/* Tangible Metrics Matrix with Motion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 pb-8">
            <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
              <div className="flex items-center gap-2 text-sky-700 mb-2">
                <Droplet className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-wider">Potable Sweet Water</span>
              </div>
              <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                {waterLitres.toLocaleString('en-IN')} L
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Solar aquifer purification delivering clean drinking water to village households.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
              <div className="flex items-center gap-2 text-rose-700 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-wider">Pediatric Neonatal Care</span>
              </div>
              <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                {antibioticCourses.toLocaleString('en-IN')} Treatments
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Sterile antibiotic treatments & infant resuscitations in tribal mobile ICUs.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
              <div className="flex items-center gap-2 text-emerald-800 mb-2">
                <Trees className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-wider">Western Ghats Canopy</span>
              </div>
              <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                {forestAcres} Acres
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Perpetual conservation corridor under indigenous tribal wardens.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <Package className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-wider">Disaster Dry Rations</span>
              </div>
              <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                {emergencyMeals.toLocaleString('en-IN')} Meals
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Fortified survival emergency meal kits distributed during flood emergencies.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-wider">Girls STEM Kits</span>
              </div>
              <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                {labKits.toLocaleString('en-IN')} Kits
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Robotics microcontrollers and NCERT digital tablet labs in rural schools.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-900 text-stone-100 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                  Section 80G Tax Benefit
                </span>
                <div className="text-2xl font-serif font-bold text-white tabular-nums mt-1">
                  ₹{effectiveAnnualAmount.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  50% tax deduction under Section 80G with automatic Form 10BE certificate.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onDonateFromCalculator(sliderAmount, frequency)}
                className="mt-4 w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Commit This Impact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
