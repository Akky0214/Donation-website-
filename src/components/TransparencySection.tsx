import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TRANSPARENCY_METRICS } from '../data/mockData';
import { Download, Award, FileCheck, MapPin } from 'lucide-react';
import { ProjectLocationsMap } from './ProjectLocationsMap';
import { useLanguage } from '../context/LanguageContext';

interface TransparencySectionProps {
  onOpenDonate?: (campaignId?: string) => void;
  onOpenFieldReport?: (campaignId: string) => void;
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({
  onOpenDonate,
  onOpenFieldReport
}) => {
  const { language, t } = useLanguage();
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownloadReport = (reportName: string) => {
    setDownloadNotice(`Downloading: ${reportName}`);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 3500);
  };

  return (
    <motion.section
      id="transparency"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 lg:py-24 border-b border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-2">
            {t('transparency.kicker')}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-stone-900 tracking-tight">
            {t('transparency.title')}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
            {t('transparency.subtitle')}
          </p>
        </div>

        {downloadNotice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-stone-900 text-stone-100 text-xs font-mono rounded-lg flex items-center justify-between shadow-md"
          >
            <span className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              {downloadNotice}
            </span>
            <span className="text-stone-400">Digital signature verified</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Financial Allocation Breakdown */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 sm:p-8">
            <h3 className="text-lg font-serif font-semibold text-stone-900 mb-6">
              Audited Capital Allocation (FY 2025-2026)
            </h3>

            {/* Visual Multi-segment Bar */}
            <div className="w-full h-4 rounded-full overflow-hidden flex mb-6">
              <div
                style={{ width: `${TRANSPARENCY_METRICS.directFieldDeployment}%` }}
                className="bg-stone-900 h-full"
                title="88.6% Direct Field Deployment"
              />
              <div
                style={{ width: `${TRANSPARENCY_METRICS.fieldLogisticsAndColdChain}%` }}
                className="bg-amber-600 h-full"
                title="7.8% Field Logistics & Cold Chain"
              />
              <div
                style={{ width: `${TRANSPARENCY_METRICS.governanceAndAuditing}%` }}
                className="bg-stone-400 h-full"
                title="3.6% Governance & Independent Audit"
              />
            </div>

            {/* Line-item list (clean unboxed text, tabular figures) */}
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-xs bg-stone-900 shrink-0" />
                    <span className="text-sm font-semibold text-stone-900">Direct Field Programs & Equipment</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 pl-4.5">
                    Purchasing solar deep-borewell rigs, mobile neonatal ambulances, medical triage supplies, and forest buffer corridors.
                  </p>
                </div>
                <span className="text-base font-serif font-bold text-stone-900 tabular-nums">
                  {TRANSPARENCY_METRICS.directFieldDeployment}%
                </span>
              </div>

              <div className="flex items-start justify-between pb-3 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-xs bg-amber-600 shrink-0" />
                    <span className="text-sm font-semibold text-stone-900">Field Logistics & Cold Chain Security</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 pl-4.5">
                    4WD ambulance diesel, vaccine portable refrigeration, boat rescue sorties, and frontline staff safety.
                  </p>
                </div>
                <span className="text-base font-serif font-bold text-stone-900 tabular-nums">
                  {TRANSPARENCY_METRICS.fieldLogisticsAndColdChain}%
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-xs bg-stone-400 shrink-0" />
                    <span className="text-sm font-semibold text-stone-900">Governance & Statutory Audit</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 pl-4.5">
                    External Chartered Accountant statutory audit, Income Tax Form 10BD filing, and legal compliance.
                  </p>
                </div>
                <span className="text-base font-serif font-bold text-stone-900 tabular-nums">
                  {TRANSPARENCY_METRICS.governanceAndAuditing}%
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-stone-500">
              <span>Section 80G No: {TRANSPARENCY_METRICS.section80GRegNo}</span>
              <span>Trust PAN: {TRANSPARENCY_METRICS.trustPan}</span>
            </div>
          </div>

          {/* Right: Accreditations & Audited Reports */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Statutory Registrations */}
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-6">
              <h3 className="text-sm font-mono uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-stone-700" />
                <span>Statutory Registrations</span>
              </h3>
              <div className="space-y-3">
                {TRANSPARENCY_METRICS.accreditations.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-200/50 last:border-none">
                    <span className="font-semibold text-stone-800">{item.title}</span>
                    <span className="text-stone-600 font-mono text-right">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Audited Document Downloads */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-stone-700" />
                  <span>Public Financial Disclosures</span>
                </h3>
                <div className="space-y-2.5">
                  {TRANSPARENCY_METRICS.auditedReports.map((report, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-stone-100 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50 transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-stone-900">{report.name}</div>
                        <div className="text-stone-500 text-[11px] font-mono mt-0.5">
                          {report.year} · {report.size} · {report.date}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadReport(report.name)}
                        className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer shrink-0"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Free open disclosure for all donors</span>
                <span className="text-stone-700 font-medium">Updated Semi-Annually</span>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Project Deployment & Geospatial Verification Registry */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 pt-12 border-t border-stone-200"
        >
          <div className="max-w-3xl mb-8">
            <div className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-2">
              Geospatial Verification Registry
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 tracking-tight">
              Physical frontline stations & verified project coordinates
            </h3>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              True transparency goes beyond financial ledger audits to physical ground reality. Explore all 9 verified project sites across India — from solar deep-well rigs in Barmer to neonatal ambulance corridors in Koraput and emergency flood barges in Majuli.
            </p>
          </div>

          <ProjectLocationsMap
            onOpenDonate={onOpenDonate}
            onOpenFieldReport={onOpenFieldReport}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};
