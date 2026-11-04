import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  CheckCircle2,
  ShieldCheck,
  Send,
  Sparkles,
  FileText,
  Bell,
  HeartHandshake,
  Droplets,
  Stethoscope,
  TreePine,
  LifeBuoy,
  GraduationCap
} from 'lucide-react';
import { NewsletterSubscriber } from '../types/donation';
import { useLanguage } from '../context/LanguageContext';

interface NewsletterSignupProps {
  onSubscribe: (data: {
    email: string;
    name?: string;
    source: string;
    preferredFrequency: 'weekly_dispatch' | 'monthly_impact' | 'critical_alerts';
    interests?: string[];
  }) => { success: boolean; message: string; isExisting?: boolean; subscriberId?: string };
  totalSubscribers?: number;
}

const getInterestOptions = (isHi: boolean) => [
  { id: 'water', label: isHi ? 'ग्रामीण बोरवेल व नल' : 'Rural Borewells', icon: Droplets },
  { id: 'medical', label: isHi ? 'बाल चिकित्सा आईसीयू' : 'Pediatric ICUs', icon: Stethoscope },
  { id: 'ecology', label: isHi ? 'पश्चिमी घाट संरक्षण' : 'Western Ghats', icon: TreePine },
  { id: 'crisis', label: isHi ? 'बाढ़ राहत व बचाव' : 'Flood Triage', icon: LifeBuoy },
  { id: 'education', label: isHi ? 'बालिका एसटीईएम' : 'Girls STEM', icon: GraduationCap }
];

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  onSubscribe,
  totalSubscribers = 1248
}) => {
  const { t, language } = useLanguage();
  const isHi = language === 'hi';
  const interestOptions = getInterestOptions(isHi);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'weekly_dispatch' | 'monthly_impact' | 'critical_alerts'>('weekly_dispatch');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['water', 'medical']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    email: string;
    subscriberId: string;
    isExisting?: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError(isHi ? 'कृपया एक मान्य ईमेल पता दर्ज करें (उदा. name@domain.in)' : 'Please provide a valid email address (e.g. name@domain.in)');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = onSubscribe({
        email: trimmedEmail,
        name: name.trim() || undefined,
        source: 'Interactive Homepage Newsletter Widget',
        preferredFrequency: frequency,
        interests: selectedInterests.length > 0 ? selectedInterests : ['general']
      });

      setIsSubmitting(false);

      if (result.success) {
        setSubmittedData({
          email: trimmedEmail,
          subscriberId: result.subscriberId || `KH-SUB-${Math.floor(1000 + Math.random() * 9000)}`,
          isExisting: result.isExisting
        });
      } else {
        setError(result.message || (isHi ? 'सदस्यता लेने में असमर्थ। कृपया पुनः प्रयास करें।' : 'Unable to subscribe. Please try again.'));
      }
    }, 450);
  };

  const handleReset = () => {
    setEmail('');
    setName('');
    setSubmittedData(null);
    setError(null);
  };

  return (
    <motion.section
      id="newsletter"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white relative overflow-hidden border-t border-b border-stone-800"
    >
      {/* Background ambient subtle grid & glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial & Trust Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/80 border border-stone-700/80 text-amber-300 text-xs font-mono">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('newsletter.badge')}</span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-stone-100 tracking-tight leading-tight">
                {t('newsletter.title')}
              </h2>
              <p className="mt-3 text-stone-300 text-sm leading-relaxed">
                {t('newsletter.subtitle')}
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-stone-400">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-950/70 border border-emerald-800/80 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-stone-200 font-medium">
                    {isHi ? 'शून्य प्रचार व विज्ञापन: ' : 'Zero Promotional Noise: '}
                  </span>
                  {isHi ? 'केवल न्यासियों और फील्ड टीमों द्वारा लिखित सत्यापित फील्ड लॉग।' : 'Strictly operational field logs authored by trustees and field teams.'}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-amber-950/70 border border-amber-800/80 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-stone-200 font-medium">
                    {isHi ? 'फॉर्म 10BD व 80G स्मरण: ' : 'Form 10BD & 80G Reminders: '}
                  </span>
                  {isHi ? 'वार्षिक आयकर कटौती प्रमाण पत्र तैयार होते ही अग्रिम सूचना।' : 'Advance notification when annual tax deduction certificates are ready to download.'}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 mt-0.5 text-stone-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-stone-200 font-medium">
                    {isHi ? 'गोपनीयता चार्टर: ' : 'Privacy Charter: '}
                  </span>
                  {isHi ? 'हम कभी दानदाता सूची नहीं बेचते। किसी भी समय एक क्लिक में अनसब्सक्राइब करें।' : 'We never sell donor lists or deploy third-party trackers. Unsubscribe at any click.'}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 text-xs font-mono text-stone-400">
              <div className="flex -space-x-2">
                <span className="inline-block w-7 h-7 rounded-full bg-amber-600 border-2 border-stone-900 text-[10px] font-bold text-center leading-6 text-white">LG</span>
                <span className="inline-block w-7 h-7 rounded-full bg-emerald-600 border-2 border-stone-900 text-[10px] font-bold text-center leading-6 text-white">BK</span>
                <span className="inline-block w-7 h-7 rounded-full bg-blue-600 border-2 border-stone-900 text-[10px] font-bold text-center leading-6 text-white">AS</span>
              </div>
              <div>
                Joined by <strong className="text-white font-mono">{totalSubscribers.toLocaleString('en-IN')}</strong> patron trustees & citizens
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Subscription Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
              <AnimatePresence mode="wait">
                {submittedData ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-8 text-center space-y-5"
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border border-emerald-700/80 flex items-center justify-center text-emerald-400">
                      <Sparkles className="w-7 h-7" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-serif font-medium text-white">
                        {submittedData.isExisting ? 'Subscription Preferences Updated!' : 'Welcome to Kindred Horizons Dispatches!'}
                      </h3>
                      <p className="mt-2 text-stone-300 text-sm max-w-md mx-auto">
                        {submittedData.isExisting
                          ? `We've refreshed your dispatch frequency for ${submittedData.email}.`
                          : `A confirmation receipt and our latest Q3 Water Security Briefing have been dispatched to ${submittedData.email}.`}
                      </p>
                    </div>

                    <div className="inline-block bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs font-mono text-stone-300">
                      <span>Dispatch Subscriber Token: </span>
                      <strong className="text-amber-300">{submittedData.subscriberId}</strong>
                    </div>

                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs font-mono text-stone-400 hover:text-white underline cursor-pointer"
                      >
                        Subscribe another email address or edit preferences
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between border-b border-stone-800/80 pb-4">
                      <div>
                        <h3 className="text-lg font-serif font-medium text-white">
                          {isHi ? 'ज़मीनी अपडेट्स हेतु पंजीकरण' : 'Enroll for Field Updates'}
                        </h3>
                        <p className="text-xs text-stone-400">
                          {isHi ? 'किंडरेड होराइजन्स ट्रस्ट का आधिकारिक संवाद चैनल' : 'Official communication channel of Kindred Horizons Trust'}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-400">
                        {isHi ? 'धारा 80G प्रमाणित' : 'Section 80G Certified'}
                      </span>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-950/50 border border-red-800/70 rounded-xl text-red-200 text-xs">
                        {error}
                      </div>
                    )}

                    {/* Email & Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-mono text-stone-400 mb-1.5">
                          {isHi ? 'आपका ईमेल पता' : 'Your Email Address'} <span className="text-amber-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder="you@domain.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-stone-900/90 border border-stone-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-stone-500 focus:outline-hidden focus:border-amber-400 font-mono"
                          />
                          <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-stone-400 mb-1.5">
                          {isHi ? 'पूरा नाम (वैकल्पिक)' : 'Full Name (Optional)'}
                        </label>
                        <input
                          type="text"
                          placeholder={isHi ? 'उदा. रामेश्वर जोशी' : 'e.g. Rameshwar Joshi'}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-stone-900/90 border border-stone-700 rounded-xl py-2.5 px-3 text-sm text-white placeholder:text-stone-500 focus:outline-hidden focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Dispatch Frequency Selector */}
                    <div>
                      <label className="block text-xs font-mono text-stone-400 mb-2">
                        {isHi ? 'अपडेट प्राप्ति अंतराल' : 'Preferred Dispatch Cadence'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'weekly_dispatch', label: t('newsletter.freq.weekly'), desc: isHi ? 'तस्वीरें व टेलीमेट्री' : 'Photos & telemetry' },
                          { id: 'monthly_impact', label: t('newsletter.freq.monthly'), desc: isHi ? 'ऑडिटेड वित्तीय रिपोर्ट' : 'Audited financials' },
                          { id: 'critical_alerts', label: t('newsletter.freq.urgent'), desc: isHi ? '2x मैच आपातकालीन राहत' : '2x match flood triage' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setFrequency(item.id as any)}
                            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                              frequency === item.id
                                ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm'
                                : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                            }`}
                          >
                            <div className="text-xs font-semibold">{item.label}</div>
                            <div className="text-[10px] text-stone-400 font-mono mt-0.5">{item.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Causes of Interest Pills */}
                    <div>
                      <label className="block text-xs font-mono text-stone-400 mb-2">
                        {isHi ? 'प्राथमिक सेवा क्षेत्र' : 'Specific Causes to Highlight'}
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {interestOptions.map((opt) => {
                          const isSelected = selectedInterests.includes(opt.id);
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => toggleInterest(opt.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
                                isSelected
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-medium'
                                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                            <span>{isHi ? 'पंजीकरण हो रहा है...' : 'Enrolling in Dispatch Vault...'}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{t('newsletter.btn_subscribe')}</span>
                          </>
                        )}
                      </button>
                      <p className="text-[11px] text-stone-500 text-center mt-2 font-mono">
                        {isHi ? 'सीधे इनबॉक्स में प्रेषण · कभी भी 1 क्लिक में रद्द करें · फॉर्म 10BD अनुपालक' : 'Instant delivery to inbox · Unsubscribe anytime with 1 click · Form 10BD compliant'}
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
};
