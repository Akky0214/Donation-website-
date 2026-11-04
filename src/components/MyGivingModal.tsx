import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DonationReceipt } from '../types/donation';
import {
  X,
  Receipt,
  Heart,
  Eye,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  Info,
  Calendar
} from 'lucide-react';
import { downloadConsolidatedPdf, downloadConsolidatedCsv } from '../utils/taxExport';

interface MyGivingModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: DonationReceipt[];
  onSelectReceipt: (receipt: DonationReceipt) => void;
  onMakeDonation: () => void;
}

export const MyGivingModal: React.FC<MyGivingModalProps> = ({
  isOpen,
  onClose,
  receipts,
  onSelectReceipt,
  onMakeDonation
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<'pdf' | 'csv' | null>(null);

  if (!isOpen) return null;

  const totalGiven = receipts.reduce((acc, r) => acc + r.totalPaid, 0);
  const totalEligible = receipts.reduce(
    (acc, r) => acc + (r.taxDeductibleAmount || Math.round(r.totalPaid * 0.5)),
    0
  );

  const handleDownloadPdf = () => {
    if (receipts.length === 0) return;
    setIsExporting('pdf');
    try {
      downloadConsolidatedPdf(receipts);
      setDownloadSuccess('Consolidated 80G PDF statement downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('PDF generation error', err);
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadCsv = () => {
    if (receipts.length === 0) return;
    setIsExporting('csv');
    try {
      downloadConsolidatedCsv(receipts);
      setDownloadSuccess('Consolidated donation history CSV downloaded for ITR filing!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('CSV export error', err);
    } finally {
      setIsExporting(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-500">
              <Receipt className="w-3.5 h-3.5 text-stone-700" />
              <span>Section 80G Tax Certificates & Records</span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-stone-900 mt-0.5">
              My Giving Ledger & Tax Filing Records
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {downloadSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
            <button
              onClick={() => setDownloadSuccess(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Metric Cards */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                Total Seva Contributed
              </span>
              <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums mt-0.5">
                ₹{totalGiven.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-stone-500 font-mono">
                {receipts.length} transaction{receipts.length === 1 ? '' : 's'}
              </span>
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                80G Exemption Eligible
              </span>
              <div className="text-2xl font-serif font-bold text-emerald-800 tabular-nums mt-0.5">
                ₹{totalEligible.toLocaleString('en-IN')}
                <span className="text-xs font-sans font-normal text-stone-500"> (50%)</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-mono">
                Sec 80G(5)(vi) benefit
              </span>
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                Assessment Year
              </span>
              <div className="text-xl font-serif font-bold text-stone-900 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>AY 2026-27</span>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">
                FY 2025-26 Filing
              </span>
            </div>
          </div>

          {/* Consolidated Export Panel (New Feature) */}
          <div className="bg-amber-50/70 rounded-xl border border-amber-200/90 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-900">
                  <Download className="w-3.5 h-3.5 text-amber-700" />
                  <span>Consolidated Tax Filing Statement</span>
                </div>
                <p className="text-xs text-stone-700 mt-1 max-w-md">
                  Export all your donations in a single, audit-ready document for Chartered Accountants (CA) or direct Income Tax Return (Schedule 80G) filing.
                </p>
              </div>
              <span className="text-[11px] font-mono text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200 self-start sm:self-auto shrink-0">
                Rule 18AB Compliant
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-amber-200/60">
              {/* Download PDF Button */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={receipts.length === 0 || isExporting === 'pdf'}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Download consolidated PDF certificate with all donation transactions"
              >
                <FileText className="w-4 h-4 text-rose-400" />
                <span>
                  {isExporting === 'pdf' ? 'Generating PDF...' : 'Download Consolidated PDF'}
                </span>
              </button>

              {/* Download CSV Button */}
              <button
                type="button"
                onClick={handleDownloadCsv}
                disabled={receipts.length === 0 || isExporting === 'csv'}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-white hover:bg-stone-100 active:scale-[0.98] text-stone-800 border border-stone-300 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Download structured CSV spreadsheet for ITR Excel import"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>
                  {isExporting === 'csv' ? 'Exporting CSV...' : 'Download CSV for ITR'}
                </span>
              </button>

              {/* Quick Print Button */}
              {receipts.length > 0 && (
                <button
                  type="button"
                  onClick={handlePrint}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-white/80 transition-colors cursor-pointer"
                  title="Print summary"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              )}
            </div>

            {receipts.length === 0 && (
              <p className="text-[11px] text-stone-500 mt-2 flex items-center gap-1 font-mono">
                <Info className="w-3 h-3 text-stone-400 shrink-0" />
                <span>PDF & CSV export buttons activate automatically once you record a donation.</span>
              </p>
            )}
          </div>

          {/* List of Issued Receipts */}
          {receipts.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
              <Heart className="w-8 h-8 text-stone-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-stone-900">No donation records found yet</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Contributions made during your session will appear here with instant printable Section 80G tax receipts and consolidated export options.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onMakeDonation();
                }}
                className="mt-4 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Make a contribution in ₹</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500">
                  Issued 80G Certificates ({receipts.length})
                </h4>
                <span className="text-[11px] font-mono text-stone-500">
                  Click 'View' for individual Form 10BE
                </span>
              </div>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                {receipts.map((r) => (
                  <div
                    key={r.receiptId}
                    className="p-4 bg-white hover:bg-stone-50/80 transition-colors flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-stone-900">
                          #{r.receiptId}
                        </span>
                        <span className="text-[11px] font-mono text-stone-500">
                          {r.transactionDate}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 font-medium mt-0.5 truncate max-w-xs sm:max-w-sm">
                        {r.campaignTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {r.donorPAN ? (
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            PAN: {r.donorPAN} (Verified)
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            PAN: Not Provided
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-stone-500">
                          50% Sec 80G: ₹{(r.taxDeductibleAmount || Math.round(r.totalPaid * 0.5)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-serif font-bold text-stone-900 tabular-nums">
                          ₹{r.totalPaid.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] block text-stone-500 font-mono">
                          {r.paymentMethod.replace(' (Verified)', '')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectReceipt(r);
                        }}
                        className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                        title="View Individual 80G Receipt"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-600" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5 truncate mr-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="truncate">Retain records for annual Income Tax e-filing (ITR Schedule 80G)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-700 font-semibold hover:text-stone-950 px-3 py-1 bg-white border border-stone-300 rounded-md shadow-xs cursor-pointer shrink-0"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
