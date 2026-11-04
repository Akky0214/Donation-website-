import React, { useState, useEffect } from 'react';
import {
  Heart,
  Receipt,
  Shield,
  Compass,
  Calculator,
  ShieldCheck,
  Users,
  ChevronRight,
  QrCode,
  CheckCircle2,
  Activity,
  MapPin
} from 'lucide-react';

interface HeaderProps {
  onOpenDonate: (campaignId?: string) => void;
  onOpenMyGiving: () => void;
  onOpenAdmin: () => void;
  myDonationCount: number;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDonate,
  onOpenMyGiving,
  onOpenAdmin,
  myDonationCount,
  isAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock background scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleResize);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  // Smooth scroll with offset for sticky header
  const handleNavClick = (hash: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(hash);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      try {
        window.history.pushState(null, '', hash);
      } catch {}
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-4">
          {/* Zone 1: Brand wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg sm:text-xl font-serif font-medium tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-stone-700 transition-colors flex items-center gap-1.5"
          >
            <span>Kindred Horizons</span>
            <span className="text-[10px] sm:text-xs font-mono font-medium text-stone-600 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded">Trust</span>
          </a>

          {/* Zone 2: Desktop Navigation with smooth offset scrolling */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-stone-600">
            <button
              type="button"
              onClick={() => handleNavClick('#causes')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-stone-600"
            >
              Active Causes
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#live-updates')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-stone-600"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Feed</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#field-map')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer text-stone-600"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Field Map</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#impact-calculator')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-stone-600"
            >
              Impact Calculator
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#transparency')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-stone-600"
            >
              Section 80G & Audits
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#donor-wall')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-stone-600"
            >
              Donor Wall
            </button>
            <button
              type="button"
              onClick={onOpenMyGiving}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer text-stone-600"
            >
              <Receipt className="w-4 h-4 text-stone-500" />
              <span>80G Receipts</span>
              {myDonationCount > 0 && (
                <span className="text-xs font-mono font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full">
                  {myDonationCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Action Buttons & 3-Line Menu Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Desktop / Tablet Admin button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Open Executive Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Control</span>
            </button>

            {/* Primary Donate CTA */}
            <button
              type="button"
              onClick={() => onOpenDonate()}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 active:scale-[0.98] transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
              <span>Donate in ₹</span>
            </button>

            {/* Three-Line Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`lg:hidden relative flex flex-col justify-center items-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                mobileMenuOpen
                  ? 'bg-stone-900 text-white border border-stone-900 shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-300 shadow-xs active:scale-95'
              }`}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {/* Animated 3-line hamburger morph */}
              <span
                className={`block h-0.5 w-5 rounded-full transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? 'bg-white rotate-45 translate-y-1.5'
                    : 'bg-stone-800 mb-1'
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full transition-all duration-200 ease-in-out ${
                  mobileMenuOpen
                    ? 'opacity-0 scale-x-0'
                    : 'bg-stone-800 mb-1'
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? 'bg-white -rotate-45 -translate-y-1.5'
                    : 'bg-stone-800'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer & Modal Backdrop */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden fixed inset-0 top-18 z-50 flex flex-col justify-start"
        >
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 top-18 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu Panel */}
          <div className="relative bg-[#FAF8F5] border-b border-stone-300 shadow-2xl z-10 max-h-[calc(100vh-4.5rem)] overflow-y-auto px-4 py-5 animate-in slide-in-from-top-3 duration-200">
            {/* Header info badge in drawer */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-stone-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-stone-600 font-medium">Sec 80G Certified Seva</span>
              </div>
              <span className="font-mono text-[11px] text-stone-500">DL/2023/0381920</span>
            </div>

            {/* Nav Links formatted as card tiles */}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleNavClick('#causes')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-stone-100/80 active:bg-stone-100 border border-stone-200/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900 group-hover:text-emerald-800 transition-colors">
                      Active Causes
                    </div>
                    <div className="text-xs text-stone-500">
                      Frontline water, medical ICU & crisis relief
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#live-updates')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-stone-100/80 active:bg-stone-100 border border-stone-200/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center text-emerald-400 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900 group-hover:text-emerald-800 transition-colors flex items-center gap-2">
                      <span>Live Milestones Feed</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <div className="text-xs text-stone-500">
                      Real-time telemetry & verified operations
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#field-map')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-stone-100/80 active:bg-stone-100 border border-stone-200/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900 group-hover:text-cyan-800 transition-colors flex items-center gap-1.5">
                      <span>Interactive Field Map</span>
                      <span className="text-[10px] font-mono font-medium bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded">
                        9 Sites
                      </span>
                    </div>
                    <div className="text-xs text-stone-500">
                      GPS-verified borewells, ICU hubs & rescue barges
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#impact-calculator')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-stone-100/80 active:bg-stone-100 border border-stone-200/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                      Impact Calculator
                    </div>
                    <div className="text-xs text-stone-500">
                      Simulate tangible human outcomes per ₹ donated
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#transparency')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-stone-100/80 active:bg-stone-100 border border-stone-200/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900 group-hover:text-sky-800 transition-colors flex items-center gap-1.5">
                      <span>Section 80G & Audits</span>
                      <span className="text-[10px] font-mono font-medium bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                        Audited Ledger
                      </span>
                    </div>
                    <div className="text-xs text-stone-500">
                      Statutory accounts, CA audit & Form 10BD/10BE
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#donor-wall')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-stone-100/80 active:bg-stone-100 border border-stone-200/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900 group-hover:text-indigo-800 transition-colors">
                      Donor Wall
                    </div>
                    <div className="text-xs text-stone-500">
                      Live community contributions and blessings
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMyGiving();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-stone-100/80 active:bg-stone-100 border border-stone-200/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900 group-hover:text-rose-800 transition-colors flex items-center gap-2">
                      <span>Section 80G Tax Receipts</span>
                      {myDonationCount > 0 && (
                        <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                          {myDonationCount} Available
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500">
                      Official Form 10BE tax exemption certificates
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Admin Portal Option for Mobile */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 active:bg-stone-200 border border-stone-300 transition-colors text-left group cursor-pointer mt-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                      <span>Executive Admin Portal</span>
                      <span className="text-[10px] font-mono font-semibold bg-stone-800 text-amber-300 px-1.5 py-0.5 rounded">
                        Trustees
                      </span>
                    </div>
                    <div className="text-xs text-stone-600">
                      Lavanya, Bhakti, Aarya & Aastha Kelelkar
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Quick Action CTA inside Mobile Menu */}
            <div className="mt-4 pt-4 border-t border-stone-200 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDonate();
                }}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400/40" />
                <span>Donate to Active Causes in ₹</span>
                <QrCode className="w-4 h-4 text-amber-400 ml-1" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-stone-500 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Instant UPI & Cards
                </span>
                <span>•</span>
                <span>Sec 80G Form 10BE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
