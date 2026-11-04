import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Brand & Header
  'brand.title': { en: 'Kindred Horizons', hi: 'किंडरेड होराइजन्स' },
  'brand.trust': { en: 'Trust', hi: 'न्यास' },
  'brand.tagline': { en: 'Public Charitable Trust', hi: 'पब्लिक चैरिटेबल ट्रस्ट' },

  // Nav Items
  'nav.causes': { en: 'Active Causes', hi: 'सक्रिय अभियान' },
  'nav.live_feed': { en: 'Live Feed', hi: 'लाइव अपडेट्स' },
  'nav.field_map': { en: 'Field Map', hi: 'ज़मीनी नक्शा' },
  'nav.impact_calculator': { en: 'Impact Calculator', hi: 'प्रभाव कैलकुलेटर' },
  'nav.transparency': { en: 'Section 80G & Audits', hi: 'धारा 80G व ऑडिट' },
  'nav.donor_wall': { en: 'Donor Wall', hi: 'दानदाता सूची' },
  'nav.receipts': { en: '80G Receipts', hi: '80G रसीदें' },
  'nav.admin': { en: 'Admin Control', hi: 'व्यवस्थापक' },
  'nav.donate': { en: 'Donate in ₹', hi: 'दान करें (₹)' },

  // Mobile Drawer
  'mobile.sec80g_badge': { en: 'Sec 80G Certified Seva', hi: 'धारा 80G प्रमाणित सेवा' },
  'mobile.causes_desc': { en: 'Frontline water, medical ICU & crisis relief', hi: 'स्वच्छ जल, मेडिकल आईसीयू व संकट राहत' },
  'mobile.live_desc': { en: 'Real-time telemetry & verified operations', hi: 'रीयल-टाइम टेलीमेट्री व ज़मीनी प्रगति' },
  'mobile.map_desc': { en: 'GPS-verified borewells, ICU hubs & rescue barges', hi: 'जीपीएस-सत्यापित बोरवेल, एम्बुलेंस व नौकाएं' },
  'mobile.impact_desc': { en: 'Translate your Rupee giving into physical units', hi: 'अपने दान का सटीक ज़मीनी प्रभाव मापें' },
  'mobile.audit_desc': { en: 'Chartered Accountant reports & Form 10BD filings', hi: 'सीए ऑडिट रिपोर्ट व फॉर्म 10BD प्रमाण' },
  'mobile.donor_desc': { en: 'Public blessings, dedications & monthly patrons', hi: 'सामूहिक समर्पण, श्रद्धांजलि व मासिक संकल्प' },
  'mobile.receipts_desc': { en: 'Instant PDF / CSV download for personal ITR filing', hi: 'इनकम टैक्स रिटर्न हेतु तुरंत रसीद डाउनलोड' },
  'mobile.switch_lang': { en: 'Language / भाषा चुनें', hi: 'भाषा / Choose Language' },

  // Emergency Banner
  'emergency.active': { en: 'Emergency Response Active:', hi: 'आपातकालीन सहायता सक्रिय:' },
  'emergency.text': {
    en: 'All donations to the Coastal Flood Triage & Sahel Water projects are currently matched 2:1 by our philanthropic syndicate.',
    hi: 'तटीय बाढ़ राहत व थार पेयजल परियोजनाओं के लिए सभी दानों को हमारे दाता संघ द्वारा 2:1 के अनुपात में मैच किया जा रहा है।'
  },
  'emergency.cta': { en: 'Deploy Matched Gift', hi: 'मैच दान भेजें' },

  // Hero Section
  'hero.kicker.trust': { en: 'Registered Indian Charitable Trust', hi: 'पंजीकृत भारतीय धर्मार्थ न्यास' },
  'hero.kicker.80g': { en: 'Section 80G Tax Exemption (Form 10BE)', hi: 'धारा 80G कर छूट (फॉर्म 10BE)' },
  'hero.kicker.pan': { en: 'Trust PAN: AAATK9412F', hi: 'ट्रस्ट पैन: AAATK9412F' },
  'hero.kicker.ssl': { en: '256-Bit SSL Secured', hi: '256-बिट सुरक्षित' },
  'hero.title': {
    en: 'Direct, audited capital deployment for human relief and ecological preservation.',
    hi: 'मानव राहत और पर्यावरण संरक्षण के लिए प्रत्यक्ष, ऑडिट-सत्यापित पूंजी का वितरण।'
  },
  'hero.subtitle': {
    en: 'Kindred Horizons operates on a zero-intermediary escrow protocol. Every Rupee donated goes directly into verified field procurement in India — solar water infrastructure, mobile pediatric ICUs, and emergency flood triage.',
    hi: 'किंडरेड होराइजन्स बिना बिचौलियों के एस्क्रो मॉडल पर काम करता है। आपका प्रत्येक रुपया सीधे भारत के ज़मीनी कार्यों में जाता है — सौर पेयजल संयंत्र, मोबाइल बाल चिकित्सा आईसीयू और आपातकालीन बाढ़ राहत।'
  },
  'hero.form.title': { en: 'Express Seva Portal', hi: 'त्वरित सेवा पोर्टल' },
  'hero.form.subtitle': { en: 'Tax-Deductible Gift in INR', hi: 'आयकर छूट योग्य योगदान (₹)' },
  'hero.freq.once': { en: 'One-Time Offering', hi: 'एकमुश्त सेवा' },
  'hero.freq.monthly': { en: 'Monthly Sankalpa', hi: 'मासिक संकल्प' },
  'hero.amount.custom': { en: 'Custom ₹', hi: 'अन्य राशि ₹' },
  'hero.button.donate': { en: 'Proceed to Secure Authorization', hi: 'सुरक्षित दान प्रक्रिया आगे बढ़ाएं' },
  'hero.stats.disbursed': { en: 'Total Direct Aid Disbursed', hi: 'कुल प्रत्यक्ष वितरित सहायता' },
  'hero.stats.lives': { en: 'Rural Lives Impacted', hi: 'लाभान्वित ग्रामीण जीवन' },
  'hero.stats.tax': { en: 'Section 80G Tax Exemption', hi: 'धारा 80G आयकर छूट' },

  // Causes Section
  'causes.kicker': { en: 'Audited Field Initiatives', hi: 'सत्यापित ज़मीनी पहल' },
  'causes.title': { en: 'Direct-action campaigns currently seeking capital', hi: 'वर्तमान में सहायता चाह रहे प्रत्यक्ष अभियान' },
  'causes.subtitle': {
    en: 'Every initiative has an established frontline partner, verifiable GPS milestones, and a zero-loss allocation protocol.',
    hi: 'प्रत्येक पहल का एक स्थापित ज़मीनी साझेदार, जीपीएस मील के पत्थर और पूर्ण पारदर्शिता प्रोटोकॉल है।'
  },
  'causes.cat.all': { en: 'All Initiatives', hi: 'सभी अभियान' },
  'causes.cat.water': { en: 'Clean Water', hi: 'स्वच्छ जल' },
  'causes.cat.medical': { en: 'Medical Care', hi: 'चिकित्सा सेवा' },
  'causes.cat.crisis': { en: 'Crisis Relief', hi: 'आपदा राहत' },
  'causes.cat.ecology': { en: 'Ecology', hi: 'पर्यावरण' },
  'causes.cat.education': { en: 'Education', hi: 'शिक्षा' },
  'causes.search': { en: 'Search initiatives or locations...', hi: 'अभियान या स्थान खोजें...' },
  'causes.card.donate': { en: 'Donate Now', hi: 'अभी दान करें' },
  'causes.card.report': { en: 'Field Report', hi: 'फील्ड रिपोर्ट' },
  'causes.card.raised': { en: 'Raised of', hi: 'एकत्रित राशि' },
  'causes.card.donors': { en: 'donors', hi: 'दाता' },

  // Live Updates Section
  'live.kicker': { en: 'Live Frontline Operations Feed', hi: 'लाइव ज़मीनी गतिविधि फ़ीड' },
  'live.title': { en: 'Humanitarian Project Milestones', hi: 'मानवीय परियोजना मील के पत्थर' },
  'live.subtitle': {
    en: 'Continuous, timestamped field telemetry drawn directly from active campaigns across India.',
    hi: 'पूरे भारत के सक्रिय अभियानों से सीधे प्राप्त निरंतर व समय-अंकित ज़मीनी रिपोर्ट।'
  },
  'live.filter.all': { en: 'All Causes', hi: 'सभी कारण' },
  'live.filter.completed': { en: 'Completed', hi: 'सम्पन्न' },
  'live.filter.active': { en: 'In Progress', hi: 'प्रगति पर' },
  'live.pause': { en: 'Pause Stream', hi: 'रोकें' },
  'live.resume': { en: 'Resume Stream', hi: 'शुरू करें' },
  'live.verified_by': { en: 'Verified by', hi: 'सत्यापितकर्ता' },
  'live.support': { en: 'Support', hi: 'सहयोग करें' },

  // Impact Calculator
  'impact.kicker': { en: 'Resource Translation Matrix', hi: 'संसाधन प्रभाव गणना' },
  'impact.title': { en: 'Calculate your tangible field yield in Rupees', hi: 'रुपयों में अपने ठोस ज़मीनी प्रभाव की गणना करें' },
  'impact.subtitle': {
    en: 'See exactly how your tax-deductible Rupees translate into audited physical outputs over 12 months.',
    hi: 'देखें कि आपके दान का प्रत्येक रुपया 12 महीनों में किस प्रकार वास्तविक राहत में बदलता है।'
  },
  'impact.monthly': { en: 'Monthly Sankalpa', hi: 'मासिक संकल्प' },
  'impact.once': { en: 'One-Time Seva', hi: 'एकमुश्त सेवा' },
  'impact.your_gift': { en: 'Your Offering:', hi: 'आपकी सेवा राशि:' },
  'impact.slider_help': { en: 'Drag slider to adjust Rupee commitment', hi: 'राशि बदलने के लिए स्लाइडर खिसकाएं' },
  'impact.commit_btn': { en: 'Commit This Impact', hi: 'यह प्रभाव सुनिश्चित करें' },
  'impact.annual_basis': { en: 'Audited 12-Month Field Delivery Guarantee', hi: '12-महीने की ऑडिट-प्रमाणित ज़मीनी आपूर्ति गारंटी' },

  // Transparency & Map Section
  'transparency.kicker': { en: 'Governance & Statutory Integrity', hi: 'शासन व वैधानिक सत्यनिष्ठा' },
  'transparency.title': { en: 'Radical financial transparency, audited to the paisa', hi: 'पैसे-पैसे का हिसाब: पूर्ण वित्तीय पारदर्शिता' },
  'transparency.subtitle': {
    en: 'Every Rupee transferred from donor escrow into frontline procurement is audited by certified Chartered Accountants with annual Form 10BD/10BE filings.',
    hi: 'एस्क्रो खाते से ज़मीनी खरीद में जाने वाला प्रत्येक रुपया चार्टर्ड एकाउंटेंट द्वारा ऑडिट किया जाता है और वार्षिक फॉर्म 10BD/10BE दाखिल होता है।'
  },
  'transparency.allocation_title': { en: 'Audited Capital Allocation (FY 2025-2026)', hi: 'ऑडिटेड पूंजी आवंटन (वित्तीय वर्ष 2025-2026)' },
  'transparency.direct_field': { en: 'Direct Field Programs & Equipment (88.6%)', hi: 'प्रत्यक्ष ज़मीनी कार्यक्रम व उपकरण (88.6%)' },
  'transparency.logistics': { en: 'Field Logistics & Cold Chain (7.8%)', hi: 'ज़मीनी लॉजिस्टिक्स व कोल्ड चेन (7.8%)' },
  'transparency.governance': { en: 'Governance & Statutory Audit (3.6%)', hi: 'शासन व वैधानिक ऑडिट (3.6%)' },
  'transparency.map_kicker': { en: 'Geospatial Verification Registry', hi: 'भू-स्थानिक सत्यापन रजिस्ट्री' },
  'transparency.map_title': { en: 'Physical frontline stations & verified project coordinates', hi: 'भौतिक अग्रिम केंद्र व सत्यापित परियोजना निर्देशांक' },

  // Field Map
  'map.header': { en: 'High-Clarity Street & Project Map', hi: 'स्पष्ट सड़क व परियोजना ज़मीनी नक्शा' },
  'map.sub': {
    en: 'Trace every allocated Rupee to exact street addresses, highway coordinates, village water plants, mobile ICU routes, and river triage barges.',
    hi: 'आवंटित प्रत्येक रुपये को सटीक सड़क पते, राजमार्ग निर्देशांक, ग्राम जल संयंत्रों, मोबाइल आईसीयू और नदी नौकाओं तक ट्रैक करें।'
  },
  'map.layer.streets': { en: 'Clear Streets', hi: 'स्पष्ट सड़कें' },
  'map.layer.osm': { en: 'OSM Roads', hi: 'ओपनस्ट्रीटमैप' },
  'map.layer.satellite': { en: 'Satellite + Roads', hi: 'सैटेलाइट + सड़कें' },
  'map.zoom.street': { en: 'Street (14x)', hi: 'सड़क (14x)' },
  'map.zoom.district': { en: 'District (10x)', hi: 'जिला (10x)' },
  'map.zoom.india': { en: 'India (5x)', hi: 'भारत (5x)' },
  'map.zoom_to_site': { en: 'Zoom Street View (15x)', hi: 'सड़क स्तर पर देखें (15x)' },
  'map.google_maps': { en: 'Google Maps', hi: 'गूगल मैप्स' },
  'map.support_site': { en: 'Support This Site', hi: 'इस केंद्र को सहयोग दें' },

  // Donor Wall Section
  'donor_wall.kicker': { en: 'Collective Seva & Solidarity', hi: 'सामूहिक सेवा व एकजुटता' },
  'donor_wall.title': { en: 'Live Donor Wall & Memorial Tributes', hi: 'लाइव दानदाता दीवार व स्मृति समर्पण' },
  'donor_wall.subtitle': {
    en: 'Every contribution carries a personal blessing. View recent verified offerings and dedications across the nation.',
    hi: 'प्रत्येक दान में एक व्यक्तिगत आशीर्वाद निहित है। पूरे भारत से हाल ही में सत्यापित समर्पण देखें।'
  },
  'donor_wall.btn_tribute': { en: 'Make a Dedication Seva', hi: 'समर्पण सेवा करें' },
  'donor_wall.filter_all': { en: 'All Offerings', hi: 'सभी योगदान' },
  'donor_wall.filter_tributes': { en: 'Memorials & Dedications', hi: 'स्मृति व समर्पण' },
  'donor_wall.filter_monthly': { en: 'Monthly Sankalpa', hi: 'मासिक संकल्प' },

  // Newsletter Section
  'newsletter.badge': { en: 'Frontline Dispatch Service', hi: 'ज़मीनी समाचार सेवा' },
  'newsletter.title': { en: 'Direct Grassroots Dispatches & Audited Impact', hi: 'सीधी ज़मीनी रिपोर्ट व ऑडिटेड प्रभाव' },
  'newsletter.subtitle': {
    en: 'Receive fortnightly high-resolution field logs, geo-tagged solar pump flow readings, neonatal ambulance mission stats, and Section 80G tax utilization summaries.',
    hi: 'पाक्षिक उच्च-रिज़ॉल्यूशन फील्ड लॉग, सौर पंप के जल प्रवाह आंकड़े, शिशु एम्बुलेंस रिपोर्ट और 80G कर उपयोग सारांश प्राप्त करें।'
  },
  'newsletter.freq.weekly': { en: 'Weekly Field Log', hi: 'साप्ताहिक फील्ड लॉग' },
  'newsletter.freq.monthly': { en: 'Monthly 80G Summary', hi: 'मासिक 80G सारांश' },
  'newsletter.freq.urgent': { en: 'Emergency Match Alerts', hi: 'आपातकालीन अलर्ट' },
  'newsletter.btn_subscribe': { en: 'Join Dispatch Network', hi: 'समाचार से जुड़ें' },

  // Footer
  'footer.description': {
    en: 'A legally registered non-profit trust dedicated to accelerating capital delivery directly to rural drinking water security, neonatal trauma medicine, and biodiversity conservation in India.',
    hi: 'ग्रामीण पेयजल सुरक्षा, नवजात शिशु चिकित्सा और जैव विविधता संरक्षण हेतु सीधे पूंजी वितरण के लिए समर्पित एक पंजीकृत धर्मार्थ न्यास।'
  },
  'footer.exemption': {
    en: 'Statutory Exemption: Income Tax Act Section 80G & 12A · Trust PAN: AAATK9412F · Darpan ID: DL/2023/0381920 · MCA CSR-1: CSR00049281',
    hi: 'वैधानिक छूट: आयकर अधिनियम धारा 80G व 12A · ट्रस्ट पैन: AAATK9412F · दर्पण आईडी: DL/2023/0381920 · एमसीए CSR-1: CSR00049281'
  },
  'footer.focus_title': { en: 'Focus Areas', hi: 'प्रमुख क्षेत्र' },
  'footer.transparency_title': { en: 'Transparency & Governance', hi: 'पारदर्शिता व शासन' },
  'footer.copyright': {
    en: '© 2026 Kindred Horizons Public Charitable Trust. All rights reserved.',
    hi: '© 2026 किंडरेड होराइजन्स पब्लिक चैरिटेबल ट्रस्ट। सर्वाधिकार सुरक्षित।'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'kindred_horizons_language_v1';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    } catch {}
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {}
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return fallback || entry?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
