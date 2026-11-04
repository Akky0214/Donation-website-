import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onSubscribe?: (data: {
    email: string;
    source: string;
    preferredFrequency: 'weekly_dispatch' | 'monthly_impact' | 'critical_alerts';
  }) => { success: boolean; message: string; isExisting?: boolean };
}

export const Footer: React.FC<FooterProps> = ({ onSubscribe }) => {
  const { language, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      if (onSubscribe) {
        onSubscribe({
          email: email.trim().toLowerCase(),
          source: 'Footer Field Dispatch Form',
          preferredFrequency: 'weekly_dispatch'
        });
      }
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-stone-800">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-5">
            <span className="text-xl font-serif font-medium text-white tracking-tight flex items-center gap-1.5">
              <span>{t('brand.title')}</span>
              <span className="text-xs font-mono text-stone-400">{t('brand.tagline')}</span>
            </span>
            <p className="mt-4 text-sm text-stone-400 leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            <div className="mt-6 text-xs font-mono text-stone-500 space-y-1">
              <div>{t('footer.exemption')}</div>
            </div>
          </div>

          {/* Quick Nav Columns */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-4">
              {t('footer.focus_title')}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a href="#causes" className="hover:text-white transition-colors">
                  {language === 'hi' ? 'सौर गहरा भूजल बोरवेल' : 'Solar Groundwater Deep Borewells'}
                </a>
              </li>
              <li>
                <a href="#causes" className="hover:text-white transition-colors">
                  {language === 'hi' ? 'जनजातीय मोबाइल नवजात आईसीयू' : 'Mobile Tribal Neonatal ICUs'}
                </a>
              </li>
              <li>
                <a href="#causes" className="hover:text-white transition-colors">
                  {language === 'hi' ? 'पश्चिमी घाट वर्षावन गलियारा' : 'Western Ghats Rainforest Corridors'}
                </a>
              </li>
              <li>
                <a href="#causes" className="hover:text-white transition-colors">
                  {language === 'hi' ? 'मानसून बाढ़ राहत व नौकाएं' : 'Monsoon Flood Triage & Skiffs'}
                </a>
              </li>
              <li>
                <a href="#causes" className="hover:text-white transition-colors">
                  {language === 'hi' ? 'ग्रामीण बालिका स्टेम व कोडिंग लैब' : 'Rural Girls STEM & Coding Labs'}
                </a>
              </li>
            </ul>
          </div>

          {/* Field Dispatch Bulletin */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-2">
              {language === 'hi' ? 'अग्रिम फील्ड बुलेटिन' : 'Frontline Field Dispatches'}
            </h4>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              {language === 'hi'
                ? 'पाक्षिक सत्यापित तस्वीरें, जल शोधन आंकड़े और स्वतंत्र चार्टर्ड अकाउंटेंट ऑडिट रिपोर्ट।'
                : 'Bi-weekly verified photographic field logs, water volume statistics, and independent audit summaries.'}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="donor@organization.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-xs py-2 px-3 bg-stone-800 border border-stone-700 rounded-md text-white placeholder:text-stone-500 focus:outline-hidden focus:border-stone-500 font-mono"
                />
                <button
                  type="submit"
                  className="py-2 px-3 bg-stone-100 hover:bg-white text-stone-900 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{language === 'hi' ? 'नामांकित' : 'Enrolled'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'सदस्य बनें' : 'Subscribe'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
              <span className="text-[11px] text-stone-500 block">
                {language === 'hi' ? 'सख्त दाता गोपनीयता नीति। कोई प्रचार नहीं।' : 'Strict donor privacy charter. Zero marketing spam.'}
              </span>
            </form>
          </div>
        </div>

        {/* Bottom Legal / Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-mono">
          <div>
            {t('footer.copyright')}
          </div>
          <div className="flex items-center gap-6">
            <a href="#transparency" className="hover:text-stone-300 transition-colors">
              {language === 'hi' ? 'फॉर्म 10BD सार्वजनिक रिटर्न' : 'Form 10BD Public Returns'}
            </a>
            <span aria-hidden="true">·</span>
            <a href="#transparency" className="hover:text-stone-300 transition-colors">
              {language === 'hi' ? 'वैधानिक सीए ऑडिट' : 'Statutory CA Audit'}
            </a>
            <span aria-hidden="true">·</span>
            <span className="text-stone-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>256-Bit Escrow Vault</span>
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
