import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DonationFrequency } from '../types/donation';
import { Droplet, Activity, Trees, Package, BookOpen, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ImpactCalculatorProps {
  onDonateFromCalculator: (amount: number, frequency: DonationFrequency) => void;
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ onDonateFromCalculator }) => {
  const { language, t } = useLanguage();
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
            {t('impact.kicker')}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-stone-900 tracking-tight">
            {t('impact.title')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600">
            {t('impact.subtitle')}
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
                {t('impact.monthly')}
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
                {t('impact.once')}
              </button>
            </div>

            {/* Current Amount Display */}
            <div className="text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
              <span className="text-xs text-stone-500 font-mono uppercase tracking-wider">
                {t('impact.your_gift')}
              </span>
              <div className="text-3xl font-serif font-bold text-stone-900 tabular-nums">
                ₹{sliderAmount.toLocaleString('en-IN')}
                <span className="text-sm font-sans font-normal text-stone-500 ml-1">
                  {frequency === 'monthly' ? (language === 'hi' ? '/ माह' : '/ month') : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="py-8 border-b border-stone-100">
            <input
              type="range"
              min="500"
              max="25000"
              step="500"
              value={sliderAmount}
              onChange={(e) => setSliderAmount(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
            />
            <div className="flex justify-between text-xs font-mono text-stone-400 mt-2">
              <span>₹500</span>
              <span>₹5,000</span>
              <span>₹10,000</span>
              <span>₹15,000</span>
              <span>₹25,000</span>
            </div>
            <p className="text-center text-xs text-stone-500 mt-3 font-mono">
              {t('impact.slider_help')}
            </p>
          </div>

          {/* Tangible Yield Outputs Grid */}
          <div className="pt-8">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-6 text-center">
              {t('impact.annual_basis')}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
                <div className="flex items-center gap-2 text-sky-700 mb-2">
                  <Droplet className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider">
                    {language === 'hi' ? 'शुद्ध पेयजल' : 'Potable Sweet Water'}
                  </span>
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                  {waterLitres.toLocaleString('en-IN')} L
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {language === 'hi' ? 'ग्रामीण परिवारों के लिए सौर जल शोधन संयंत्रों द्वारा आपूर्ति।' : 'Solar aquifer purification delivering clean drinking water to village households.'}
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
                <div className="flex items-center gap-2 text-rose-700 mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider">
                    {language === 'hi' ? 'शिशु आईसीयू देखभाल' : 'Pediatric Neonatal Care'}
                  </span>
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                  {antibioticCourses.toLocaleString('en-IN')} {language === 'hi' ? 'उपचार' : 'Treatments'}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {language === 'hi' ? 'जनजातीय मोबाइल आईसीयू में स्टेराइल एंटीबायोटिक व शिशु जीवन रक्षा।' : 'Sterile antibiotic treatments & infant resuscitations in tribal mobile ICUs.'}
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
                <div className="flex items-center gap-2 text-emerald-800 mb-2">
                  <Trees className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider">
                    {language === 'hi' ? 'पश्चिमी घाट वन क्षेत्र' : 'Western Ghats Canopy'}
                  </span>
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                  {forestAcres} {language === 'hi' ? 'एकड़' : 'Acres'}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {language === 'hi' ? 'आदिवासी टोडा व कुरुम्बा संरक्षकों के अधीन शोला वन गलियारा।' : 'Perpetual conservation corridor under indigenous tribal wardens.'}
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
                <div className="flex items-center gap-2 text-amber-700 mb-2">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider">
                    {language === 'hi' ? 'आपदा सूखा राशन' : 'Disaster Dry Rations'}
                  </span>
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                  {emergencyMeals.toLocaleString('en-IN')} {language === 'hi' ? 'भोजन किट' : 'Meals'}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {language === 'hi' ? 'बाढ़ विस्थापितों हेतु पौष्टिक सूखा राशन और जीवन रक्षक गोलियां।' : 'Fortified survival emergency meal kits distributed during flood emergencies.'}
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider">
                    {language === 'hi' ? 'बालिका स्टेम प्रयोगशाला' : 'Girls STEM Kits'}
                  </span>
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                  {labKits.toLocaleString('en-IN')} {language === 'hi' ? 'किट' : 'Kits'}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {language === 'hi' ? 'ग्रामीण स्कूलों में रोबोटिक्स और एनसीईआरटी द्विभाषी डिजिटल टैबलेट।' : 'Robotics microcontrollers and NCERT digital tablet labs in rural schools.'}
                </p>
              </motion.div>

              {/* Direct Commitment CTA Box */}
              <motion.div
                whileHover={{ y: -2 }}
                className="p-4 rounded-lg bg-stone-900 text-white flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                    {language === 'hi' ? 'धारा 80G कर छूट' : 'Tax Deduction (80G)'}
                  </div>
                  <div className="text-xs text-stone-300 mt-1">
                    {language === 'hi' ? '50% कर कटौती व तुरंत फॉर्म 10BE प्रमाण पत्र।' : '50% tax deduction eligibility with immediate Form 10BE generation.'}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onDonateFromCalculator(sliderAmount, frequency)}
                  className="mt-4 w-full py-2 px-3 bg-white hover:bg-stone-100 text-stone-900 font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>{t('impact.commit_btn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
