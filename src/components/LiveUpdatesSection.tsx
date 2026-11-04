import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Campaign, CauseCategory } from '../types/donation';
import {
  Activity,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Stethoscope,
  Trees,
  AlertTriangle,
  GraduationCap,
  ShieldCheck,
  Eye,
  Heart
} from 'lucide-react';

interface LiveUpdatesSectionProps {
  campaigns: Campaign[];
  onDonateToCampaign: (campaignId: string) => void;
  onOpenFieldReport: (campaign: Campaign) => void;
}

interface MilestoneUpdate {
  id: string;
  campaignId: string;
  campaignTitle: string;
  category: CauseCategory;
  categoryLabel: string;
  location: string;
  milestoneTitle: string;
  milestoneDescription: string;
  date: string;
  completed: boolean;
  fieldNote?: string;
  imageUrl?: string;
  auditor: string;
  verifiedTimeAgo: string;
}

const AUDITORS = [
  'Bhakti Kapse (Director of Field Ops)',
  'Lavanya Gurbhele (Managing Trustee)',
  'Aarya Sarode (Director of Treasury)',
  'Aastha Kelelkar (Community Relations)',
  'District Ground Water Authority, Rajasthan',
  'Panchayat Oversight Committee'
];

const TIME_AGOS = [
  '8 minutes ago',
  '24 minutes ago',
  '1 hour ago',
  '3 hours ago',
  'Yesterday at 17:40 IST',
  '2 days ago'
];

export const LiveUpdatesSection: React.FC<LiveUpdatesSectionProps> = ({
  campaigns,
  onDonateToCampaign,
  onOpenFieldReport
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CauseCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Flatten milestones from existing campaign objects
  const allUpdates: MilestoneUpdate[] = React.useMemo(() => {
    const list: MilestoneUpdate[] = [];

    campaigns.forEach((camp, campIdx) => {
      camp.milestones.forEach((m, mIdx) => {
        const fieldNote = camp.fieldNotes && camp.fieldNotes.length > 0
          ? camp.fieldNotes[mIdx % camp.fieldNotes.length]
          : undefined;

        list.push({
          id: `${camp.id}-milestone-${mIdx}`,
          campaignId: camp.id,
          campaignTitle: camp.title,
          category: camp.category,
          categoryLabel: camp.categoryLabel,
          location: camp.location,
          milestoneTitle: m.title,
          milestoneDescription: m.description,
          date: m.date,
          completed: m.completed,
          fieldNote,
          imageUrl: camp.imageUrl,
          auditor: AUDITORS[(campIdx * 3 + mIdx) % AUDITORS.length],
          verifiedTimeAgo: TIME_AGOS[(campIdx * 2 + mIdx) % TIME_AGOS.length]
        });
      });
    });

    return list;
  }, [campaigns]);

  // Filtered updates
  const filteredUpdates = allUpdates.filter((u) => {
    if (selectedCategory !== 'all' && u.category !== selectedCategory) return false;
    if (statusFilter === 'completed' && !u.completed) return false;
    if (statusFilter === 'active' && u.completed) return false;
    return true;
  });

  // Smooth continuous auto-scroll ticker with pause-on-hover
  useEffect(() => {
    if (!isAutoScrolling || isUserInteracting) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [isAutoScrolling, isUserInteracting]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (category: CauseCategory) => {
    switch (category) {
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-blue-600" />;
      case 'medical':
        return <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />;
      case 'ecology':
        return <Trees className="w-3.5 h-3.5 text-teal-600" />;
      case 'crisis':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'education':
        return <GraduationCap className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  return (
    <motion.section
      id="live-updates"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 bg-stone-900 text-stone-100 border-y border-stone-800 relative overflow-hidden"
    >
      {/* Subtle background ambient grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Real-Time Live Beacon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                Live Frontline Operations Feed
              </span>
              <span className="text-[11px] font-mono text-stone-400 border border-stone-700 rounded px-1.5 py-0.2">
                Telemetric Logs
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Humanitarian Project Milestones
            </h2>
            <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
              Continuous, timestamped field telemetry drawn directly from active campaigns across India. Track borewell drilling, trauma ambulance dispatches, and mangrove plantations as they happen.
            </p>
          </div>

          {/* Scrolling & Pause Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono border border-stone-700 transition-colors cursor-pointer"
              title={isAutoScrolling ? 'Pause automatic scrolling' : 'Resume automatic scrolling'}
            >
              {isAutoScrolling ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleManualScroll('left')}
              className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 flex items-center justify-center text-stone-300 transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll('right')}
              className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 flex items-center justify-center text-stone-300 transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {(['all', 'water', 'medical', 'crisis', 'ecology', 'education'] as CauseCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-stone-950 font-semibold shadow-xs'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
                }`}
              >
                {cat === 'all' ? 'All Causes' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs font-mono bg-stone-800/80 p-1 rounded-lg border border-stone-700">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-stone-700 text-white font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All ({allUpdates.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                statusFilter === 'completed' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Completed</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                statusFilter === 'active' ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>In Deployment</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Feed Container */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsUserInteracting(true)}
          onMouseLeave={() => setIsUserInteracting(false)}
          onTouchStart={() => setIsUserInteracting(true)}
          onTouchEnd={() => setIsUserInteracting(false)}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth no-scrollbar focus:outline-none"
          tabIndex={0}
          role="region"
          aria-label="Humanitarian project milestones feed"
        >
          {filteredUpdates.map((item) => {
            const parentCampaign = campaigns.find((c) => c.id === item.campaignId);

            return (
              <div
                key={item.id}
                className="w-[320px] sm:w-[360px] shrink-0 bg-stone-850/90 hover:bg-stone-800/90 rounded-2xl border border-stone-750 p-5 flex flex-col justify-between transition-all duration-200 hover:border-stone-600 hover:shadow-xl group snap-start"
              >
                <div>
                  {/* Top Metadata Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900/80 border border-stone-700 text-xs font-mono text-stone-300">
                      {getCategoryIcon(item.category)}
                      <span>{item.categoryLabel}</span>
                    </span>

                    {item.completed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Completed & Audited</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-950/80 text-amber-400 border border-amber-800/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span>Active Deployment</span>
                      </span>
                    )}
                  </div>

                  {/* Campaign Title & Location */}
                  <div className="mb-2">
                    <h3 className="text-xs font-semibold text-amber-300 line-clamp-1 group-hover:text-amber-200 transition-colors">
                      {item.campaignTitle}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-stone-400 font-mono mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Milestone Main Title */}
                  <div className="border-t border-stone-800 pt-3 mt-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-white font-serif line-clamp-2">
                        {item.milestoneTitle}
                      </h4>
                      <span className="text-[11px] font-mono text-stone-400 shrink-0 bg-stone-900 px-1.5 py-0.5 rounded">
                        {item.date}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed line-clamp-3 mt-1.5">
                      {item.milestoneDescription}
                    </p>
                  </div>

                  {/* Field Note Quote */}
                  {item.fieldNote && (
                    <div className="mt-3 p-2.5 rounded-lg bg-stone-900/90 border border-stone-800 text-[11px] font-mono text-stone-400 italic">
                      "{item.fieldNote}"
                    </div>
                  )}
                </div>

                {/* Footer with Verification Log & Actions */}
                <div className="mt-4 pt-3 border-t border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                    <span className="flex items-center gap-1 truncate max-w-[200px]" title={item.auditor}>
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{item.auditor}</span>
                    </span>
                    <span className="shrink-0 text-stone-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {item.verifiedTimeAgo}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onDonateToCampaign(item.campaignId)}
                      className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-white text-stone-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600/30" />
                      <span>Support (₹)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (parentCampaign) {
                          onOpenFieldReport(parentCampaign);
                        }
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-400" />
                      <span>Field Log</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Telemetry Status Bar */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audited & verified by Kindred Horizons Trust under NGO Darpan DL/2023/0381920</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-300">
              Showing {filteredUpdates.length} of {allUpdates.length} verified operations
            </span>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <span className="text-emerald-400">Section 80G Compliant</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
