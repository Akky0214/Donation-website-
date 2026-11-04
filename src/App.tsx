import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { EmergencyBanner } from './components/EmergencyBanner';
import { HeroSection } from './components/HeroSection';
import { CausesSection } from './components/CausesSection';
import { LiveUpdatesSection } from './components/LiveUpdatesSection';
import { ImpactCalculator } from './components/ImpactCalculator';
import { TransparencySection } from './components/TransparencySection';
import { DonorWallSection } from './components/DonorWallSection';
import { FieldReportModal } from './components/FieldReportModal';
import { DonationModal } from './components/DonationModal';
import { ReceiptModal } from './components/ReceiptModal';
import { MyGivingModal } from './components/MyGivingModal';
import { AdminPortal } from './components/AdminPortal';
import { NewsletterSignup } from './components/NewsletterSignup';
import { Footer } from './components/Footer';

import { CelebrationEffects } from './components/CelebrationEffects';

import { Campaign, DonationFrequency, DonationReceipt, DonorWallEntry, TrustSettings, NewsletterSubscriber, AdminUser } from './types/donation';
import { INITIAL_CAMPAIGNS, INITIAL_DONOR_WALL, DEFAULT_TRUST_SETTINGS, DEFAULT_SUBSCRIBERS } from './data/mockData';
import { CheckCircle2, Shield, Users } from 'lucide-react';
import { LanguageProvider } from './context/LanguageContext';

const STORAGE_KEY_RECEIPTS = 'kindred_receipts_inr_v2';
const STORAGE_KEY_DONORS = 'kindred_donors_inr_v2';
const STORAGE_KEY_CAMPAIGNS = 'kindred_campaigns_inr_v2';
const STORAGE_KEY_TRUST_SETTINGS = 'kindred_trust_settings_v2';
const STORAGE_KEY_SUBSCRIBERS = 'kindred_subscribers_inr_v2';

const SUPER_ADMIN_EMAIL = 'lavanyagurbhele@gmail.com';

export default function App() {
  // Trust settings with persistence and safe schema migration
  const [trustSettings, setTrustSettings] = useState<TrustSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRUST_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedAdmins: AdminUser[] = Array.isArray(parsed.admins) && parsed.admins.length > 0
          ? parsed.admins
          : DEFAULT_TRUST_SETTINGS.admins;

        // Auto-merge newly added default administrators (such as Aastha Kelelkar)
        const mergedAdmins = [...savedAdmins];
        for (const defaultAdmin of DEFAULT_TRUST_SETTINGS.admins) {
          if (!mergedAdmins.some((a: AdminUser) => a.name.toLowerCase() === defaultAdmin.name.toLowerCase() || a.id === defaultAdmin.id)) {
            mergedAdmins.push(defaultAdmin);
          }
        }

        return {
          ...DEFAULT_TRUST_SETTINGS,
          ...parsed,
          admins: mergedAdmins
        };
      }
    } catch {}
    return DEFAULT_TRUST_SETTINGS;
  });

  // Campaigns state with persistence & automatic realistic image migration
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
      if (saved) {
        const parsed: Campaign[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c) => {
            const initial = INITIAL_CAMPAIGNS.find((item) => item.id === c.id);
            return {
              ...c,
              imageUrl: c.imageUrl || initial?.imageUrl,
              imageAlt: c.imageAlt || initial?.imageAlt
            };
          });
        }
      }
    } catch {}
    return INITIAL_CAMPAIGNS;
  });

  // Donor wall state with persistence
  const [donorWall, setDonorWall] = useState<DonorWallEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DONORS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DONOR_WALL;
  });

  // Receipts state with persistence
  const [receipts, setReceipts] = useState<DonationReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECEIPTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Newsletter subscribers state with persistence
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBSCRIBERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SUBSCRIBERS;
  });

  // Modal controls
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [donationParams, setDonationParams] = useState<{
    campaignId?: string;
    amount?: number;
    frequency?: DonationFrequency;
    isTribute?: boolean;
  }>({});

  const [fieldReportCampaign, setFieldReportCampaign] = useState<Campaign | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<DonationReceipt | null>(null);
  const [isMyGivingOpen, setIsMyGivingOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  // Success toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(receipts));
    } catch {}
  }, [receipts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(subscribers));
    } catch {}
  }, [subscribers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DONORS, JSON.stringify(donorWall));
    } catch {}
  }, [donorWall]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
    } catch {}
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRUST_SETTINGS, JSON.stringify(trustSettings));
    } catch {}
  }, [trustSettings]);

  // Handler to open donation modal with customizable initial states
  const handleOpenDonate = (campaignId?: string) => {
    setDonationParams({
      campaignId,
      amount: 2500,
      frequency: 'once',
      isTribute: false
    });
    setIsDonationOpen(true);
  };

  const handleHeroStartDonation = (amount: number, frequency: DonationFrequency, campaignId?: string) => {
    setDonationParams({
      campaignId,
      amount,
      frequency,
      isTribute: false
    });
    setIsDonationOpen(true);
  };

  const handleCalculatorDonate = (amount: number, frequency: DonationFrequency) => {
    setDonationParams({
      amount,
      frequency,
      isTribute: false
    });
    setIsDonationOpen(true);
  };

  const handleDonateWithTribute = () => {
    setDonationParams({
      amount: 5000,
      frequency: 'once',
      isTribute: true
    });
    setIsDonationOpen(true);
  };

  const handleEmergencyQuickDonate = () => {
    setDonationParams({
      campaignId: 'bay-islands-flood-relief',
      amount: 2500,
      frequency: 'once',
      isTribute: false
    });
    setIsDonationOpen(true);
  };

  // On successful donation
  const handleDonationSuccess = (receipt: DonationReceipt, donorEntry?: DonorWallEntry) => {
    setIsDonationOpen(false);

    // Save receipt
    setReceipts((prev) => [receipt, ...prev]);

    // Update campaign raisedAmount and donorCount if targeted
    if (receipt.campaignTitle) {
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.title === receipt.campaignTitle || receipt.campaignTitle.includes(c.title)) {
            return {
              ...c,
              raisedAmount: c.raisedAmount + receipt.amount,
              donorCount: c.donorCount + 1
            };
          }
          return c;
        })
      );
    }

    // Add to live donor wall
    if (donorEntry) {
      setDonorWall((prev) => [donorEntry, ...prev]);
    }

    // Trigger celebratory confetti animation!
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 4500);

    // Show toast and open official receipt
    setToastMessage(`Contribution of ₹${receipt.totalPaid.toLocaleString('en-IN')} recorded. Form 10BE issued.`);
    setTimeout(() => setToastMessage(null), 5000);

    setActiveReceipt(receipt);
  };

  // Newsletter subscription handler with duplicate handling & local state persistence
  const handleNewsletterSubscribe = (data: {
    email: string;
    name?: string;
    source: string;
    preferredFrequency: 'weekly_dispatch' | 'monthly_impact' | 'critical_alerts';
    interests?: string[];
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existingIndex = subscribers.findIndex((s) => s.email.toLowerCase() === cleanEmail);

    if (existingIndex >= 0) {
      const updated = [...subscribers];
      const current = updated[existingIndex];
      const refreshedSubscriber: NewsletterSubscriber = {
        ...current,
        name: data.name || current.name,
        preferredFrequency: data.preferredFrequency || current.preferredFrequency,
        interests: data.interests || current.interests,
        status: 'active'
      };
      updated[existingIndex] = refreshedSubscriber;
      setSubscribers(updated);

      setToastMessage(`Preferences updated for ${cleanEmail}. Next dispatch scheduled.`);
      setTimeout(() => setToastMessage(null), 4000);

      return {
        success: true,
        message: 'Subscription cadence updated successfully!',
        isExisting: true,
        subscriberId: current.id
      };
    } else {
      const newId = `sub-${Date.now()}`;
      const newSub: NewsletterSubscriber = {
        id: newId,
        email: cleanEmail,
        name: data.name,
        subscribedAt: new Date().toISOString(),
        source: data.source || 'Website Form',
        status: 'active',
        preferredFrequency: data.preferredFrequency || 'weekly_dispatch',
        interests: data.interests && data.interests.length > 0 ? data.interests : ['general']
      };

      setSubscribers([newSub, ...subscribers]);

      setToastMessage(`Enrolled ${cleanEmail} for frontline field dispatches.`);
      setTimeout(() => setToastMessage(null), 4500);

      return {
        success: true,
        message: 'Welcome to Kindred Horizons Field Dispatches!',
        isExisting: false,
        subscriberId: newId
      };
    }
  };

  const scrollToDonorWall = () => {
    const el = document.getElementById('donor-wall');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-200">
      {/* Celebratory Particle Confetti on successful donation */}
      <CelebrationEffects active={isCelebrating} />

      {/* Super Admin & Co-Admin Top Operational Banner */}
      <div className="bg-stone-900 text-stone-300 py-2 px-4 text-xs font-mono border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="truncate">
            <span className="text-white font-semibold">Trust Leadership:</span>{' '}
            <strong className="text-amber-300">Lavanya Gurbhele</strong> (Super Admin) ·{' '}
            <span className="text-stone-200">Bhakti Kapse</span>, <span className="text-stone-200">Aarya Sarode</span> & <span className="text-stone-200">Aastha Kelelkar</span> (Co-Admins)
          </div>
        </div>
        <button
          onClick={() => setIsAdminPortalOpen(true)}
          className="text-amber-300 hover:text-white underline font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Executive Control Portal</span>
          <span>→</span>
        </button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="app-toast-alert"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-stone-800 flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setIsMyGivingOpen(true)}
              className="ml-2 text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
            >
              View 80G Receipt
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Crisis Match Announcement */}
      <EmergencyBanner onQuickDonateEmergency={handleEmergencyQuickDonate} />

      {/* Top Navigation Bar: Strict 3-zone Top Bar Contract */}
      <Header
        onOpenDonate={handleOpenDonate}
        onOpenMyGiving={() => setIsMyGivingOpen(true)}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        myDonationCount={receipts.length}
        isAdmin={true}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Editorial Hero & Express Giving Engine */}
        <HeroSection onStartDonation={handleHeroStartDonation} />

        {/* Active Causes & Field Campaigns */}
        <CausesSection
          campaigns={campaigns}
          onDonateToCampaign={handleOpenDonate}
          onOpenFieldReport={(camp) => setFieldReportCampaign(camp)}
        />

        {/* Real-time scrolling feed of humanitarian project milestones */}
        <LiveUpdatesSection
          campaigns={campaigns}
          onDonateToCampaign={handleOpenDonate}
          onOpenFieldReport={(camp) => setFieldReportCampaign(camp)}
        />

        {/* Tangible Impact Simulator in INR */}
        <ImpactCalculator onDonateFromCalculator={handleCalculatorDonate} />

        {/* Audited Financial Transparency & Governance with Interactive Geospatial Map */}
        <TransparencySection
          onOpenDonate={handleOpenDonate}
          onOpenFieldReport={(campId) => {
            const found = campaigns.find((c) => c.id === campId);
            if (found) setFieldReportCampaign(found);
          }}
        />

        {/* Community Donor Wall & Tributes */}
        <DonorWallSection
          entries={donorWall}
          onDonateWithTribute={handleDonateWithTribute}
        />

        {/* Newsletter & Grassroots Field Dispatches Subscription */}
        <NewsletterSignup
          onSubscribe={handleNewsletterSubscribe}
          totalSubscribers={1240 + subscribers.length}
        />
      </main>

      {/* Institutional Curatorial Footer */}
      <Footer onSubscribe={handleNewsletterSubscribe} />

      {/* Modals */}
      {fieldReportCampaign && (
        <FieldReportModal
          campaign={fieldReportCampaign}
          onClose={() => setFieldReportCampaign(null)}
          onDonate={(campId) => {
            setFieldReportCampaign(null);
            handleOpenDonate(campId);
          }}
        />
      )}

      {isDonationOpen && (
        <DonationModal
          isOpen={isDonationOpen}
          onClose={() => setIsDonationOpen(false)}
          campaigns={campaigns}
          initialCampaignId={donationParams.campaignId}
          initialAmount={donationParams.amount}
          initialFrequency={donationParams.frequency}
          initialTributeActive={donationParams.isTribute}
          trustSettings={trustSettings}
          onSuccess={handleDonationSuccess}
        />
      )}

      {activeReceipt && (
        <ReceiptModal
          receipt={activeReceipt}
          onClose={() => setActiveReceipt(null)}
          onViewDonorWall={scrollToDonorWall}
        />
      )}

      {isMyGivingOpen && (
        <MyGivingModal
          isOpen={isMyGivingOpen}
          onClose={() => setIsMyGivingOpen(false)}
          receipts={receipts}
          onSelectReceipt={(r) => setActiveReceipt(r)}
          onMakeDonation={() => handleOpenDonate()}
        />
      )}

      {isAdminPortalOpen && (
        <AdminPortal
          isOpen={isAdminPortalOpen}
          onClose={() => setIsAdminPortalOpen(false)}
          campaigns={campaigns}
          onUpdateCampaigns={setCampaigns}
          receipts={receipts}
          onUpdateReceipts={setReceipts}
          donorWall={donorWall}
          onUpdateDonorWall={setDonorWall}
          trustSettings={trustSettings}
          onUpdateTrustSettings={setTrustSettings}
          subscribers={subscribers}
          onUpdateSubscribers={setSubscribers}
          adminEmail={SUPER_ADMIN_EMAIL}
        />
      )}
      </div>
    </LanguageProvider>
  );
}
